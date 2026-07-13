use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

#[tokio::test]
#[serial]
async fn chat_endpoint_streams_gateway_sse_from_wiremock() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("AI_GATEWAY_BASE_URL", format!("{}/v1", server.uri()));
        std::env::set_var("AI_GATEWAY_KEY", "sk-wiremock");
        std::env::remove_var("SYLPHX_URL");
    }

    let sse = "data: {\"choices\":[{\"delta\":{\"content\":\"Hello\"}}]}\n\n\
data: {\"choices\":[{\"delta\":{},\"finish_reason\":\"stop\"}]}\n\n\
data: [DONE]\n\n";

    Mock::given(method("POST"))
        .and(path("/v1/chat/completions"))
        .respond_with(
            ResponseTemplate::new(200)
                .insert_header("content-type", "text/event-stream")
                .set_body_string(sse),
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
}
