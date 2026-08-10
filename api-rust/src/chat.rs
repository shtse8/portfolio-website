//! AI chat — browser SSE bridge to the Sylphx AI Gateway Responses wire.
//!
//! Browser contract (unchanged, AI SDK v7): POST /chat → SSE events
//! `text-start|text-delta|text-end|tool-input-start|tool-input-available|
//! tool-output-available|error` + `[DONE]`.
//!
//! Gateway contract (ADR-169): `SYLPHX_AI_URL` (default `https://api.sylphx.ai`,
//! normalized to `/v1`) + `SYLPHX_AI_API_KEY` bearer → `POST /v1/responses`
//! (OpenAI Responses API, SSE). Public `/v1/chat/completions` is retired
//! (2026-08-09); `SYLPHX_URL` is the platform *public browser* connection URL
//! and must never be used as a server credential.

use crate::http_util::{event_stream_content_type, no_cache};
use crate::persona::SYSTEM_PROMPT;
use crate::rate_limit::{check_rate_limit, client_ip, LimitVerdict};
use crate::tools;
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{
    sse::{Event, KeepAlive, Sse},
    IntoResponse, Response,
};
use futures::StreamExt;
use serde::Deserialize;
use serde_json::{json, Value};
use std::env;
use std::time::Duration;
use tokio_stream::wrappers::UnboundedReceiverStream;
use uuid::Uuid;

const MAX_TURNS: usize = 14;
const CHAT_TIMEOUT: Duration = Duration::from_secs(60);
const MAX_STEPS: usize = 3;
const AI_MODEL: &str = "sylphx/lumen";
const DEFAULT_SYLPHX_AI_URL: &str = "https://api.sylphx.ai";

#[derive(Debug, Clone)]
pub struct AiConfig {
    pub base_url: String,
    pub key: String,
    pub model: String,
}

/// Normalize a raw gateway URL to the `/v1` base (same rule as the canonical
/// spiron client).
fn normalize_v1_url(raw: Option<&str>) -> String {
    let configured = raw
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .unwrap_or(DEFAULT_SYLPHX_AI_URL);
    let trimmed = configured.trim_end_matches('/');
    if trimmed.ends_with("/v1") {
        trimmed.to_string()
    } else {
        format!("{trimmed}/v1")
    }
}

/// Host of a URL-like string (best-effort; empty when unparseable).
fn url_host(raw: &str) -> String {
    let s = raw.trim();
    let without_scheme = s
        .strip_prefix("https://")
        .or_else(|| s.strip_prefix("http://"))
        .unwrap_or(s);
    without_scheme
        .split('/')
        .next()
        .unwrap_or("")
        .split('@')
        .next_back()
        .unwrap_or("")
        .split(':')
        .next()
        .unwrap_or("")
        .to_ascii_lowercase()
}

/// Platform management hosts must never be used as the AI Gateway.
/// Live incident (2026-08-10): `AI_GATEWAY_BASE_URL=https://api.sylphx.com`
/// produced `unsupported_credential` because that host is Platform product API.
fn is_forbidden_gateway_host(host: &str) -> bool {
    let h = host.trim().to_ascii_lowercase();
    if h.is_empty() {
        return false;
    }
    h == "api.sylphx.com"
        || h.ends_with(".api.sylphx.com")
        || h == "console.sylphx.com"
        || h == "app.sylphx.com"
}

/// Reject credentials that belong to Platform product/management planes.
/// Live incident (2026-08-10): `AI_GATEWAY_KEY=sk_prod_…` is a Platform
/// project secret, not a Sylphx AI data-plane key (`ck_*` / `sk-sx-*`).
fn is_plausible_gateway_key(key: &str) -> bool {
    let k = key.trim();
    if k.is_empty() || k.len() < 8 {
        return false;
    }
    if k.starts_with("sk_prod_")
        || k.starts_with("sk_prev_")
        || k.starts_with("pk_prod_")
        || k.starts_with("pk_prev_")
        || k.starts_with("sylphx://")
        || k.starts_with("eyJ")
    {
        return false;
    }
    true
}

fn first_env(names: &[&str]) -> Option<String> {
    for name in names {
        if let Ok(v) = env::var(name) {
            let t = v.trim();
            if !t.is_empty() {
                return Some(t.to_string());
            }
        }
    }
    None
}

