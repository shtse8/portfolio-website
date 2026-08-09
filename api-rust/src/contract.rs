//! Single JSON REST contract for kylet.se (ADR-169 clean break).
//! Sole authority for origin/CORS policy, rate-limit policy, package-name
//! validation, shared payload shapes, and the GitHub activity computation.

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::BTreeMap;

pub const ALLOWED_ORIGINS: &[&str] = &[
    "https://kylet.se",
    "https://www.kylet.se",
    "https://slim-pal-0k3stq.sylphx.app",
    "https://loud-slab-t9c6ai.sylphx.app",
    "http://localhost:3000",
];

pub const DAY_MS: u64 = 86_400_000;
pub const WEEK_MS: u64 = 7 * DAY_MS;

pub const IP_WINDOW_MS: u64 = 3 * 60_000;
pub const IP_MAX_IN_WINDOW: usize = 12;
pub const IP_MAX_PER_DAY: usize = 60;
pub const GLOBAL_MAX_PER_DAY: usize = 500;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct LastPush {
    pub repo: String,
    pub ago: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ActivityPayload {
    pub commits_today: u64,
    pub commits_week: u64,
    pub commits_month: u64,
    pub repos_active_today: u64,
    pub last_push: Option<LastPush>,
    pub updated_at: String,
    /// True when serving last verified snapshot after upstream failure.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stale: Option<bool>,
    /// `live` | `stale` | `not_observed` | …
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub freshness: Option<String>,
    /// `github` | `github-stale` | …
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub projection_revision: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum LimitVerdict {
    Ok,
    TooFast,
    DailyIp,
    GlobalDaily,
}

impl LimitVerdict {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Ok => "ok",
            Self::TooFast => "tooFast",
            Self::DailyIp => "dailyIp",
            Self::GlobalDaily => "globalDaily",
        }
    }
}

pub fn valid_pkg(pkg: &str) -> bool {
    if pkg.len() > 80 {
        return false;
    }
    let mut rest = pkg;
    if let Some(stripped) = pkg.strip_prefix('@') {
        let (scope, name) = stripped.split_once('/').unwrap_or(("", ""));
        if scope.is_empty() || name.is_empty() {
            return false;
        }
        rest = name;
    }
    !rest.is_empty()
        && rest
            .chars()
            .next()
            .is_some_and(|c| c.is_ascii_alphanumeric())
        && rest
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
}

/// Returns the origin to echo in CORS headers, or `None` when the request
/// origin is not allowlisted (browser will block the response).
pub fn allowed_origin(origin: Option<&str>) -> Option<&'static str> {
    origin.and_then(|o| ALLOWED_ORIGINS.iter().copied().find(|&allowed| allowed == o))
}

pub fn cors_header_map(origin: Option<&str>) -> BTreeMap<String, String> {
    let mut map = BTreeMap::new();
    if let Some(allowed) = allowed_origin(origin) {
        map.insert("access-control-allow-origin".to_string(), allowed.to_string());
    }
    map.insert(
        "access-control-allow-methods".to_string(),
        "GET, POST, OPTIONS".to_string(),
    );
    map.insert(
        "access-control-allow-headers".to_string(),
        "content-type".to_string(),
    );
    map.insert("access-control-max-age".to_string(), "86400".to_string());
    map.insert("vary".to_string(), "origin".to_string());
    map
}

/// Resolve the real client IP from headers set by trusted proxies.
/// Trust ladder: cf-connecting-ip → x-real-ip → last XFF entry → envoy.
pub fn client_ip(headers: &[(String, String)]) -> String {
    let pick = |name: &str| -> Option<String> {
        headers
            .iter()
            .find(|(k, _)| k.eq_ignore_ascii_case(name))
            .map(|(_, v)| v.clone())
    };
    let raw = pick("cf-connecting-ip")
        .map(|v| v.split(',').next().map(str::trim).map(str::to_string).unwrap_or_default())
        .filter(|v| !v.is_empty())
        .or_else(|| pick("x-real-ip").map(|v| v.trim().to_string()).filter(|v| !v.is_empty()))
        .or_else(|| {
            pick("x-forwarded-for")
                .and_then(|v| v.rsplit(',').next().map(str::trim).map(str::to_string))
                .filter(|v| !v.is_empty())
        })
        .or_else(|| pick("x-envoy-external-address").map(|v| v.trim().to_string()).filter(|v| !v.is_empty()))
        .unwrap_or_else(|| "unknown".to_string());
    raw.chars().take(45).collect()
}

pub fn rate_limit_constants() -> Value {
    json!({
        "ipWindowMs": IP_WINDOW_MS,
        "ipMaxInWindow": IP_MAX_IN_WINDOW,
        "ipMaxPerDay": IP_MAX_PER_DAY,
        "globalMaxPerDay": GLOBAL_MAX_PER_DAY,
    })
}

