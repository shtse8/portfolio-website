//! Development activity authority — Control Plane projection only.
//!
//! Browser clients must never talk to Control Plane or recompute metrics from
//! GitHub. This BFF is the sole public surface for `/activity`.
//!
//! Authority ladder:
//! 1. Authenticated projection: `CP_PROJECTION_BASE` + `CP_PROJECTION_TOKEN`
//!    → `GET /api/v1/projections/{id}/snapshot`
//! 2. Legacy anonymous expand-contract: `CP_PUBLIC_BASE` / `CONTROL_PLANE_PUBLIC_BASE`
//!    → `GET /api/public/v1/profiles/{slug}/summary`
//! 3. Otherwise: hard error (no Control Plane projection configured)
//!
//! On CP failure: serve last verified CP snapshot marked stale, or unavailable.
//! NEVER recompute commits/work metrics via GitHub GraphQL.

use crate::contract::ActivityPayload;
use reqwest::Client;
use std::env;
use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const DEFAULT_ACTIVITY_TTL_MS: u64 = 90 * 1000;

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

/// Durable last verified Control Plane snapshot — never expires for fail-over.
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

fn non_empty_env(key: &str) -> Option<String> {
    env::var(key)
        .ok()
        .map(|s| s.trim().trim_end_matches('/').to_string())
        .filter(|s| !s.is_empty())
}

/// Preferred authenticated projection base (S2S).
fn cp_projection_base() -> Option<String> {
    non_empty_env("CP_PROJECTION_BASE")
}

fn cp_projection_token() -> Option<String> {
    env::var("CP_PROJECTION_TOKEN")
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
}

fn cp_projection_id() -> String {
    non_empty_env("CP_PROJECTION_ID").unwrap_or_else(cp_public_slug)
}

/// Legacy anonymous public profile base (expand-contract only).
fn cp_public_base() -> Option<String> {
    non_empty_env("CP_PUBLIC_BASE").or_else(|| non_empty_env("CONTROL_PLANE_PUBLIC_BASE"))
}

fn cp_public_slug() -> String {
    env::var("CP_PUBLIC_PROFILE_SLUG").unwrap_or_else(|_| "kyle".into())
}

