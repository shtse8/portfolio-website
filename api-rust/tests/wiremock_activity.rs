use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn graphql_fixture() -> serde_json::Value {
    json!({ "data": {
        "today": { "contributionsCollection": {
            "totalCommitContributions": 3,
            "commitContributionsByRepository": [
                { "repository": { "nameWithOwner": "shtse8/tool-repo", "pushedAt": "2026-08-09T10:00:00Z" }, "contributions": { "totalCount": 3 } },
                { "repository": { "nameWithOwner": "shtse8/idle", "pushedAt": "2026-08-01T00:00:00Z" }, "contributions": { "totalCount": 0 } }
            ]
        } },
        "week": { "contributionsCollection": { "totalCommitContributions": 16 } },
        "month": { "contributionsCollection": { "totalCommitContributions": 55 } },
        "repos": { "repositories": { "nodes": [
            { "nameWithOwner": "shtse8/tool-repo", "pushedAt": "2026-08-09T10:00:00Z" }
        ] } }
    } })
}

#[tokio::test]
#[serial]
async fn activity_from_github_graphql_is_live() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("GITHUB_API_BASE", server.uri());
        std::env::set_var("GITHUB_TOKEN", "wiremock-token");
    }

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(graphql_fixture()))
        .mount(&server)
        .await;

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/activity")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX).await.unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["commitsToday"], json!(3));
    assert_eq!(v["commitsWeek"], json!(16));
    assert_eq!(v["commitsMonth"], json!(55));
    assert_eq!(v["reposActiveToday"], json!(1));
    assert_eq!(v["source"], json!("github"));
    assert_eq!(v["freshness"], json!("live"));
    assert_ne!(v["commitsMonth"], json!(64)); // never week×4 (16×4)
    assert_eq!(v["lastPush"]["repo"], json!("tool-repo"));
}

#[tokio::test]
#[serial]
async fn activity_github_failure_serves_last_good_stale_without_fabrication() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("GITHUB_API_BASE", server.uri());
        std::env::set_var("GITHUB_TOKEN", "wiremock-token");
    }

    // Seed a last-good snapshot, then make GitHub fail.
    kylet_api_rust::activity::seed_last_good_for_tests(kylet_api_rust::contract::ActivityPayload {
        commits_today: 2,
        commits_week: 8,
        commits_month: 25,
        repos_active_today: 1,
        last_push: None,
        updated_at: "2026-08-09T09:00:00Z".into(),
        stale: Some(false),
        freshness: Some("live".into()),
        source: Some("github".into()),
        projection_revision: None,
    });

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(500))
        .mount(&server)
        .await;

    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/activity")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX).await.unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["stale"], json!(true));
    assert_eq!(v["freshness"], json!("stale"));
    assert_eq!(v["source"], json!("github-stale"));
    assert_eq!(v["commitsWeek"], json!(8));
}

#[tokio::test]
#[serial]
async fn activity_unavailable_when_unconfigured_and_no_last_good() {
    testing::reset_all();
    unsafe {
        std::env::remove_var("GITHUB_API_BASE");
        std::env::remove_var("GITHUB_GRAPHQL_URL");
        std::env::remove_var("GITHUB_TOKEN");
    }
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/activity")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::BAD_GATEWAY);
}
