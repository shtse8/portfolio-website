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
        // Never invent month as week×4. True 30d landings come from Control Plane
        // public series when CP_PUBLIC_BASE is configured; legacy GraphQL path has
        // no honest 30d default-branch SHA series here.
        commits_month: 0,
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