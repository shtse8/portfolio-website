//! REST JSON projections for static-site `fetch` (derived edge, not product wire authority).
//! Product wire authority is buffa + connectrpc (technology-stack-profile).

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
    })
}

pub fn stats_json_stale(payload: &StatsPayload) -> Value {
    let mut v = stats_json(payload);
    if let Some(obj) = v.as_object_mut() {
        obj.insert("stale".to_string(), Value::Bool(true));
    }
    v
}

pub fn activity_json(payload: &ActivityPayload) -> Value {
    let mut obj = Map::new();
    obj.insert("commitsToday".into(), json!(payload.commits_today));
    obj.insert("commitsWeek".into(), json!(payload.commits_week));
    obj.insert("commitsMonth".into(), json!(payload.commits_month));
    obj.insert("reposActiveToday".into(), json!(payload.repos_active_today));
    obj.insert("updatedAt".into(), json!(payload.updated_at));
    if let Some(ref lp) = payload.last_push {
        obj.insert(
            "lastPush".into(),
            json!({ "repo": lp.repo, "ago": lp.ago }),
        );
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

pub fn list_projects_json(projects: &[RepoSummary], updated_at: &str) -> Value {
    json!({
        "projects": projects.iter().map(repo_json).collect::<Vec<_>>(),
        "updatedAt": updated_at,
    })
}

pub fn list_recent_json(recent: &[RepoSummary], updated_at: &str) -> Value {
    json!({
        "recent": recent.iter().map(repo_json).collect::<Vec<_>>(),
        "updatedAt": updated_at,
    })
}

pub fn get_repo_json(repo: &RepoSummary, updated_at: &str) -> Value {
    json!({
        "repo": repo_json(repo),
        "updatedAt": updated_at,
    })
}

pub fn downloads_json(pkg: &str, series: &[NpmDay], total: u64, updated_at: &str) -> Value {
    json!({
        "pkg": pkg,
        "series": series.iter().map(|d| json!({ "day": d.day, "downloads": d.downloads })).collect::<Vec<_>>(),
        "total": total,
        "updatedAt": updated_at,
    })
}

#[derive(Debug, Clone)]
pub struct AgentToolDefinition {
    pub name: String,
    pub description: String,
}

#[derive(Debug, Clone)]
pub struct AgentToolCatalog {
    pub tools: Vec<AgentToolDefinition>,
}

/// Catalog matches retired Bun `AGENT_TOOLS` names/descriptions.
pub fn agent_tool_catalog() -> AgentToolCatalog {
    AgentToolCatalog {
        tools: vec![
            AgentToolDefinition {
                name: "list_projects".into(),
                description: "List Kyle's top projects by live GitHub stars.".into(),
            },
            AgentToolDefinition {
                name: "get_repo".into(),
                description: "Get live details for a specific repository.".into(),
            },
            AgentToolDefinition {
                name: "recent_activity".into(),
                description: "Show Kyle's most recently shipped repos.".into(),
            },
            AgentToolDefinition {
                name: "search_projects".into(),
                description: "Search Kyle's repos by keyword.".into(),
            },
            AgentToolDefinition {
                name: "npm_downloads".into(),
                description: "Get npm download counts for a package.".into(),
            },
        ],
    }
}


#[derive(Debug, Clone)]
pub struct StreamChatPart {
    pub r#type: String,
    pub text: String,
}

#[derive(Debug, Clone)]
pub struct StreamChatMessage {
    pub role: String,
    pub parts: Vec<StreamChatPart>,
}

#[derive(Debug, Clone)]
pub struct StreamChatRequestView {
    pub messages: Vec<StreamChatMessage>,
}

/// Parse browser chat body (REST projection of StreamChatRequest).
/// Product stream authority remains REST SSE; this is contract shape validation only.
pub fn parse_stream_chat_request(value: &Value) -> Option<StreamChatRequestView> {
    let obj = value.as_object()?;
    let messages = obj.get("messages")?.as_array()?;
    if messages.is_empty() {
        return None;
    }
    let mut out = Vec::new();
    for m in messages {
        let mo = m.as_object()?;
        let role = mo.get("role")?.as_str()?.to_string();
        let parts_v = mo.get("parts")?.as_array()?;
        let mut parts = Vec::new();
        for p in parts_v {
            let po = p.as_object()?;
            parts.push(StreamChatPart {
                r#type: po.get("type")?.as_str()?.to_string(),
                text: po.get("text").and_then(|t| t.as_str()).unwrap_or("").to_string(),
            });
        }
        out.push(StreamChatMessage { role, parts });
    }
    Some(StreamChatRequestView { messages: out })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn stats_json_uses_camel_case_contract_keys() {
        let payload = StatsPayload {
            github_stars: 1,
            npm_downloads: 2,
            flagship_stars: 3,
            flagship_downloads: 4,
            by_owner: HashMap::from([("SylphxAI".into(), 9)]),
            repos: 5,
            updated_at: "2026-01-01T00:00:00Z".into(),
        };
        let v = stats_json(&payload);
        assert_eq!(v["githubStars"], 1);
        assert_eq!(v["npmDownloads"], 2);
        assert_eq!(v["byOwner"]["SylphxAI"], 9);
        assert_eq!(v["updatedAt"], "2026-01-01T00:00:00Z");
    }

    #[test]
    fn agent_tool_catalog_matches_bun_surface() {
        let catalog = agent_tool_catalog();
        let names: Vec<_> = catalog.tools.iter().map(|t| t.name.as_str()).collect();
        assert_eq!(
            names,
            vec![
                "list_projects",
                "get_repo",
                "recent_activity",
                "search_projects",
                "npm_downloads"
            ]
        );
    }
}
