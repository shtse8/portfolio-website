use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path, path_regex};
use wiremock::{Mock, MockServer, ResponseTemplate};

#[tokio::test]
#[serial]
async fn chat_tool_loop_list_projects_grounded_by_wiremock_github() {
    let gh = MockServer::start().await;
    let gw = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("GITHUB_API_BASE", gh.uri());
        std::env::set_var("GITHUB_TOKEN", "wiremock-token");
        std::env::set_var("AI_GATEWAY_BASE_URL", format!("{}/v1", gw.uri()));
        std::env::set_var("AI_GATEWAY_KEY", "sk-wiremock");
        std::env::remove_var("SYLPHX_URL");
    }

    for owner in ["shtse8", "SylphxAI", "Cubeage", "EpiowAI"] {
        let body = if owner == "shtse8" {
            json!([{
                "full_name": "shtse8/tool-repo",
                "name": "tool-repo",
                "owner": {"login": "shtse8"},
                "stargazers_count": 3,
                "forks_count": 0,
                "description": "from tool",
                "language": "Rust",
                "topics": [],
                "html_url": "https://github.com/shtse8/tool-repo",
                "pushed_at": "2026-07-01T00:00:00Z",
                "fork": false,
                "archived": false
            }])
        } else {
            json!([])
        };
        Mock::given(method("GET"))
            .and(path_regex(format!(r"/users/{owner}/repos.*")))
            .respond_with(ResponseTemplate::new(200).set_body_json(body))
            .mount(&gh)
            .await;
    }

    let tool_sse = "data: {\"choices\":[{\"delta\":{\"tool_calls\":[{\"index\":0,\"id\":\"call1\",\"function\":{\"name\":\"list_projects\",\"arguments\":\"{\\\"limit\\\":2}\"}}]}}]}\n\n\
data: {\"choices\":[{\"finish_reason\":\"tool_calls\"}]}\n\n\
data: [DONE]\n\n";
    let text_sse = "data: {\"choices\":[{\"delta\":{\"content\":\"Grounded.\"}}]}\n\n\
data: {\"choices\":[{\"finish_reason\":\"stop\"}]}\n\n\
data: [DONE]\n\n";

    Mock::given(method("POST"))
        .and(path("/v1/chat/completions"))
        .respond_with(ResponseTemplate::new(200).insert_header("content-type", "text/event-stream").set_body_string(tool_sse))
        .up_to_n_times(1)
        .mount(&gw)
        .await;
    Mock::given(method("POST"))
        .and(path("/v1/chat/completions"))
        .respond_with(ResponseTemplate::new(200).insert_header("content-type", "text/event-stream").set_body_string(text_sse))
        .up_to_n_times(1)
        .mount(&gw)
        .await;

    let body = json!({"messages": [{"role": "user", "parts": [{"type": "text", "text": "list projects"}]}]});
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
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX).await.unwrap();
    let text = String::from_utf8_lossy(&bytes);
    assert!(text.contains("tool-output-available"), "{text}");
    assert!(text.contains("tool-repo") || text.contains("Grounded."), "{text}");
}
