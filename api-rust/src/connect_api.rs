#![allow(refining_impl_trait)]
//! Native Connect PortfolioApiService — buffa + connectrpc product wire densify.
//! REST routes remain derived projections for static-site `fetch` (ADR-168).

use std::sync::Arc;

use connectrpc::{ConnectError, ErrorCode, RequestContext, Response, ServiceRequest, ServiceResult};

use crate::activity;
use crate::proto::portfolio::v1::{
    ChatRequest, ChatResponse, ChatToolFunction, GetActivityRequest, GetActivityResponse,
    GetDownloadsRequest, GetDownloadsResponse, GetHealthRequest, GetHealthResponse, GetRepoRequest,
    GetRepoResponse, GetStatsRequest, GetStatsResponse, LastPush, ListChatToolsRequest,
    ListChatToolsResponse, ListProjectsRequest, ListProjectsResponse, ListRecentRequest,
    ListRecentResponse, NpmDay, PortfolioApiService, RepoSummary,
};
use crate::stats;
use crate::tools;

#[derive(Clone, Default)]
pub struct PortfolioConnectService;

impl PortfolioConnectService {
    pub fn new() -> Self {
        Self
    }
}

fn repo_to_proto(repo: &tools::RepoSummary) -> RepoSummary {
    RepoSummary {
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
        ..Default::default()
    }
}

fn iso_now() -> String {
    stats::iso_now()
}

impl PortfolioApiService for PortfolioConnectService {
    async fn get_health(
        &self,
        _ctx: RequestContext,
        _request: ServiceRequest<'_, GetHealthRequest>,
    ) -> ServiceResult<GetHealthResponse> {
        Ok(Response::new(GetHealthResponse {
            status: "ok".into(),
            ..Default::default()
        }))
    }

    async fn get_stats(
        &self,
        _ctx: RequestContext,
        _request: ServiceRequest<'_, GetStatsRequest>,
    ) -> ServiceResult<GetStatsResponse> {
        let data = stats::get_stats().await.map_err(|e| {
            ConnectError::new(ErrorCode::Unavailable, format!("stats_unavailable:{e}"))
        })?;
        Ok(Response::new(GetStatsResponse {
            github_stars: data.github_stars,
            npm_downloads: data.npm_downloads,
            flagship_stars: data.flagship_stars,
            flagship_downloads: data.flagship_downloads,
            by_owner: data.by_owner.into_iter().collect(),
            repos: data.repos,
            updated_at: data.updated_at,
            ..Default::default()
        }))
    }

    async fn get_activity(
        &self,
        _ctx: RequestContext,
        _request: ServiceRequest<'_, GetActivityRequest>,
    ) -> ServiceResult<GetActivityResponse> {
        let data = activity::get_activity().await.map_err(|e| {
            ConnectError::new(ErrorCode::Unavailable, format!("activity_unavailable:{e}"))
        })?;
        Ok(Response::new(GetActivityResponse {
            commits_today: data.commits_today,
            commits_week: data.commits_week,
            commits_month: data.commits_month,
            repos_active_today: data.repos_active_today,
            last_push: data
                .last_push
                .map(|lp| LastPush {
                    repo: lp.repo,
                    ago: lp.ago,
                    ..Default::default()
                })
                .into(),
            updated_at: data.updated_at,
            ..Default::default()
        }))
    }

    async fn list_projects(
        &self,
        _ctx: RequestContext,
        request: ServiceRequest<'_, ListProjectsRequest>,
    ) -> ServiceResult<ListProjectsResponse> {
        let limit = if request.limit == 0 {
            12usize
        } else {
            request.limit as usize
        };
        let projects = tools::list_projects(limit).await;
        Ok(Response::new(ListProjectsResponse {
            projects: projects.iter().map(repo_to_proto).collect(),
            updated_at: iso_now(),
            ..Default::default()
        }))
    }

    async fn get_repo(
        &self,
        _ctx: RequestContext,
        request: ServiceRequest<'_, GetRepoRequest>,
    ) -> ServiceResult<GetRepoResponse> {
        let name = request.name.trim();
        if name.is_empty() {
            return Err(ConnectError::new(ErrorCode::InvalidArgument, "name_required"));
        }
        let Some(repo) = tools::get_repo_detail(name).await else {
            return Err(ConnectError::new(ErrorCode::NotFound, "repo_not_found"));
        };
        Ok(Response::new(GetRepoResponse {
            repo: Some(repo_to_proto(&repo)).into(),
            updated_at: iso_now(),
            ..Default::default()
        }))
    }

    async fn list_recent(
        &self,
        _ctx: RequestContext,
        request: ServiceRequest<'_, ListRecentRequest>,
    ) -> ServiceResult<ListRecentResponse> {
        let limit = if request.limit == 0 {
            12usize
        } else {
            request.limit as usize
        };
        let recent = tools::recent_activity(limit).await;
        Ok(Response::new(ListRecentResponse {
            recent: recent.iter().map(repo_to_proto).collect(),
            updated_at: iso_now(),
            ..Default::default()
        }))
    }

    async fn get_downloads(
        &self,
        _ctx: RequestContext,
        request: ServiceRequest<'_, GetDownloadsRequest>,
    ) -> ServiceResult<GetDownloadsResponse> {
        let pkg = request.pkg.trim();
        if pkg.is_empty() {
            return Err(ConnectError::new(ErrorCode::InvalidArgument, "pkg_required"));
        }
        let series = tools::npm_range(pkg).await;
        let total: u64 = series.iter().map(|d| d.downloads).sum();
        Ok(Response::new(GetDownloadsResponse {
            pkg: pkg.to_string(),
            series: series
                .into_iter()
                .map(|d| NpmDay {
                    day: d.day,
                    downloads: d.downloads,
                    ..Default::default()
                })
                .collect(),
            total,
            updated_at: iso_now(),
            ..Default::default()
        }))
    }

    async fn chat(
        &self,
        _ctx: RequestContext,
        _request: ServiceRequest<'_, ChatRequest>,
    ) -> ServiceResult<ChatResponse> {
        // Streaming chat remains REST SSE (`POST /chat`) for static-site AI SDK transport.
        Err(ConnectError::new(
            ErrorCode::Unimplemented,
            "chat_stream_via_rest_sse",
        ))
    }

    async fn list_chat_tools(
        &self,
        _ctx: RequestContext,
        _request: ServiceRequest<'_, ListChatToolsRequest>,
    ) -> ServiceResult<ListChatToolsResponse> {
        let catalog = crate::rest_projection::agent_tool_catalog();
        Ok(Response::new(ListChatToolsResponse {
            tools: catalog
                .tools
                .into_iter()
                .map(|t| ChatToolFunction {
                    name: t.name,
                    description: t.description,
                    parameters_json: "{}".into(),
                    ..Default::default()
                })
                .collect(),
            ..Default::default()
        }))
    }
}

pub fn portfolio_connect_service() -> Arc<PortfolioConnectService> {
    Arc::new(PortfolioConnectService::new())
}