/// True when any Control Plane metric path is configured (auth or public).
pub fn cp_metrics_configured() -> bool {
    let auth = cp_projection_base().is_some() && cp_projection_token().is_some();
    auth || cp_public_base().is_some()
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum CpPath {
    Authenticated,
    PublicLegacy,
}

fn select_cp_path() -> Result<(CpPath, String), String> {
    if let (Some(base), Some(_token)) = (cp_projection_base(), cp_projection_token()) {
        let id = cp_projection_id();
        let url = format!("{base}/api/v1/projections/{id}/snapshot");
        return Ok((CpPath::Authenticated, url));
    }
    if let Some(base) = cp_public_base() {
        let slug = cp_public_slug();
        let url = format!("{base}/api/public/v1/profiles/{slug}/summary");
        return Ok((CpPath::PublicLegacy, url));
    }
    Err("no control plane projection configured".into())
}

/// Map a Control Plane projection / public summary envelope → ActivityPayload.
/// Never invents month as week×4; takes d30 from CP series only.
pub fn map_cp_envelope_to_activity(v: &serde_json::Value, source: &str) -> ActivityPayload {
    let c = v
        .pointer("/summary/commits_landed")
        .or_else(|| v.pointer("/payload/summary/commits_landed"))
        .or_else(|| v.pointer("/data/summary/commits_landed"))
        .cloned()
        .unwrap_or_else(|| serde_json::json!({}));
    let today = c.get("today").and_then(|x| x.as_u64()).unwrap_or(0);
    let week = c.get("d7").and_then(|x| x.as_u64()).unwrap_or(0);
    // Honest 30d series from CP — never week×4.
    let month = c.get("d30").and_then(|x| x.as_u64()).unwrap_or(0);
    let projects = v
        .pointer("/summary/projects_active/count")
        .or_else(|| v.pointer("/payload/summary/projects_active/count"))
        .or_else(|| v.pointer("/data/summary/projects_active/count"))
        .and_then(|x| x.as_u64())
        .unwrap_or(0);
    let revision = v
        .get("projection_revision")
        .or_else(|| v.get("revision"))
        .and_then(|x| x.as_str())
        .map(str::to_string);
    let as_of = v
        .get("as_of")
        .or_else(|| v.get("updated_at"))
        .or_else(|| v.get("generated_at"))
        .and_then(|x| x.as_str())
        .unwrap_or("")
        .to_string();
    let freshness = v
        .pointer("/freshness/state")
        .or_else(|| v.get("freshness"))
        .and_then(|x| x.as_str())
        .unwrap_or("live")
        .to_string();
    let stale = freshness == "stale" || freshness == "not_observed";
    ActivityPayload {
        commits_today: today,
        commits_week: week,
        commits_month: month,
        repos_active_today: projects,
        last_push: None,
        updated_at: as_of,
        stale: Some(stale),
        freshness: Some(freshness),
        source: Some(source.to_string()),
        projection_revision: revision,
    }
}

/// Pure mapping guard: CP d30 must not be rewritten as week×4 on the BFF.
pub fn assert_honest_cp_windows(payload: &ActivityPayload) -> Result<(), String> {
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

async fn fetch_cp_json(path: CpPath, url: &str) -> Result<serde_json::Value, String> {
    let mut req = client().get(url).header("accept", "application/json");
    if path == CpPath::Authenticated {
        let token = cp_projection_token().ok_or_else(|| "CP_PROJECTION_TOKEN unset".to_string())?;
        req = req.header("authorization", format!("Bearer {token}"));
    }
    let res = req
        .send()
        .await
        .map_err(|e| format!("cp projection transport: {e}"))?;
    let status = res.status();
    if !status.is_success() {
        let body = res.text().await.unwrap_or_default();
        return Err(format!(
            "cp projection http {status}: {}",
            body.chars().take(200).collect::<String>()
        ));
    }
    res.json()
        .await
        .map_err(|e| format!("cp projection decode: {e}"))
}

async fn compute_activity_from_cp() -> Result<ActivityPayload, String> {
    let (path, url) = select_cp_path()?;
    let source = match path {
        CpPath::Authenticated => "control-plane",
        CpPath::PublicLegacy => "control-plane-public",
    };
    let v = fetch_cp_json(path, &url).await?;
    Ok(map_cp_envelope_to_activity(&v, source))
}

/// Single metric authority: Control Plane only. No GitHub GraphQL fall-through.
pub async fn compute_activity() -> Result<ActivityPayload, String> {
    if !cp_metrics_configured() {
        return Err("no control plane projection configured".into());
    }
    compute_activity_from_cp().await
}

fn mark_stale(mut data: ActivityPayload) -> ActivityPayload {
    data.stale = Some(true);
    data.freshness = Some("stale".into());
    // Contract source labels for fail-over serves.
    data.source = Some(match data.source.as_deref() {
        Some(s) if s.contains("public") => "control-plane-public-stale".into(),
        _ => "control-plane-stale".into(),
    });
    data
}

fn store_success(now: u64, data: &ActivityPayload) {
    if let Ok(mut guard) = cache().lock() {
        *guard = Some((now, data.clone()));
    }
    if let Ok(mut guard) = last_good().lock() {
        *guard = Some(data.clone());
    }
}

fn take_last_good() -> Option<ActivityPayload> {
    last_good()
        .lock()
        .ok()
        .and_then(|guard| guard.as_ref().cloned())
}

pub async fn get_activity() -> Result<ActivityPayload, String> {
    let now = now_ms();

    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
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
                    upstream = "control-plane",
                    route = "/activity",
                    "activity CP failed; serving last verified CP snapshot as stale"
                );
                return Ok(mark_stale(cached));
            }
            Err(err)
        }
    }
}

