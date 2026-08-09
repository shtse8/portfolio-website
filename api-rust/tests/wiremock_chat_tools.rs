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
        std::env::set_var("SYLPHX_AI_URL", gw.uri());
        std::env::set_var("SYLPHX_AI_API_KEY", "sk-wiremock");
        std::env::remove_var("SYLPHX_URL");
        std::env::remove_var("AI_GATEWAY_BASE_URL");
        std::env::remove_var("AI_GATEWAY_KEY");
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

    let tool_sse = "data: {\"type\":\"response.output_item.added\",\"output_index\":0,\"item\":{\"type\":\"function_call\",\"call_id\":\"call1\",\"name\":\"list_projects\"}}\n\n\
data: {\"type\":\"response.function_call_arguments.delta\",\"output_index\":0,\"delta\":\"{\\\"limit\\\":2}\"}\n\n\
data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r1\",\"status\":\"completed\",\"output\":[{\"type\":\"function_call\",\"call_id\":\"call1\",\"name\":\"list_projects\",\"arguments\":\"{\\\"limit\\\":2}\"}]}}\n\n";
    let text_sse = "data: {\"type\":\"response.output_text.delta\",\"delta\":\"Grounded.\"}\n\n\
data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r2\",\"status\":\"completed\",\"output\":[{\"type\":\"message\",\"role\":\"assistant\",\"content\":[{\"type\":\"output_text\",\"text\":\"Grounded.\"}]}]}}\n\n";

    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(
            ResponseTemplate::new(200)
                .set_body_raw(tool_sse, "text/event-stream"),
        )
        .up_to_n_times(1)
        .mount(&gw)
        .await;
    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(
            ResponseTemplate::new(200)
                .set_body_raw(text_sse, "text/event-stream"),
        )
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
    assert!(text.contains("tool-repo"), "{text}");
    assert!(text.contains("Grounded."), "{text}");
}
