use kylet_api_rust::activity::{ActivityPayload, LastPush};
use kylet_api_rust::contract::{activity_json_stale, stats_json_stale};
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
    assert_eq!(v["githubStars"], 10);

    let act = ActivityPayload {
        commits_today: 1,
        commits_week: 2,
        commits_month: 8,
        repos_active_today: 1,
        last_push: Some(LastPush { repo: "x".into(), ago: "1h ago".into() }),
        updated_at: "t".into(),
    };
    let a = activity_json_stale(&act);
    assert_eq!(a["stale"], true);
    assert_eq!(a["commitsToday"], 1);
}
