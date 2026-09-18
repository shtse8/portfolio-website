//! Protected-canary / explicit-public-control oracle (docs/capabilities.md:19).
//!
//! One fixture, one assertion, applied to every repository-dependent customer
//! path: `GET /repo`, the repository lists in `GET /projects` and `GET /recent`,
//! `GET /stats`, `GET /activity`, `GET /claims`, the repository-dependent chat
//! tools, and the caches and durable fallbacks behind them.
//!
//! The test fails if a non-public OR visibility-unverifiable repository fact ever
//! crosses into a public payload; the paired assertion proves the explicit-public
//! control is still available on the same path (so the oracle cannot pass by
//! breaking everything).

use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::canary;
use kylet_api_rust::tools::RepoLookup;
use kylet_api_rust::{activity as api_activity, app, stats as api_stats, testing, tools};
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path, path_regex};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn temp_dir(tag: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join(format!("kylet-canary-{tag}-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&dir);
    dir
}

fn fixture_guard(dir: &std::path::Path) -> testing::EnvGuard {
    let guard = testing::EnvGuard::acquire(&[
        "GITHUB_API_BASE",
        "NPM_API_BASE",
        "GITHUB_TOKEN",
        "STATS_LAST_GOOD_PATH",
        "ACTIVITY_LAST_GOOD_PATH",
    ]);
    guard.set("STATS_LAST_GOOD_PATH", dir.join("stats-last-good.json").to_str().unwrap());
    guard.set("ACTIVITY_LAST_GOOD_PATH", dir.join("activity-last-good.json").to_str().unwrap());
    guard
}

async fn mount_owner_lists(server: &MockServer) {
    let rows = json!([
        canary::rest_unverifiable_canary(),
        canary::rest_private_canary(),
        canary::rest_public_control()
    ]);
    for owner_path in ["/users/shtse8/repos", "/orgs/SylphxAI/repos"] {
        Mock::given(method("GET"))
            .and(path(owner_path))
            .respond_with(ResponseTemplate::new(200).set_body_json(rows.clone()))
            .mount(server)
            .await;
    }
}

async fn body_of(uri: &str) -> (StatusCode, Vec<u8>) {
    let res = app::router()
        .oneshot(
            Request::builder()
                .uri(uri)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let status = res.status();
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    (status, bytes.to_vec())
}

/// `GET /repo`, `GET /projects`, `GET /recent` and the repository-dependent chat
/// tools: canary absent, control available.
#[tokio::test]
#[serial]
async fn canary_absent_and_control_available_on_repo_surfaces() {
    let server = MockServer::start().await;
    let dir = temp_dir("repo-surfaces");
    let guard = fixture_guard(&dir);
    guard.set("GITHUB_API_BASE", &server.uri());
    guard.set("NPM_API_BASE", &server.uri());
    guard.set("GITHUB_TOKEN", "wiremock-token");

    mount_owner_lists(&server).await;
    // The upstream openly returns the canary for a direct lookup, and the
    // control for the control lookup.
    for (owner, body) in [
        ("SylphxAI", canary::rest_private_canary()),
        ("shtse8", canary::rest_unverifiable_canary()),
    ] {
        Mock::given(method("GET"))
            .and(path(format!("/repos/{owner}/{}", canary::CANARY_REPO)))
            .respond_with(ResponseTemplate::new(200).set_body_json(body))
            .mount(&server)
            .await;
    }
    Mock::given(method("GET"))
        .and(path(format!(
            "/repos/{}/{}",
            canary::PUBLIC_CONTROL_OWNER,
            canary::PUBLIC_CONTROL_REPO
        )))
        .respond_with(ResponseTemplate::new(200).set_body_json(canary::rest_public_control()))
        .mount(&server)
        .await;

    for uri in ["/projects", "/recent"] {
        let (status, bytes) = body_of(uri).await;
        assert_eq!(status, StatusCode::OK, "{uri}");
        canary::assert_no_canary(&bytes).unwrap_or_else(|e| panic!("{uri}: {e}"));
        let text = String::from_utf8_lossy(&bytes);
        assert!(
            text.contains(canary::PUBLIC_CONTROL_REPO),
            "{uri}: explicit-public control must stay available"
        );
        assert_eq!(json_from(&bytes)["freshness"], "live", "{uri}");
    }

    let (status, bytes) = body_of("/repo?name=pdf-reader-mcp").await;
    assert_eq!(status, StatusCode::OK);
    canary::assert_no_canary(&bytes).unwrap();
    assert!(String::from_utf8_lossy(&bytes).contains(canary::PUBLIC_CONTROL_REPO));

    // A direct canary deep link must not resolve, under either fixture shape.
    for uri in [
        "/repo?name=protected-canary-9f3c",
        "/repo?owner=sylphx-protected-canary&name=protected-canary-9f3c",
    ] {
        let (status, bytes) = body_of(uri).await;
        assert_eq!(status, StatusCode::NOT_FOUND, "{uri}");
        canary::assert_no_canary(&bytes).unwrap_or_else(|e| panic!("{uri}: {e}"));
    }

    // Repository-dependent chat tools share the same inventory.
    let listed = serde_json::to_vec(&tools::list_projects(40).await).unwrap();
    canary::assert_no_canary(&listed).unwrap();
    assert!(String::from_utf8_lossy(&listed).contains(canary::PUBLIC_CONTROL_REPO));
    let searched = serde_json::to_vec(&tools::search_projects("canary").await).unwrap();
    canary::assert_no_canary(&searched).unwrap();
    let recent = serde_json::to_vec(&tools::recent_activity(6).await).unwrap();
    canary::assert_no_canary(&recent).unwrap();
    match tools::get_repo_detail_in(Some(canary::CANARY_OWNER), canary::CANARY_REPO).await {
        RepoLookup::NotFound => {}
        RepoLookup::Found(repo) => panic!("canary resolved: {}", repo.repo),
        RepoLookup::UpstreamUnavailable(why) => panic!("canary probe errored: {why}"),
    }
    match tools::get_repo_detail_in(None, canary::PUBLIC_CONTROL_REPO).await {
        RepoLookup::Found(repo) => assert_eq!(repo.repo, "SylphxAI/pdf-reader-mcp"),
        _ => panic!("explicit-public control must resolve"),
    }

    assert!(
        api_stats::last_good_snapshot().is_none(),
        "a rejected repository must not seed the stats fallback"
    );
    let _ = std::fs::remove_dir_all(&dir);
}

fn json_from(bytes: &[u8]) -> serde_json::Value {
    serde_json::from_slice(bytes).unwrap()
}

fn stats_graphql(nodes: serde_json::Value) -> serde_json::Value {
    json!({ "data": {
        "o0": { "repositories": { "totalCount": 1, "nodes": nodes } },
        "o1": { "repositories": { "totalCount": 0, "nodes": [] } },
        "o2": { "repositories": { "totalCount": 0, "nodes": [] } },
        "o3": { "repositories": { "totalCount": 0, "nodes": [] } },
        "o4": { "repositories": { "totalCount": 0, "nodes": [] } }
    } })
}

/// `GET /stats` with a canary in the upstream payload: fail closed on the fact
/// (no inflated total, no leaked star count), fail soft on the visitor (200, not
/// a 5xx).
#[tokio::test]
#[serial]
async fn canary_fact_never_inflates_stats_and_never_500s() {
    let server = MockServer::start().await;
    let dir = temp_dir("stats");
    let guard = fixture_guard(&dir);
    guard.set("GITHUB_API_BASE", &server.uri());
    guard.set("NPM_API_BASE", &server.uri());
    guard.set("GITHUB_TOKEN", "wiremock-token");

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(stats_graphql(json!([
            canary::graphql_unverifiable_canary(),
            canary::graphql_public_control()
        ]))))
        .mount(&server)
        .await;

    let (status, bytes) = body_of("/stats").await;
    assert_eq!(status, StatusCode::OK);
    canary::assert_no_canary(&bytes).unwrap();
    let v = json_from(&bytes);
    assert_eq!(v["freshness"], "absent", "a canary in the query fails closed");
    assert!(v["githubStars"].is_null());
    assert_eq!(v["repositoryVisibility"], "public-only/v1");
    assert!(api_stats::last_good_snapshot().is_none());

    // /claims carries the same numbers and must not leak either.
    let (status, bytes) = body_of("/claims").await;
    assert_eq!(status, StatusCode::OK);
    canary::assert_no_canary(&bytes).unwrap();
    assert_eq!(json_from(&bytes)["metrics"], serde_json::Value::Null);

    let _ = std::fs::remove_dir_all(&dir);
}

/// With only explicit-public nodes, the same path yields live numbers — the
/// control half of the oracle.
#[tokio::test]
#[serial]
async fn explicit_public_control_yields_live_stats() {
    let server = MockServer::start().await;
    let dir = temp_dir("stats-control");
    let guard = fixture_guard(&dir);
    guard.set("GITHUB_API_BASE", &server.uri());
    guard.set("NPM_API_BASE", &server.uri());
    guard.set("GITHUB_TOKEN", "wiremock-token");

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(stats_graphql(json!([
            canary::graphql_public_control()
        ]))))
        .mount(&server)
        .await;
    Mock::given(method("GET"))
        .and(path(format!(
            "/repos/{}/{}",
            canary::PUBLIC_CONTROL_OWNER,
            canary::PUBLIC_CONTROL_REPO
        )))
        .respond_with(ResponseTemplate::new(200).set_body_json(canary::rest_public_control()))
        .mount(&server)
        .await;
    Mock::given(method("GET"))
        .and(path_regex(r"/downloads/point/last-month/.*"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({ "downloads": 7 })))
        .mount(&server)
        .await;

    let (status, bytes) = body_of("/stats").await;
    assert_eq!(status, StatusCode::OK);
    let v = json_from(&bytes);
    assert_eq!(v["freshness"], "live");
    assert_eq!(v["githubStars"], json!(canary::PUBLIC_CONTROL_STARS));
    canary::assert_no_canary(&bytes).unwrap();
    assert_eq!(v["repositoryVisibility"], "public-only/v1");

    let _ = std::fs::remove_dir_all(&dir);
}

/// `GET /activity` and `GET /claims` with the canary in the GraphQL activity
/// feed: the canary repo must not be counted as active and must not become the
/// `lastPush` deep link.
#[tokio::test]
#[serial]
async fn canary_excluded_from_activity_and_claims() {
    let server = MockServer::start().await;
    let dir = temp_dir("activity");
    let guard = fixture_guard(&dir);
    guard.set("GITHUB_API_BASE", &server.uri());
    guard.set("NPM_API_BASE", &server.uri());
    guard.set("GITHUB_TOKEN", "wiremock-token");

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({ "data": {
            "today": { "contributionsCollection": { "commitContributionsByRepository": [
                { "repository": canary::graphql_unverifiable_canary(), "contributions": { "totalCount": 400 } },
                { "repository": canary::graphql_private_canary(), "contributions": { "totalCount": 200 } },
                { "repository": canary::graphql_public_control(), "contributions": { "totalCount": 3 } }
            ] } },
            "repos": { "repositories": { "nodes": [
                canary::graphql_private_canary(),
                canary::graphql_unverifiable_canary(),
                canary::graphql_public_control()
            ] } }
        } })))
        .mount(&server)
        .await;
    for total in [275u64, 12_023, 24_682] {
        Mock::given(method("GET"))
            .and(path("/search/commits"))
            .respond_with(ResponseTemplate::new(200).set_body_json(json!({ "total_count": total })))
            .up_to_n_times(1)
            .mount(&server)
            .await;
    }

    let (status, bytes) = body_of("/activity").await;
    assert_eq!(status, StatusCode::OK);
    canary::assert_no_canary(&bytes).unwrap();
    let v = json_from(&bytes);
    assert_eq!(v["reposActiveToday"], json!(1), "only the control counts");
    assert_eq!(v["lastPush"]["repo"], json!(canary::PUBLIC_CONTROL_REPO));
    assert_eq!(v["projectionRevision"], "github-public-only/v1");

    let (status, bytes) = body_of("/claims").await;
    assert_eq!(status, StatusCode::OK);
    canary::assert_no_canary(&bytes).unwrap();

    let _ = std::fs::remove_dir_all(&dir);
}