pub fn check_rate_limit_isolated(ip: &str, now: u64, state: &mut RateLimitState) -> LimitVerdict {
    let day = (now / 86_400_000) as i64;
    if state.global_day != day {
        state.global_day = day;
        state.global_count = 0;
        state.ip_day.clear();
        state.ip_hits.clear();
    }
    if state.global_count >= GLOBAL_MAX_PER_DAY {
        return LimitVerdict::GlobalDaily;
    }
    if ip != "unknown" {
        let day_count = state.ip_day.get(ip).copied().unwrap_or(0);
        if day_count >= IP_MAX_PER_DAY {
            return LimitVerdict::DailyIp;
        }
        let hits: Vec<u64> = state
            .ip_hits
            .get(ip)
            .map(|h| {
                h.iter()
                    .copied()
                    .filter(|t| now.saturating_sub(*t) < IP_WINDOW_MS)
                    .collect()
            })
            .unwrap_or_default();
        if hits.len() >= IP_MAX_IN_WINDOW {
            return LimitVerdict::TooFast;
        }
        let mut new_hits = hits;
        new_hits.push(now);
        state.ip_hits.insert(ip.to_string(), new_hits);
        state.ip_day.insert(ip.to_string(), day_count + 1);
    }
    state.global_count += 1;
    LimitVerdict::Ok
}

#[derive(Debug, Default)]
pub struct RateLimitState {
    ip_hits: std::collections::HashMap<String, Vec<u64>>,
    ip_day: std::collections::HashMap<String, usize>,
    global_day: i64,
    global_count: usize,
}

pub fn simulate_burst_verdicts(ip: &str, base: u64) -> (Vec<String>, String) {
    let mut state = RateLimitState::default();
    let mut verdicts = Vec::new();
    for i in 0..=IP_MAX_IN_WINDOW {
        let verdict = check_rate_limit_isolated(ip, base + i as u64, &mut state);
        verdicts.push(verdict.as_str().to_string());
    }
    let final_verdict = verdicts
        .last()
        .cloned()
        .unwrap_or_else(|| "unknown".to_string());
    (verdicts, final_verdict)
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub activity (ADR-169 amendment 2026-08-09): `/activity` counts authored
// commits via the GitHub commit SEARCH API — `contributionsCollection` only
// counts default-branch commits and massively under-reports branch work, so
// counts come from search (all branches); a light GraphQL query supplies
// repos-with-contributions-today and the most recently pushed repo.
// ─────────────────────────────────────────────────────────────────────────────

pub const ACTIVITY_GITHUB_USER: &str = "shtse8";

/// Lightweight GraphQL: today-contributions by repo (for `repos_active_today`)
/// + the 10 most recently pushed repos (for `last_push`).
pub fn github_activity_query(now_iso: &str, today_start: &str) -> String {
    format!(
        "{{ today: user(login: \"{login}\") {{ contributionsCollection(from: \"{today}\", to: \"{now}\") {{ totalCommitContributions commitContributionsByRepository(maxRepositories: 20) {{ repository {{ nameWithOwner pushedAt }} contributions {{ totalCount }} }} }} }} repos: user(login: \"{login}\") {{ repositories(first: 10, orderBy: {{ field: PUSHED_AT, direction: DESC }}, ownerAffiliations: OWNER) {{ nodes {{ nameWithOwner pushedAt }} }} }} }}",
        login = ACTIVITY_GITHUB_USER,
        today = today_start,
        now = now_iso,
    )
}

/// Commit search query URL: authored commits (all branches, incl. private with
/// the service token) since the given ISO instant. `per_page=1` keeps it cheap;
/// `total_count` is the real number.
pub fn github_activity_search_url(api_base: &str, since_iso: &str) -> String {
    format!(
        "{base}/search/commits?q=author:{user}+author-date:%3E%3D{since}&per_page=1",
        base = api_base.trim_end_matches('/'),
        user = ACTIVITY_GITHUB_USER,
        since = since_iso,
    )
}

/// Brace balance sanity (must open and close what it opens).
pub fn github_activity_query_balanced(query: &str) -> bool {
    query.chars().filter(|c| *c == '{').count() == query.chars().filter(|c| *c == '}').count()
}

/// Aggregate GitHub activity: commit COUNTS come from the commit search API
/// (all branches); the GraphQL `data` supplies repos-with-contributions-today
/// and the most recently pushed repo.
pub fn aggregate_github_activity(
    data: &Value,
    commits_today: u64,
    commits_week: u64,
    commits_month: u64,
    now_ms: u64,
    updated_at: &str,
) -> ActivityPayload {
    let mut repos_active_today = 0u64;
    if let Some(by_repo) = data
        .pointer("/today/contributionsCollection/commitContributionsByRepository")
        .and_then(Value::as_array)
    {
        repos_active_today = by_repo
            .iter()
            .filter(|e| {
                e.get("contributions")
                    .and_then(|c| c.get("totalCount"))
                    .and_then(Value::as_u64)
                    .unwrap_or(0)
                    > 0
            })
            .count() as u64;
    }
    let last_push = data
        .pointer("/repos/repositories/nodes")
        .and_then(Value::as_array)
        .and_then(|nodes| nodes.first())
        .and_then(|n| {
            let name = n.get("nameWithOwner").and_then(Value::as_str).unwrap_or("");
            let pushed = n.get("pushedAt").and_then(Value::as_str).unwrap_or("");
            if name.is_empty() || pushed.is_empty() {
                None
            } else {
                Some(LastPush {
                    repo: name.split('/').nth(1).unwrap_or(name).to_string(),
                    ago: format_ago(now_ms, pushed),
                })
            }
        });

    ActivityPayload {
        commits_today,
        commits_week,
        commits_month,
        repos_active_today,
        last_push,
        updated_at: updated_at.to_string(),
        stale: None,
        freshness: Some("live".to_string()),
        source: Some("github".to_string()),
        projection_revision: None,
    }
}

// ── ISO-8601 window helpers (UTC) ────────────────────────────────────────────

pub fn start_of_day_iso(now_ms: u64) -> String {
    let secs = now_ms / 1000;
    let day_secs = secs % 86_400;
    format_iso(now_ms - day_secs * 1000)
}

pub fn days_ago_iso(now_ms: u64, days: u64) -> String {
    format_iso(now_ms.saturating_sub(days * 86_400_000))
}

fn format_iso(ms: u64) -> String {
    let secs = ms / 1000;
    let nanos = (ms % 1000) * 1_000_000;
    match time::OffsetDateTime::from_unix_timestamp(secs as i64) {
        Ok(dt) => dt
            .replace_nanosecond(nanos as u32)
            .unwrap_or(dt)
            .format(&time::format_description::well_known::Rfc3339)
            .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string()),
        Err(_) => "1970-01-01T00:00:00Z".to_string(),
    }
}

