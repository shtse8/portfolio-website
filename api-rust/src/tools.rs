use crate::upstream;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;
use std::time::Duration;

#[derive(Clone, Copy)]
enum GithubOwnerKind {
    User,
    Organization,
}

#[derive(Clone, Copy)]
struct GithubOwnerConfig {
    login: &'static str,
    kind: GithubOwnerKind,
}

const GH_OWNERS: &[GithubOwnerConfig] = &[
    GithubOwnerConfig {
        login: "shtse8",
        kind: GithubOwnerKind::User,
    },
    GithubOwnerConfig {
        login: "SylphxAI",
        kind: GithubOwnerKind::Organization,
    },
    GithubOwnerConfig {
        login: "Cubeage",
        kind: GithubOwnerKind::Organization,
    },
    GithubOwnerConfig {
        login: "EpiowAI",
        kind: GithubOwnerKind::Organization,
    },
    GithubOwnerConfig {
        login: "OzyrixLtd",
        kind: GithubOwnerKind::Organization,
    },
];
const UPSTREAM_TIMEOUT: Duration = Duration::from_secs(8);
/// `/repo` probes every candidate owner concurrently, so this budget bounds the
/// whole lookup rather than one request. It must stay under the edge timeout
/// that produced the observed 504s (nginx/Envoy answer a visitor in ~5 s).
const REPO_PROBE_TIMEOUT: Duration = Duration::from_secs(3);
/// Owners that host a known repo, tried before the general owner list so a
/// deep link resolves on the first (concurrent) probe rather than the last.
const KNOWN_REPO_OWNERS: &[(&str, &str)] = &[("pdf-reader-mcp", "SylphxAI")];
const REPOS_TTL_MS: u64 = 5 * 60 * 1000;
/// Owned forks with real portfolio signal (e.g. Google-Photos-Delete-Tool).
const NOTABLE_FORK_STARS: u64 = 30;

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
    private: Option<bool>,
    visibility: Option<String>,
}

fn is_public_repo(r: &GhRepo) -> bool {
    crate::github_visibility::is_explicitly_public(r.private, r.visibility.as_deref())
}

