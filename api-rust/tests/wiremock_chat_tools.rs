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
                "archived": false,
                "private": false,
                "visibility": "public"
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
        .respond_with(ResponseTemplate::new(200).set_body_raw(tool_sse, "text/event-stream"))
        .up_to_n_times(1)
        .mount(&gw)
        .await;
    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(ResponseTemplate::new(200).set_body_raw(text_sse, "text/event-stream"))
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
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let text = String::from_utf8_lossy(&bytes);
    assert!(text.contains("tool-output-available"), "{text}");
    assert!(text.contains("tool-repo"), "{text}");
    assert!(text.contains("Grounded."), "{text}");

    let received = gw.received_requests().await.expect("received");
    assert_eq!(received.len(), 2, "tool loop should call gateway twice");
    for (n, req) in received.iter().enumerate() {
        let payload: serde_json::Value = serde_json::from_slice(&req.body).expect("gateway JSON");
        let input = payload["input"].as_array().expect("input");
        for (i, item) in input.iter().enumerate() {
            let ty = item.get("type").and_then(|v| v.as_str()).unwrap_or("");
            assert!(!ty.is_empty(), "step {n} $.input[{i}].type omitted: {item}");
            let role = item.get("role").and_then(|v| v.as_str()).unwrap_or("");
            if role == "user" || role == "assistant" {
                assert_eq!(
                    ty, "message",
                    "step {n} $.input[{i}] must be type=message: {item}"
                );
            }
        }
        assert_eq!(payload["tools"].as_array().map(Vec::len), Some(5));
    }
    let second: serde_json::Value =
        serde_json::from_slice(&received[1].body).expect("second gateway JSON");
    let types: Vec<&str> = second["input"]
        .as_array()
        .expect("input")
        .iter()
        .filter_map(|item| item.get("type").and_then(|v| v.as_str()))
        .collect();
    assert!(types.contains(&"message"), "{types:?}");
    assert!(types.contains(&"function_call"), "{types:?}");
    assert!(types.contains(&"function_call_output"), "{types:?}");
}

#[tokio::test]
#[serial]
async fn chat_get_repo_returns_null_for_non_public_repository() {
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

    Mock::given(method("GET"))
        .and(path("/repos/shtse8/nonpublic-synthetic-a"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "full_name": "shtse8/nonpublic-synthetic-a",
            "name": "nonpublic-synthetic-a",
            "owner": {"login": "shtse8"},
            "private": true,
            "visibility": "private"
        })))
        .mount(&gh)
        .await;

    let tool_sse = "data: {\"type\":\"response.output_item.added\",\"output_index\":0,\"item\":{\"type\":\"function_call\",\"call_id\":\"call-private\",\"name\":\"get_repo\"}}\n\n\
data: {\"type\":\"response.function_call_arguments.delta\",\"output_index\":0,\"delta\":\"{\\\"name\\\":\\\"nonpublic-synthetic-a\\\"}\"}\n\n\
data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r1\",\"status\":\"completed\",\"output\":[{\"type\":\"function_call\",\"call_id\":\"call-private\",\"name\":\"get_repo\",\"arguments\":\"{\\\"name\\\":\\\"nonpublic-synthetic-a\\\"}\"}]}}\n\n";
    let text_sse = "data: {\"type\":\"response.output_text.delta\",\"delta\":\"Unavailable.\"}\n\n\
data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r2\",\"status\":\"completed\",\"output\":[{\"type\":\"message\",\"role\":\"assistant\",\"content\":[{\"type\":\"output_text\",\"text\":\"Unavailable.\"}]}]}}\n\n";

    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(ResponseTemplate::new(200).set_body_raw(tool_sse, "text/event-stream"))
        .up_to_n_times(1)
        .mount(&gw)
        .await;
    Mock::given(method("POST"))
        .and(path("/v1/responses"))
        .respond_with(ResponseTemplate::new(200).set_body_raw(text_sse, "text/event-stream"))
        .up_to_n_times(1)
        .mount(&gw)
        .await;

    let body = json!({"messages": [{"role": "user", "parts": [{"type": "text", "text": "check the synthetic repo"}]}]});
    let res = router()
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
    assert!(text.contains("tool-output-available"), "{text}");
    assert!(text.contains("[DONE]"), "{text}");

    let received = gw.received_requests().await.expect("gateway requests");
    assert_eq!(received.len(), 2);
    let second: serde_json::Value = serde_json::from_slice(&received[1].body).unwrap();
    let output = second["input"]
        .as_array()
        .and_then(|items| {
            items
                .iter()
                .find(|item| item["type"] == "function_call_output")
        })
        .and_then(|item| item["output"].as_str());
    assert_eq!(output, Some("null"));
}
