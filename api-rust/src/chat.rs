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

#[derive(Debug, Clone)]
pub struct AiConfig {
    pub base_url: String,
    pub key: String,
    pub model: String,
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

pub fn resolve_ai() -> AiConfig {
    let override_base = env::var("AI_GATEWAY_BASE_URL")
        .ok()
        .filter(|s| !s.trim().is_empty());
    let override_key = env::var("AI_GATEWAY_KEY")
        .ok()
        .filter(|s| !s.trim().is_empty());
    let conn = env::var("SYLPHX_URL").unwrap_or_default();
    let cred = conn
        .strip_prefix("sylphx://")
        .and_then(|rest| rest.split('@').next())
        .unwrap_or("")
        .to_string();
    let host = conn
        .split('@')
        .nth(1)
        .and_then(|h| h.split('/').next())
        .unwrap_or("")
        .to_string();
    let base = override_base.unwrap_or_else(|| {
        if host.is_empty() {
            String::new()
        } else {
            format!("https://{host}/v1")
        }
    });
    AiConfig {
        base_url: base.trim_end_matches('/').to_string(),
        key: override_key.unwrap_or(cred),
        model: env::var("AI_MODEL").unwrap_or_else(|_| AI_MODEL.to_string()),
    }
}

fn ui_messages_to_openai(messages: &[UIMessage]) -> Vec<Value> {
    messages
        .iter()
        .filter_map(|m| {
            let role = m.role.as_str();
            if role != "user" && role != "assistant" && role != "system" {
                return None;
            }
            let text: String = if let Some(parts) = &m.parts {
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
            };
            if text.is_empty() && role != "assistant" {
                return None;
            }
            Some(json!({ "role": role, "content": text }))
        })
        .collect()
}

fn tools_schema() -> Vec<Value> {
    vec![
        json!({"type":"function","function":{"name":"list_projects","description":"List Kyle's top projects by live GitHub stars.","parameters":{"type":"object","properties":{"limit":{"type":"number"}}}}}),
        json!({"type":"function","function":{"name":"get_repo","description":"Get live details for a specific repository.","parameters":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}}}),
        json!({"type":"function","function":{"name":"recent_activity","description":"Show Kyle's most recently shipped repos.","parameters":{"type":"object","properties":{"limit":{"type":"number"}}}}}),
        json!({"type":"function","function":{"name":"search_projects","description":"Search Kyle's repos by keyword.","parameters":{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}}}),
        json!({"type":"function","function":{"name":"npm_downloads","description":"Get npm download counts for a package.","parameters":{"type":"object","properties":{"pkg":{"type":"string"}},"required":["pkg"]}}}),
    ]
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

fn emit_event(tx: &tokio::sync::mpsc::UnboundedSender<Result<Event, std::convert::Infallible>>, chunk: Value) {
    let _ = tx.send(Ok(Event::default().data(chunk.to_string())));
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

    let mut openai_messages = ui_messages_to_openai(&trimmed);
    openai_messages.insert(0, json!({ "role": "system", "content": SYSTEM_PROMPT }));

    let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
    let ai2 = ai.clone();
    tokio::spawn(async move {
        let text_id = Uuid::new_v4().to_string();
        let mut messages_state = openai_messages;
        for _step in 0..MAX_STEPS {
            let payload = json!({
                "model": ai2.model,
                "messages": messages_state,
                "tools": tools_schema(),
                "stream": true,
            });
            let res = match client
                .post(format!("{}/chat/completions", ai2.base_url))
                .bearer_auth(&ai2.key)
                .json(&payload)
                .send()
                .await
            {
                Ok(r) => r,
                Err(e) => {
                    emit_event(&tx, json!({ "type": "error", "errorText": format!("gateway error: {e}") }));
                    let _ = tx.send(Ok(Event::default().data("[DONE]")));
                    return;
                }
            };
            if !res.status().is_success() {
                let status = res.status();
                let body = res.text().await.unwrap_or_default();
                emit_event(
                    &tx,
                    json!({ "type": "error", "errorText": format!("gateway {status}: {}", body.chars().take(200).collect::<String>()) }),
                );
                let _ = tx.send(Ok(Event::default().data("[DONE]")));
                return;
            }
            let mut byte_stream = res.bytes_stream();
            let mut saw_stream_bytes = false;
            let mut assistant_text = String::new();
            let mut tool_calls: Vec<(String, String, String)> = Vec::new();
            let mut started_text = false;
            let mut tool_finish = false;
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
                    let choice = parsed.get("choices").and_then(|c| c.get(0));
                    let delta = choice.and_then(|c| c.get("delta"));
                    if let Some(content) = delta.and_then(|d| d.get("content")).and_then(|c| c.as_str()) {
                        if !started_text {
                            started_text = true;
                            emit_event(&tx, json!({ "type": "text-start", "id": text_id }));
                        }
                        assistant_text.push_str(content);
                        emit_event(&tx, json!({ "type": "text-delta", "id": text_id, "delta": content }));
                    }
                    if let Some(tcs) = delta.and_then(|d| d.get("tool_calls")).and_then(|t| t.as_array()) {
                        for tc in tcs {
                            let idx = tc.get("index").and_then(|i| i.as_u64()).unwrap_or(0) as usize;
                            while tool_calls.len() <= idx {
                                tool_calls.push((String::new(), String::new(), String::new()));
                            }
                            if let Some(id) = tc.get("id").and_then(|i| i.as_str()) {
                                tool_calls[idx].0 = id.to_string();
                            }
                            if let Some(name) = tc.get("function").and_then(|f| f.get("name")).and_then(|n| n.as_str()) {
                                tool_calls[idx].1 = name.to_string();
                            }
                            if let Some(args) = tc.get("function").and_then(|f| f.get("arguments")).and_then(|a| a.as_str()) {
                                tool_calls[idx].2.push_str(args);
                            }
                        }
                    }
                    if let Some(finish) = choice.and_then(|c| c.get("finish_reason")).and_then(|f| f.as_str()) {
                        if finish == "stop" {
                            if started_text {
                                emit_event(&tx, json!({ "type": "text-end", "id": text_id }));
                            }
                            let _ = tx.send(Ok(Event::default().data("[DONE]")));
                            return;
                        }
                        if finish == "tool_calls" {
                            tool_finish = true;
                            if started_text {
                                emit_event(&tx, json!({ "type": "text-end", "id": text_id }));
                            }
                            let mut tool_msgs = Vec::new();
                            for (id, name, args_raw) in &tool_calls {
                                if name.is_empty() {
                                    continue;
                                }
                                let args: Value = serde_json::from_str(args_raw).unwrap_or(json!({}));
                                emit_event(&tx, json!({ "type": "tool-input-start", "toolCallId": id, "toolName": name }));
                                emit_event(&tx, json!({ "type": "tool-input-available", "toolCallId": id, "toolName": name, "input": args }));
                                let output = run_tool(name, &args).await;
                                emit_event(&tx, json!({ "type": "tool-output-available", "toolCallId": id, "output": output }));
                                tool_msgs.push(json!({ "role": "tool", "tool_call_id": id, "content": output.to_string() }));
                            }
                            messages_state.push(json!({
                                "role": "assistant",
                                "content": assistant_text,
                                "tool_calls": tool_calls.iter().map(|(id, name, args)| json!({
                                    "id": id, "type": "function", "function": { "name": name, "arguments": args }
                                })).collect::<Vec<_>>()
                            }));
                            for tm in tool_msgs {
                                messages_state.push(tm);
                            }
                            break;
                        }
                    }
                }
            }
            if tool_finish {
                continue;
            }
            if !started_text && !saw_stream_bytes {
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
            if started_text {
                emit_event(&tx, json!({ "type": "text-end", "id": text_id }));
            }
            let _ = tx.send(Ok(Event::default().data("[DONE]")));
            return;
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

fn json_response(status: StatusCode, body: Value, mut cors: HeaderMap) -> Response {
    crate::http_util::apply_json_headers(&mut cors);
    (
        status,
        cors,
        serde_json::to_string(&body).unwrap_or_else(|_| "{}".to_string()),
    )
        .into_response()
}