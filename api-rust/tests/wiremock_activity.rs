use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serde_json::json;
use serial_test::serial;
use std::time::{SystemTime, UNIX_EPOCH};
use tower::ServiceExt;
use wiremock::matchers::{method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

/// RFC3339 timestamp `offset_secs` before now (UTC). Avoids date-locked fixtures that
/// silently fail once wall-clock moves past a hard-coded `pushedAt` day.
fn iso_ago(offset_secs: i64) -> String {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock after epoch")
        .as_secs() as i64;
    let secs = now.saturating_sub(offset_secs.max(0));
    time::OffsetDateTime::from_unix_timestamp(secs)
        .expect("valid unix timestamp")
        .format(&time::format_description::well_known::Rfc3339)
        .expect("format rfc3339")
}

#[tokio::test]
#[serial]
async fn activity_endpoint_aggregates_wiremock_graphql() {
    let server = MockServer::start().await;
    // GHA injects GITHUB_GRAPHQL_URL; EnvGuard clears it so GITHUB_API_BASE pins GraphQL.
    let env = testing::EnvGuard::acquire(&[
        "GITHUB_API_BASE",
        "GITHUB_TOKEN",
        "GITHUB_GRAPHQL_URL",
    ]);
    env.set("GITHUB_API_BASE", &server.uri());
    env.set("GITHUB_TOKEN", "wiremock-token");
    // Explicitly drop any GHA GraphQL override (removed via EnvGuard keys on drop too).
    unsafe { std::env::remove_var("GITHUB_GRAPHQL_URL") };
    let _env = env;

    // Within rolling DAY_MS window used by aggregate_activity_from_graphql.
    let pushed_today = iso_ago(3_600);
    // Outside the 24h window — must not inflate commitsToday.
    let pushed_stale = iso_ago(3 * 86_400);

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "data": {
                "o0": {"contributionsCollection": {
                    "totalCommitContributions": 5,
                    "commitContributionsByRepository": [{
                        "repository": {"nameWithOwner": "shtse8/demo", "pushedAt": pushed_today},
                        "contributions": {"totalCount": 2}
                    }, {
                        "repository": {"nameWithOwner": "shtse8/old", "pushedAt": pushed_stale},
                        "contributions": {"totalCount": 9}
                    }]
                }},
                "o1": {"contributionsCollection": {"totalCommitContributions": 0, "commitContributionsByRepository": []}},
                "o2": {"contributionsCollection": {"totalCommitContributions": 0, "commitContributionsByRepository": []}},
                "o3": {"contributionsCollection": {"totalCommitContributions": 0, "commitContributionsByRepository": []}}
            }
        })))
        .mount(&server)
        .await;

    let app = router();
    let res = app
        .oneshot(Request::builder().uri("/activity").body(Body::empty()).unwrap())
        .await
        .unwrap();
    assert_eq!(
        res.status(),
        StatusCode::OK,
        "activity must succeed against wiremock upstream"
    );
    let bytes = axum::body::to_bytes(res.into_body(), usize::MAX)
        .await
        .unwrap();
    let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert!(
        v.get("error").is_none(),
        "activity must not be error payload under wiremock: {v}"
    );
    assert_eq!(v["commitsWeek"], 5, "body={v}");
    assert_eq!(
        v["commitsToday"], 2,
        "only repos pushed within DAY_MS count toward commitsToday; body={v}"
    );
    assert_eq!(
        v["reposActiveToday"], 1,
        "stale push must not count as active today; body={v}"
    );
    assert_eq!(v["lastPush"]["repo"], "demo", "body={v}");
    assert!(v.get("lastPush").is_some(), "body={v}");
}