/// Nothing the canary touched may survive in a cache or a durable fallback file.
#[tokio::test]
#[serial]
async fn canary_absent_from_caches_and_durable_fallbacks() {
    let server = MockServer::start().await;
    let dir = temp_dir("caches");
    let guard = fixture_guard(&dir);
    guard.set("GITHUB_API_BASE", &server.uri());
    guard.set("NPM_API_BASE", &server.uri());
    guard.set("GITHUB_TOKEN", "wiremock-token");

    mount_owner_lists(&server).await;
    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(stats_graphql(json!([
            canary::graphql_private_canary()
        ]))))
        .mount(&server)
        .await;
    Mock::given(method("GET"))
        .and(path("/search/commits"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({ "total_count": 5 })))
        .mount(&server)
        .await;

    // Drive every surface that can populate a cache.
    for uri in ["/projects", "/recent", "/stats", "/activity", "/claims"] {
        let (_, bytes) = body_of(uri).await;
        canary::assert_no_canary(&bytes).unwrap_or_else(|e| panic!("{uri}: {e}"));
    }

    // In-memory caches.
    let repos = serde_json::to_vec(&tools::list_all_repos().await).unwrap();
    canary::assert_no_canary(&repos).unwrap();
    if let Some(snapshot) = api_stats::last_good_snapshot() {
        let bytes = serde_json::to_vec(&snapshot).unwrap();
        canary::assert_no_canary(&bytes).unwrap();
    }
    if let Some(snapshot) = api_activity::cached_snapshot() {
        let bytes = serde_json::to_vec(&snapshot).unwrap();
        canary::assert_no_canary(&bytes).unwrap();
    }

    // Durable fallbacks, if any were written at all.
    for path in [api_stats::last_good_path(), api_activity::last_good_path()] {
        if let Ok(bytes) = std::fs::read(&path) {
            canary::assert_no_canary(&bytes).unwrap_or_else(|e| panic!("{}: {e}", path.display()));
        }
    }

    let _ = std::fs::remove_dir_all(&dir);
}