pub fn parse_iso_ms(iso: &str) -> u64 {
    time::OffsetDateTime::parse(iso, &time::format_description::well_known::Rfc3339)
        .ok()
        .map(|dt| (dt.unix_timestamp_nanos() / 1_000_000) as u64)
        .unwrap_or(0)
}

pub fn format_ago(now_ms: u64, when: &str) -> String {
    let when_ms = parse_iso_ms(when);
    let diff = now_ms.saturating_sub(when_ms);
    let mins = diff / 60_000;
    let hrs = mins / 60;
    let days = hrs / 24;
    if days > 0 {
        format!("{days}d ago")
    } else if hrs > 0 {
        format!("{hrs}h ago")
    } else if mins > 0 {
        format!("{mins}m ago")
    } else {
        "just now".to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::activity::assert_honest_windows;

    #[test]
    fn github_activity_query_is_balanced() {
        let q = github_activity_query("2026-08-09T12:00:00Z", "2026-08-09T00:00:00Z");
        assert!(github_activity_query_balanced(&q), "query braces must balance");
        for alias in ["today:", "repos:"] {
            assert!(q.contains(alias), "missing alias {alias}");
        }
        assert!(q.contains(ACTIVITY_GITHUB_USER));
    }

    #[test]
    fn github_activity_search_url_is_well_formed() {
        let url = github_activity_search_url("https://api.github.com", "2026-08-09T00:00:00Z");
        assert!(url.starts_with(
            "https://api.github.com/search/commits?q=author:shtse8+author-date:%3E%3D2026-08-09T00:00:00Z&per_page=1"
        ));
        let url2 = github_activity_search_url("http://127.0.0.1:9/", "2026-08-09T00:00:00Z");
        assert!(url2.starts_with("http://127.0.0.1:9/search/commits?"));
    }

    #[test]
    fn aggregate_uses_search_counts_and_graphql_side_data() {
        let data = json!({
            "today": { "contributionsCollection": { "commitContributionsByRepository": [
                { "repository": { "nameWithOwner": "shtse8/pdf-reader-mcp", "pushedAt": "2026-08-09T10:00:00Z" }, "contributions": { "totalCount": 2 } },
                { "repository": { "nameWithOwner": "shtse8/other", "pushedAt": "2026-08-08T00:00:00Z" }, "contributions": { "totalCount": 0 } }
            ] } },
            "repos": { "repositories": { "nodes": [
                { "nameWithOwner": "shtse8/newest", "pushedAt": "2026-08-09T11:00:00Z" }
            ] } }
        });
        let a = aggregate_github_activity(&data, 275, 12_023, 24_682, 1_782_800_000_000, "2026-08-09T12:00:00Z");
        assert_eq!(a.commits_today, 275);
        assert_eq!(a.commits_week, 12_023);
        assert_eq!(a.commits_month, 24_682);
        assert_ne!(a.commits_month, a.commits_week * 4);
        assert_eq!(a.repos_active_today, 1);
        assert_eq!(a.last_push.as_ref().map(|l| l.repo.as_str()), Some("newest"));
        assert_eq!(a.source.as_deref(), Some("github"));
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
            projection_revision: None,
        };
        assert!(assert_honest_windows(&a).is_err());
    }

    #[test]
    fn window_iso_helpers_are_rfc3339() {
        let now = 1_782_800_000_000u64;
        let today = start_of_day_iso(now);
        let week = days_ago_iso(now, 7);
        let month = days_ago_iso(now, 30);
        assert!(today.ends_with("T00:00:00Z"));
        assert!(week < today);
        assert!(month < week);
    }
}
