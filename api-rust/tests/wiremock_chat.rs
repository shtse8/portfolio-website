use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn assert_gateway_input_items_have_type_message(body: &[u8]) {
    let payload: serde_json::Value = serde_json::from_slice(body).expect("gateway JSON");
    let input = payload
        .get("input")
        .and_then(|v| v.as_array())
        .expect("input array");
    assert!(!input.is_empty(), "gateway input must not be empty: {payload}");
    for (i, item) in input.iter().enumerate() {
        let ty = item.get("type").and_then(|v| v.as_str()).unwrap_or("");
        assert!(
            !ty.is_empty(),
            "$.input[{i}].type omitted (gateway 400 non-empty string is required): {item}"
        );
        let role = item.get("role").and_then(|v| v.as_str()).unwrap_or("");
        if role == "user" || role == "assistant" {
            assert_eq!(
                ty, "message",
                "$.input[{i}] role={role} must be type=message: {item}"
            );
        }
    }
    let tools = payload
        .get("tools")
        .and_then(|v| v.as_array())
        .expect("tools array");
    assert_eq!(
        tools.len(),
        5,
        "POST /chat must keep five tools: {tools:?}"
    );
}

#[tokio::test]
#[serial]
async fn chat_endpoint_streams_gateway_responses_sse_from_wiremock() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("SYLPHX_AI_URL", server.uri());
        std::env::set_var("SYLPHX_AI_API_KEY", "sk-sx-wiremock");
        std::env::remove_var("SYLPHX_URL");
        std::env::remove_var("AI_GATEWAY_BASE_URL");
        std::env::remove_var("AI_GATEWAY_KEY");
    }

    let sse = "data: {\"type\":\"response.output_text.delta\",\"delta\":\"Hello\"}\n\n\
data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r1\",\"status\":\"completed\",\"model\":\"sylphx/lumen\",\"output\":[{\"type\":\"message\",\"role\":\"assistant\",\"content\":[{\"type\":\"output_text\",\"text\":\"Hello\"}]}]}}\n\n";

    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(
            ResponseTemplate::new(200)
                .set_body_raw(sse, "text/event-stream"),
        )
        .mount(&server)
        .await;

    let body = json!({
        "messages": [{"role": "user", "parts": [{"type": "text", "text": "hi"}]}]
    });

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/chat")
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let text = String::from_utf8_lossy(&bytes);
    assert!(text.contains("text-delta"), "stream missing deltas: {text}");
    assert!(text.contains("Hello"));
    assert!(text.contains("[DONE]"));

    let received = server.received_requests().await.expect("received");
    assert_eq!(received.len(), 1, "expected one gateway call, got {}", received.len());
    assert_gateway_input_items_have_type_message(&received[0].body);
}

#[tokio::test]
#[serial]
async fn chat_posts_responses_input_items_with_type_message() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("SYLPHX_AI_URL", server.uri());
        std::env::set_var("SYLPHX_AI_API_KEY", "sk-sx-wiremock");
        std::env::remove_var("SYLPHX_URL");
        std::env::remove_var("AI_GATEWAY_BASE_URL");
        std::env::remove_var("AI_GATEWAY_KEY");
    }

    let sse = "data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r1\",\"status\":\"completed\",\"output\":[{\"type\":\"message\",\"role\":\"assistant\",\"content\":[{\"type\":\"output_text\",\"text\":\"ok\"}]}]}}\n\n";

    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(
            ResponseTemplate::new(200)
                .set_body_raw(sse, "text/event-stream"),
        )
        .mount(&server)
        .await;

    let body = json!({
        "messages": [
            {"role": "user", "parts": [{"type": "text", "text": "hello kyle"}]},
            {"role": "assistant", "parts": [{"type": "text", "text": "hi"}]},
            {"role": "user", "parts": [{"type": "text", "text": "list a repo"}]}
        ]
    });

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/chat")
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let text = String::from_utf8_lossy(&bytes);
    assert!(text.contains("[DONE]"), "{text}");

    let received = server.received_requests().await.expect("received");
    assert_eq!(received.len(), 1);
    let payload: serde_json::Value =
        serde_json::from_slice(&received[0].body).expect("gateway JSON");
    assert_gateway_input_items_have_type_message(&received[0].body);
    assert_eq!(payload["input"][0]["type"], "message");
    assert_eq!(payload["input"][0]["role"], "user");
    assert_eq!(payload["input"][1]["type"], "message");
    assert_eq!(payload["input"][1]["role"], "assistant");
    assert_eq!(payload["input"][2]["type"], "message");
    assert_eq!(payload["input"][2]["role"], "user");
    let names: Vec<&str> = payload["tools"]
        .as_array()
        .expect("tools")
        .iter()
        .filter_map(|t| t.get("name").and_then(|n| n.as_str()))
        .collect();
    assert_eq!(
        names,
        [
            "list_projects",
            "get_repo",
            "recent_activity",
            "search_projects",
            "npm_downloads"
        ]
    );
}

