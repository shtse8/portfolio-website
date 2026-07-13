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

    Mock::given(method("POST"))
        .and(path("/graphql"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "data": {
                "o0": {"contributionsCollection": {
                    "totalCommitContributions": 5,
                    "commitContributionsByRepository": [{
                        "repository": {"nameWithOwner": "shtse8/demo", "pushedAt": "2026-07-13T10:00:00Z"},
                        "contributions": {"totalCount": 2}
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
    assert_eq!(v["commitsToday"], 2, "body={v}");
    assert!(v.get("lastPush").is_some(), "body={v}");
}
