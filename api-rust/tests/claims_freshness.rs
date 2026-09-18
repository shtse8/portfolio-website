//! F1-a regression: the claim pack must not advertise a stale last-good
//! snapshot as `freshness:"live"`.
//!
//! When the upstream hangs, `/claims` and `/stats` serve the same
//! `STATS_LAST_GOOD_PATH` snapshot. Before the fix `/claims` projected it
//! through `stats_json` (hard-coded `freshness:"live"`, `stale:false`,
//! `source:"github-public"`) while `/stats` answered `stale` / `true` /
//! `github-public-stale` — the same process, the same bytes, opposite label.
//! The numbers are real measurements in both; only the label may differ, and it
//! must not.

use axum::body::Body;
use axum::http::{Request, StatusCode};
use kylet_api_rust::app::router;
use kylet_api_rust::contract::{ActivityPayload, PUBLIC_ACTIVITY_PROJECTION_REVISION};
use kylet_api_rust::testing;
use serial_test::serial;
use std::net::TcpListener;
use std::time::{Duration, Instant};
use tower::ServiceExt;

/// The ~5 s edge budget, with a little headroom for test/harness overhead.
const EDGE_BUDGET: Duration = Duration::from_millis(4_800);

/// Accept TCP connections forever and never write a byte back — the
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
async fn claims_labels_a_last_good_snapshot_exactly_as_stats_does() {
    let base = spawn_hanging_upstream();
    let dir = std::env::temp_dir().join(format!("kylet-claims-freshness-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&dir);

    // A freshly seeded last-good snapshot: a real measurement with its own
    // observation time, served only because the upstream will not answer.
    std::fs::write(
        dir.join("stats-last-good.json"),
        r#"{"revision":"public-only/v1","payload":{"githubStars":111,"npmDownloads":222,"flagshipStars":33,"flagshipDownloads":44,"byOwner":{"shtse8":111},"repos":7,"updatedAt":"2026-01-02T03:04:05Z"}}"#,
    )
    .expect("seed stats last-good");
    let activity = ActivityPayload {
        commits_today: 7,
        commits_week: 8,
        commits_month: 9,
        repos_active_today: 2,
        last_push: None,
        updated_at: "2026-01-02T03:04:05Z".to_string(),
        stale: None,
        freshness: None,
        source: None,
        projection_revision: Some(PUBLIC_ACTIVITY_PROJECTION_REVISION.to_string()),
    };
    std::fs::write(
        dir.join("activity-last-good.json"),
        serde_json::to_vec(&activity).expect("encode activity"),
    )
    .expect("seed activity last-good");

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

    let (stats_status, stats, stats_elapsed) = timed_get("/stats").await;
    let (claims_status, claims, claims_elapsed) = timed_get("/claims").await;

    assert_eq!(stats_status, StatusCode::OK);
    assert_eq!(claims_status, StatusCode::OK);

    // /stats is the reference label for this snapshot.
    assert_eq!(stats["freshness"], "stale");
    assert_eq!(stats["stale"], true);
    assert_eq!(stats["source"], "github-public-stale");
    assert_eq!(stats["verifiedAt"], "2026-01-02T03:04:05Z");
    assert_eq!(stats["githubStars"], 111);

    // The pack must say the same thing about the same bytes...
    assert_eq!(
        claims["metrics"]["freshness"], stats["freshness"],
        "/claims metrics freshness disagrees with /stats on the same snapshot"
    );
    assert_eq!(claims["metrics"]["stale"], stats["stale"]);
    assert_eq!(claims["metrics"]["source"], stats["source"]);
    assert_eq!(claims["metrics"]["verifiedAt"], "2026-01-02T03:04:05Z");
    // ...without touching the real numbers.
    assert_eq!(claims["metrics"]["githubStars"], 111);
    assert_eq!(claims["metrics"]["npmDownloads"], 222);

    // The nested activity part follows /activity's ladder too.
    assert_eq!(claims["activity"]["freshness"], "stale");
    assert_eq!(claims["activity"]["stale"], true);
    assert_eq!(claims["activity"]["commitsToday"], 7);

    // Both answers still land inside the ~5 s edge budget.
    assert!(
        stats_elapsed < EDGE_BUDGET,
        "/stats took {stats_elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );
    assert!(
        claims_elapsed < EDGE_BUDGET,
        "/claims took {claims_elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );

    let _ = std::fs::remove_dir_all(&dir);
}

/// N1: with no snapshot at all, `/claims` must be as explicit as `/stats`.
///
/// `/stats` answers the `absent` object (`freshness:"absent"`); the pack used
/// to answer `metrics:null` / `activity:null`, which a machine reader cannot
/// distinguish from "field not provided". This test is the mutation check:
/// reverting the pack to `.map(…)`/`null` makes `metrics` a bare null and
/// fails the `is_object` assertions below.
#[tokio::test]
#[serial]
async fn claims_no_snapshot_branch_is_explicitly_absent_not_null() {
    let base = spawn_hanging_upstream();
    let dir = std::env::temp_dir().join(format!("kylet-claims-absent-{}", std::process::id()));
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
    // Deliberately nonexistent: nothing on disk, and EnvGuard cleared memory.
    guard.set(
        "STATS_LAST_GOOD_PATH",
        dir.join("no-stats.json").to_str().unwrap(),
    );
    guard.set(
        "ACTIVITY_LAST_GOOD_PATH",
        dir.join("no-activity.json").to_str().unwrap(),
    );

    let (stats_status, stats, _) = timed_get("/stats").await;
    let (claims_status, claims, claims_elapsed) = timed_get("/claims").await;
    assert_eq!(stats_status, StatusCode::OK);
    assert_eq!(claims_status, StatusCode::OK);

    // /stats is the reference answer for "nothing was measured".
    assert_eq!(stats["freshness"], "absent");
    assert!(stats["verifiedAt"].is_null());

    // The pack must carry the same explicit object — never a bare null, and
    // never a live label.
    assert!(
        claims["metrics"].is_object(),
        "metrics must be the explicit absent object, not null"
    );
    assert_eq!(claims["metrics"]["freshness"], "absent");
    assert_eq!(claims["metrics"]["stale"], true);
    assert_eq!(claims["metrics"]["source"], "github-public-absent");
    assert!(claims["metrics"]["githubStars"].is_null());
    assert!(claims["metrics"]["npmDownloads"].is_null());
    assert!(claims["metrics"]["verifiedAt"].is_null());
    assert_ne!(claims["metrics"]["freshness"], "live");

    assert!(
        claims["activity"].is_object(),
        "activity must be the explicit absent object, not null"
    );
    assert_eq!(claims["activity"]["freshness"], "absent");
    assert_eq!(claims["activity"]["stale"], true);
    assert!(claims["activity"]["commitsToday"].is_null());
    assert_ne!(claims["activity"]["freshness"], "live");

    assert!(
        claims_elapsed < EDGE_BUDGET,
        "/claims took {claims_elapsed:?}, past the edge budget {EDGE_BUDGET:?}"
    );

    let _ = std::fs::remove_dir_all(&dir);
}
