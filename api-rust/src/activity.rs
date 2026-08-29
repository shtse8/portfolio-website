//! Development activity authority — GitHub GraphQL (ADR-169 amendment 2026-08-09).
//!
//! `/activity` is computed live from GitHub: commits today / 7d / 30d across
//! Kyle's public repositories + owned orgs (users via `contributionsCollection`,
//! orgs via default-branch commit history). The Control Plane projection feed
//! was stale/broken since 2026-07-16, so the owner chose real GitHub numbers.
//!
//! Honesty ladder (unchanged):
//! 1. Process-local TTL cache.
//! 2. On GitHub failure: serve a **verified** last snapshot marked stale, or
//!    return explicit unavailable when no verified snapshot exists — never
//!    fabricate zeros as a live success.
//! 3. Durable last-good file at `ACTIVITY_LAST_GOOD_PATH` (default
//!    `/var/lib/portfolio-api/activity-last-good.json`) survives restarts.
//!
//! `commits_month` is a REAL 30-day series from GitHub — never week×4.

use crate::contract::{
    aggregate_github_activity, days_ago_iso, github_activity_query, start_of_day_iso,
    ActivityPayload, PUBLIC_ACTIVITY_PROJECTION_REVISION,
};
use reqwest::Client;
use serde_json::Value;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const DEFAULT_ACTIVITY_TTL_MS: u64 = 5 * 60 * 1000;
const DEFAULT_LAST_GOOD_PATH: &str = "/var/lib/portfolio-api/activity-last-good.json";

fn activity_ttl_ms() -> u64 {
    env::var("ACTIVITY_TTL_MS")
        .ok()
        .and_then(|v| v.parse().ok())
        .filter(|&v| v > 0)
        .unwrap_or(DEFAULT_ACTIVITY_TTL_MS)
}

/// Short-TTL response cache (fresh hits within ACTIVITY_TTL_MS).
static CACHE: std::sync::OnceLock<Mutex<Option<(u64, ActivityPayload)>>> =
    std::sync::OnceLock::new();

/// In-memory last verified GitHub snapshot (mirrors durable file).
static LAST_GOOD: std::sync::OnceLock<Mutex<Option<ActivityPayload>>> = std::sync::OnceLock::new();

fn cache() -> &'static Mutex<Option<(u64, ActivityPayload)>> {
    CACHE.get_or_init(|| Mutex::new(None))
}

fn last_good() -> &'static Mutex<Option<ActivityPayload>> {
    LAST_GOOD.get_or_init(|| Mutex::new(None))
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

fn client() -> Client {
    Client::builder()
        .timeout(Duration::from_secs(8))
        .build()
        .unwrap_or_else(|_| Client::new())
}

/// Durable last-good path (env-overridable for tests).
pub fn last_good_path() -> PathBuf {
    non_empty_env("ACTIVITY_LAST_GOOD_PATH")
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(DEFAULT_LAST_GOOD_PATH))
}

fn non_empty_env(key: &str) -> Option<String> {
    env::var(key)
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
}

fn write_last_good_file(data: &ActivityPayload) {
    let path = last_good_path();
    if let Some(parent) = path.parent() {
        if let Err(e) = fs::create_dir_all(parent) {
            tracing::warn!(
                error = %e,
                path = %path.display(),
                "activity last_good: could not create parent dir"
            );
            return;
        }
    }
    match serde_json::to_vec(data) {
        Ok(bytes) => {
            // Atomic-ish: write tmp then rename.
            let tmp = path.with_extension("json.tmp");
            if let Err(e) = fs::write(&tmp, &bytes) {
                tracing::warn!(error = %e, path = %tmp.display(), "activity last_good write tmp failed");
                return;
            }
            if let Err(e) = fs::rename(&tmp, &path) {
                // rename may fail across filesystems; try direct write as fallback
                if let Err(e2) = fs::write(&path, &bytes) {
                    tracing::warn!(
                        error = %e,
                        fallback = %e2,
                        path = %path.display(),
                        "activity last_good durable write failed"
                    );
                }
                let _ = fs::remove_file(&tmp);
            }
        }
        Err(e) => {
            tracing::warn!(error = %e, "activity last_good encode failed");
        }
    }
}

fn read_last_good_file() -> Option<ActivityPayload> {
    let path = last_good_path();
    read_last_good_from_path(&path)
}

