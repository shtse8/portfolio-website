use crate::contract::{
    aggregate_activity_from_graphql, build_org_activity_graphql_block,
    build_user_activity_graphql_block, normalize_activity_graphql_response, ActivityPayload,
    GITHUB_OWNERS, WEEK_MS,
};
use crate::upstream;
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

fn github_token() -> Result<String, String> {
    let token = env::var("GITHUB_TOKEN").map_err(|_| "GITHUB_TOKEN not set".to_string())?;
    if token.is_empty() {
        return Err("GITHUB_TOKEN empty".to_string());
    }
    Ok(token)
}

pub async fn github_graphql(query: &str) -> Result<serde_json::Value, String> {
    let token = github_token()?;
    let res = client()
        .post(upstream::github_graphql_url())
        .header("authorization", format!("bearer {token}"))
        .header("content-type", "application/json")
        .header("user-agent", "kylet-api-rust")
        .json(&serde_json::json!({ "query": query }))
        .send()
        .await
        .map_err(|e| format!("github graphql transport: {e}"))?;
    let status = res.status();
    if !status.is_success() {
        let body = res.text().await.unwrap_or_default();
        return Err(format!(
            "github graphql http {status}: {}",
            body.chars().take(200).collect::<String>()
        ));
    }
    let body: serde_json::Value = res
        .json()
        .await
        .map_err(|e| format!("github graphql decode: {e}"))?;
    if let Some(errors) = body.get("errors") {
        return Err(format!(
            "github graphql errors: {}",
            errors.to_string().chars().take(300).collect::<String>()
        ));
    }
    body.get("data")
        .cloned()
        .ok_or_else(|| "github graphql missing data".to_string())
}

fn iso_now() -> String {
    time::OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
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

pub fn build_activity_graphql_query(week_start: &str, now_iso: &str) -> String {
    let blocks: String = GITHUB_OWNERS
        .iter()
        .enumerate()
        .map(|(i, (login, kind))| {
            if *kind == "organization" {
                build_org_activity_graphql_block(i, login, week_start)
            } else {
                build_user_activity_graphql_block(i, login, week_start, now_iso)
            }
        })
        .collect::<Vec<_>>()
        .join("\n");
    format!("{{ {blocks} }}")
}

/// Control Plane public projection base (anonymous). When set, owns activity authority.
fn cp_public_base() -> Option<String> {
    env::var("CP_PUBLIC_BASE")
        .or_else(|_| env::var("CONTROL_PLANE_PUBLIC_BASE"))
        .ok()
        .map(|s| s.trim().trim_end_matches('/').to_string())
        .filter(|s| !s.is_empty())
}

fn cp_public_slug() -> String {
    env::var("CP_PUBLIC_PROFILE_SLUG").unwrap_or_else(|_| "kyle".into())
}

async fn compute_activity_from_cp() -> Result<ActivityPayload, String> {
    let base = cp_public_base().ok_or_else(|| "CP_PUBLIC_BASE unset".to_string())?;
    let slug = cp_public_slug();
    let url = format!("{base}/api/public/v1/profiles/{slug}/summary");
    let client = Client::builder()
        .timeout(Duration::from_secs(8))
        .build()
        .map_err(|e| e.to_string())?;
    let res = client
        .get(&url)
        .header("accept", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        return Err(format!("cp public summary status {}", res.status()));
    }
    let v: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    let c = v
        .pointer("/summary/commits_landed")
        .cloned()
        .unwrap_or(serde_json::json!({}));
    let today = c.get("today").and_then(|x| x.as_u64()).unwrap_or(0);
    let week = c.get("d7").and_then(|x| x.as_u64()).unwrap_or(0);
    let month = c.get("d30").and_then(|x| x.as_u64()).unwrap_or(0);
    let projects = v
        .pointer("/summary/projects_active/count")
        .and_then(|x| x.as_u64())
        .unwrap_or(0);
    Ok(ActivityPayload {
        commits_today: today,
        commits_week: week,
        commits_month: month,
        repos_active_today: projects,
        last_push: None,
        updated_at: v
            .get("as_of")
            .and_then(|x| x.as_str())
            .unwrap_or("")
            .to_string(),
    })
}

pub async fn compute_activity() -> Result<ActivityPayload, String> {
    // Prefer Control Plane public projection (primary development-activity authority).
    if cp_public_base().is_some() {
        match compute_activity_from_cp().await {
            Ok(data) => return Ok(data),
            Err(err) => {
                tracing::warn!(
                    error = %err,
                    "CP public activity failed; falling back to legacy GitHub GraphQL path"
                );
            }
        }
    }
    let now = now_ms();
    let week_start = iso_from_ms(now.saturating_sub(WEEK_MS));
    let now_iso = iso_now();
    let query = build_activity_graphql_query(&week_start, &now_iso);
    let data = github_graphql(&query).await?;
    let normalized = normalize_activity_graphql_response(&data);
    let owner_keys: Vec<String> = (0..GITHUB_OWNERS.len()).map(|i| format!("o{i}")).collect();
    Ok(aggregate_activity_from_graphql(
        &normalized,
        &owner_keys,
        now,
        &iso_now(),
    ))
}

pub async fn get_activity() -> Result<ActivityPayload, String> {
    let now = now_ms();
    let stale = cache()
        .lock()
        .ok()
        .and_then(|guard| guard.as_ref().map(|(_, data)| data.clone()));

    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < activity_ttl_ms() {
                return Ok(data.clone());
            }
        }
    }

    match compute_activity().await {
        Ok(data) => {
            if let Ok(mut guard) = cache().lock() {
                *guard = Some((now, data.clone()));
            }
            Ok(data)
        }
        Err(err) => {
            if let Some(cached) = stale {
                tracing::warn!(
                    error = %err,
                    upstream = "github_graphql",
                    route = "/activity",
                    "activity upstream failed; serving stale cache"
                );
                return Ok(cached);
            }
            Err(err)
        }
    }
}

#[doc(hidden)]
pub fn cached_snapshot() -> Option<ActivityPayload> {
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

#[doc(hidden)]
pub fn reset_cache_for_tests() {
    if let Ok(mut guard) = cache().lock() {
        *guard = None;
    }
}

#[cfg(test)]
mod tests {
    use super::build_activity_graphql_query;

    #[test]
    fn activity_query_uses_user_contributions_for_users_only() {
        let query = build_activity_graphql_query("2026-07-01T00:00:00Z", "2026-07-10T00:00:00Z");
        assert!(query.contains("o0: user(login: \"shtse8\")"));
        assert!(query.contains("contributionsCollection(from: \"2026-07-01T00:00:00Z\""));
        assert!(!query.contains("organization(login: \"shtse8\")"));
    }

    #[test]
    fn activity_query_uses_org_repositories_not_contributions_collection() {
        let query = build_activity_graphql_query("2026-07-01T00:00:00Z", "2026-07-10T00:00:00Z");
        assert!(query.contains("o1: organization(login: \"SylphxAI\")"));
        assert!(query.contains("repositories(first: 50"));
        let org_section = query.split("o1: organization").nth(1).expect("org section");
        assert!(!org_section.contains("contributionsCollection"));
    }
}