use kylet_api_rust::contract::{ActivityPayload, LastPush};
use kylet_api_rust::rest_projection::{
    activity_json_absent, activity_json_stale, stats_json_absent, stats_json_stale,
};
use kylet_api_rust::stats::StatsPayload;
use std::collections::HashMap;

#[test]
fn stale_projection_adds_flag() {
    let stats = StatsPayload {
        github_stars: 10,
        npm_downloads: 20,
        flagship_stars: 3,
        flagship_downloads: 4,
        by_owner: HashMap::new(),
        repos: 1,
        updated_at: "t".into(),
    };
    let v = stats_json_stale(&stats);
    assert_eq!(v["stale"], true);
    assert_eq!(v["freshness"], "stale");
    assert_eq!(v["verifiedAt"], "t");
    assert_eq!(v["githubStars"], 10);

    let act = ActivityPayload {
        commits_today: 1,
        commits_week: 2,
        commits_month: 8,
        repos_active_today: 1,
        last_push: Some(LastPush { repo: "x".into(), ago: "1h ago".into() }),
        updated_at: "t".into(),
        stale: None,
        freshness: None,
        source: Some("control-plane".into()),
        projection_revision: Some("rev".into()),
    };
    let a = activity_json_stale(&act);
    assert_eq!(a["stale"], true);
    assert_eq!(a["commitsToday"], 1);
    assert_eq!(a["source"], "control-plane");
    assert_eq!(a["projectionRevision"], "rev");
}

/// A stale answer must say where it came from, so a reader can tell a verified
/// snapshot from an absent one without guessing.
#[test]
fn stale_stats_projection_discloses_source() {
    let stats = StatsPayload {
        github_stars: 1,
        npm_downloads: 2,
        flagship_stars: 3,
        flagship_downloads: 4,
        by_owner: HashMap::new(),
        repos: 5,
        updated_at: "2026-09-18T09:00:00Z".into(),
    };
    let v = stats_json_stale(&stats);
    assert_eq!(v["source"], "github-public-stale");
    assert_eq!(v["repositoryVisibility"], "public-only/v1");
    let live = kylet_api_rust::rest_projection::stats_json(&stats);
    assert_eq!(live["source"], "github-public");
    assert_eq!(live["freshness"], "live");
}

/// The absent payload is the honest answer when nothing was ever verified: it
/// carries the attestations, admits `verifiedAt: null`, and fabricates no zero.
#[test]
fn absent_projections_are_null_never_zero() {
    let s = stats_json_absent();
    assert_eq!(s["freshness"], "absent");
    assert_eq!(s["stale"], true);
    assert_eq!(s["source"], "github-public-absent");
    assert!(s["verifiedAt"].is_null());
    for key in ["githubStars", "npmDownloads", "flagshipStars", "flagshipDownloads", "repos"] {
        assert!(s[key].is_null(), "{key} must be null, got {}", s[key]);
    }
    assert_eq!(s["repositoryVisibility"], "public-only/v1");

    let a = activity_json_absent();
    assert_eq!(a["freshness"], "absent");
    assert_eq!(a["stale"], true);
    assert_eq!(a["source"], "github-public-absent");
    assert!(a["verifiedAt"].is_null());
    for key in ["commitsToday", "commitsWeek", "commitsMonth", "reposActiveToday"] {
        assert!(a[key].is_null(), "{key} must be null, got {}", a[key]);
    }
    assert_eq!(a["projectionRevision"], "github-public-only/v1");
}
