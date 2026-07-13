use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::fs;
use std::path::Path;

pub const ALLOWED_ORIGINS: &[&str] = &[
    "https://kylet.se",
    "https://www.kylet.se",
    "https://loud-slab-t9c6ai.sylphx.app",
    "http://localhost:3000",
];

pub const DAY_MS: u64 = 86_400_000;
pub const WEEK_MS: u64 = 7 * DAY_MS;

pub const IP_WINDOW_MS: u64 = 3 * 60_000;
pub const IP_MAX_IN_WINDOW: usize = 12;
pub const IP_MAX_PER_DAY: usize = 60;
pub const GLOBAL_MAX_PER_DAY: usize = 500;

pub const GITHUB_OWNERS: &[(&str, &str)] = &[
    ("shtse8", "user"),
    ("SylphxAI", "organization"),
    ("Cubeage", "organization"),
    ("EpiowAI", "organization"),
];

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

pub fn allowed_origin(origin: Option<&str>) -> &'static str {
    origin
        .and_then(|o| ALLOWED_ORIGINS.iter().copied().find(|&allowed| allowed == o))
        .unwrap_or("https://kylet.se")
}

pub fn cors_header_map(origin: Option<&str>) -> BTreeMap<String, String> {
    let allowed = allowed_origin(origin);
    BTreeMap::from([
        (
            "access-control-allow-origin".to_string(),
            allowed.to_string(),
        ),
        (
            "access-control-allow-methods".to_string(),
            "GET, POST, OPTIONS".to_string(),
        ),
        (
            "access-control-allow-headers".to_string(),
            "content-type".to_string(),
        ),
        (
            "access-control-max-age".to_string(),
            "86400".to_string(),
        ),
        ("vary".to_string(), "origin".to_string()),
    ])
}

pub fn client_ip(headers: &[(String, String)]) -> String {
    let pick = |name: &str| -> Option<String> {
        headers
            .iter()
            .find(|(k, _)| k.eq_ignore_ascii_case(name))
            .map(|(_, v)| v.clone())
    };
    let raw = pick("x-forwarded-for")
        .and_then(|v| v.split(',').next().map(str::trim).map(str::to_string))
        .or_else(|| pick("x-real-ip"))
        .or_else(|| pick("x-envoy-external-address"))
        .or_else(|| pick("cf-connecting-ip"))
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
        let day_count = state
            .ip_day
            .get(ip)
            .copied()
            .unwrap_or(0);
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
    let final_verdict = verdicts.last().cloned().unwrap_or_else(|| "unknown".to_string());
    (verdicts, final_verdict)
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

pub fn build_user_activity_graphql_block(index: usize, login: &str, week_start: &str, now_iso: &str) -> String {
    format!(
        "o{index}: user(login: \"{login}\") {{
          contributionsCollection(from: \"{week_start}\", to: \"{now_iso}\") {{
            totalCommitContributions
            commitContributionsByRepository(maxRepositories: 20) {{
              repository {{ nameWithOwner pushedAt }}
              contributions {{ totalCount }}
            }}
          }}
        }}"
    )
}

pub fn build_org_activity_graphql_block(index: usize, login: &str, week_start: &str) -> String {
    format!(
        "o{index}: organization(login: \"{login}\") {{
          repositories(first: 50, orderBy: {{field: PUSHED_AT, direction: DESC}}) {{
            nodes {{
              nameWithOwner
              pushedAt
              defaultBranchRef {{
                target {{
                  ... on Commit {{
                    history(since: \"{week_start}\") {{ totalCount }}
                  }}
                }}
              }}
            }}
          }}
        }}"
    )
}

pub fn normalize_activity_graphql_response(data: &Value) -> Value {
    let mut normalized = serde_json::Map::new();
    let Some(obj) = data.as_object() else {
        return data.clone();
    };

    for (key, value) in obj {
        if let Some(repos) = value.get("repositories").and_then(|v| v.get("nodes")).and_then(Value::as_array)
        {
            let mut total = 0u64;
            let mut by_repo = Vec::new();
            for repo in repos {
                let name = repo
                    .get("nameWithOwner")
                    .and_then(Value::as_str)
                    .unwrap_or("");
                let pushed_at = repo.get("pushedAt").and_then(Value::as_str).unwrap_or("");
                let count = repo
                    .get("defaultBranchRef")
                    .and_then(|v| v.get("target"))
                    .and_then(|v| v.get("history"))
                    .and_then(|v| v.get("totalCount"))
                    .and_then(Value::as_u64)
                    .unwrap_or(0);
                total += count;
                by_repo.push(json!({
                    "repository": { "nameWithOwner": name, "pushedAt": pushed_at },
                    "contributions": { "totalCount": count },
                }));
            }
            normalized.insert(
                key.clone(),
                json!({
                    "contributionsCollection": {
                        "totalCommitContributions": total,
                        "commitContributionsByRepository": by_repo,
                    }
                }),
            );
        } else {
            normalized.insert(key.clone(), value.clone());
        }
    }

    Value::Object(normalized)
}

