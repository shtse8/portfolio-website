use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::activity;
use kylet_api_rust::app::router;
use kylet_api_rust::contract::ActivityPayload;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use tower::ServiceExt;
use wiremock::matchers::{header, method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn cp_summary(today: u64, d7: u64, d30: u64) -> serde_json::Value {
    json!({
        "schema_version": "public.profile.v1",
        "projection_revision": "sha256:wiremock-rev",
        "as_of": "2026-07-16T12:00:00Z",
        "freshness": { "state": "live" },
        "summary": {
            "commits_landed": {
                "today": today,
                "d7": d7,
                "d30": d30,
                "d30_is_not_week_times_four": true
            },
            "projects_active": { "count": 3 }
        }
    })
}

#[tokio::test]
#[serial]
async fn activity_from_authenticated_cp_projection() {
    let server = MockServer::start().await;
    let env = testing::EnvGuard::acquire(&[
        "CP_PROJECTION_BASE",
        "CP_PROJECTION_TOKEN",
        "CP_PROJECTION_ID",
        "CP_PUBLIC_BASE",
        "CONTROL_PLANE_PUBLIC_BASE",
        "GITHUB_TOKEN",
        "GITHUB_API_BASE",
        "GITHUB_GRAPHQL_URL",
    ]);
    env.set("CP_PROJECTION_BASE", &server.uri());
    env.set("CP_PROJECTION_TOKEN", "proj-token");
    env.set("CP_PROJECTION_ID", "kyle-dev-metrics");
    let _env = env;

    Mock::given(method("GET"))
        .and(path("/api/v1/projections/kyle-dev-metrics/snapshot"))
        .and(header("authorization", "Bearer proj-token"))
        .respond_with(ResponseTemplate::new(200).set_body_json(cp_summary(12, 80, 300)))
        .expect(1..)
        .mount(&server)
        .await;

    // GraphQL must never be hit when CP is configured.
    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(500).set_body_string("graphql must not be called"))
        .expect(0)
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
    assert_eq!(v["commitsToday"], 12, "body={v}");
    assert_eq!(v["commitsWeek"], 80, "body={v}");
    assert_eq!(v["commitsMonth"], 300, "body={v}");
    assert_ne!(
        v["commitsMonth"].as_u64().unwrap_or(0),
        v["commitsWeek"].as_u64().unwrap_or(0) * 4,
        "week×4 must not appear on BFF mapping path; body={v}"
    );
    assert_eq!(v["source"], "control-plane", "body={v}");
    assert_eq!(v["freshness"], "live", "body={v}");
    assert_eq!(v["stale"], false, "body={v}");
    assert_eq!(v["projectionRevision"], "sha256:wiremock-rev", "body={v}");
    assert!(v.get("lastPush").is_none() || v["lastPush"].is_null(), "body={v}");
}

#[tokio::test]
#[serial]
async fn activity_cp_failure_serves_last_good_stale_without_graphql() {
    let server = MockServer::start().await;
    let env = testing::EnvGuard::acquire(&[
        "CP_PROJECTION_BASE",
        "CP_PROJECTION_TOKEN",
        "CP_PROJECTION_ID",
        "CP_PUBLIC_BASE",
        "CONTROL_PLANE_PUBLIC_BASE",
        "GITHUB_TOKEN",
        "GITHUB_API_BASE",
        "GITHUB_GRAPHQL_URL",
    ]);
    env.set("CP_PROJECTION_BASE", &server.uri());
    env.set("CP_PROJECTION_TOKEN", "proj-token");
    env.set("CP_PROJECTION_ID", "kyle-dev-metrics");
    // Point GraphQL at wiremock so any accidental call is observable.
    env.set("GITHUB_API_BASE", &server.uri());
    env.set("GITHUB_TOKEN", "must-not-use");
    let _env = env;

    // Seed durable last_good as if a prior CP fetch succeeded.
    activity::seed_last_good_for_tests(ActivityPayload {
        commits_today: 2,
        commits_week: 7,
        commits_month: 19,
        repos_active_today: 1,
        last_push: None,
        updated_at: "2026-07-15T00:00:00Z".into(),
        stale: Some(false),
        freshness: Some("live".into()),
        source: Some("control-plane".into()),
        projection_revision: Some("sha256:last-good".into()),
    });

    Mock::given(method("GET"))
        .and(path("/api/v1/projections/kyle-dev-metrics/snapshot"))
        .respond_with(ResponseTemplate::new(503).set_body_string("cp down"))
        .expect(1..)
        .mount(&server)
        .await;

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "data": { "o0": { "contributionsCollection": { "totalCommitContributions": 999 } } }
        })))
        .expect(0)
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
    assert_eq!(res.status(), StatusCode::OK, "must serve last_good stale");
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(v["commitsWeek"], 7, "body={v}");
    assert_eq!(v["commitsMonth"], 19, "body={v}");
    assert_ne!(v["commitsMonth"], 28, "must not invent week×4; body={v}");
    assert_eq!(v["stale"], true, "body={v}");
    assert_eq!(v["freshness"], "stale", "body={v}");
    assert_eq!(v["source"], "control-plane-stale", "body={v}");
    assert_eq!(v["projectionRevision"], "sha256:last-good", "body={v}");
}

#[tokio::test]
#[serial]
async fn activity_unavailable_when_cp_unconfigured_and_no_last_good() {
    let env = testing::EnvGuard::acquire(&[
        "CP_PROJECTION_BASE",
        "CP_PROJECTION_TOKEN",
        "CP_PROJECTION_ID",
        "CP_PUBLIC_BASE",
        "CONTROL_PLANE_PUBLIC_BASE",
        "GITHUB_TOKEN",
        "GITHUB_API_BASE",
        "GITHUB_GRAPHQL_URL",
    ]);
    // Explicitly no CP config; EnvGuard removes keys on drop and acquire resets caches.
    let _env = env;

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
    assert_eq!(
        res.status(),
        StatusCode::BAD_GATEWAY,
        "unconfigured CP with no last_good must be unavailable"
    );
}

#[tokio::test]
#[serial]
async fn activity_from_legacy_public_summary() {
    let server = MockServer::start().await;
    let env = testing::EnvGuard::acquire(&[
        "CP_PROJECTION_BASE",
        "CP_PROJECTION_TOKEN",
        "CP_PROJECTION_ID",
        "CP_PUBLIC_BASE",
        "CP_PUBLIC_PROFILE_SLUG",
        "CONTROL_PLANE_PUBLIC_BASE",
        "GITHUB_TOKEN",
        "GITHUB_API_BASE",
        "GITHUB_GRAPHQL_URL",
    ]);
    env.set("CP_PUBLIC_BASE", &server.uri());
    env.set("CP_PUBLIC_PROFILE_SLUG", "kyle");
    let _env = env;

    Mock::given(method("GET"))
        .and(path("/api/public/v1/profiles/kyle/summary"))
        .respond_with(ResponseTemplate::new(200).set_body_json(cp_summary(1, 2, 5)))
        .mount(&server)
        .await;

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(500))
        .expect(0)
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
    assert_eq!(v["commitsToday"], 1);
    assert_eq!(v["commitsWeek"], 2);
    assert_eq!(v["commitsMonth"], 5);
    assert_eq!(v["source"], "control-plane-public");
}
