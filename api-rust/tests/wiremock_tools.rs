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

async fn mount_empty_org_lists(server: &MockServer) {
    for owner in ["SylphxAI", "Cubeage", "EpiowAI", "OzyrixLtd"] {
        Mock::given(method("GET"))
            .and(path_regex(format!(r"/orgs/{owner}/repos.*")))
            .respond_with(ResponseTemplate::new(200).set_body_json(json!([])))
            .mount(server)
            .await;
    }
}

#[tokio::test]
#[serial]
async fn projects_endpoint_only_projects_explicitly_public_repos() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    let repos = json!([
        {
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
            "archived": false,
            "private": false,
            "visibility": "public"
        },
        {
            "full_name": "shtse8/nonpublic-synthetic-a",
            "name": "nonpublic-synthetic-a",
            "owner": {"login": "shtse8"},
            "stargazers_count": 100,
            "description": "must not project",
            "fork": false,
            "archived": false,
            "private": true,
            "visibility": "private"
        },
        {
            "full_name": "shtse8/nonpublic-synthetic-b",
            "name": "nonpublic-synthetic-b",
            "owner": {"login": "shtse8"},
            "stargazers_count": 100,
            "description": "must not project",
            "fork": false,
            "archived": false,
            "private": false,
            "visibility": "internal"
        },
        {
            "full_name": "shtse8/nonpublic-synthetic-c",
            "name": "nonpublic-synthetic-c",
            "owner": {"login": "shtse8"},
            "stargazers_count": 100,
            "description": "must not project",
            "fork": false,
            "archived": false,
            "private": false
        }
    ]);

    Mock::given(method("GET"))
        .and(path_regex(r"/users/shtse8/repos.*"))
        .respond_with(ResponseTemplate::new(200).set_body_json(repos))
        .mount(&server)
        .await;
    mount_empty_org_lists(&server).await;

    let res = router()
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
    let value: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(value["projects"].as_array().map(Vec::len), Some(1));
    assert_eq!(value["projects"][0]["name"], "demo-repo");

    let received = server.received_requests().await.expect("received requests");
    let urls: Vec<String> = received
        .iter()
        .map(|request| request.url.to_string())
        .collect();
    assert!(urls
        .iter()
        .any(|url| url.contains("/users/shtse8/repos") && url.contains("type=owner")));
    assert!(urls
        .iter()
        .any(|url| url.contains("/orgs/SylphxAI/repos") && url.contains("type=public")));
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

    let res = router()
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
    let value: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(value["pkg"], "@sylphx/pdf-reader-mcp");
    assert_eq!(value["total"], 7);
}

#[tokio::test]
#[serial]
async fn repo_endpoint_returns_an_explicitly_public_repo() {
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
            "archived": false,
            "private": false,
            "visibility": "public"
        })))
        .mount(&server)
        .await;

    let res = router()
        .oneshot(
            Request::builder()
                .uri("/repo?name=demo-repo")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let value: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(value["repo"]["stars"], 9);
}

#[tokio::test]
#[serial]
async fn repo_endpoint_rejects_private_internal_and_missing_visibility() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    for (name, body) in [
        (
            "nonpublic-synthetic-a",
            json!({"private": true, "visibility": "private"}),
        ),
        (
            "nonpublic-synthetic-b",
            json!({"private": false, "visibility": "internal"}),
        ),
        ("nonpublic-synthetic-c", json!({"private": false})),
    ] {
        Mock::given(method("GET"))
            .and(path(format!("/repos/shtse8/{name}")))
            .respond_with(ResponseTemplate::new(200).set_body_json(body))
            .mount(&server)
            .await;

        let res = router()
            .oneshot(
                Request::builder()
                    .uri(format!("/repo?name={name}"))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), StatusCode::NOT_FOUND, "{name}");
    }
}