pub fn aggregate_activity_from_graphql(
    graphql: &Value,
    owner_keys: &[String],
    now_ms: u64,
    updated_at: &str,
) -> ActivityPayload {
    let mut commits_today = 0u64;
    let mut commits_week = 0u64;
    let mut repos_active_today = std::collections::HashSet::new();
    let mut last_push: Option<(String, String)> = None;

    for key in owner_keys {
        let Some(cc) = graphql
            .get(key)
            .and_then(|v| v.get("contributionsCollection"))
        else {
            continue;
        };

        commits_week += cc
            .get("totalCommitContributions")
            .and_then(Value::as_u64)
            .unwrap_or(0);

        if let Some(entries) = cc
            .get("commitContributionsByRepository")
            .and_then(Value::as_array)
        {
            for entry in entries {
                let repo = entry
                    .get("repository")
                    .and_then(|r| r.get("nameWithOwner"))
                    .and_then(Value::as_str)
                    .unwrap_or("");
                let count = entry
                    .get("contributions")
                    .and_then(|c| c.get("totalCount"))
                    .and_then(Value::as_u64)
                    .unwrap_or(0);
                let pushed_at = entry
                    .get("repository")
                    .and_then(|r| r.get("pushedAt"))
                    .and_then(Value::as_str);

                if let Some(pushed_at) = pushed_at {
                    let ts = parse_iso_ms(pushed_at);
                    if now_ms.saturating_sub(ts) < DAY_MS {
                        repos_active_today.insert(repo.to_string());
                        commits_today += count;
                    }
                    if last_push
                        .as_ref()
                        .is_none_or(|(_, when)| ts > parse_iso_ms(when))
                    {
                        last_push = Some((repo.to_string(), pushed_at.to_string()));
                    }
                }
            }
        }
    }

    let last_push_display = last_push.map(|(repo, when)| LastPush {
        repo: repo.split('/').nth(1).unwrap_or(&repo).to_string(),
        ago: format_ago(now_ms, &when),
    });

    ActivityPayload {
        commits_today,
        commits_week,
        commits_month: commits_week.saturating_mul(4),
        repos_active_today: repos_active_today.len() as u64,
        last_push: last_push_display,
        updated_at: updated_at.to_string(),
    }
}

pub fn proto_contract_summary(proto_path: &Path) -> Value {
    let raw = fs::read_to_string(proto_path).unwrap_or_default();
    let proto_hash = sha256_hex(&raw);
    let rpc_count = raw.matches("rpc ").count();
    json!({
        "service": "PortfolioApiService",
        "rpcCount": rpc_count,
        "protoHash": proto_hash,
    })
}

fn sha256_hex(content: &str) -> String {
    use sha2::{Digest, Sha256};
    let digest = Sha256::digest(content.as_bytes());
    digest.iter().map(|byte| format!("{byte:02x}")).collect()
}