fn keep_live_repo(r: &GhRepo) -> bool {
    if !is_public_repo(r) || r.archived.unwrap_or(false) {
        return false;
    }
    let stars = r.stargazers_count.unwrap_or(0);
    if r.fork.unwrap_or(false) {
        // Notable personal forks stay in the live /projects feed.
        let name = r.name.as_deref().unwrap_or("");
        return stars >= NOTABLE_FORK_STARS
            || name.eq_ignore_ascii_case("Google-Photos-Delete-Tool");
    }
    true
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

/// One process-wide HTTP client (N2). `reqwest::Client` is an `Arc` handle
/// over a connection pool: reusing it is a refcount bump, whereas building a
/// fresh one per owner re-binds the TLS root store and spends ~0.1 s of the
/// request budget inside the walk's own deadline. The timeout is unchanged;
/// only the construction cost moves out of the walk.
static HTTP_CLIENT: std::sync::OnceLock<Client> = std::sync::OnceLock::new();

fn client() -> Client {
    HTTP_CLIENT
        .get_or_init(|| {
            Client::builder()
                .timeout(UPSTREAM_TIMEOUT)
                .build()
                .unwrap_or_else(|_| Client::new())
        })
        .clone()
}

fn gh_token() -> Option<String> {
    env::var("GITHUB_TOKEN").ok().filter(|t| !t.is_empty())
}

fn to_public_summary(r: GhRepo) -> Option<RepoSummary> {
    if !is_public_repo(&r) {
        return None;
    }
    let full = r.full_name.unwrap_or_default();
    let owner = r
        .owner
        .and_then(|o| o.login)
        .or_else(|| full.split('/').next().map(str::to_string))
        .unwrap_or_default();
    let pushed_at = r.pushed_at.unwrap_or_default();
    Some(RepoSummary {
        repo: full.clone(),
        name: r
            .name
            .unwrap_or_else(|| full.split('/').nth(1).unwrap_or("").to_string()),
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
    })
}

fn owner_repos_path(owner: GithubOwnerConfig) -> String {
    match owner.kind {
        GithubOwnerKind::User => format!(
            "/users/{}/repos?per_page=100&sort=updated&type=owner",
            owner.login
        ),
        GithubOwnerKind::Organization => format!(
            "/orgs/{}/repos?per_page=100&sort=updated&type=public",
            owner.login
        ),
    }
}

async fn gh_get(path: &str) -> Result<reqwest::Response, reqwest::Error> {
    let mut req = client()
        .get(upstream::github_rest_url(path))
        .header("user-agent", "kylet-api-rust");
    if let Some(token) = gh_token() {
        req = req.header("authorization", format!("bearer {token}"));
    }
    req.send().await
}

fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

/// Portfolio inventory plus the wall-clock time (ms since epoch) at which the
/// payload was actually observed. A cache hit reports the time of the *fetch*,
/// not the time of the response — the honest `verifiedAt` source for
/// `/projects` and `/recent`, mirroring how `/stats` reports the payload's own
/// `updated_at`.
pub async fn list_all_repos_with_observed_at() -> (Vec<RepoSummary>, u64) {
    let now = now_ms();

    if let Ok(guard) = repos_cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < REPOS_TTL_MS {
                return (data.clone(), *at);
            }
        }
    }

    // Probe every owner concurrently. The previous sequential walk spent one
    // 8 s client timeout per owner (5 x 8 s), so a hanging upstream outlived the
    // edge timeout five times over; the request budget now bounds the whole walk
    // to one deadline. `join_all` preserves the owner order, so the assembled
    // payload is identical to the sequential walk — only the wall time changes.
    let fetches = GH_OWNERS.iter().map(|owner| {
        let owner = *owner;
        async move {
            match gh_get(&owner_repos_path(owner)).await {
                Ok(res) if res.status().is_success() => res.json::<Vec<GhRepo>>().await.ok(),
                _ => None,
            }
        }
    });
    let mut out = Vec::new();
    for raw in futures::future::join_all(fetches).await.into_iter().flatten() {
        out.extend(
            raw.into_iter()
                .filter(keep_live_repo)
                .filter_map(to_public_summary),
        );
    }

    if !out.is_empty() {
        if let Ok(mut guard) = repos_cache().lock() {
            *guard = Some((now, out.clone()));
        }
    }
    (out, now)
}

pub async fn list_all_repos() -> Vec<RepoSummary> {
    list_all_repos_with_observed_at().await.0
}

/// `/projects` plus the observation time of the payload it was derived from.
pub async fn list_projects_with_observed_at(limit: usize) -> (Vec<RepoSummary>, u64) {
    let lim = limit.clamp(1, 80);
    let (all, observed_ms) = list_all_repos_with_observed_at().await;
    let mut repos: Vec<_> = all
        .into_iter()
        .filter(|r| r.stars > 0 || r.description.as_ref().is_some_and(|d| !d.is_empty()))
        .collect();
    repos.sort_by_key(|b| std::cmp::Reverse(b.stars));
    repos.truncate(lim);
    (repos, observed_ms)
}

pub async fn list_projects(limit: usize) -> Vec<RepoSummary> {
    list_projects_with_observed_at(limit).await.0
}

/// Outcome of a single-repo lookup, so callers can tell "no such public
/// repository" from "the upstream did not answer".
pub enum RepoLookup {
    Found(Box<RepoSummary>),
    NotFound,
    UpstreamUnavailable(String),
}

fn valid_repo_segment(raw: &str) -> bool {
    !raw.is_empty()
        && raw.len() <= 100
        && raw
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
}

fn valid_owner_segment(raw: &str) -> bool {
    !raw.is_empty()
        && raw.len() <= 100
        && raw
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
}

