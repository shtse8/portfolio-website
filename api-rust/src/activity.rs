use reqwest::Client;
use serde::Serialize;
use std::env;
use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const ACTIVITY_TTL_MS: u64 = 90 * 1000;
const DAY_MS: u64 = 86_400_000;
const WEEK_MS: u64 = 7 * DAY_MS;

struct GithubOwner {
    login: &'static str,
    kind: &'static str,
}

const GITHUB_OWNERS: &[GithubOwner] = &[
    GithubOwner {
        login: "shtse8",
        kind: "user",
    },
    GithubOwner {
        login: "SylphxAI",
        kind: "organization",
    },
    GithubOwner {
        login: "Cubeage",
        kind: "organization",
    },
    GithubOwner {
        login: "EpiowAI",
        kind: "organization",
    },
];

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LastPush {
    pub repo: String,
    pub ago: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ActivityPayload {
    pub commits_today: u64,
    pub commits_week: u64,
    pub commits_month: u64,
    pub repos_active_today: u64,
    pub last_push: Option<LastPush>,
    pub updated_at: String,
}

static CACHE: std::sync::OnceLock<Mutex<Option<(u64, ActivityPayload)>>> =
    std::sync::OnceLock::new();

fn cache() -> &'static Mutex<Option<(u64, ActivityPayload)>> {
    CACHE.get_or_init(|| Mutex::new(None))
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

async fn github_graphql(query: &str) -> Result<serde_json::Value, String> {
    let token = env::var("GITHUB_TOKEN").map_err(|_| "GITHUB_TOKEN not set".to_string())?;
    let res = client()
        .post("https://api.github.com/graphql")
        .header("authorization", format!("bearer {token}"))
        .header("content-type", "application/json")
        .header("user-agent", "kylet-api-rust")
        .json(&serde_json::json!({ "query": query }))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        return Err(format!("github graphql {}", res.status()));
    }
    let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    if let Some(errors) = body.get("errors") {
        return Err(format!(
            "github graphql: {}",
            errors.to_string().chars().take(200).collect::<String>()
        ));
    }
    body.get("data")
        .cloned()
        .ok_or_else(|| "missing data".to_string())
}

fn format_ago(now: u64, when: &str) -> String {
    let when_ms = chrono_like_parse(when);
    let diff = now.saturating_sub(when_ms);
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

fn chrono_like_parse(iso: &str) -> u64 {
    time::OffsetDateTime::parse(iso, &time::format_description::well_known::Rfc3339)
        .ok()
        .map(|dt| (dt.unix_timestamp_nanos() / 1_000_000) as u64)
        .unwrap_or(0)
}

fn iso_now() -> String {
    time::OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
}

async fn compute_activity() -> Result<ActivityPayload, String> {
    let now = now_ms();
    let week_start = iso_from_ms(now.saturating_sub(WEEK_MS));
    let now_iso = iso_now();

    let blocks: String = GITHUB_OWNERS
        .iter()
        .enumerate()
        .map(|(i, o)| {
            let entity = if o.kind == "organization" {
                "organization"
            } else {
                "user"
            };
            format!(
                "o{i}: {entity}(login: \"{}\") {{
          contributionsCollection(from: \"{week_start}\", to: \"{now_iso}\") {{
            totalCommitContributions
            commitContributionsByRepository(maxRepositories: 20) {{
              repository {{ nameWithOwner pushedAt }}
              contributions {{ totalCount }}
            }}
          }}
        }}",
                o.login
            )
        })
        .collect::<Vec<_>>()
        .join("\n");

    let data = github_graphql(&format!("{{ {blocks} }}")).await?;

    let mut commits_today = 0u64;
    let mut commits_week = 0u64;
    let mut repos_active_today = std::collections::HashSet::new();
    let mut last_push: Option<(String, String)> = None;

    for (i, _) in GITHUB_OWNERS.iter().enumerate() {
        let cc = data
            .get(format!("o{i}"))
            .and_then(|v| v.get("contributionsCollection"));
        let Some(cc) = cc else { continue };

        commits_week += cc
            .get("totalCommitContributions")
            .and_then(|v| v.as_u64())
            .unwrap_or(0);

        let by_repo = cc
            .get("commitContributionsByRepository")
            .and_then(|v| v.as_array());

        if let Some(entries) = by_repo {
            for entry in entries {
                let repo = entry
                    .get("repository")
                    .and_then(|r| r.get("nameWithOwner"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let count = entry
                    .get("contributions")
                    .and_then(|c| c.get("totalCount"))
                    .and_then(|v| v.as_u64())
                    .unwrap_or(0);
                let pushed_at = entry
                    .get("repository")
                    .and_then(|r| r.get("pushedAt"))
                    .and_then(|v| v.as_str());

                if let Some(pushed_at) = pushed_at {
                    let ts = chrono_like_parse(pushed_at);
                    if now.saturating_sub(ts) < DAY_MS {
                        repos_active_today.insert(repo.to_string());
                        commits_today += count;
                    }
                    if last_push.as_ref().is_none_or(|(_, when)| ts > chrono_like_parse(when)) {
                        last_push = Some((repo.to_string(), pushed_at.to_string()));
                    }
                }
            }
        }
    }

    let last_push_display = last_push.map(|(repo, when)| {
        let short = repo.split('/').nth(1).unwrap_or(&repo).to_string();
        LastPush {
            repo: short,
            ago: format_ago(now, &when),
        }
    });

    Ok(ActivityPayload {
        commits_today,
        commits_week,
        commits_month: commits_week.saturating_mul(4),
        repos_active_today: repos_active_today.len() as u64,
        last_push: last_push_display,
        updated_at: iso_now(),
    })
}

fn iso_from_ms(ms: u64) -> String {
    let secs = (ms / 1000) as i64;
    time::OffsetDateTime::from_unix_timestamp(secs)
        .ok()
        .and_then(|dt| {
            dt.format(&time::format_description::well_known::Rfc3339)
                .ok()
        })
        .unwrap_or_else(|| "1970-01-01T00:00:00Z".to_string())
}

pub fn cached_snapshot() -> Option<ActivityPayload> {
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < ACTIVITY_TTL_MS {
                return Some(data.clone());
            }
        }
    }
    None
}

pub async fn get_activity() -> Result<ActivityPayload, String> {
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < ACTIVITY_TTL_MS {
                return Ok(data.clone());
            }
        }
    }
    let data = compute_activity().await?;
    if let Ok(mut guard) = cache().lock() {
        *guard = Some((now, data.clone()));
    }
    Ok(data)
}