fn is_current_public_projection(data: &ActivityPayload) -> bool {
    data.projection_revision.as_deref() == Some(PUBLIC_ACTIVITY_PROJECTION_REVISION)
}

fn read_last_good_from_path(path: &Path) -> Option<ActivityPayload> {
    let bytes = fs::read(path).ok()?;
    serde_json::from_slice::<ActivityPayload>(&bytes)
        .ok()
        .filter(is_current_public_projection)
}

/// Pure mapping guard: d30 must not be a week×4 rewrite on the BFF.
pub fn assert_honest_windows(payload: &ActivityPayload) -> Result<(), String> {
    if payload.commits_week > 0
        && payload.commits_month == payload.commits_week.saturating_mul(4)
        && payload.commits_month > 0
    {
        // Statistically possible but treated as dual-authority regression signal in tests.
        return Err(format!(
            "commits_month equals commits_week×4 ({} == {}×4) — dual-authority bug",
            payload.commits_month, payload.commits_week
        ));
    }
    Ok(())
}

async fn search_count(token: &str, since_iso: &str) -> Result<u64, String> {
    let url =
        crate::contract::github_activity_search_url(&crate::upstream::github_api_base(), since_iso);
    let res = client()
        .get(&url)
        .header("authorization", format!("bearer {token}"))
        .header("accept", "application/vnd.github+json")
        .header("user-agent", "kylet-api-rust")
        .send()
        .await
        .map_err(|e| format!("github search transport: {e}"))?;
    if !res.status().is_success() {
        return Err(format!("github search {}", res.status()));
    }
    let body: Value = res
        .json()
        .await
        .map_err(|e| format!("github search decode: {e}"))?;
    body.get("total_count")
        .and_then(Value::as_u64)
        .ok_or_else(|| "github search missing total_count".to_string())
}

async fn fetch_github_activity() -> Result<ActivityPayload, String> {
    let token = env::var("GITHUB_TOKEN")
        .ok()
        .filter(|t| !t.trim().is_empty())
        .ok_or_else(|| "GITHUB_TOKEN not set".to_string())?;
    let now = now_ms();
    let now_iso = crate::stats::iso_now();
    let today_start = start_of_day_iso(now);
    let week_start = days_ago_iso(now, 7);
    let month_start = days_ago_iso(now, 30);

    let query = github_activity_query(&now_iso, &today_start);
    if !crate::contract::github_activity_query_balanced(&query) {
        return Err("github activity query brace imbalance".to_string());
    }
    let res = client()
        .post(crate::upstream::github_graphql_url())
        .header("authorization", format!("bearer {token}"))
        .header("content-type", "application/json")
        .header("user-agent", "kylet-api-rust")
        .json(&serde_json::json!({ "query": query }))
        .send()
        .await
        .map_err(|e| format!("github graphql transport: {e}"))?;
    if !res.status().is_success() {
        return Err(format!("github graphql {}", res.status()));
    }
    let body: Value = res
        .json()
        .await
        .map_err(|e| format!("github graphql decode: {e}"))?;
    if let Some(errors) = body.get("errors") {
        return Err(format!(
            "github graphql: {}",
            errors.to_string().chars().take(200).collect::<String>()
        ));
    }
    let data = body
        .get("data")
        .cloned()
        .ok_or_else(|| "github graphql missing data".to_string())?;

    // Commit counts: public-only commit search covers all public branches (contributionsCollection
    // only counts default-branch commits and under-reports branch work).
    let commits_today = search_count(&token, &today_start).await?;
    let commits_week = search_count(&token, &week_start).await?;
    let commits_month = search_count(&token, &month_start).await?;

    let payload = aggregate_github_activity(
        &data,
        commits_today,
        commits_week,
        commits_month,
        now,
        &now_iso,
    );
    assert_honest_windows(&payload)?;
    Ok(payload)
}

/// Single metric authority: GitHub GraphQL only.
pub async fn compute_activity() -> Result<ActivityPayload, String> {
    fetch_github_activity().await
}

fn mark_stale(mut data: ActivityPayload) -> ActivityPayload {
    data.stale = Some(true);
    data.freshness = Some("stale".into());
    data.source = Some("github-public-stale".into());
    data
}

fn store_success(now: u64, data: &ActivityPayload) {
    if let Ok(mut guard) = cache().lock() {
        *guard = Some((now, data.clone()));
    }
    if let Ok(mut guard) = last_good().lock() {
        *guard = Some(data.clone());
    }
    write_last_good_file(data);
}