/// Resolve the AI gateway config from server-side env only.
///
/// Candidates (first *valid* wins):
/// - Base: `AI_GATEWAY_BASE_URL` → `SYLPHX_AI_URL` → default `https://api.sylphx.ai`
/// - Key: `AI_GATEWAY_KEY` → `AI_GATEWAY_API_KEY` → `SYLPHX_AI_API_KEY`
///
/// Invalid candidates (Platform hosts / Platform product keys) are skipped,
/// not forwarded. `SYLPHX_URL` is never used.
pub fn resolve_ai() -> AiConfig {
    let base_candidates = [
        first_env(&["AI_GATEWAY_BASE_URL"]),
        first_env(&["SYLPHX_AI_URL"]),
    ];
    let base_raw = base_candidates
        .into_iter()
        .flatten()
        .find(|raw| !is_forbidden_gateway_host(&url_host(raw)))
        .unwrap_or_else(|| DEFAULT_SYLPHX_AI_URL.to_string());
    let base = normalize_v1_url(Some(&base_raw));

    let key = [
        first_env(&["AI_GATEWAY_KEY"]),
        first_env(&["AI_GATEWAY_API_KEY"]),
        first_env(&["SYLPHX_AI_API_KEY"]),
    ]
    .into_iter()
    .flatten()
    .find(|k| is_plausible_gateway_key(k))
    .unwrap_or_default();

    AiConfig {
        base_url: base,
        key,
        model: env::var("AI_MODEL")
            .ok()
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .unwrap_or_else(|| AI_MODEL.to_string()),
    }
}

/// Non-secret readiness report for UI fail-closed + ops probes.
pub fn chat_readiness() -> Value {
    let ai = resolve_ai();
    let host = url_host(&ai.base_url);
    let ready = !ai.key.is_empty() && !is_forbidden_gateway_host(&host);
    let reason = if ai.key.is_empty() {
        Some("missing_or_invalid_gateway_key")
    } else if is_forbidden_gateway_host(&host) {
        Some("forbidden_gateway_host")
    } else {
        None
    };
    json!({
        "ready": ready,
        "host": host,
        "model": ai.model,
        "reason": reason,
    })
}

#[derive(Debug, Deserialize)]
pub struct ChatRequest {
    pub messages: Option<Vec<UIMessage>>,
}

