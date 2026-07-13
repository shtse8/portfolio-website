use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;
use std::time::Duration;
use kylet_api_rust::chat_messages::{sanitize_repo_name, urlencoding_encode};

const GH_OWNERS: &[&str] = &["shtse8", "SylphxAI", "Cubeage", "EpiowAI"];
const UPSTREAM_TIMEOUT: Duration = Duration::from_secs(8);
const REPOS_TTL_MS: u64 = 5 * 60 * 1000;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RepoSummary {
    pub repo: String,
    pub name: String,
    pub owner: String,
    pub stars: u64,
    pub forks: u64,
    pub description: Option<String>,
    pub language: Option<String>,
    pub topics: Vec<String>,
    pub homepage: Option<String>,
    pub url: String,
    pub pushed: String,
    pub pushed_at: String,
}

#[derive(Debug, Deserialize)]
struct GhRepo {
    full_name: Option<String>,
    name: Option<String>,
    owner: Option<GhOwner>,
    stargazers_count: Option<u64>,
    forks_count: Option<u64>,
    description: Option<String>,
    language: Option<String>,
    topics: Option<Vec<String>>,
    homepage: Option<String>,
    html_url: Option<String>,
    pushed_at: Option<String>,
    fork: Option<bool>,
    archived: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct GhOwner {
    login: Option<String>,
}

static REPOS_CACHE: std::sync::OnceLock<std::sync::Mutex<Option<(u64, Vec<RepoSummary>)>>> =
    std::sync::OnceLock::new();

fn repos_cache() -> &'static std::sync::Mutex<Option<(u64, Vec<RepoSummary>)>> {
    REPOS_CACHE.get_or_init(|| std::sync::Mutex::new(None))
}

fn client() -> Client {
    Client::builder()
        .timeout(UPSTREAM_TIMEOUT)
        .build()
        .unwrap_or_else(|_| Client::new())
}

fn gh_token() -> Option<String> {
    env::var("GITHUB_TOKEN").ok().filter(|t| !t.is_empty())
}

fn to_summary(r: GhRepo) -> RepoSummary {
    let full = r.full_name.unwrap_or_default();
    let owner = r
        .owner
        .and_then(|o| o.login)
        .or_else(|| full.split('/').next().map(str::to_string))
        .unwrap_or_default();
    let pushed_at = r.pushed_at.unwrap_or_default();
    RepoSummary {
        repo: full.clone(),
        name: r.name.unwrap_or_else(|| full.split('/').nth(1).unwrap_or("").to_string()),
        owner,
        stars: r.stargazers_count.unwrap_or(0),
        forks: r.forks_count.unwrap_or(0),
        description: r.description,
        language: r.language,
        topics: r.topics.unwrap_or_default(),
        homepage: r.homepage.filter(|h| !h.is_empty()),
        url: r.html_url.unwrap_or_default(),
        pushed: pushed_at.chars().take(10).collect(),
        pushed_at,
    }
}

async fn gh_get(path: &str) -> Result<reqwest::Response, reqwest::Error> {
    let mut req = client().get(format!("https://api.github.com{path}")).header(
        "user-agent",
        "kylet-api-rust",
    );
    if let Some(token) = gh_token() {
        req = req.header("authorization", format!("bearer {token}"));
    }
    req.send().await
}

pub async fn list_all_repos() -> Vec<RepoSummary> {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0);

    if let Ok(guard) = repos_cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < REPOS_TTL_MS {
                return data.clone();
            }
        }
    }

    let mut out = Vec::new();
    for owner in GH_OWNERS {
        if let Ok(res) = gh_get(&format!("/users/{owner}/repos?per_page=100&sort=updated&type=owner")).await
        {
            if res.status().is_success() {
                if let Ok(raw) = res.json::<Vec<GhRepo>>().await {
                    out.extend(
                        raw.into_iter()
                            .filter(|r| !r.fork.unwrap_or(false) && !r.archived.unwrap_or(false))
                            .map(to_summary),
                    );
                }
            }
        }
    }

    if !out.is_empty() {
        if let Ok(mut guard) = repos_cache().lock() {
            *guard = Some((now, out.clone()));
        }
    }
    out
}

pub async fn list_projects(limit: usize) -> Vec<RepoSummary> {
    let lim = limit.clamp(1, 40);
    let mut repos: Vec<_> = list_all_repos()
        .await
        .into_iter()
        .filter(|r| r.stars > 0 || r.description.as_ref().is_some_and(|d| !d.is_empty()))
        .collect();
    repos.sort_by_key(|b| std::cmp::Reverse(b.stars));
    repos.truncate(lim);
    repos
}

pub async fn get_repo_detail(name_raw: &str) -> Option<RepoSummary> {
    let Some(raw) = sanitize_repo_name(name_raw) else {
        return None;
    };
    for owner in GH_OWNERS {
        if let Ok(res) = gh_get(&format!("/repos/{owner}/{raw}")).await {
            if res.status().is_success() {
                if let Ok(repo) = res.json::<GhRepo>().await {
                    return Some(to_summary(repo));
                }
            }
        }
    }
    None
}

pub async fn recent_activity(limit: usize) -> Vec<RepoSummary> {
    let lim = limit.clamp(1, 12);
    let mut repos: Vec<_> = list_all_repos()
        .await
        .into_iter()
        .filter(|r| !r.pushed_at.is_empty())
        .collect();
    repos.sort_by(|a, b| b.pushed_at.cmp(&a.pushed_at));
    repos.truncate(lim);
    repos
}

pub async fn search_projects(query: &str) -> Vec<RepoSummary> {
    let q = query.to_lowercase();
    let terms: Vec<_> = q.split_whitespace().filter(|t| !t.is_empty()).collect();
    if terms.is_empty() {
        return Vec::new();
    }
    let mut scored: Vec<_> = list_all_repos()
        .await
        .into_iter()
        .map(|r| {
            let hay = format!(
                "{} {} {} {}",
                r.name,
                r.description.as_deref().unwrap_or(""),
                r.topics.join(" "),
                r.language.as_deref().unwrap_or("")
            )
            .to_lowercase();
            let score = terms.iter().filter(|t| hay.contains(*t)).count();
            (r, score)
        })
        .filter(|(_, score)| *score > 0)
        .collect();
    scored.sort_by(|(a, sa), (b, sb)| sb.cmp(sa).then_with(|| b.stars.cmp(&a.stars)));
    scored.truncate(6);
    scored.into_iter().map(|(r, _)| r).collect()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NpmDay {
    pub day: String,
    pub downloads: u64,
}

pub async fn npm_range(pkg: &str) -> Vec<NpmDay> {
    let url = format!(
        "https://api.npmjs.org/downloads/range/last-month/{}",
        urlencoding_encode(pkg)
    );
    match client().get(&url).send().await {
        Ok(res) if res.status().is_success() => res
            .json::<serde_json::Value>()
            .await
            .ok()
            .and_then(|v| {
                serde_json::from_value::<Vec<NpmDay>>(v.get("downloads")?.clone()).ok()
            })
            .unwrap_or_default(),
        _ => Vec::new(),
    }
}

// urlencoding_encode: pure SSOT in kylet_api_rust::chat_messages

#[cfg(test)]
mod tests {
    use kylet_api_rust::chat_messages::sanitize_repo_name;

    #[test]
    fn repo_name_validation_matches_bun_sanitization() {
        assert!(sanitize_repo_name("../../etc").is_some());
        assert!(sanitize_repo_name("valid-repo").is_some());
        assert!(sanitize_repo_name("").is_none());
        assert!(sanitize_repo_name("has spaces").is_none());
    }
}
