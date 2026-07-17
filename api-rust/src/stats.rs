use crate::upstream;
use reqwest::Client;
use serde::Serialize;
use std::env;
use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const STATS_TTL_MS: u64 = 10 * 60 * 1000;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StatsPayload {
    pub github_stars: u64,
    pub npm_downloads: u64,
    pub flagship_stars: u64,
    pub flagship_downloads: u64,
    pub by_owner: std::collections::HashMap<String, u64>,
    pub repos: u64,
    pub updated_at: String,
}

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

const NPM_PACKAGES: &[&str] = &[
    "@sylphx/pdf-reader-mcp",
    "@sylphx/coderag",
    "@sylphx/flow",
    "@sylphx/silk",
    "@sylphx/craft",
    "@sylphx/rapid",
    "@sylphx/spectra",
    "@shtse8/filesystem-mcp",
    "@shtse8/pdf-reader-mcp",
    "@shtse8/cursor-ai-downloads",
];

const FLAGSHIP_REPO: &str = "SylphxAI/pdf-reader-mcp";
const FLAGSHIP_NPM: &str = "@sylphx/pdf-reader-mcp";

static CACHE: std::sync::OnceLock<Mutex<Option<(u64, StatsPayload)>>> = std::sync::OnceLock::new();

fn cache() -> &'static Mutex<Option<(u64, StatsPayload)>> {
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
        .post(upstream::github_graphql_url())
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

async fn fetch_github_stars() -> Result<(u64, std::collections::HashMap<String, u64>, u64), String> {
    let blocks: String = GITHUB_OWNERS
        .iter()
        .enumerate()
        .map(|(i, o)| {
            if o.kind == "user" {
                format!(
                    // Include owned forks so notable personal tools (e.g. Google-Photos-Delete-Tool)
                    // count toward portfolio star totals.
                    "o{i}: user(login: \"{}\") {{ repositories(ownerAffiliations: OWNER, first: 100, orderBy: {{ field: STARGAZERS, direction: DESC }}) {{ totalCount nodes {{ stargazerCount isFork }} }} }}",
                    o.login
                )
            } else {
                format!(
                    "o{i}: organization(login: \"{}\") {{ repositories(first: 100, isFork: false, orderBy: {{ field: STARGAZERS, direction: DESC }}) {{ totalCount nodes {{ stargazerCount }} }} }}",
                    o.login
                )
            }
        })
        .collect::<Vec<_>>()
        .join("\n");
    let data = github_graphql(&format!("{{ {blocks} }}")).await?;
    let mut by_owner = std::collections::HashMap::new();
    let mut total = 0u64;
    let mut repos = 0u64;
    for (i, o) in GITHUB_OWNERS.iter().enumerate() {
        let conn = data
            .get(format!("o{i}"))
            .and_then(|v| v.get("repositories"));
        let stars: u64 = conn
            .and_then(|c| c.get("nodes"))
            .and_then(|n| n.as_array())
            .map(|nodes| {
                nodes
                    .iter()
                    .filter(|n| {
                        // Orgs: isFork not present → keep. User: keep non-forks + notable forks (≥30★).
                        let is_fork = n.get("isFork").and_then(|v| v.as_bool()).unwrap_or(false);
                        if !is_fork {
                            return true;
                        }
                        n.get("stargazerCount")
                            .and_then(|s| s.as_u64())
                            .unwrap_or(0)
                            >= 30
                    })
                    .filter_map(|n| n.get("stargazerCount").and_then(|s| s.as_u64()))
                    .sum()
            })
            .unwrap_or(0);
        by_owner.insert(o.login.to_string(), stars);
        total += stars;
        repos += conn
            .and_then(|c| c.get("totalCount"))
            .and_then(|t| t.as_u64())
            .unwrap_or(0);
    }
    Ok((total, by_owner, repos))
}

async fn npm_monthly(pkg: &str) -> u64 {
    let url = upstream::npm_url(&format!(
        "/downloads/point/last-month/{}",
        pkg.replace('@', "%40").replace('/', "%2F")
    ));
    match client().get(&url).send().await {
        Ok(res) if res.status().is_success() => res
            .json::<serde_json::Value>()
            .await
            .ok()
            .and_then(|v| v.get("downloads").and_then(|d| d.as_u64()))
            .unwrap_or(0),
        _ => 0,
    }
}

async fn fetch_npm_downloads() -> (u64, u64) {
    let mut total = 0u64;
    let mut flagship = 0u64;
    for (i, pkg) in NPM_PACKAGES.iter().enumerate() {
        let n = npm_monthly(pkg).await;
        total += n;
        if *pkg == FLAGSHIP_NPM {
            flagship = n;
        } else if flagship == 0 && i == 0 {
            // placeholder until flagship found
        }
    }
    (total, flagship)
}

async fn fetch_flagship_stars() -> u64 {
    let token = env::var("GITHUB_TOKEN").ok();
    let mut req = client()
        .get(upstream::github_rest_url(&format!("/repos/{FLAGSHIP_REPO}")))
        .header("user-agent", "kylet-api-rust");
    if let Some(t) = token {
        req = req.header("authorization", format!("bearer {t}"));
    }
    match req.send().await {
        Ok(res) if res.status().is_success() => res
            .json::<serde_json::Value>()
            .await
            .ok()
            .and_then(|v| v.get("stargazers_count").and_then(|s| s.as_u64()))
            .unwrap_or(0),
        _ => 0,
    }
}

async fn compute_stats() -> Result<StatsPayload, String> {
    let (gh_total, by_owner, repos) = fetch_github_stars().await?;
    let (npm_total, npm_flagship) = fetch_npm_downloads().await;
    let flagship_stars = fetch_flagship_stars().await;
    Ok(StatsPayload {
        github_stars: gh_total,
        npm_downloads: npm_total,
        flagship_stars: if flagship_stars > 0 {
            flagship_stars
        } else {
            *by_owner.get("SylphxAI").unwrap_or(&0)
        },
        flagship_downloads: npm_flagship,
        by_owner,
        repos,
        updated_at: iso_now(),
    })
}

pub fn iso_now() -> String {
    time::OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
}

pub fn cached_snapshot() -> Option<StatsPayload> {
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < STATS_TTL_MS {
                return Some(data.clone());
            }
        }
    }
    None
}

pub async fn get_stats() -> Result<StatsPayload, String> {
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < STATS_TTL_MS {
                return Ok(data.clone());
            }
        }
    }
    let data = compute_stats().await?;
    if let Ok(mut guard) = cache().lock() {
        *guard = Some((now, data.clone()));
    }
    Ok(data)
}



#[doc(hidden)]
pub fn reset_cache_for_tests() {
    if let Ok(mut guard) = cache().lock() {
        *guard = None;
    }
}