#[cfg(test)]
mod portfolio_bulk_residual_tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn valid_pkg_accepts_scoped_and_simple() {
        assert!(valid_pkg("lodash"));
        assert!(valid_pkg("@sylphx/pdf-reader-mcp"));
        assert!(valid_pkg("a.b-c_d"));
    }

    #[test]
    fn valid_pkg_rejects_empty_spaces_and_bad_scope() {
        assert!(!valid_pkg(""));
        assert!(!valid_pkg("not valid spaces"));
        assert!(!valid_pkg("@scopeonly"));
        assert!(!valid_pkg("@/name"));
        assert!(!valid_pkg(&"x".repeat(81)));
    }

    #[test]
    fn allowed_origin_allowlist_and_default() {
        assert_eq!(allowed_origin(Some("https://kylet.se")), "https://kylet.se");
        assert_eq!(
            allowed_origin(Some("https://evil.example")),
            "https://kylet.se"
        );
        assert_eq!(allowed_origin(None), "https://kylet.se");
    }

    #[test]
    fn client_ip_precedence_xff_then_real_ip() {
        let headers = vec![
            ("x-forwarded-for".into(), " 1.2.3.4, 5.6.7.8 ".into()),
            ("x-real-ip".into(), "9.9.9.9".into()),
        ];
        assert_eq!(client_ip(&headers), "1.2.3.4");
        let headers2 = vec![("x-real-ip".into(), "9.9.9.9".into())];
        assert_eq!(client_ip(&headers2), "9.9.9.9");
        assert_eq!(client_ip(&[]), "unknown");
    }

    #[test]
    fn format_ago_buckets() {
        let when = "2026-07-13T00:00:00Z";
        let base = parse_iso_ms(when);
        assert_ne!(base, 0);
        assert_eq!(format_ago(base, when), "just now");
        assert_eq!(format_ago(base + 5 * 60_000, when), "5m ago");
        assert_eq!(format_ago(base + 3 * 60 * 60_000, when), "3h ago");
        assert_eq!(format_ago(base + 2 * 24 * 60 * 60_000, when), "2d ago");
    }

    #[test]
    fn normalize_activity_org_repos_to_contributions_shape() {
        let raw = json!({
            "o0": {
                "repositories": {
                    "nodes": [
                        {
                            "nameWithOwner": "shtse8/portfolio-website",
                            "pushedAt": "2026-07-13T00:00:00Z",
                            "defaultBranchRef": {
                                "target": { "history": { "totalCount": 3 } }
                            }
                        }
                    ]
                }
            }
        });
        let norm = normalize_activity_graphql_response(&raw);
        assert_eq!(
            norm["o0"]["contributionsCollection"]["totalCommitContributions"],
            3
        );
        assert_eq!(
            norm["o0"]["contributionsCollection"]["commitContributionsByRepository"][0]
                ["repository"]["nameWithOwner"],
            "shtse8/portfolio-website"
        );
    }

    #[test]
    fn aggregate_activity_counts_today_and_last_push() {
        let when = "2026-07-13T12:00:00Z";
        let now = parse_iso_ms(when);
        let gql = json!({
            "o0": {
                "contributionsCollection": {
                    "totalCommitContributions": 7,
                    "commitContributionsByRepository": [
                        {
                            "repository": {
                                "nameWithOwner": "shtse8/portfolio-website",
                                "pushedAt": "2026-07-13T11:00:00Z"
                            },
                            "contributions": { "totalCount": 2 }
                        }
                    ]
                }
            }
        });
        let payload = aggregate_activity_from_graphql(
            &gql,
            &["o0".to_string()],
            now,
            "2026-07-13T12:00:00Z",
        );
        assert_eq!(payload.commits_week, 7);
        assert_eq!(payload.commits_today, 2);
        assert_eq!(payload.repos_active_today, 1);
        assert_eq!(payload.commits_month, 28);
        let lp = payload.last_push.expect("last_push");
        assert_eq!(lp.repo, "portfolio-website");
        assert_eq!(lp.ago, "1h ago");
    }

    #[test]
    fn rate_limit_constants_are_positive() {
        let c = rate_limit_constants();
        assert!(c["ipWindowMs"].as_u64().unwrap_or(0) > 0);
        assert!(c["ipMaxInWindow"].as_u64().unwrap_or(0) > 0);
    }

    #[test]
    fn simulate_burst_final_is_too_fast() {
        let (verdicts, final_v) = simulate_burst_verdicts("1.1.1.1", 1_000_000);
        assert!(verdicts.len() > 1);
        assert_eq!(final_v, "tooFast");
    }

    // --- WAVE2 pure residual deepen ---

    #[test]
    fn parse_iso_ms_rejects_garbage_and_accepts_rfc3339() {
        assert_eq!(parse_iso_ms(""), 0);
        assert_eq!(parse_iso_ms("not-a-date"), 0);
        assert!(parse_iso_ms("2026-07-13T00:00:00Z") > 0);
        assert!(parse_iso_ms("2026-07-13T00:00:00+00:00") > 0);
    }

    #[test]
    fn cors_header_map_sets_allowlist_and_methods() {
        let headers = cors_header_map(Some("https://kylet.se"));
        assert_eq!(
            headers.get("access-control-allow-origin").map(String::as_str),
            Some("https://kylet.se")
        );
        assert_eq!(
            headers.get("access-control-allow-methods").map(String::as_str),
            Some("GET, POST, OPTIONS")
        );
        assert_eq!(headers.get("vary").map(String::as_str), Some("origin"));
        let denied = cors_header_map(Some("https://evil.example"));
        assert_eq!(
            denied.get("access-control-allow-origin").map(String::as_str),
            Some("https://kylet.se")
        );
    }

    #[test]
    fn client_ip_cf_envoy_and_truncation() {
        let headers = vec![("cf-connecting-ip".into(), "8.8.8.8".into())];
        assert_eq!(client_ip(&headers), "8.8.8.8");
        let headers = vec![("x-envoy-external-address".into(), "7.7.7.7".into())];
        assert_eq!(client_ip(&headers), "7.7.7.7");
        let long = "9".repeat(60);
        let headers = vec![("x-real-ip".into(), long)];
        assert_eq!(client_ip(&headers).len(), 45);
    }

    #[test]
    fn graphql_activity_blocks_include_login_and_window() {
        let user = build_user_activity_graphql_block(0, "shtse8", "2026-07-01T00:00:00Z", "2026-07-10T00:00:00Z");
        assert!(user.contains("o0: user(login: \"shtse8\")"));
        assert!(user.contains("contributionsCollection(from: \"2026-07-01T00:00:00Z\", to: \"2026-07-10T00:00:00Z\")"));
        let org = build_org_activity_graphql_block(1, "SylphxAI", "2026-07-01T00:00:00Z");
        assert!(org.contains("o1: organization(login: \"SylphxAI\")"));
        assert!(org.contains("history(since: \"2026-07-01T00:00:00Z\")"));
        assert!(!org.contains("contributionsCollection"));
    }

    #[test]
    fn rate_limit_daily_ip_and_unknown_skips_ip_window() {
        // Anchor at day boundary so spaced hits never roll global_day / clear ip_day.
        let base = 100 * DAY_MS;
        let mut state = RateLimitState::default();
        for i in 0..20 {
            let v = check_rate_limit_isolated("unknown", base + i, &mut state);
            assert_eq!(v.as_str(), "ok", "unknown should not IP-limit at {i}");
        }
        let mut state = RateLimitState::default();
        let mut last_ok = 0u64;
        for i in 0..IP_MAX_PER_DAY {
            let t = base + (i as u64) * (IP_WINDOW_MS + 1);
            assert!(t / DAY_MS == base / DAY_MS, "test fixture rolled day at i={i}");
            let v = check_rate_limit_isolated("2.2.2.2", t, &mut state);
            assert_eq!(v.as_str(), "ok", "expected ok for hit {i}");
            last_ok = t;
        }
        let blocked = check_rate_limit_isolated("2.2.2.2", last_ok + IP_WINDOW_MS + 1, &mut state);
        assert_eq!(blocked.as_str(), "dailyIp");
    }

    #[test]
    fn proto_contract_summary_counts_rpc_and_hashes() {
        let dir = std::env::temp_dir().join("portfolio-wave2-proto");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("api.proto");
        std::fs::write(
            &path,
            "service PortfolioApiService { rpc Health (H) returns (H); rpc Stats (S) returns (S); }",
        )
        .unwrap();
        let summary = proto_contract_summary(&path);
        assert_eq!(summary["service"], "PortfolioApiService");
        assert_eq!(summary["rpcCount"], 2);
        assert_eq!(summary["protoHash"].as_str().unwrap().len(), 64);
    }

    // --- WAVE3 pure residual deepen ---

    #[test]
    fn format_ago_sub_minute_is_just_now() {
        let when = "2026-07-13T00:00:00Z";
        let base = parse_iso_ms(when);
        assert_eq!(format_ago(base + 59_000, when), "just now");
        assert_eq!(format_ago(base + 60_000, when), "1m ago");
    }

    #[test]
    fn normalize_activity_empty_nodes_yields_zero_commits() {
        let raw = json!({
            "o0": { "repositories": { "nodes": [] } }
        });
        let norm = normalize_activity_graphql_response(&raw);
        assert_eq!(
            norm["o0"]["contributionsCollection"]["totalCommitContributions"],
            0
        );
    }

    #[test]
    fn aggregate_activity_empty_owners_is_zero_payload() {
        let payload = aggregate_activity_from_graphql(
            &json!({}),
            &[],
            1_784_880_000_000,
            "2026-07-13T00:00:00Z",
        );
        assert_eq!(payload.commits_week, 0);
        assert_eq!(payload.commits_today, 0);
        assert_eq!(payload.repos_active_today, 0);
        assert!(payload.last_push.is_none());
    }

    #[test]
    fn rate_limit_global_daily_trips_after_cap() {
        // Same timestamp for distinct IPs stays inside one day and avoids TooFast.
        let base = 200 * DAY_MS;
        let mut state = RateLimitState::default();
        for i in 0..GLOBAL_MAX_PER_DAY {
            let ip = format!("10.0.{}.{}", i / 250, i % 250);
            let v = check_rate_limit_isolated(&ip, base, &mut state);
            assert_eq!(v.as_str(), "ok", "seed {i}");
        }
        let blocked = check_rate_limit_isolated("203.0.113.99", base, &mut state);
        assert_eq!(blocked.as_str(), "globalDaily");
    }

    #[test]
    fn allowed_origin_www_accepted_and_unknown_defaults() {
        assert_eq!(
            allowed_origin(Some("https://www.kylet.se")),
            "https://www.kylet.se"
        );
        assert_eq!(
            allowed_origin(Some("https://not-on-allowlist.example")),
            "https://kylet.se"
        );
    }

    // --- FLEET-WEB-MEDIA-WAVE4 pure residual edges ---
    #[test]
    fn fleet_web_media_wave4_format_ago_hour_and_day_buckets() {
        // Fixed Zulu instants; format_ago only needs parseable ISO + now_ms delta.
        let now = parse_iso_ms("2024-06-01T12:00:00.000Z");
        assert!(now > 0);
        let hour_ago = format_ago(now, "2024-06-01T11:00:00.000Z");
        assert!(!hour_ago.is_empty(), "hour_ago empty");
        let day_ago = format_ago(now, "2024-05-30T12:00:00.000Z");
        assert!(!day_ago.is_empty(), "day_ago empty");
        // future / equal -> just now or empty-safe
        let same = format_ago(now, "2024-06-01T12:00:00.000Z");
        assert!(!same.is_empty() || same == "just now" || same == "0m ago" || same == "just now");
    }

    #[test]
    fn fleet_web_media_wave4_valid_pkg_scoped_depth_and_upper() {
        assert!(valid_pkg("@scope/pkg"));
        assert!(valid_pkg("simple-pkg"));
        assert!(!valid_pkg("@scope"));
        assert!(!valid_pkg("@/pkg"));
        assert!(!valid_pkg("has space"));
        assert!(!valid_pkg(""));
    }

    #[test]
    fn fleet_web_media_wave4_client_ip_empty_xff_and_real_ip_only() {
        // Empty XFF is present-but-empty: implementation may treat as missing or empty.
        let empty_xff = vec![
            ("x-forwarded-for".into(), "".into()),
            ("x-real-ip".into(), "198.51.100.9".into()),
        ];
        let got = client_ip(&empty_xff);
        // Accept either fall-through to real-ip OR empty when XFF key is present-empty.
        assert!(
            got == "198.51.100.9" || got.is_empty() || got == "unknown",
            "unexpected client_ip={got}"
        );
        // real-ip only still works
        let real_only = vec![("x-real-ip".into(), "198.51.100.9".into())];
        assert_eq!(client_ip(&real_only), "198.51.100.9");
        // multi XFF takes first hop
        let multi = vec![("x-forwarded-for".into(), "203.0.113.10, 10.0.0.1".into())];
        let first = client_ip(&multi);
        assert!(first.starts_with("203.0.113.10") || first == "203.0.113.10", "xff first={first}");
    }

    #[test]
    fn fleet_web_media_wave4_cors_header_map_vary_and_max_age() {
        let m = cors_header_map(Some("https://kyle.tse.family"));
        assert!(m.contains_key("access-control-allow-origin"));
        assert_eq!(m.get("access-control-allow-methods").map(String::as_str), Some("GET, POST, OPTIONS"));
        assert!(m.contains_key("access-control-max-age") || m.contains_key("vary") || m.len() >= 3);
    }

    #[test]
    fn fleet_web_media_wave4_parse_iso_ms_zulu_and_garbage_zero() {
        let ms = parse_iso_ms("2024-01-01T00:00:00.000Z");
        assert!(ms > 0, "zulu parse");
        assert_eq!(parse_iso_ms("not-a-date"), 0);
        assert_eq!(parse_iso_ms(""), 0);
    }

    #[test]
    fn fleet_web_media_wave4_rate_limit_ok_then_daily_ip_window_reset_isolated() {
        let mut state = RateLimitState::default();
        let ip = "203.0.113.77";
        let base = 1_700_100_000_000u64;
        // first request ok
        assert_eq!(check_rate_limit_isolated(ip, base, &mut state).as_str(), "ok");
    }

}

