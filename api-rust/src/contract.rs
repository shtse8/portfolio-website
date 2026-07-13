//! REST JSON projections derived from generated protobuf types (ADR-167).

use crate::activity::ActivityPayload;
use crate::proto::portfolio::v1::{
    AgentToolCatalog, AgentToolDefinition, GetActivityResponse, GetDownloadsResponse,
    GetRepoResponse, GetStatsResponse, LastPush as ProtoLastPush, ListProjectsResponse,
    ListRecentResponse, NpmDay as ProtoNpmDay, RepoSummary as ProtoRepoSummary,
    StreamChatRequest,
};
use crate::stats::StatsPayload;
use crate::tools::{NpmDay, RepoSummary};
use serde_json::{json, Value};

pub fn stats_response(payload: &StatsPayload) -> GetStatsResponse {
    GetStatsResponse {
        github_stars: payload.github_stars,
        npm_downloads: payload.npm_downloads,
        flagship_stars: payload.flagship_stars,
        flagship_downloads: payload.flagship_downloads,
        by_owner: payload.by_owner.clone(),
        repos: payload.repos,
        updated_at: payload.updated_at.clone(),
    }
}

pub fn stats_json(payload: &StatsPayload) -> Value {
    serde_json::to_value(stats_response(payload)).unwrap_or_else(|_| json!({}))
}

pub fn stats_json_stale(payload: &StatsPayload) -> Value {
    let mut v = stats_json(payload);
    if let Some(obj) = v.as_object_mut() {
        obj.insert("stale".to_string(), Value::Bool(true));
    }
    v
}

pub fn activity_response(payload: &ActivityPayload) -> GetActivityResponse {
    GetActivityResponse {
        commits_today: payload.commits_today,
        commits_week: payload.commits_week,
        commits_month: payload.commits_month,
        repos_active_today: payload.repos_active_today,
        last_push: payload.last_push.as_ref().map(|lp| ProtoLastPush {
            repo: lp.repo.clone(),
            ago: lp.ago.clone(),
        }),
        updated_at: payload.updated_at.clone(),
    }
}

pub fn activity_json(payload: &ActivityPayload) -> Value {
    serde_json::to_value(activity_response(payload)).unwrap_or_else(|_| json!({}))
}

pub fn activity_json_stale(payload: &ActivityPayload) -> Value {
    let mut v = activity_json(payload);
    if let Some(obj) = v.as_object_mut() {
        obj.insert("stale".to_string(), Value::Bool(true));
    }
    v
}

fn repo_proto(repo: &RepoSummary) -> ProtoRepoSummary {
    ProtoRepoSummary {
        repo: repo.repo.clone(),
        name: repo.name.clone(),
        owner: repo.owner.clone(),
        stars: repo.stars,
        forks: repo.forks,
        description: repo.description.clone(),
        language: repo.language.clone(),
        topics: repo.topics.clone(),
        homepage: repo.homepage.clone(),
        url: repo.url.clone(),
        pushed: repo.pushed.clone(),
        pushed_at: repo.pushed_at.clone(),
    }
}

pub fn list_projects_json(projects: &[RepoSummary], updated_at: &str) -> Value {
    let msg = ListProjectsResponse {
        projects: projects.iter().map(repo_proto).collect(),
        updated_at: updated_at.to_string(),
    };
    serde_json::to_value(msg).unwrap_or_else(|_| json!({}))
}

pub fn list_recent_json(recent: &[RepoSummary], updated_at: &str) -> Value {
    let msg = ListRecentResponse {
        recent: recent.iter().map(repo_proto).collect(),
        updated_at: updated_at.to_string(),
    };
    serde_json::to_value(msg).unwrap_or_else(|_| json!({}))
}

pub fn get_repo_json(repo: &RepoSummary, updated_at: &str) -> Value {
    let msg = GetRepoResponse {
        repo: Some(repo_proto(repo)),
        updated_at: updated_at.to_string(),
    };
    serde_json::to_value(msg).unwrap_or_else(|_| json!({}))
}

pub fn downloads_json(pkg: &str, series: &[NpmDay], total: u64, updated_at: &str) -> Value {
    let msg = GetDownloadsResponse {
        pkg: pkg.to_string(),
        series: series
            .iter()
            .map(|d| ProtoNpmDay {
                day: d.day.clone(),
                downloads: d.downloads,
            })
            .collect(),
        total,
        updated_at: updated_at.to_string(),
    };
    serde_json::to_value(msg).unwrap_or_else(|_| json!({}))
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

pub fn parse_stream_chat_request(value: &Value) -> Option<StreamChatRequest> {
    serde_json::from_value(value.clone()).ok()
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