fn take_last_good() -> Option<ActivityPayload> {
    if let Ok(guard) = last_good().lock() {
        if let Some(data) = guard
            .as_ref()
            .filter(|data| is_current_public_projection(data))
        {
            return Some(data.clone());
        }
    }
    // Durable file fallback (process restart / empty memory).
    if let Some(data) = read_last_good_file() {
        if let Ok(mut guard) = last_good().lock() {
            *guard = Some(data.clone());
        }
        return Some(data);
    }
    None
}

pub async fn get_activity() -> Result<ActivityPayload, String> {
    let now = now_ms();

    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard
            .as_ref()
            .filter(|(_, data)| is_current_public_projection(data))
        {
            if now.saturating_sub(*at) < activity_ttl_ms() {
                return Ok(data.clone());
            }
        }
    }

    match compute_activity().await {
        Ok(data) => {
            store_success(now, &data);
            Ok(data)
        }
        Err(err) => {
            if let Some(cached) = take_last_good() {
                tracing::warn!(
                    error = %err,
                    upstream = "github-graphql",
                    route = "/activity",
                    "github activity failed; serving last verified snapshot as stale"
                );
                return Ok(mark_stale(cached));
            }
            // Explicit unavailable — no fabricated zeros.
            Err(err)
        }
    }
}

#[doc(hidden)]
pub fn cached_snapshot() -> Option<ActivityPayload> {
    if let Some(data) = take_last_good() {
        return Some(mark_stale(data));
    }
    if let Ok(guard) = cache().lock() {
        return guard
            .as_ref()
            .filter(|(_, data)| is_current_public_projection(data))
            .map(|(_, data)| mark_stale(data.clone()));
    }
    None
}

#[doc(hidden)]
pub fn seed_last_good_for_tests(data: ActivityPayload) {
    if let Ok(mut guard) = last_good().lock() {
        *guard = Some(data.clone());
    }
    let path = last_good_path();
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    if let Ok(bytes) = serde_json::to_vec(&data) {
        let _ = fs::write(&path, bytes);
    }
}