#[derive(Debug, Deserialize)]
pub struct UIMessage {
    pub role: String,
    pub parts: Option<Vec<UIPart>>,
    pub content: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct UIPart {
    #[serde(rename = "type")]
    pub kind: String,
    pub text: Option<String>,
}

fn message_text(m: &UIMessage) -> String {
    if let Some(parts) = &m.parts {
        parts
            .iter()
            .filter(|p| p.kind == "text")
            .filter_map(|p| p.text.clone())
            .collect::<Vec<_>>()
            .join("")
    } else if let Some(c) = &m.content {
        if let Some(s) = c.as_str() {
            s.to_string()
        } else if let Some(arr) = c.as_array() {
            arr.iter()
                .filter_map(|p| {
                    p.get("type")
                        .and_then(|t| t.as_str())
                        .filter(|t| *t == "text")
                        .and_then(|_| p.get("text").and_then(|t| t.as_str()))
                })
                .collect::<Vec<_>>()
                .join("")
        } else {
            String::new()
        }
    } else {
        String::new()
    }
}

/// Map UI messages to Responses `input` items (user/assistant text only;
/// tool state is server-local across the loop).
fn ui_messages_to_input_items(messages: &[UIMessage]) -> Vec<Value> {
    messages
        .iter()
        .filter_map(|m| {
            let text = message_text(m);
            if text.trim().is_empty() {
                return None;
            }
            match m.role.as_str() {
                "user" => Some(json!({
                    "role": "user",
                    "content": [{ "type": "input_text", "text": text }],
                })),
                "assistant" => Some(json!({
                    "role": "assistant",
                    "content": [{ "type": "output_text", "text": text }],
                })),
                _ => None,
            }
        })
        .collect()
}

fn responses_tools() -> Vec<Value> {
    crate::tool_schemas::tools_schema()
}

async fn run_tool(name: &str, args: &Value) -> Value {
    match name {
        "list_projects" => {
            let limit = args.get("limit").and_then(|v| v.as_u64()).unwrap_or(12) as usize;
            serde_json::to_value(tools::list_projects(limit).await).unwrap_or(json!([]))
        }
        "get_repo" => {
            let name = args.get("name").and_then(|v| v.as_str()).unwrap_or("");
            match tools::get_repo_detail(name).await {
                Some(r) => serde_json::to_value(r).unwrap_or(Value::Null),
                None => Value::Null,
            }
        }
        "recent_activity" => {
            let limit = args.get("limit").and_then(|v| v.as_u64()).unwrap_or(6) as usize;
            serde_json::to_value(tools::recent_activity(limit).await).unwrap_or(json!([]))
        }
        "search_projects" => {
            let q = args.get("query").and_then(|v| v.as_str()).unwrap_or("");
            serde_json::to_value(tools::search_projects(q).await).unwrap_or(json!([]))
        }
        "npm_downloads" => {
            let pkg = args.get("pkg").and_then(|v| v.as_str()).unwrap_or("");
            serde_json::to_value(tools::npm_range(pkg).await).unwrap_or(json!([]))
        }
        _ => json!({ "error": "unknown tool" }),
    }
}

fn message_payload_len(messages: &[UIMessage]) -> usize {
    messages
        .iter()
        .map(|m| {
            m.parts
                .as_ref()
                .map(|p| {
                    p.iter()
                        .filter_map(|x| x.text.as_ref())
                        .map(|t| t.len())
                        .sum::<usize>()
                })
                .unwrap_or(0)
                + m.content.as_ref().map(|c| c.to_string().len()).unwrap_or(0)
        })
        .sum()
}

fn emit_event(
    tx: &tokio::sync::mpsc::UnboundedSender<Result<Event, std::convert::Infallible>>,
    chunk: Value,
) {
    let _ = tx.send(Ok(Event::default().data(chunk.to_string())));
}

/// Accumulated function call from Responses stream deltas.
#[derive(Debug, Default, Clone)]
struct StreamFunctionCall {
    id: String,
    name: String,
    arguments: String,
}

/// Extract assistant text + function calls from a non-stream Responses body
/// (fallback when the gateway returns a complete JSON response).
fn parse_buffered_response(body: &Value) -> (String, Vec<StreamFunctionCall>) {
    let mut text = String::new();
    let mut calls = Vec::new();
    let Some(output) = body.get("output").and_then(Value::as_array) else {
        return (text, calls);
    };
    for item in output {
        match item.get("type").and_then(Value::as_str).unwrap_or("") {
            "message" => {
                if let Some(parts) = item.get("content").and_then(Value::as_array) {
                    for part in parts {
                        if part.get("type").and_then(Value::as_str) == Some("output_text") {
                            if let Some(t) = part.get("text").and_then(Value::as_str) {
                                text.push_str(t);
                            }
                        }
                    }
                }
            }
            "function_call" => {
                let id = item
                    .get("call_id")
                    .or_else(|| item.get("id"))
                    .and_then(Value::as_str)
                    .unwrap_or("")
                    .to_string();
                let name = item
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or("")
                    .to_string();
                let args = item
                    .get("arguments")
                    .and_then(Value::as_str)
                    .unwrap_or("")
                    .to_string();
                if !name.is_empty() {
                    calls.push(StreamFunctionCall {
                        id,
                        name,
                        arguments: args,
                    });
                }
            }
            _ => {}
        }
    }
    (text, calls)
}

pub async fn handle_chat(body: ChatRequest, headers: &HeaderMap, cors: HeaderMap) -> Response {
    let ai = resolve_ai();
    if ai.base_url.is_empty() || ai.key.is_empty() {
        return json_response(
            StatusCode::SERVICE_UNAVAILABLE,
            json!({ "error": "chat is warming up — the AI gateway isn't wired yet." }),
            cors,
        );
    }
    let messages: Vec<UIMessage> = body.messages.unwrap_or_default();
    let trimmed: Vec<_> = messages
        .into_iter()
        .rev()
        .take(MAX_TURNS)
        .collect::<Vec<_>>()
        .into_iter()
        .rev()
        .collect();
    if trimmed.is_empty() || trimmed.last().map(|m| m.role.as_str()) != Some("user") {
        return json_response(
            StatusCode::BAD_REQUEST,
            json!({ "error": "send at least one user message" }),
            cors,
        );
    }
    if message_payload_len(&trimmed) > 60_000 {
        return json_response(
            StatusCode::PAYLOAD_TOO_LARGE,
            json!({ "error": "that message is too long — please trim it." }),
            cors,
        );
    }
    let header_pairs: Vec<(String, String)> = headers
        .iter()
        .filter_map(|(k, v)| v.to_str().ok().map(|val| (k.as_str().to_string(), val.to_string())))
        .collect();
    let ip = client_ip(&header_pairs);
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0);
    match check_rate_limit(&ip, now) {
        LimitVerdict::TooFast => {
            return json_response(
                StatusCode::TOO_MANY_REQUESTS,
                json!({ "error": "Slow down a moment — that's a lot of questions very fast. Try again shortly." }),
                cors,
            );
        }
        LimitVerdict::DailyIp => {
            return json_response(
                StatusCode::TOO_MANY_REQUESTS,
                json!({ "error": "You've reached today's question limit. Come back tomorrow — or just email Kyle at hi@kylet.se." }),
                cors,
            );
        }
        LimitVerdict::GlobalDaily => {
            return json_response(
                StatusCode::SERVICE_UNAVAILABLE,
                json!({ "error": "My AI has answered a lot today and is resting — please try again tomorrow, or reach me at hi@kylet.se." }),
                cors,
            );
        }
        LimitVerdict::Ok => {}
    }

