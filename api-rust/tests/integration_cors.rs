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