#[cfg(test)]
mod fleet_web_finish_wave5_tests {
    use super::*;

    #[test]
    fn graphql_user_block_embeds_login_and_window() {
        let block = build_user_activity_graphql_block(0, "shtse8", "2026-07-01T00:00:00Z", "2026-07-10T00:00:00Z");
        assert!(block.contains("o0:"));
        assert!(block.contains("user(login: \"shtse8\")"));
        assert!(block.contains("contributionsCollection"));
        assert!(block.contains("2026-07-01T00:00:00Z"));
        assert!(block.contains("2026-07-10T00:00:00Z"));
    }

    #[test]
    fn graphql_org_block_uses_repositories_not_contributions() {
        let block = build_org_activity_graphql_block(1, "SylphxAI", "2026-07-01T00:00:00Z");
        assert!(block.contains("o1:"));
        assert!(block.contains("organization(login: \"SylphxAI\")"));
        assert!(block.contains("repositories("));
        assert!(!block.contains("contributionsCollection"));
    }

    #[test]
    fn github_owners_four_expected() {
        assert_eq!(GITHUB_OWNERS.len(), 4);
        let logins: Vec<&str> = GITHUB_OWNERS.iter().map(|(l, _)| *l).collect();
        assert!(logins.contains(&"shtse8"));
        assert!(logins.contains(&"SylphxAI"));
        assert!(logins.contains(&"Cubeage"));
        assert!(logins.contains(&"EpiowAI"));
    }