    let client = reqwest::Client::builder()
        .timeout(CHAT_TIMEOUT)
        .build()
        .unwrap_or_else(|_| reqwest::Client::new());

    let mut conversation_input = ui_messages_to_input_items(&trimmed);
    if conversation_input.is_empty() {
        return json_response(
            StatusCode::BAD_REQUEST,
            json!({ "error": "no readable user text" }),
            cors,
        );
    }

    let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
    let ai2 = ai.clone();
    tokio::spawn(async move {
        let text_id = Uuid::new_v4().to_string();
        for _step in 0..MAX_STEPS {
            // Client disconnect cancels the remaining gateway work promptly.
            tokio::select! {
                _ = tx.closed() => { return; }
                outcome = run_gateway_step(&client, &ai2, &conversation_input, &tx, &text_id) => {
                    match outcome {
                        StepOutcome::ToolCalls { text, calls } => {
                            // Append assistant items + tool outputs, then loop.
                            if !text.is_empty() {
                                conversation_input.push(json!({
                                    "role": "assistant",
                                    "content": [{ "type": "output_text", "text": text }],
                                }));
                            }
                            for call in &calls {
                                emit_event(&tx, json!({ "type": "tool-input-start", "toolCallId": call.id, "toolName": call.name }));
                                emit_event(&tx, json!({ "type": "tool-input-available", "toolCallId": call.id, "toolName": call.name, "input": serde_json::from_str::<Value>(&call.arguments).unwrap_or(json!({})) }));
                                let output = run_tool(&call.name, &serde_json::from_str::<Value>(&call.arguments).unwrap_or(json!({}))).await;
                                emit_event(&tx, json!({ "type": "tool-output-available", "toolCallId": call.id, "output": output }));
                                conversation_input.push(json!({
                                    "type": "function_call",
                                    "call_id": call.id,
                                    "name": call.name,
                                    "arguments": call.arguments,
                                }));
                                conversation_input.push(json!({
                                    "type": "function_call_output",
                                    "call_id": call.id,
                                    "output": output.to_string(),
                                }));
                            }
                        }
                        StepOutcome::Done { text } => {
                            if !text.is_empty() {
                                emit_event(&tx, json!({ "type": "text-start", "id": text_id }));
                                emit_event(&tx, json!({ "type": "text-delta", "id": text_id, "delta": text }));
                                emit_event(&tx, json!({ "type": "text-end", "id": text_id }));
                            }
                            let _ = tx.send(Ok(Event::default().data("[DONE]")));
                            return;
                        }
                        StepOutcome::Error { message } => {
                            emit_event(&tx, json!({ "type": "error", "errorText": message }));
                            let _ = tx.send(Ok(Event::default().data("[DONE]")));
                            return;
                        }
                        StepOutcome::Empty => {
                            emit_event(
                                &tx,
                                json!({
                                    "type": "error",
                                    "errorText": "gateway returned an empty stream — the AI provider may be unavailable (check platform credits)."
                                }),
                            );
                            let _ = tx.send(Ok(Event::default().data("[DONE]")));
                            return;
                        }
                    }
                }
            }
        }
        let _ = tx.send(Ok(Event::default().data("[DONE]")));
    });