pub fn reset_cache_for_tests() {
    if let Ok(mut guard) = cache().lock() {
        *guard = None;
    }
    if let Ok(mut guard) = last_good().lock() {
        *guard = None;
    }
    // Best-effort remove durable file when under test path.
    let path = last_good_path();
    let _ = fs::remove_file(path);
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use std::sync::Mutex as StdMutex;

    // Serialize tests that touch process-global env / file path.
    static TEST_LOCK: StdMutex<()> = StdMutex::new(());

    #[test]
    fn aggregate_uses_search_counts_and_graphql_side_data() {
        let data = json!({
            "today": { "contributionsCollection": { "commitContributionsByRepository": [
                { "repository": { "nameWithOwner": "shtse8/pdf-reader-mcp", "pushedAt": "2026-08-09T10:00:00Z", "isPrivate": false, "visibility": "PUBLIC" }, "contributions": { "totalCount": 2 } },
                { "repository": { "nameWithOwner": "shtse8/other", "pushedAt": "2026-08-08T00:00:00Z", "isPrivate": false, "visibility": "PUBLIC" }, "contributions": { "totalCount": 0 } }
            ] } },
            "repos": { "repositories": { "nodes": [
                { "nameWithOwner": "shtse8/newest", "pushedAt": "2026-08-09T11:00:00Z", "isPrivate": false, "visibility": "PUBLIC" }
            ] } }
        });
        let a = aggregate_github_activity(
            &data,
            275,
            12_023,
            24_682,
            1_782_800_000_000,
            "2026-08-09T12:00:00Z",
        );
        assert_eq!(a.commits_today, 275);
        assert_eq!(a.commits_week, 12_023);
        assert_eq!(a.commits_month, 24_682);
        assert_ne!(a.commits_month, a.commits_week * 4);
        assert_eq!(a.repos_active_today, 1);
        assert_eq!(
            a.last_push.as_ref().map(|l| l.repo.as_str()),
            Some("newest")
        );
        assert_eq!(a.source.as_deref(), Some("github-public"));
        assert_eq!(a.freshness.as_deref(), Some("live"));
        assert!(assert_honest_windows(&a).is_ok());
    }

    #[test]
    fn honest_window_guard_rejects_week_times_four() {
        let a = ActivityPayload {
            commits_today: 1,
            commits_week: 10,
            commits_month: 40,
            repos_active_today: 1,
            last_push: None,
            updated_at: "t".into(),
            stale: Some(false),
            freshness: Some("live".into()),
            source: Some("github".into()),
            projection_revision: Some(PUBLIC_ACTIVITY_PROJECTION_REVISION.to_string()),
        };
        assert!(assert_honest_windows(&a).is_err());
    }

    #[test]
    fn mark_stale_sets_contract_fields() {
        let live = ActivityPayload {
            commits_today: 2,
            commits_week: 5,
            commits_month: 9,
            repos_active_today: 1,
            last_push: None,
            updated_at: "2026-08-09T00:00:00Z".into(),
            stale: Some(false),
            freshness: Some("live".into()),
            source: Some("github".into()),
            projection_revision: Some(PUBLIC_ACTIVITY_PROJECTION_REVISION.to_string()),
        };
        let s = mark_stale(live);
        assert_eq!(s.stale, Some(true));
        assert_eq!(s.freshness.as_deref(), Some("stale"));
        assert_eq!(s.source.as_deref(), Some("github-public-stale"));
        assert_eq!(s.commits_week, 5);
    }

    #[test]
    fn window_iso_helpers_are_rfc3339() {
        let now = 1_782_800_000_000u64; // 2026-08-09-ish UTC
        let today = start_of_day_iso(now);
        let week = days_ago_iso(now, 7);
        let month = days_ago_iso(now, 30);
        assert!(today.ends_with("T00:00:00Z"));
        assert!(week < today);
        assert!(month < week);
    }

    #[test]
    fn pre_cut_last_good_without_public_revision_is_rejected() {
        let dir = std::env::temp_dir().join(format!(
            "portfolio-activity-pre-cut-test-{}",
            std::process::id()
        ));
        let _ = fs::create_dir_all(&dir);
        let path = dir.join("activity-last-good.json");
        let old = ActivityPayload {
            commits_today: 900,
            commits_week: 901,
            commits_month: 902,
            repos_active_today: 9,
            last_push: Some(crate::contract::LastPush {
                repo: "nonpublic-synthetic-a".into(),
                ago: "now".into(),
            }),
            updated_at: "2026-08-09T01:00:00Z".into(),
            stale: Some(false),
            freshness: Some("live".into()),
            source: Some("github-public".into()),
            projection_revision: None,
        };
        fs::write(&path, serde_json::to_vec(&old).unwrap()).unwrap();
        assert!(read_last_good_from_path(&path).is_none());
        let _ = fs::remove_file(path);
        let _ = fs::remove_dir(dir);
    }

    #[test]
    fn durable_last_good_roundtrip_via_file() {
        let _g = TEST_LOCK.lock().unwrap();
        let dir = std::env::temp_dir().join(format!(
            "portfolio-activity-last-good-test-{}",
            std::process::id()
        ));
        let _ = fs::create_dir_all(&dir);
        let path = dir.join("activity-last-good.json");
        // SAFETY: serialized by TEST_LOCK; restored below.
        unsafe { std::env::set_var("ACTIVITY_LAST_GOOD_PATH", &path) };
        reset_cache_for_tests();

        let payload = ActivityPayload {
            commits_today: 3,
            commits_week: 11,
            commits_month: 41,
            repos_active_today: 2,
            last_push: None,
            updated_at: "2026-08-09T01:00:00Z".into(),
            stale: Some(false),
            freshness: Some("live".into()),
            source: Some("github-public".into()),
            projection_revision: Some(PUBLIC_ACTIVITY_PROJECTION_REVISION.to_string()),
        };
        seed_last_good_for_tests(payload.clone());
        assert!(path.is_file(), "durable file must exist");

        // Clear memory only — file must still serve.
        if let Ok(mut guard) = last_good().lock() {
            *guard = None;
        }
        if let Ok(mut guard) = cache().lock() {
            *guard = None;
        }
        let restored = take_last_good().expect("file-backed last_good");
        assert_eq!(restored.commits_week, 11);
        assert_eq!(restored.commits_month, 41);
        assert_eq!(restored.source.as_deref(), Some("github-public"));
        assert!(assert_honest_windows(&restored).is_ok());

        unsafe { std::env::remove_var("ACTIVITY_LAST_GOOD_PATH") };
        reset_cache_for_tests();
    }
}