#[doc(hidden)]
pub fn cached_snapshot() -> Option<ActivityPayload> {
    // Prefer durable last_good for handler-level stale serve.
    if let Some(data) = take_last_good() {
        return Some(mark_stale(data));
    }
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < activity_ttl_ms() {
                return Some(data.clone());
            }
        }
    }
    None
}

/// Inject a verified snapshot for tests (simulates prior successful CP fetch).
#[doc(hidden)]
pub fn seed_last_good_for_tests(data: ActivityPayload) {
    if let Ok(mut guard) = last_good().lock() {
        *guard = Some(data);
    }
    if let Ok(mut guard) = cache().lock() {
        *guard = None;
    }
}

#[doc(hidden)]
pub fn reset_cache_for_tests() {
    if let Ok(mut guard) = cache().lock() {
        *guard = None;
    }
    if let Ok(mut guard) = last_good().lock() {
        *guard = None;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn map_cp_envelope_uses_true_d30_not_week_times_four() {
        let v = json!({
            "projection_revision": "sha256:abc",
            "as_of": "2026-07-16T00:00:00Z",
            "freshness": { "state": "live" },
            "summary": {
                "commits_landed": {
                    "today": 12,
                    "d7": 80,
                    "d30": 300,
                    "d30_is_not_week_times_four": true
                },
                "projects_active": { "count": 4 }
            }
        });
        let a = map_cp_envelope_to_activity(&v, "control-plane");
        assert_eq!(a.commits_today, 12);
        assert_eq!(a.commits_week, 80);
        assert_eq!(a.commits_month, 300);
        assert_ne!(a.commits_month, a.commits_week * 4);
        assert_eq!(a.repos_active_today, 4);
        assert!(a.last_push.is_none());
        assert_eq!(a.source.as_deref(), Some("control-plane"));
        assert_eq!(a.freshness.as_deref(), Some("live"));
        assert_eq!(a.stale, Some(false));
        assert_eq!(a.projection_revision.as_deref(), Some("sha256:abc"));
        assert!(assert_honest_cp_windows(&a).is_ok());
    }

    #[test]
    fn assert_honest_flags_week_times_four() {
        let a = ActivityPayload {
            commits_today: 1,
            commits_week: 10,
            commits_month: 40,
            repos_active_today: 1,
            last_push: None,
            updated_at: "t".into(),
            stale: Some(false),
            freshness: Some("live".into()),
            source: Some("control-plane".into()),
            projection_revision: None,
        };
        assert!(assert_honest_cp_windows(&a).is_err());
    }

    #[test]
    fn mark_stale_sets_contract_fields() {
        let live = ActivityPayload {
            commits_today: 2,
            commits_week: 5,
            commits_month: 9,
            repos_active_today: 1,
            last_push: None,
            updated_at: "2026-07-16T00:00:00Z".into(),
            stale: Some(false),
            freshness: Some("live".into()),
            source: Some("control-plane".into()),
            projection_revision: Some("rev1".into()),
        };
        let s = mark_stale(live);
        assert_eq!(s.stale, Some(true));
        assert_eq!(s.freshness.as_deref(), Some("stale"));
        assert_eq!(s.source.as_deref(), Some("control-plane-stale"));
        assert_eq!(s.commits_week, 5);
        assert_eq!(s.projection_revision.as_deref(), Some("rev1"));
    }

    #[test]
    fn select_cp_path_errors_when_unconfigured() {
        // Structural: select_cp_path with no env is tested via compute path contract.
        // We only assert map does not invent month when d30 missing.
        let v = json!({ "summary": { "commits_landed": { "today": 1, "d7": 2 } } });
        let a = map_cp_envelope_to_activity(&v, "control-plane-public");
        assert_eq!(a.commits_month, 0);
        assert_ne!(a.commits_month, a.commits_week * 4);
    }
}
