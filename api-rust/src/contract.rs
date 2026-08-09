//! Single JSON REST contract for kylet.se (ADR-169 clean break).
//! Sole authority for origin/CORS policy, rate-limit policy, package-name
//! validation, and the shared response payload shapes. No proto/Connect
//! surface remains; this module is the contract SSOT.

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
    /// True when serving last verified CP snapshot after upstream failure.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stale: Option<bool>,
    /// `live` | `stale` | `not_observed` | …
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub freshness: Option<String>,
    /// `control-plane` | `control-plane-stale` | …
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    /// Opaque CP projection revision of the snapshot served.
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
/// origin is not allowlisted (browser will block the response — never echo a
/// foreign origin back).
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
///
/// Trust ladder (never the client-controlled first X-Forwarded-For entry):
/// 1. `cf-connecting-ip` — Cloudflare overwrites this at the edge.
/// 2. `x-real-ip` — nginx sets this from `$remote_addr` (`proxy_set_header`).
/// 3. Last entry of `x-forwarded-for` — the peer appended by our own nginx;
///    client-supplied earlier entries are ignored.
/// 4. `x-envoy-external-address` — platform edge fallback.
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn client_ip_trusts_cf_connecting_ip_first() {
        let headers = vec![
            ("x-forwarded-for".to_string(), "6.6.6.6, 203.0.113.9".to_string()),
            ("cf-connecting-ip".to_string(), "198.51.100.7".to_string()),
            ("x-real-ip".to_string(), "203.0.113.9".to_string()),
        ];
        assert_eq!(client_ip(&headers), "198.51.100.7");
    }

    #[test]
    fn client_ip_ignores_spoofed_first_xff_entry() {
        // Client-sent first XFF entry must never be trusted; the last entry is
        // appended by our own nginx from $remote_addr.
        let headers = vec![(
            "x-forwarded-for".to_string(),
            "1.2.3.4, 203.0.113.9".to_string(),
        )];
        assert_eq!(client_ip(&headers), "203.0.113.9");
    }

    #[test]
    fn client_ip_falls_back_to_x_real_ip() {
        let headers = vec![
            ("x-forwarded-for".to_string(), "1.2.3.4".to_string()),
            ("x-real-ip".to_string(), "203.0.113.9".to_string()),
        ];
        assert_eq!(client_ip(&headers), "203.0.113.9");
    }

    #[test]
    fn client_ip_unknown_without_proxy_headers() {
        assert_eq!(client_ip(&[]), "unknown");
    }

    #[test]
    fn cors_only_echoes_allowlisted_origins() {
        assert_eq!(
            allowed_origin(Some("https://kylet.se")),
            Some("https://kylet.se")
        );
        assert_eq!(
            allowed_origin(Some("https://slim-pal-0k3stq.sylphx.app")),
            Some("https://slim-pal-0k3stq.sylphx.app")
        );
        assert_eq!(allowed_origin(Some("https://evil.example")), None);
        assert_eq!(allowed_origin(None), None);
    }

    #[test]
    fn cors_map_omits_allow_origin_for_foreign_origins() {
        let map = cors_header_map(Some("https://evil.example"));
        assert!(!map.contains_key("access-control-allow-origin"));
        assert_eq!(map.get("vary").map(String::as_str), Some("origin"));

        let map = cors_header_map(Some("https://kylet.se"));
        assert_eq!(
            map.get("access-control-allow-origin").map(String::as_str),
            Some("https://kylet.se")
        );
    }

    #[test]
    fn pkg_validation_rules() {
        assert!(valid_pkg("@sylphx/pdf-reader-mcp"));
        assert!(valid_pkg("lodash"));
        assert!(!valid_pkg("not valid spaces"));
        assert!(!valid_pkg(""));
        assert!(!valid_pkg("@/nope"));
    }

    #[test]
    fn rate_limit_blocks_burst_after_window_capacity() {
        let ip = "203.0.113.1".to_string();
        let base = 1_700_000_000_000u64;
        let mut state = RateLimitState::default();
        for i in 0..IP_MAX_IN_WINDOW {
            assert_eq!(
                check_rate_limit_isolated(&ip, base + i as u64, &mut state),
                LimitVerdict::Ok
            );
        }
        assert_eq!(
            check_rate_limit_isolated(&ip, base + IP_MAX_IN_WINDOW as u64, &mut state),
            LimitVerdict::TooFast
        );
    }
}
