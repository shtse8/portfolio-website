//! F1 regression: a hanging upstream (a socket that accepts and never answers)
//! must not hold a visitor past the edge budget. The fast-fail condition (401 /
//! 500 / refused) was already covered; this is the blocked-egress branch, where
//! there is no response to fail on - only a timeout.
//!
//! Every upstream-derived endpoint must answer 200 with an honest stale/absent
//! payload inside the ~5 s edge timeout the repo cites (api-rust/src/tools.rs
//! REPO_PROBE_TIMEOUT comment) instead of letting the per-request client timeout
//! (8 s) or the serial /claims composition (~20 s) surface as an edge 504.

use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::testing;
use serial_test::serial;
use std::net::TcpListener;
use std::time::{Duration, Instant};
use tower::ServiceExt;

/// The ~5 s edge budget, with a little headroom for test/harness overhead.
const EDGE_BUDGET: Duration = Duration::from_millis(4_800);

/// Accept TCP connections forever and never write a byte back - the
/// accept-and-never-answer shape.
fn spawn_hanging_upstream() -> String {
    let listener = TcpListener::bind("127.0.0.1:0").expect("bind hanging listener");
    let addr = listener.local_addr().expect("hanging listener addr");
    std::thread::spawn(move || {
        // Hold every accepted socket open so the client cannot observe EOF.
        let mut held = Vec::new();
        for stream in listener.incoming() {
            match stream {
                Ok(s) => held.push(s),
                Err(_) => break,
            }
        }
    });
    format!("http://{addr}")
}

async fn timed_get(uri: &str) -> (StatusCode, serde_json::Value, Duration) {
    let start = Instant::now();
    let res = router()
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
    let elapsed = start.elapsed();
    let body = serde_json::from_slice(&bytes).unwrap_or(serde_json::Value::Null);
    (status, body, elapsed)
}

#[tokio::test]
#[serial]
async fn hanging_upstream_still_answers_within_the_edge_budget() {
    let base = spawn_hanging_upstream();
    let dir = std::env::temp_dir().join(format!("kylet-budget-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&dir);
    let guard = testing::EnvGuard::acquire(&[
        "GITHUB_API_BASE",
        "NPM_API_BASE",
        "GITHUB_TOKEN",
        "STATS_LAST_GOOD_PATH",
        "ACTIVITY_LAST_GOOD_PATH",
    ]);
    guard.set("GITHUB_API_BASE", &base);
    guard.set("NPM_API_BASE", &base);
    guard.set("GITHUB_TOKEN", "hanging-token");
    guard.set(
        "STATS_LAST_GOOD_PATH",
        dir.join("stats-last-good.json").to_str().unwrap(),
    );
    guard.set(
        "ACTIVITY_LAST_GOOD_PATH",
        dir.join("activity-last-good.json").to_str().unwrap(),
    );

    // /claims - the former serial composition (8 s + 8 s + 3 s) must now be one
    // budget, and must not invent a number it could not verify.
    let (status, body, elapsed) = timed_get("/claims").await;
    assert_eq!(status, StatusCode::OK);
    assert!(body["metrics"].is_null());
    assert!(body["activity"].is_null());
    assert!(body["flagship"].is_null());
    assert!(
        elapsed < EDGE_BUDGET,
        "/claims took {elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );

    // /stats - no verified snapshot exists, so the honest answer is absent.
    let (status, body, elapsed) = timed_get("/stats").await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["freshness"], "absent");
    assert!(body["verifiedAt"].is_null());
    assert!(body["githubStars"].is_null());
    assert!(
        elapsed < EDGE_BUDGET,
        "/stats took {elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );

    // /activity - same ladder, null counts never fabricated zeros.
    let (status, body, elapsed) = timed_get("/activity").await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["freshness"], "absent");
    assert!(body["commitsToday"].is_null());
    assert!(
        elapsed < EDGE_BUDGET,
        "/activity took {elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );

    // /repo already carried REPO_PROBE_TIMEOUT; it must not regress.
    let (status, body, elapsed) = timed_get("/repo?name=pdf-reader-mcp").await;
    assert_eq!(status, StatusCode::OK);
    assert!(body["repo"].is_null());
    assert_eq!(body["freshness"], "absent");
    assert!(
        elapsed < EDGE_BUDGET,
        "/repo took {elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );

    let _ = std::fs::remove_dir_all(&dir);
}