/// Candidate owners for a lookup: an explicit `?owner=` wins (one probe), a
/// known-repo owner comes next, then the portfolio owners.
fn candidate_owners(owner: Option<&str>, repo: &str) -> Vec<String> {
    if let Some(explicit) = owner.map(str::trim).filter(|o| !o.is_empty()) {
        return if valid_owner_segment(explicit) {
            vec![explicit.to_string()]
        } else {
            Vec::new()
        };
    }
    let mut out: Vec<String> = KNOWN_REPO_OWNERS
        .iter()
        .filter(|(name, _)| name.eq_ignore_ascii_case(repo))
        .map(|(_, login)| (*login).to_string())
        .collect();
    for owner in GH_OWNERS {
        if !out.iter().any(|o| o.eq_ignore_ascii_case(owner.login)) {
            out.push(owner.login.to_string());
        }
    }
    out
}

/// Probe one owner for one repository. `Ok(None)` means the upstream answered
/// and the repo is absent or not provably public; `Err` means it did not answer.
async fn probe_repo(owner: &str, repo: &str) -> Result<Option<RepoSummary>, String> {
    let client = Client::builder()
        .timeout(REPO_PROBE_TIMEOUT)
        .build()
        .unwrap_or_else(|_| Client::new());
    let mut req = client
        .get(upstream::github_rest_url(&format!("/repos/{owner}/{repo}")))
        .header("user-agent", "kylet-api-rust");
    if let Some(token) = gh_token() {
        req = req.header("authorization", format!("bearer {token}"));
    }
    let res = req
        .send()
        .await
        .map_err(|e| format!("github repo transport: {e}"))?;
    match res.status().as_u16() {
        200 => {
            let repo: GhRepo = res
                .json()
                .await
                .map_err(|e| format!("github repo decode: {e}"))?;
            Ok(to_public_summary(repo))
        }
        404 => Ok(None),
        // 401/403 (credential/visibility proof unavailable) and 5xx/429 are
        // "the upstream did not answer", not "this repo does not exist".
        status => Err(format!("github repo {status}")),
    }
}

/// Single-repo lookup under the explicit-public publication authority. Owners
/// are probed concurrently so the visitor-visible answer cannot time out the
/// way the previous sequential probe did.
pub async fn get_repo_detail_in(owner: Option<&str>, name_raw: &str) -> RepoLookup {
    let raw = name_raw.trim().trim_start_matches(['/', '.']);
    let raw = raw.rsplit('/').next().unwrap_or(raw).to_string();
    if !valid_repo_segment(&raw) {
        return RepoLookup::NotFound;
    }
    let owners = candidate_owners(owner, &raw);
    if owners.is_empty() {
        return RepoLookup::NotFound;
    }
    let probes = owners.iter().map(|o| probe_repo(o, &raw));
    let outcomes = futures::future::join_all(probes).await;
    let mut answered_absent = false;
    let mut unavailable = String::new();
    for outcome in outcomes {
        match outcome {
            Ok(Some(summary)) => return RepoLookup::Found(Box::new(summary)),
            Ok(None) => answered_absent = true,
            Err(err) => unavailable = err,
        }
    }
    // A 404 is authoritative only for the owner that produced it. A probe that
    // errored (401/403/5xx/429, or a transport failure) leaves an unresolved
    // candidate owner, so the sweep must not claim "repo not found" while the
    // owner that actually hosts the repo may simply have refused to answer.
    // UpstreamUnavailable therefore wins over any answered-absent 404s.
    if !unavailable.is_empty() {
        RepoLookup::UpstreamUnavailable(unavailable)
    } else if answered_absent {
        RepoLookup::NotFound
    } else {
        RepoLookup::UpstreamUnavailable("no candidate owner".to_string())
    }
}

pub async fn get_repo_detail(name_raw: &str) -> Option<RepoSummary> {
    match get_repo_detail_in(None, name_raw).await {
        RepoLookup::Found(repo) => Some(*repo),
        RepoLookup::NotFound | RepoLookup::UpstreamUnavailable(_) => None,
    }
}

