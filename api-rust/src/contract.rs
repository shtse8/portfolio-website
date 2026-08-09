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
// GitHub activity (ADR-169 amendment 2026-08-09): `/activity` mirrors GitHub's
// OWN contribution graph — `contributionCalendar` counts ALL contribution
// types (commits, PRs, issues, reviews, discussions) including private repos,
// summed as REAL per-day series (never week×4). This is the same number the
// profile graph shows when "Include private contributions" is enabled.
// ─────────────────────────────────────────────────────────────────────────────

pub const ACTIVITY_GITHUB_USER: &str = "shtse8";

/// One GraphQL query: the contribution calendar for the full 30-day window
/// (per-day counts), today's commitContributionsByRepository (for
/// `repos_active_today`), and the 10 most recently pushed repos (last_push).
pub fn github_activity_query(now_iso: &str, month_start: &str) -> String {
    format!(
        "{{ activity: user(login: \"{login}\") {{ contributionsCollection(from: \"{from}\", to: \"{now}\") {{ contributionCalendar {{ totalContributions weeks {{ contributionDays {{ date contributionCount }} }} }} commitContributionsByRepository(maxRepositories: 20) {{ repository {{ nameWithOwner pushedAt }} contributions {{ totalCount }} }} }} }} repos: user(login: \"{login}\") {{ repositories(first: 10, orderBy: {{ field: PUSHED_AT, direction: DESC }}, ownerAffiliations: OWNER) {{ nodes {{ nameWithOwner pushedAt }} }} }} }}",
        login = ACTIVITY_GITHUB_USER,
        from = month_start,
        now = now_iso,
    )
}

/// Brace balance sanity (must open and close what it opens).
pub fn github_activity_query_balanced(query: &str) -> bool {
    query.chars().filter(|c| *c == '{').count() == query.chars().filter(|c| *c == '}').count()
}

/// Aggregate the GitHub contribution calendar + repos into the payload.
/// `today` is the current UTC calendar day; `week`/`month` are REAL sums of
/// per-day calendar counts (identical to GitHub's graph).
pub fn aggregate_github_activity(data: &Value, now_ms: u64, updated_at: &str) -> ActivityPayload {
    // Compare on DATE only (YYYY-MM-DD) — calendar days are date-only strings
    // and a naive full-ISO compare would misclassify the day boundary.
    let today_date = &start_of_day_iso(now_ms)[..10];
    let week_start_date = &days_ago_iso(now_ms, 7)[..10];
    let month_start_date = &days_ago_iso(now_ms, 30)[..10];

    let mut today = 0u64;
    let mut week = 0u64;
    let mut month = 0u64;
    if let Some(weeks) = data
        .pointer("/activity/contributionsCollection/contributionCalendar/weeks")
        .and_then(Value::as_array)
    {
        for w in weeks {
            if let Some(days) = w.get("contributionDays").and_then(Value::as_array) {
                for d in days {
                    let Some(date) = d.get("date").and_then(Value::as_str) else {
                        continue;
                    };
                    let count = d.get("contributionCount").and_then(Value::as_u64).unwrap_or(0);
                    if date >= month_start_date {
                        month += count;
                    }
                    if date >= week_start_date {
                        week += count;
                    }
                    if date >= today_date {
                        today += count;
                    }
                }
            }
        }
    }

    let mut repos_active_today = 0u64;
    if let Some(by_repo) = data
        .pointer("/activity/contributionsCollection/commitContributionsByRepository")
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
        commits_today: today,
        commits_week: week,
        commits_month: month,
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
        let q = github_activity_query("2026-08-09T12:00:00Z", "2026-07-10T12:00:00Z");
        assert!(github_activity_query_balanced(&q), "query braces must balance");
        for alias in ["activity:", "repos:"] {
            assert!(q.contains(alias), "missing alias {alias}");
        }
        assert!(q.contains("contributionCalendar"));
        assert!(q.contains(ACTIVITY_GITHUB_USER));
    }

    #[test]
    fn aggregate_sums_real_per_day_series() {
        let data: Value = serde_json::from_str(r#"{"activity": {"contributionsCollection": {"contributionCalendar": {"weeks": [{"contributionDays": [{"date": "2026-08-02", "contributionCount": 100}, {"date": "2026-08-03", "contributionCount": 50}, {"date": "2026-08-09", "contributionCount": 25}]}]}, "commitContributionsByRepository": [{"repository": {"nameWithOwner": "shtse8/pdf-reader-mcp", "pushedAt": "2026-08-09T10:00:00Z"}, "contributions": {"totalCount": 2}}]}}, "repos": {"repositories": {"nodes": [{"nameWithOwner": "shtse8/newest", "pushedAt": "2026-08-09T11:00:00Z"}]}}}"#).unwrap();
        let a = aggregate_github_activity(&data, 1_786_276_800_000, "2026-08-09T12:00:00Z");
        assert_eq!(a.commits_today, 25);
        assert_eq!(a.commits_week, 175);
        assert_eq!(a.commits_month, 175);
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
