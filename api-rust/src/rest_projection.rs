//! REST JSON projections for static-site `fetch` — the single public contract
//! surface (ADR-169). No proto/Connect layer exists; these shapes are the SSOT
//! for the browser BFF.

use crate::contract::ActivityPayload;
use crate::stats::StatsPayload;
use crate::tools::{NpmDay, RepoSummary};
use serde_json::{json, Map, Value};

pub fn stats_json(payload: &StatsPayload) -> Value {
    let mut by_owner = Map::new();
    for (k, v) in &payload.by_owner {
        by_owner.insert(k.clone(), json!(v));
    }
    json!({
        "githubStars": payload.github_stars,
        "npmDownloads": payload.npm_downloads,
        "flagshipStars": payload.flagship_stars,
        "flagshipDownloads": payload.flagship_downloads,
        "byOwner": by_owner,
        "repos": payload.repos,
        "updatedAt": payload.updated_at,
        "verifiedAt": payload.updated_at,
        "freshness": "live",
        "stale": false,
        "source": "github-public",
        "repositoryVisibility": crate::contract::PUBLIC_STATS_REVISION,
    })
}

pub fn stats_json_stale(payload: &StatsPayload) -> Value {
    let mut v = stats_json(payload);
    if let Some(obj) = v.as_object_mut() {
        obj.insert("stale".to_string(), Value::Bool(true));
        obj.insert("freshness".to_string(), Value::String("stale".into()));
        obj.insert("verifiedAt".to_string(), json!(payload.updated_at));
        obj.insert("source".to_string(), Value::String("github-public-stale".into()));
    }
    v
}

/// No verified measurement exists at all. The honest answer is an explicit
/// `absent` payload with a null `verifiedAt` — never fabricated zeros, and
/// never a gateway error shown to a visitor. The visibility attestation stays
/// because the payload carries no repository fact to fence.
pub fn stats_json_absent() -> Value {
    json!({
        "githubStars": Value::Null,
        "npmDownloads": Value::Null,
        "flagshipStars": Value::Null,
        "flagshipDownloads": Value::Null,
        "byOwner": {},
        "repos": Value::Null,
        "updatedAt": crate::stats::iso_now(),
        "verifiedAt": Value::Null,
        "freshness": "absent",
        "stale": true,
        "source": "github-public-absent",
        "repositoryVisibility": crate::contract::PUBLIC_STATS_REVISION,
    })
}

pub fn activity_json(payload: &ActivityPayload) -> Value {
    let mut obj = Map::new();
    obj.insert("commitsToday".into(), json!(payload.commits_today));
    obj.insert("commitsWeek".into(), json!(payload.commits_week));
    obj.insert("commitsMonth".into(), json!(payload.commits_month));
    obj.insert("reposActiveToday".into(), json!(payload.repos_active_today));
    obj.insert("updatedAt".into(), json!(payload.updated_at));
    if let Some(ref lp) = payload.last_push {
        obj.insert("lastPush".into(), json!({ "repo": lp.repo, "ago": lp.ago }));
    } else {
        obj.insert("lastPush".into(), Value::Null);
    }
    if let Some(stale) = payload.stale {
        obj.insert("stale".into(), Value::Bool(stale));
    }
    if let Some(ref freshness) = payload.freshness {
        obj.insert("freshness".into(), Value::String(freshness.clone()));
    }
    if let Some(ref source) = payload.source {
        obj.insert("source".into(), Value::String(source.clone()));
    }
    if let Some(ref rev) = payload.projection_revision {
        obj.insert("projectionRevision".into(), Value::String(rev.clone()));
    }
    Value::Object(obj)
}

/// No verified activity measurement exists. Counts are null (not zero) and the
/// projection revision attestation stays, because nothing repository-derived
/// is present to fence.
pub fn activity_json_absent() -> Value {
    json!({
        "commitsToday": Value::Null,
        "commitsWeek": Value::Null,
        "commitsMonth": Value::Null,
        "reposActiveToday": Value::Null,
        "lastPush": Value::Null,
        "updatedAt": crate::stats::iso_now(),
        "verifiedAt": Value::Null,
        "freshness": "absent",
        "stale": true,
        "source": "github-public-absent",
        "projectionRevision": crate::contract::PUBLIC_ACTIVITY_PROJECTION_REVISION,
    })
}