/// `/recent` plus the observation time of the payload it was derived from.
pub async fn recent_activity_with_observed_at(limit: usize) -> (Vec<RepoSummary>, u64) {
    let lim = limit.clamp(1, 12);
    let (all, observed_ms) = list_all_repos_with_observed_at().await;
    let mut repos: Vec<_> = all
        .into_iter()
        .filter(|r| !r.pushed_at.is_empty())
        .collect();
    repos.sort_by(|a, b| b.pushed_at.cmp(&a.pushed_at));
    repos.truncate(lim);
    (repos, observed_ms)
}

pub async fn recent_activity(limit: usize) -> Vec<RepoSummary> {
    recent_activity_with_observed_at(limit).await.0
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

/// Map short repo/package names visitors and the agent naturally use to the
/// scoped npm package that actually exists. Unscoped `pdf-reader-mcp` returns
/// empty from the registry; `@sylphx/pdf-reader-mcp` is the live package.
const NPM_PKG_ALIASES: &[(&str, &str)] = &[
    ("pdf-reader-mcp", "@sylphx/pdf-reader-mcp"),
    ("filesystem-mcp", "@sylphx/filesystem-mcp"),
    ("coderag", "@sylphx/coderag"),
    ("flow", "@sylphx/flow"),
    ("silk", "@sylphx/silk"),
    ("craft", "@sylphx/craft"),
    ("rapid", "@sylphx/rapid"),
    ("cursor-ai-downloads", "@shtse8/cursor-ai-downloads"),
];

/// Resolve a visitor/agent package argument to the registry package name.
#[must_use]
pub fn resolve_npm_pkg(pkg: &str) -> String {
    let trimmed = pkg.trim();
    for (alias, full) in NPM_PKG_ALIASES {
        if trimmed.eq_ignore_ascii_case(alias) {
            return (*full).to_string();
        }
    }
    trimmed.to_string()
}

pub async fn npm_range(pkg: &str) -> Vec<NpmDay> {
    let pkg = resolve_npm_pkg(pkg);
    // Enforce the contract pkg rule on every entry point (REST handler AND
    // chat tool) — never forward unvalidated package names upstream.
    if !crate::contract::valid_pkg(&pkg) {
        return Vec::new();
    }
    let url = upstream::npm_url(&format!(
        "/downloads/range/last-month/{}",
        urlencoding_encode(&pkg)
    ));
    match client().get(&url).send().await {
        Ok(res) if res.status().is_success() => res
            .json::<serde_json::Value>()
            .await
            .ok()
            .and_then(|v| serde_json::from_value::<Vec<NpmDay>>(v.get("downloads")?.clone()).ok())
            .unwrap_or_default(),
        _ => Vec::new(),
    }
}

fn urlencoding_encode(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            'A'..='Z' | 'a'..='z' | '0'..='9' | '-' | '_' | '.' | '~' => c.to_string(),
            _ => format!("%{:02X}", c as u8),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::resolve_npm_pkg;

    #[test]
    fn repo_name_validation_matches_bun_sanitization() {
        // Bun strips to the last path segment before validating.
        assert!(get_repo_detail_sync_name("../../etc"));
        assert!(get_repo_detail_sync_name("valid-repo"));
        assert!(!get_repo_detail_sync_name(""));
        assert!(!get_repo_detail_sync_name("has spaces"));
    }

    #[test]
    fn npm_pkg_aliases_map_flagship_unscoped_names() {
        assert_eq!(resolve_npm_pkg("pdf-reader-mcp"), "@sylphx/pdf-reader-mcp");
        assert_eq!(
            resolve_npm_pkg("@sylphx/pdf-reader-mcp"),
            "@sylphx/pdf-reader-mcp"
        );
        assert_eq!(resolve_npm_pkg("coderag"), "@sylphx/coderag");
    }

    fn get_repo_detail_sync_name(name: &str) -> bool {
        let raw = name
            .trim()
            .trim_start_matches(|c: char| c == '/' || c == '.');
        let raw = raw.rsplit('/').next().unwrap_or(raw);
        raw.chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
            && !raw.is_empty()
            && raw.len() <= 100
    }
}

#[doc(hidden)]
pub fn reset_repos_cache_for_tests() {
    if let Ok(mut guard) = repos_cache().lock() {
        *guard = None;
    }
}