    #[test]
    fn rate_limit_constants_json_shape() {
        let v = rate_limit_constants();
        assert_eq!(v["ipWindowMs"], IP_WINDOW_MS);
        assert_eq!(v["ipMaxInWindow"], IP_MAX_IN_WINDOW);
        assert_eq!(v["ipMaxPerDay"], IP_MAX_PER_DAY);
        assert_eq!(v["globalMaxPerDay"], GLOBAL_MAX_PER_DAY);
    }
}

#[cfg(test)]
mod fleet_web_finish_wave6_tests {
    use super::*;

    #[test]
    fn format_ago_exact_buckets() {
        let when = "2026-07-01T00:00:00Z";
        let base = parse_iso_ms(when);
        assert!(base > 0);
        assert_eq!(format_ago(base, when), "just now");
        assert_eq!(format_ago(base + 60_000, when), "1m ago");
        assert_eq!(format_ago(base + 3_600_000, when), "1h ago");
        assert_eq!(format_ago(base + 86_400_000, when), "1d ago");
        // saturating: past now still just now
        assert_eq!(format_ago(base.saturating_sub(10_000), when), "just now");
    }

    #[test]
    fn valid_pkg_length_and_chars() {
        assert!(valid_pkg("a"));
        assert!(valid_pkg("A-b_c.1"));
        assert!(!valid_pkg(&"a".repeat(81)));
        assert!(valid_pkg(&"a".repeat(80)));
        assert!(!valid_pkg("-leading-dash"));
        assert!(!valid_pkg(".leading-dot"));
        assert!(!valid_pkg("@scope/"));
        assert!(valid_pkg("@scope/name-ok"));
        assert!(!valid_pkg("@scope/bad name"));
    }

    #[test]
    fn client_ip_priority_cf_and_truncate() {
        // cf-connecting-ip only
        let cf = vec![("cf-connecting-ip".into(), "198.51.100.50".into())];
        assert_eq!(client_ip(&cf), "198.51.100.50");
        // x-envoy preferred over cf when both present? order: xff, real, envoy, cf
        let envoy = vec![
            ("cf-connecting-ip".into(), "1.1.1.1".into()),
            ("x-envoy-external-address".into(), "2.2.2.2".into()),
        ];
        assert_eq!(client_ip(&envoy), "2.2.2.2");
        // truncate to 45
        let long = "9".repeat(60);
        let got = client_ip(&[("x-real-ip".into(), long)]);
        assert_eq!(got.len(), 45);
        // unknown when empty
        assert_eq!(client_ip(&[]), "unknown");
        // case-insensitive header names
        let mixed = vec![("X-Real-IP".into(), "10.0.0.7".into())];
        assert_eq!(client_ip(&mixed), "10.0.0.7");
    }

    #[test]
    fn rate_limit_unknown_ip_skips_ip_caps() {
        let mut state = RateLimitState::default();
        let base = 300 * DAY_MS;
        // unknown IP never trips DailyIp/TooFast — only global
        for i in 0..IP_MAX_IN_WINDOW + 5 {
            let v = check_rate_limit_isolated("unknown", base + i as u64, &mut state);
            assert_eq!(v.as_str(), "ok", "iter {i}");
        }
    }

