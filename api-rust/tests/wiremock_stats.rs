use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path, path_regex};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn set_upstream_env(server: &MockServer) {
    // SAFETY: serialized via #[serial] on these tests.
    unsafe {
        std::env::set_var("GITHUB_API_BASE", server.uri());
        std::env::set_var("NPM_API_BASE", server.uri());
        std::env::set_var("GITHUB_TOKEN", "wiremock-token");
    }
}

#[tokio::test]
#[serial]
async fn stats_endpoint_uses_wiremock_github_and_npm() {
    let server = MockServer::start().await;
    set_upstream_env(&server);
    testing::reset_all();

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "data": {
                "o0": {"repositories": {"totalCount": 1, "nodes": [{"stargazerCount": 10, "isPrivate": false, "visibility": "PUBLIC"}]}},
                "o1": {"repositories": {"totalCount": 1, "nodes": [{"stargazerCount": 20, "isPrivate": false, "visibility": "PUBLIC"}]}},
                "o2": {"repositories": {"totalCount": 0, "nodes": []}},
                "o3": {"repositories": {"totalCount": 0, "nodes": []}},
                "o4": {"repositories": {"totalCount": 0, "nodes": []}}
            }
        })))
        .mount(&server)
        .await;

    Mock::given(method("GET"))
        .and(path("/repos/SylphxAI/pdf-reader-mcp"))
        .respond_with(ResponseTemplate::new(200).set_body_json(
            json!({"stargazers_count": 99, "private": false, "visibility": "public"}),
        ))
        .mount(&server)
        .await;

    Mock::given(method("GET"))
        .and(path_regex(r"/downloads/point/last-month/.*"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({"downloads": 7})))
        .mount(&server)
        .await;

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/stats")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["githubStars"], 30);
    assert_eq!(v["flagshipStars"], 99);
    assert_eq!(v["npmDownloads"], 70); // 10 packages * 7
    assert_eq!(v["flagshipDownloads"], 7);
    assert_eq!(v["freshness"], "live");
    assert_eq!(v["stale"], false);
    assert!(v.get("verifiedAt").and_then(|x| x.as_str()).is_some());
    assert_eq!(v["verifiedAt"], v["updatedAt"]);
    assert_eq!(v["repositoryVisibility"], "public-only/v1");

    let received = server.received_requests().await.expect("received requests");
    let graphql = received
        .iter()
        .find(|request| request.url.path() == "/graphql")
        .expect("graphql request");
    let payload: serde_json::Value = serde_json::from_slice(&graphql.body).unwrap();
    let query = payload["query"].as_str().expect("graphql query");
    assert_eq!(query.matches("privacy: PUBLIC").count(), 5);
    assert!(query.contains("isPrivate visibility"));
}

#[tokio::test]
#[serial]
async fn stats_fails_closed_if_public_query_returns_unverifiable_repository() {
    let server = MockServer::start().await;
    set_upstream_env(&server);
    testing::reset_all();

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "data": {
                "o0": {"repositories": {"totalCount": 1, "nodes": [
                    {"stargazerCount": 999, "isPrivate": false}
                ]}}
            }
        })))
        .mount(&server)
        .await;

    let res = router()
        .oneshot(
            Request::builder()
                .uri("/stats")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::BAD_GATEWAY);
}
