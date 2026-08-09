use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use tower::ServiceExt;

#[tokio::test]
async fn options_preflight_allows_kylet_origin() {
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("OPTIONS")
                .uri("/stats")
                .header("origin", "https://kylet.se")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::NO_CONTENT);
    assert_eq!(
        res.headers()
            .get("access-control-allow-origin")
            .and_then(|v| v.to_str().ok()),
        Some("https://kylet.se")
    );
}

#[tokio::test]
async fn foreign_origin_preflight_gets_no_allow_origin() {
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .method("OPTIONS")
                .uri("/stats")
                .header("origin", "https://evil.example")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::NO_CONTENT);
    assert!(
        res.headers()
            .get("access-control-allow-origin")
            .is_none(),
        "foreign origin must not be echoed"
    );
}

#[tokio::test]
async fn stats_response_omits_allow_origin_for_foreign_origin() {
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/stats")
                .header("origin", "https://evil.example")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert!(
        res.headers()
            .get("access-control-allow-origin")
            .is_none(),
        "foreign origin must not receive allow-origin"
    );
}

#[tokio::test]
async fn unknown_route_returns_404_json() {
    let app = router();
    let res = app
        .oneshot(
            Request::builder()
                .uri("/nope")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::NOT_FOUND);
}