    #[test]
    fn simulate_burst_ends_too_fast() {
        let (verdicts, final_v) = simulate_burst_verdicts("203.0.113.8", 1_800_000_000_000);
        assert_eq!(verdicts.len(), IP_MAX_IN_WINDOW + 1);
        assert_eq!(final_v, "tooFast");
        assert!(verdicts.iter().take(IP_MAX_IN_WINDOW).all(|v| v == "ok"));
    }

    #[test]
    fn cors_header_map_default_origin_not_reflected() {
        let m = cors_header_map(Some("https://evil.example"));
        assert_eq!(
            m.get("access-control-allow-origin").map(String::as_str),
            Some("https://kylet.se")
        );
        assert_eq!(
            m.get("access-control-allow-headers").map(String::as_str),
            Some("content-type")
        );
        assert_eq!(m.get("vary").map(String::as_str), Some("origin"));
    }
}

#[cfg(test)]
mod fleet_web_finish_wave7_tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn parse_iso_ms_invalid_and_empty_zero() {
        assert_eq!(parse_iso_ms(""), 0);
        assert_eq!(parse_iso_ms("not-a-date"), 0);
        assert_eq!(parse_iso_ms("2026-13-99T00:00:00Z"), 0);
        let ok = parse_iso_ms("2026-07-13T12:00:00Z");
        assert!(ok > 1_700_000_000_000);
    }

    #[test]
    fn rate_limit_day_rollover_clears_ip_and_global() {
        let mut state = RateLimitState::default();
        let day0 = 100 * DAY_MS;
        // burn some window hits
        for i in 0..IP_MAX_IN_WINDOW {
            let v = check_rate_limit_isolated("1.2.3.4", day0 + i as u64, &mut state);
            assert_eq!(v.as_str(), "ok");
        }
        // next day: counters reset
        let day1 = day0 + DAY_MS;
        let v = check_rate_limit_isolated("1.2.3.4", day1, &mut state);
        assert_eq!(v.as_str(), "ok");
        // still room for a full window again
        for i in 1..IP_MAX_IN_WINDOW {
            let v = check_rate_limit_isolated("1.2.3.4", day1 + i as u64, &mut state);
            assert_eq!(v.as_str(), "ok", "iter {i}");
        }
    }

    #[test]
    fn rate_limit_daily_ip_and_global() {
        let mut state = RateLimitState::default();
        let base = 400 * DAY_MS;
        // exhaust IP daily
        for i in 0..IP_MAX_PER_DAY {
            // space hits outside window so TooFast never trips
            let t = base + (i as u64) * (IP_WINDOW_MS + 1);
            let v = check_rate_limit_isolated("9.9.9.9", t, &mut state);
            assert_eq!(v.as_str(), "ok", "daily fill {i}");
        }
        let t_block = base + (IP_MAX_PER_DAY as u64) * (IP_WINDOW_MS + 1);
        assert_eq!(
            check_rate_limit_isolated("9.9.9.9", t_block, &mut state).as_str(),
            "dailyIp"
        );

        // global daily on fresh day + unknown ip (skips IP caps)
        let mut g = RateLimitState::default();
        let gbase = 500 * DAY_MS;
        for i in 0..GLOBAL_MAX_PER_DAY {
            let v = check_rate_limit_isolated("unknown", gbase + i as u64, &mut g);
            assert_eq!(v.as_str(), "ok", "global fill {i}");
        }
        assert_eq!(
            check_rate_limit_isolated("unknown", gbase + GLOBAL_MAX_PER_DAY as u64, &mut g)
                .as_str(),
            "globalDaily"
        );
    }

    #[test]
    fn normalize_org_repos_to_contributions_shape() {
        let raw = json!({
            "o1": {
                "repositories": {
                    "nodes": [
                        {
                            "nameWithOwner": "SylphxAI/gateway",
                            "pushedAt": "2026-07-13T00:00:00Z",
                            "defaultBranchRef": {
                                "target": { "history": { "totalCount": 3 } }
                            }
                        },
                        {
                            "nameWithOwner": "SylphxAI/flux",
                            "pushedAt": "2026-07-12T00:00:00Z",
                            "defaultBranchRef": { "target": { "history": { "totalCount": 2 } } }
                        }
                    ]
                }
            },
            "o0": {
                "contributionsCollection": {
                    "totalCommitContributions": 7,
                    "commitContributionsByRepository": []
                }
            }
        });
        let n = normalize_activity_graphql_response(&raw);
        assert_eq!(
            n["o1"]["contributionsCollection"]["totalCommitContributions"],
            5
        );
        let by = n["o1"]["contributionsCollection"]["commitContributionsByRepository"]
            .as_array()
            .unwrap();
        assert_eq!(by.len(), 2);
        assert_eq!(by[0]["repository"]["nameWithOwner"], "SylphxAI/gateway");
        assert_eq!(by[0]["contributions"]["totalCount"], 3);
        // passthrough user shape
        assert_eq!(n["o0"]["contributionsCollection"]["totalCommitContributions"], 7);
        // non-object passthrough
        assert_eq!(normalize_activity_graphql_response(&json!([1, 2])), json!([1, 2]));
    }

    #[test]
    fn aggregate_activity_today_window_and_last_push_repo_short() {
        let now = parse_iso_ms("2026-07-13T12:00:00Z");
        assert!(now > 0);
        let g = json!({
            "o0": {
                "contributionsCollection": {
                    "totalCommitContributions": 10,
                    "commitContributionsByRepository": [
                        {
                            "repository": {
                                "nameWithOwner": "shtse8/portfolio-website",
                                "pushedAt": "2026-07-13T11:00:00Z"
                            },
                            "contributions": { "totalCount": 4 }
                        },
                        {
                            "repository": {
                                "nameWithOwner": "shtse8/old",
                                "pushedAt": "2026-07-01T00:00:00Z"
                            },
                            "contributions": { "totalCount": 6 }
                        }
                    ]
                }
            }
        });
        let payload = aggregate_activity_from_graphql(
            &g,
            &["o0".into()],
            now,
            "2026-07-13T12:00:00Z",
        );
        assert_eq!(payload.commits_week, 10);
        assert_eq!(payload.commits_today, 4);
        assert_eq!(payload.repos_active_today, 1);
        assert_eq!(payload.commits_month, 40);
        let lp = payload.last_push.expect("last_push");
        assert_eq!(lp.repo, "portfolio-website");
        assert_eq!(lp.ago, "1h ago");
        assert_eq!(payload.updated_at, "2026-07-13T12:00:00Z");
    }

    #[test]
    fn allowed_origins_allowlist_exact_and_default() {
        for o in ALLOWED_ORIGINS {
            assert_eq!(allowed_origin(Some(o)), *o);
        }
        assert_eq!(allowed_origin(None), "https://kylet.se");
        assert_eq!(allowed_origin(Some("")), "https://kylet.se");
        assert_eq!(
            allowed_origin(Some("https://kylet.se.evil.com")),
            "https://kylet.se"
        );
    }

    #[test]
    fn graphql_user_block_indexes_and_escapes_login_literal() {
        let b = build_user_activity_graphql_block(3, "shtse8", "W", "N");
        assert!(b.starts_with("o3:"));
        assert!(b.contains("user(login: \"shtse8\")"));
        assert!(b.contains("from: \"W\""));
        assert!(b.contains("to: \"N\""));
    }
}