#[tokio::test]
#[serial]
async fn chat_fails_closed_without_gateway_credentials() {
    testing::reset_all();
    unsafe {
        std::env::remove_var("SYLPHX_AI_API_KEY");
        std::env::remove_var("AI_GATEWAY_KEY");
        std::env::remove_var("SYLPHX_URL");
    }
    let body = json!({
        "messages": [{"role": "user", "parts": [{"type": "text", "text": "hi"}]}]
    });
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/chat")
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::SERVICE_UNAVAILABLE);
}

#[tokio::test]
#[serial]
async fn chat_ready_fails_closed_for_leftover_internal_ck_key() {
    // Live 2026-09-04: dest host + leftover ck_* reported ready=true while
    // POST /chat streamed gateway 401 invalid_api_key.
    testing::reset_all();
    unsafe {
        std::env::set_var("AI_GATEWAY_BASE_URL", "https://api.sylphx.ai");
        std::env::set_var("SYLPHX_AI_URL", "https://api.sylphx.ai");
        std::env::set_var("AI_GATEWAY_KEY", "ck_8cdf15c1c_testkey");
        std::env::set_var("SYLPHX_AI_API_KEY", "ck_8cdf15c1c_testkey");
        std::env::remove_var("SYLPHX_URL");
        std::env::remove_var("AI_GATEWAY_API_KEY");
    }
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/chat/ready")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let body: serde_json::Value = serde_json::from_slice(&bytes).expect("ready json");
    assert_eq!(body["ready"], false, "{body}");
    assert_eq!(body["reason"], "missing_or_invalid_gateway_key", "{body}");
    assert_eq!(body["host"], "api.sylphx.ai", "{body}");
}

#[tokio::test]
#[serial]
async fn chat_post_fails_closed_for_leftover_internal_ck_key() {
    testing::reset_all();
    unsafe {
        std::env::set_var("AI_GATEWAY_BASE_URL", "https://api.sylphx.ai");
        std::env::set_var("AI_GATEWAY_KEY", "ck_8cdf15c1c_testkey");
        std::env::set_var("SYLPHX_AI_API_KEY", "ck_8cdf15c1c_testkey");
        std::env::remove_var("SYLPHX_URL");
        std::env::remove_var("AI_GATEWAY_API_KEY");
    }
    let body = json!({
        "messages": [{"role": "user", "parts": [{"type": "text", "text": "hi"}]}]
    });
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/chat")
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::SERVICE_UNAVAILABLE);
}

#[tokio::test]
#[serial]
async fn chat_ready_true_for_dest_sk_sx_key() {
    testing::reset_all();
    unsafe {
        std::env::set_var("AI_GATEWAY_BASE_URL", "https://api.sylphx.ai");
        std::env::set_var("SYLPHX_AI_API_KEY", "sk-sx-wiremock");
        std::env::remove_var("AI_GATEWAY_KEY");
        std::env::remove_var("AI_GATEWAY_API_KEY");
        std::env::remove_var("SYLPHX_URL");
    }
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/chat/ready")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let body: serde_json::Value = serde_json::from_slice(&bytes).expect("ready json");
    assert_eq!(body["ready"], true, "{body}");
    assert_eq!(body["reason"], serde_json::Value::Null, "{body}");
    assert_eq!(body["host"], "api.sylphx.ai", "{body}");
}

#[tokio::test]
#[serial]
async fn chat_never_uses_public_sylphx_url_as_credential() {
    // SYLPHX_URL (platform public browser connection URL) must be ignored;
    // without a real server credential the service fails closed.
    testing::reset_all();
    unsafe {
        std::env::set_var("SYLPHX_URL", "sylphx://pk_prod_abc@portfolio.api.sylphx.com");
        std::env::remove_var("SYLPHX_AI_API_KEY");
        std::env::remove_var("AI_GATEWAY_KEY");
    }
    let body = json!({
        "messages": [{"role": "user", "parts": [{"type": "text", "text": "hi"}]}]
    });
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/chat")
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::SERVICE_UNAVAILABLE);
}