pub fn activity_json_stale(payload: &ActivityPayload) -> Value {
    let mut marked = payload.clone();
    marked.stale = Some(true);
    if marked.freshness.is_none() {
        marked.freshness = Some("stale".into());
    }
    if marked.source.is_none() {
        marked.source = Some("control-plane-stale".into());
    }
    activity_json(&marked)
}

fn repo_json(repo: &RepoSummary) -> Value {
    json!({
        "repo": repo.repo,
        "name": repo.name,
        "owner": repo.owner,
        "stars": repo.stars,
        "forks": repo.forks,
        "description": repo.description,
        "language": repo.language,
        "topics": repo.topics,
        "homepage": repo.homepage,
        "url": repo.url,
        "pushed": repo.pushed,
        "pushedAt": repo.pushed_at,
    })
}

/// List projections carry the same honesty ladder as `/stats`: an empty list is
/// `absent` (nothing verifiably public was measured), a non-empty list is
/// `live`, and the visibility attestation always travels with it.
///
/// `observed_at` must be the payload's own observation time, not the response
/// time: `verifiedAt` claims when the data was actually measured, so a cached
/// list served after the upstream died must keep its original timestamp.
pub fn list_projects_json(projects: &[RepoSummary], observed_at: &str) -> Value {
    let freshness = if projects.is_empty() { "absent" } else { "live" };
    json!({
        "projects": projects.iter().map(repo_json).collect::<Vec<_>>(),
        "updatedAt": observed_at,
        "verifiedAt": if projects.is_empty() { Value::Null } else { json!(observed_at) },
        "freshness": freshness,
        "stale": projects.is_empty(),
        "repositoryVisibility": crate::contract::PUBLIC_STATS_REVISION,
    })
}

pub fn list_recent_json(recent: &[RepoSummary], observed_at: &str) -> Value {
    let freshness = if recent.is_empty() { "absent" } else { "live" };
    json!({
        "recent": recent.iter().map(repo_json).collect::<Vec<_>>(),
        "updatedAt": observed_at,
        "verifiedAt": if recent.is_empty() { Value::Null } else { json!(observed_at) },
        "freshness": freshness,
        "stale": recent.is_empty(),
        "repositoryVisibility": crate::contract::PUBLIC_STATS_REVISION,
    })
}

pub fn get_repo_json(repo: &RepoSummary, updated_at: &str) -> Value {
    json!({
        "repo": repo_json(repo),
        "updatedAt": updated_at,
        "verifiedAt": updated_at,
        "freshness": "live",
        "stale": false,
        "source": "github-public",
        "repositoryVisibility": crate::contract::PUBLIC_STATS_REVISION,
    })
}

/// `/repo` could not reach the upstream. The repo is explicitly `null` — never a
/// substituted or guessed repository — and the answer is still a valid 200.
pub fn repo_absent_json() -> Value {
    json!({
        "repo": Value::Null,
        "updatedAt": crate::stats::iso_now(),
        "verifiedAt": Value::Null,
        "freshness": "absent",
        "stale": true,
        "source": "github-public-absent",
        "reason": "github upstream unavailable",
        "repositoryVisibility": crate::contract::PUBLIC_STATS_REVISION,
    })
}

pub fn downloads_json(pkg: &str, series: &[NpmDay], total: u64, updated_at: &str) -> Value {
    json!({
        "pkg": pkg,
        "series": series
            .iter()
            .map(|d| json!({ "day": d.day, "downloads": d.downloads }))
            .collect::<Vec<_>>(),
        "total": total,
        "updatedAt": updated_at,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn stats_json_uses_camel_case_contract_keys() {
        let payload = StatsPayload {
            github_stars: 1,
            npm_downloads: 2,
            flagship_stars: 3,
            flagship_downloads: 4,
            by_owner: std::collections::HashMap::from([("shtse8".to_string(), 1)]),
            repos: 5,
            updated_at: "2026-08-09T00:00:00Z".to_string(),
        };
        let v = stats_json(&payload);
        assert!(v.get("githubStars").is_some());
        assert!(v.get("npmDownloads").is_some());
        assert!(v.get("byOwner").is_some());
        assert!(v.get("github_stars").is_none());
        assert_eq!(v["freshness"], "live");
        assert_eq!(v["verifiedAt"], "2026-08-09T00:00:00Z");
        assert_eq!(v["stale"], false);
    }
}