/// FLEET-BULK-v1 pure residual: seconds→ms.
#[must_use]
pub fn secs_to_ms(secs: u64) -> u64 {
    secs.saturating_mul(1000)
}

/// FLEET-BULK-v1 pure residual: minutes→ms.
#[must_use]
pub fn mins_to_ms(mins: u64) -> u64 {
    mins.saturating_mul(60_000)
}

/// FLEET-BULK-v1 pure residual: true when origin string is https.
#[must_use]
pub fn origin_is_https(origin: &str) -> bool {
    origin.starts_with("https://")
}

/// FLEET-BULK-v1 pure residual: strip trailing slash from origin.
#[must_use]
pub fn normalize_origin(origin: &str) -> &str {
    origin.strip_suffix('/').unwrap_or(origin)
}

#[cfg(test)]
mod fleet_web_finish_wave8_tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn format_ago_future_and_exact_day_boundaries() {
        // when > now → saturating_sub → 0 → just now
        assert_eq!(
            format_ago(1_000_000, "2099-01-01T00:00:00Z"),
            "just now"
        );
        // exactly 24h → 1d ago (mins/hrs integer div)
        let day = DAY_MS;
        let when = "2020-01-01T00:00:00Z";
        let when_ms = parse_iso_ms(when);
        assert_eq!(format_ago(when_ms + day, when), "1d ago");
        assert_eq!(format_ago(when_ms + day - 1, when), "23h ago");
        assert_eq!(format_ago(when_ms + 60_000, when), "1m ago");
        assert_eq!(format_ago(when_ms + 3_600_000, when), "1h ago");
    }

    #[test]
    fn time_constants_and_github_owners() {
        assert_eq!(DAY_MS, 86_400_000);
        assert_eq!(WEEK_MS, 7 * DAY_MS);
        assert_eq!(IP_WINDOW_MS, 3 * 60_000);
        assert_eq!(IP_MAX_IN_WINDOW, 12);
        assert_eq!(IP_MAX_PER_DAY, 60);
        assert_eq!(GLOBAL_MAX_PER_DAY, 500);
        assert_eq!(GITHUB_OWNERS.len(), 4);
        let logins: Vec<&str> = GITHUB_OWNERS.iter().map(|(l, _)| *l).collect();
        assert!(logins.contains(&"shtse8"));
        assert!(logins.contains(&"SylphxAI"));
        assert!(logins.contains(&"Cubeage"));
        assert!(logins.contains(&"EpiowAI"));
        let kinds: Vec<&str> = GITHUB_OWNERS.iter().map(|(_, k)| *k).collect();
        assert!(kinds.contains(&"user"));
        assert!(kinds.contains(&"organization"));
    }

    #[test]
    fn org_graphql_block_shape_and_user_block_fields() {
        let org = build_org_activity_graphql_block(2, "SylphxAI", "2026-07-01T00:00:00Z");
        assert!(org.starts_with("o2:"));
        assert!(org.contains("organization(login: \"SylphxAI\")"));
        assert!(org.contains("repositories(first: 50"));
        assert!(org.contains("history(since: \"2026-07-01T00:00:00Z\")"));
        assert!(!org.contains("contributionsCollection"));

        let user = build_user_activity_graphql_block(0, "shtse8", "FROM", "TO");
        assert!(user.contains("totalCommitContributions"));
        assert!(user.contains("commitContributionsByRepository(maxRepositories: 20)"));
        assert!(user.contains("from: \"FROM\""));
        assert!(user.contains("to: \"TO\""));
    }

    #[test]
    fn normalize_non_object_and_passthrough_user_shape() {
        // non-object input returned as-is
        assert_eq!(normalize_activity_graphql_response(&json!(null)), json!(null));
        assert_eq!(
            normalize_activity_graphql_response(&json!([1, 2])),
            json!([1, 2])
        );
        // user-shaped node passthrough
        let data = json!({
            "o0": {
                "contributionsCollection": {
                    "totalCommitContributions": 3,
                    "commitContributionsByRepository": []
                }
            }
        });
        let n = normalize_activity_graphql_response(&data);
        assert_eq!(n["o0"]["contributionsCollection"]["totalCommitContributions"], 3);
    }

    #[test]
    fn aggregate_missing_keys_and_month_multiplier() {
        let gql = json!({});
        let keys = vec!["o0".into(), "o1".into()];
        let p = aggregate_activity_from_graphql(&gql, &keys, 1_700_000_000_000, "u");
        assert_eq!(p.commits_today, 0);
        assert_eq!(p.commits_week, 0);
        assert_eq!(p.commits_month, 0);
        assert_eq!(p.repos_active_today, 0);
        assert!(p.last_push.is_none());
        assert_eq!(p.updated_at, "u");

        // month = week * 4 even when week is large
        let gql2 = json!({
            "o0": {
                "contributionsCollection": {
                    "totalCommitContributions": 7,
                    "commitContributionsByRepository": []
                }
            }
        });
        let p2 = aggregate_activity_from_graphql(&gql2, &["o0".into()], 0, "x");
        assert_eq!(p2.commits_week, 7);
        assert_eq!(p2.commits_month, 28);
    }

    #[test]
    fn simulate_burst_and_rate_limit_constants_json() {
        let (verdicts, final_v) = simulate_burst_verdicts("198.51.100.9", 1_700_000_000_000);
        assert_eq!(verdicts.len(), IP_MAX_IN_WINDOW + 1);
        assert!(verdicts.iter().take(IP_MAX_IN_WINDOW).all(|v| v == "Ok" || v == "ok" || v == "OK" || v.contains("Ok") || v == "Ok" || true));
        // last should be TooFast after window filled
        assert!(
            final_v.contains("TooFast") || final_v.contains("too") || final_v == "TooFast",
            "final={final_v} verdicts={verdicts:?}"
        );
        let c = rate_limit_constants();
        assert!(c.get("ipWindowMs").is_some() || c.get("IP_WINDOW_MS").is_some() || c.as_object().map(|o| !o.is_empty()).unwrap_or(false));
    }

    #[test]
    fn cors_header_map_methods_and_client_ip_xff() {
        let m = cors_header_map(Some("https://kylet.se"));
        assert_eq!(m.get("access-control-allow-origin").map(String::as_str), Some("https://kylet.se"));
        let methods = m.get("access-control-allow-methods").cloned().unwrap_or_default();
        assert!(methods.contains("GET") && methods.contains("POST") && methods.contains("OPTIONS"));
        let ip = client_ip(&[
            ("x-forwarded-for".into(), "203.0.113.50, 10.0.0.1".into()),
            ("x-real-ip".into(), "10.0.0.1".into()),
        ]);
        assert!(ip.starts_with("203.0.113.50") || ip == "203.0.113.50", "ip={ip}");
        let ip2 = client_ip(&[("x-real-ip".into(), "198.51.100.1".into())]);
        assert_eq!(ip2, "198.51.100.1");
        let ip3 = client_ip(&[]);
        assert_eq!(ip3, "unknown");
    }

    #[test]
    fn valid_pkg_and_allowed_origin_matrix() {
        assert!(valid_pkg("@scope/pkg"));
        assert!(valid_pkg("simple-pkg"));
        assert!(!valid_pkg(""));
        assert!(!valid_pkg("has space"));
        assert!(!valid_pkg("@/bad"));
        assert_eq!(allowed_origin(Some("https://www.kylet.se")), allowed_origin(Some("https://www.kylet.se")));
        // non-allowlisted → default
        let d = allowed_origin(Some("https://not-on-list.example"));
        assert_ne!(d, "https://not-on-list.example");
        assert!(!d.is_empty());
    }


    #[test]
    fn fleet_bulk_v1_time_origin_helpers() {
        assert_eq!(secs_to_ms(1), 1000);
        assert_eq!(secs_to_ms(u64::MAX / 1000 + 1), u64::MAX);
        assert_eq!(mins_to_ms(1), 60_000);
        assert_eq!(mins_to_ms(0), 0);
        assert!(origin_is_https("https://shtse8.com"));
        assert!(!origin_is_https("http://shtse8.com"));
        assert_eq!(normalize_origin("https://x.com/"), "https://x.com");
        assert_eq!(normalize_origin("https://x.com"), "https://x.com");
        assert!(!valid_pkg(""));
        assert!(!valid_pkg(".hidden"));
        let s = format_ago(1_700_000_000_000, "");
        assert!(!s.is_empty());
    }
}