    let mut resp_headers = cors;
    resp_headers.insert(header::CONTENT_TYPE, event_stream_content_type());
    resp_headers.insert(header::CACHE_CONTROL, no_cache());
    (
        resp_headers,
        Sse::new(UnboundedReceiverStream::new(rx)).keep_alive(KeepAlive::default()),
    )
        .into_response()
}

enum StepOutcome {
    ToolCalls { text: String, calls: Vec<StreamFunctionCall> },
    Done { text: String },
    Error { message: String },
    Empty,
}

/// One Responses request/stream round. Emits browser text deltas as they
/// arrive; returns tool calls or terminal state from `response.completed`.
async fn run_gateway_step(
    client: &reqwest::Client,
    ai: &AiConfig,
    conversation_input: &[Value],
    tx: &tokio::sync::mpsc::UnboundedSender<Result<Event, std::convert::Infallible>>,
    text_id: &str,
) -> StepOutcome {
    let payload = json!({
        "model": ai.model,
        "instructions": SYSTEM_PROMPT,
        "input": conversation_input,
        "tools": responses_tools(),
        "stream": true,
    });
    let res = match client
        .post(format!("{}/responses", ai.base_url))
        .bearer_auth(&ai.key)
        .json(&payload)
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => return StepOutcome::Error { message: format!("gateway error: {e}") },
    };
    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_default();
        return StepOutcome::Error {
            message: format!(
                "gateway {status}: {}",
                body.chars().take(200).collect::<String>()
            ),
        };
    }
    let content_type = res
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_string();

    // Non-stream fallback: complete JSON response body.
    if !content_type.contains("text/event-stream") {
        match res.json::<Value>().await {
            Ok(body) => {
                let status = body
                    .pointer("/response/status")
                    .or_else(|| body.get("status"))
                    .and_then(Value::as_str)
                    .unwrap_or("completed");
                if status == "failed" {
                    let msg = body
                        .pointer("/response/error/message")
                        .or_else(|| body.pointer("/error/message"))
                        .and_then(Value::as_str)
                        .unwrap_or("gateway failed")
                        .to_string();
                    return StepOutcome::Error { message: msg };
                }
                let (text, calls) = parse_buffered_response(&body);
                if !calls.is_empty() {
                    return StepOutcome::ToolCalls { text, calls };
                }
                if text.is_empty() {
                    return StepOutcome::Empty;
                }
                return StepOutcome::Done { text };
            }
            Err(_) => return StepOutcome::Empty,
        }
    }

    let mut byte_stream = res.bytes_stream();
    let mut saw_stream_bytes = false;
    let mut started_text = false;
    let mut text = String::new();
    let mut calls: Vec<StreamFunctionCall> = Vec::new();
    let mut by_index: std::collections::HashMap<usize, usize> = std::collections::HashMap::new();
    // Terminal signal captured inside the loop; final StepOutcome is built
    // after the loop so accumulated state can move into it exactly once.
    let mut completed_status: Option<String> = None;
    let mut failed_message: Option<String> = None;

    while let Some(chunk) = byte_stream.next().await {
        let Ok(bytes) = chunk else { continue };
        if !bytes.is_empty() {
            saw_stream_bytes = true;
        }
        for raw in String::from_utf8_lossy(&bytes).lines() {
            let data = raw.strip_prefix("data: ").unwrap_or(raw).trim();
            if data.is_empty() || data == "[DONE]" {
                continue;
            }
            let Ok(parsed) = serde_json::from_str::<Value>(data) else {
                continue;
            };
            let Some(event_type) = parsed.get("type").and_then(Value::as_str) else {
                continue;
            };
            match event_type {
                "response.output_text.delta" => {
                    if let Some(delta) = parsed.get("delta").and_then(Value::as_str) {
                        if !started_text {
                            started_text = true;
                            emit_event(tx, json!({ "type": "text-start", "id": text_id }));
                        }
                        text.push_str(delta);
                        emit_event(tx, json!({ "type": "text-delta", "id": text_id, "delta": delta }));
                    }
                }
                "response.output_item.added" => {
                    if let Some(item) = parsed.get("item") {
                        if item.get("type").and_then(Value::as_str) == Some("function_call") {
                            let idx = parsed.get("output_index").and_then(Value::as_u64).unwrap_or(0) as usize;
                            let call = StreamFunctionCall {
                                id: item
                                    .get("call_id")
                                    .and_then(Value::as_str)
                                    .unwrap_or("")
                                    .to_string(),
                                name: item.get("name").and_then(Value::as_str).unwrap_or("").to_string(),
                                arguments: String::new(),
                            };
                            by_index.insert(idx, calls.len());
                            calls.push(call);
                        }
                    }
                }
                "response.function_call_arguments.delta" => {
                    if let Some(delta) = parsed.get("delta").and_then(Value::as_str) {
                        let idx = parsed.get("output_index").and_then(Value::as_u64).unwrap_or(0) as usize;
                        if let Some(slot) = by_index.get(&idx).copied() {
                            if let Some(call) = calls.get_mut(slot) {
                                call.arguments.push_str(delta);
                            }
                        }
                    }
                }
                "response.output_item.done" => {
                    if let Some(item) = parsed.get("item") {
                        if item.get("type").and_then(Value::as_str) == Some("function_call") {
                            // Authoritative arguments if the stream omitted deltas.
                            if let Some(args) = item.get("arguments").and_then(Value::as_str) {
                                let idx = parsed.get("output_index").and_then(Value::as_u64).unwrap_or(0) as usize;
                                if let Some(slot) = by_index.get(&idx).copied() {
                                    if let Some(call) = calls.get_mut(slot) {
                                        if call.arguments.is_empty() {
                                            call.arguments = args.to_string();
                                        }
                                        if call.id.is_empty() {
                                            if let Some(id) = item.get("call_id").and_then(Value::as_str) {
                                                call.id = id.to_string();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                "response.completed" => {
                    if let Some(output) = parsed.pointer("/response/output").and_then(Value::as_array) {
                        // Authoritative final parse (covers deltas missed or buffered).
                        for item in output {
                            match item.get("type").and_then(Value::as_str).unwrap_or("") {
                                "message" => {
                                    if let Some(parts) = item.get("content").and_then(Value::as_array) {
                                        for part in parts {
                                            if part.get("type").and_then(Value::as_str) == Some("output_text") {
                                                if let Some(t) = part.get("text").and_then(Value::as_str) {
                                                    text.push_str(t);
                                                }
                                            }
                                        }
                                    }
                                }
                                "function_call" => {
                                    let name = item.get("name").and_then(Value::as_str).unwrap_or("").to_string();
                                    if name.is_empty() {
                                        continue;
                                    }
                                    let id = item
                                        .get("call_id")
                                        .or_else(|| item.get("id"))
                                        .and_then(Value::as_str)
                                        .unwrap_or("")
                                        .to_string();
                                    let args = item.get("arguments").and_then(Value::as_str).unwrap_or("").to_string();
                                    if let Some(existing) = calls.iter_mut().find(|c| !c.id.is_empty() && c.id == id) {
                                        if existing.arguments.is_empty() {
                                            existing.arguments = args;
                                        }
                                    } else {
                                        calls.push(StreamFunctionCall { id, name, arguments: args });
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                    completed_status = Some(
                        parsed
                            .pointer("/response/status")
                            .and_then(Value::as_str)
                            .unwrap_or("completed")
                            .to_string(),
                    );
                }
                "response.incomplete" => {
                    failed_message = Some("gateway stream ended incomplete — please try again.".to_string());
                }
                "response.failed" => {
                    failed_message = Some(
                        parsed
                            .pointer("/response/error/message")
                            .and_then(Value::as_str)
                            .unwrap_or("gateway failed")
                            .to_string(),
                    );
                }
                _ => {}
            }
        }
        if completed_status.is_some() || failed_message.is_some() {
            break;
        }
    }

    if let Some(msg) = failed_message {
        return StepOutcome::Error { message: msg };
    }
    if let Some(status) = completed_status {
        if status != "completed" {
            return StepOutcome::Error {
                message: format!("gateway response status: {status}"),
            };
        }
        if !calls.is_empty() {
            return StepOutcome::ToolCalls { text, calls };
        }
        if !text.is_empty() || started_text {
            return StepOutcome::Done { text };
        }
        return StepOutcome::Empty;
    }
    if !saw_stream_bytes {
        return StepOutcome::Empty;
    }
    // Stream ended without a terminal event: text (if any) is all we have.
    if !calls.is_empty() {
        return StepOutcome::ToolCalls { text, calls };
    }
    if !text.is_empty() || started_text {
        return StepOutcome::Done { text };
    }
    StepOutcome::Empty
}

fn json_response(status: StatusCode, body: Value, mut cors: HeaderMap) -> Response {
    crate::http_util::apply_json_headers(&mut cors);
    (
        status,
        cors,
        serde_json::to_string(&body).unwrap_or_else(|_| "{}".to_string()),
    )
        .into_response()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ui_messages_map_to_responses_input_items() {
        let messages = vec![
            UIMessage {
                role: "user".into(),
                parts: Some(vec![UIPart {
                    kind: "text".into(),
                    text: Some("hello".into()),
                }]),
                content: None,
            },
            UIMessage {
                role: "assistant".into(),
                parts: Some(vec![UIPart {
                    kind: "text".into(),
                    text: Some("hi".into()),
                }]),
                content: None,
            },
            UIMessage {
                role: "system".into(),
                parts: None,
                content: Some(json!([{ "type": "text", "text": "ignored" }])),
            },
        ];
        let items = ui_messages_to_input_items(&messages);
        assert_eq!(items.len(), 2);
        assert_eq!(items[0]["role"], "user");
        assert_eq!(items[0]["content"][0]["type"], "input_text");
        assert_eq!(items[1]["role"], "assistant");
        assert_eq!(items[1]["content"][0]["type"], "output_text");
    }

    #[test]
    fn parse_buffered_response_extracts_text_and_calls() {
        let body = json!({
            "id": "r1",
            "output": [
                { "type": "message", "role": "assistant", "content": [
                    { "type": "output_text", "text": "Here is the answer " }
                ]},
                { "type": "function_call", "call_id": "call_1", "name": "get_repo", "arguments": "{\"name\":\"pdf-reader-mcp\"}" }
            ]
        });
        let (text, calls) = parse_buffered_response(&body);
        assert_eq!(text, "Here is the answer ");
        assert_eq!(calls.len(), 1);
        assert_eq!(calls[0].name, "get_repo");
        assert_eq!(calls[0].id, "call_1");
    }

    #[test]
    fn normalize_v1_url_rules() {
        assert_eq!(normalize_v1_url(None), "https://api.sylphx.ai/v1");
        assert_eq!(
            normalize_v1_url(Some("https://gateway.example")),
            "https://gateway.example/v1"
        );
        assert_eq!(
            normalize_v1_url(Some("https://gateway.example/v1")),
            "https://gateway.example/v1"
        );
        assert_eq!(
            normalize_v1_url(Some("https://gateway.example/v1/")),
            "https://gateway.example/v1"
        );
    }

    #[test]
    fn forbids_platform_management_hosts() {
        assert!(is_forbidden_gateway_host("api.sylphx.com"));
        assert!(is_forbidden_gateway_host("API.sylphx.com"));
        assert!(!is_forbidden_gateway_host("api.sylphx.ai"));
        assert!(!is_forbidden_gateway_host("gateway.sylphx-ai-prod.svc.cluster.local"));
        assert!(!is_forbidden_gateway_host("127.0.0.1"));
    }

    #[test]
    fn rejects_platform_product_keys() {
        assert!(!is_plausible_gateway_key("sk_prod_0288deadbeef"));
        assert!(!is_plausible_gateway_key("pk_prod_abc"));
        assert!(!is_plausible_gateway_key("sylphx://pk_prod_x@unit.api.sylphx.com"));
        assert!(!is_plausible_gateway_key("eyJhbGciOiJIUzI1NiJ9.e30.sig"));
        assert!(is_plausible_gateway_key("ck_8cdf15c1c_testkey"));
        assert!(is_plausible_gateway_key("sk-sx-abcdefghijklmnop"));
        assert!(is_plausible_gateway_key("sk-wiremock"));
    }
}
