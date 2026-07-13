use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path, path_regex};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn set_github_env(server: &MockServer) {
    unsafe {
        std::env::set_var("GITHUB_API_BASE", server.uri());
        std::env::set_var("GITHUB_TOKEN", "wiremock-token");
    }
}

#[tokio::test]
#[serial]
async fn projects_endpoint_lists_repos_from_wiremock() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    let repo = json!([{
        "full_name": "shtse8/demo-repo",
        "name": "demo-repo",
        "owner": {"login": "shtse8"},
        "stargazers_count": 12,
        "forks_count": 1,
        "description": "demo",
        "language": "Rust",
        "topics": ["ai"],
        "html_url": "https://github.com/shtse8/demo-repo",
        "pushed_at": "2026-07-01T12:00:00Z",
        "fork": false,
        "archived": false
    }]);

    for owner in ["shtse8", "SylphxAI", "Cubeage", "EpiowAI"] {
        let body = if owner == "shtse8" { repo.clone() } else { json!([]) };
        Mock::given(method("GET"))
            .and(path_regex(format!(r"/users/{owner}/repos.*")))
            .respond_with(ResponseTemplate::new(200).set_body_json(body))
            .mount(&server)
            .await;
    }

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/projects?limit=5")
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
    assert_eq!(v["projects"].as_array().map(|a| a.len()), Some(1));
    assert_eq!(v["projects"][0]["name"], "demo-repo");
}

#[tokio::test]
#[serial]
async fn downloads_endpoint_reads_npm_range_from_wiremock() {
    let server = MockServer::start().await;
    unsafe {
        std::env::set_var("NPM_API_BASE", server.uri());
    }
    testing::reset_all();

    Mock::given(method("GET"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "downloads": [
                {"day": "2026-07-01", "downloads": 3},
                {"day": "2026-07-02", "downloads": 4}
            ]
        })))
        .mount(&server)
        .await;

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/downloads?pkg=%40sylphx%2Fpdf-reader-mcp")
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
    assert_eq!(v["pkg"], "@sylphx/pdf-reader-mcp", "pkg decode: {v}");
    assert_eq!(v["total"], 7);
    assert_eq!(v["series"].as_array().map(|a| a.len()), Some(2));
}

#[tokio::test]
#[serial]
async fn repo_endpoint_fetches_single_repo_from_wiremock() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    Mock::given(method("GET"))
        .and(path("/repos/shtse8/demo-repo"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "full_name": "shtse8/demo-repo",
            "name": "demo-repo",
            "owner": {"login": "shtse8"},
            "stargazers_count": 9,
            "forks_count": 0,
            "description": "x",
            "language": "Rust",
            "topics": [],
            "html_url": "https://github.com/shtse8/demo-repo",
            "pushed_at": "2026-07-02T00:00:00Z",
            "fork": false,
            "archived": false
        })))
        .mount(&server)
        .await;

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/repo?name=demo-repo")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX).await.unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["repo"]["stars"], 9);
}


#[tokio::test]
#[serial]
async fn recent_endpoint_sorts_by_push_date_from_wiremock() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    let repos = json!([
        {
            "full_name": "shtse8/old",
            "name": "old",
            "owner": {"login": "shtse8"},
            "stargazers_count": 1,
            "forks_count": 0,
            "description": null,
            "language": "Rust",
            "topics": [],
            "html_url": "https://github.com/shtse8/old",
            "pushed_at": "2026-07-01T00:00:00Z",
            "fork": false,
            "archived": false
        },
        {
            "full_name": "shtse8/new",
            "name": "new",
            "owner": {"login": "shtse8"},
            "stargazers_count": 2,
            "forks_count": 0,
            "description": null,
            "language": "Rust",
            "topics": [],
            "html_url": "https://github.com/shtse8/new",
            "pushed_at": "2026-07-10T00:00:00Z",
            "fork": false,
            "archived": false
        }
    ]);

    for owner in ["shtse8", "SylphxAI", "Cubeage", "EpiowAI"] {
        let body = if owner == "shtse8" { repos.clone() } else { json!([]) };
        Mock::given(method("GET"))
            .and(path_regex(format!(r"/users/{owner}/repos.*")))
            .respond_with(ResponseTemplate::new(200).set_body_json(body))
            .mount(&server)
            .await;
    }

    let app = router();
    let res = app
        .oneshot(Request::builder().uri("/recent?limit=2").body(Body::empty()).unwrap())
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX).await.unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["recent"][0]["name"], "new");
}
