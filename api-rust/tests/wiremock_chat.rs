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
async fn chat_endpoint_streams_gateway_responses_sse_from_wiremock() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("SYLPHX_AI_URL", server.uri());
        std::env::set_var("SYLPHX_AI_API_KEY", "sk-wiremock");
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
