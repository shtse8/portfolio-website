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
async fn activity_github_failure_serves_last_good_stale_without_fabrication() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("GITHUB_API_BASE", server.uri());
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
        source: Some("github-public".into()),
        projection_revision: Some(
            kylet_api_rust::contract::PUBLIC_ACTIVITY_PROJECTION_REVISION.to_string(),
        ),
    });

    Mock::given(method("GET"))
        .and(path("/search/commits"))
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
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["stale"], json!(true));
    assert_eq!(v["freshness"], json!("stale"));
    assert_eq!(v["source"], json!("github-public-stale"));
    assert_eq!(v["commitsWeek"], json!(8));
}

#[tokio::test]
#[serial]
async fn activity_absent_not_502_when_unconfigured_and_no_last_good() {
    testing::reset_all();
    unsafe {
        std::env::remove_var("GITHUB_API_BASE");
        std::env::remove_var("GITHUB_GRAPHQL_URL");
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
    // Honest absence, not a gateway error: null counts (never zeros), a
    // verifiedAt that admits it never observed anything, and the projection
    // revision attestation kept.
    assert_eq!(res.status(), StatusCode::OK);
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["freshness"], "absent");
    assert_eq!(v["stale"], true);
    assert!(v["verifiedAt"].is_null());
    assert!(v["commitsToday"].is_null());
    assert!(v["commitsWeek"].is_null());
    assert!(v["lastPush"].is_null());
    assert_eq!(v["projectionRevision"], "github-public-only/v1");
}

#[tokio::test]
#[serial]
async fn activity_absent_not_502_when_upstream_fails_and_no_last_good() {
    let server = MockServer::start().await;
    testing::reset_all();
    unsafe {
        std::env::set_var("GITHUB_API_BASE", server.uri());
    }

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(500))
        .mount(&server)
        .await;

    let res = router()
        .oneshot(
            Request::builder()
                .uri("/activity")
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
    assert!(v["commitsToday"].is_null());
    assert!(v["verifiedAt"].is_null());
    assert_eq!(v["projectionRevision"], "github-public-only/v1");
}