#[tokio::test]
#[serial]
async fn recent_endpoint_sorts_public_repos_by_push_date() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    let repos = json!([
        {
            "full_name": "shtse8/old", "name": "old", "owner": {"login": "shtse8"},
            "stargazers_count": 1, "forks_count": 0, "description": null,
            "language": "Rust", "topics": [], "html_url": "https://github.com/shtse8/old",
            "pushed_at": "2026-07-01T00:00:00Z", "fork": false, "archived": false,
            "private": false, "visibility": "public"
        },
        {
            "full_name": "shtse8/new", "name": "new", "owner": {"login": "shtse8"},
            "stargazers_count": 2, "forks_count": 0, "description": null,
            "language": "Rust", "topics": [], "html_url": "https://github.com/shtse8/new",
            "pushed_at": "2026-07-10T00:00:00Z", "fork": false, "archived": false,
            "private": false, "visibility": "public"
        }
    ]);
    Mock::given(method("GET"))
        .and(path_regex(r"/users/shtse8/repos.*"))
        .respond_with(ResponseTemplate::new(200).set_body_json(repos))
        .mount(&server)
        .await;
    mount_empty_org_lists(&server).await;

    let res = router()
        .oneshot(
            Request::builder()
                .uri("/recent?limit=2")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let value: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(value["recent"][0]["name"], "new");
}

/// F2: a 404 is authoritative only for the owner that produced it. When the
/// known owner (and another candidate) fail with 401/500 while the rest 404, the
/// sweep must answer 200 "upstream unavailable" - never a false 404.
#[tokio::test]
#[serial]
async fn repo_sweep_prefers_upstream_unavailable_over_cross_owner_404() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    Mock::given(method("GET"))
        .and(path("/repos/SylphxAI/pdf-reader-mcp"))
        .respond_with(ResponseTemplate::new(401))
        .mount(&server)
        .await;
    Mock::given(method("GET"))
        .and(path("/repos/shtse8/pdf-reader-mcp"))
        .respond_with(ResponseTemplate::new(500))
        .mount(&server)
        .await;
    // Every other candidate owner is unmatched, so wiremock answers 404.

    let res = router()
        .oneshot(
            Request::builder()
                .uri("/repo?owner=SylphxAI&name=pdf-reader-mcp")
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
    assert_eq!(v["freshness"], "absent");
    assert!(v["repo"].is_null());

    let res = router()
        .oneshot(
            Request::builder()
                .uri("/repo?name=pdf-reader-mcp")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK, "sweep must not emit a false 404");
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert!(v["repo"].is_null());
    assert_eq!(v["freshness"], "absent");
}

/// F3: verifiedAt must be the payload's own observation time. Within the repo
/// TTL the second request is a cache hit, so its verifiedAt must equal the
/// first's instead of drifting with the response time.
#[tokio::test]
#[serial]
async fn projects_verified_at_is_the_observation_time() {
    let server = MockServer::start().await;
    set_github_env(&server);
    testing::reset_all();

    Mock::given(method("GET"))
        .and(path_regex(r"/users/shtse8/repos.*"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!([{
            "full_name": "shtse8/demo-repo", "name": "demo-repo",
            "owner": {"login": "shtse8"}, "stargazers_count": 12,
            "forks_count": 1, "description": "demo", "language": "Rust",
            "topics": [], "html_url": "https://github.com/shtse8/demo-repo",
            "pushed_at": "2026-07-01T12:00:00Z", "fork": false,
            "archived": false, "private": false, "visibility": "public"
        }])))
        .mount(&server)
        .await;
    mount_empty_org_lists(&server).await;

    async fn fetch(uri: &str) -> serde_json::Value {
        let res = router()
            .oneshot(Request::builder().uri(uri).body(Body::empty()).unwrap())
            .await
            .unwrap();
        let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
            .await
            .unwrap();
        serde_json::from_slice(&bytes).unwrap()
    }

    let first = fetch("/projects").await;
    assert_eq!(first["freshness"], "live");
    std::thread::sleep(std::time::Duration::from_millis(30));
    let second = fetch("/projects").await;
    assert_eq!(second["freshness"], "live");
    assert_eq!(first["updatedAt"], first["verifiedAt"]);
    assert_eq!(
        first["verifiedAt"], second["verifiedAt"],
        "a cache hit must keep the payload observation time, not the response time"
    );
}

