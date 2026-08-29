use axum::{
    extract::{Query, Request},
    http::{HeaderMap, Method, StatusCode},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use serde_json::json;
use std::time::Instant;
use tracing::info;
use crate::activity;
use crate::chat;
use crate::contract;
use crate::cors;
use crate::http_util;
use crate::stats;
use crate::tools;

#[derive(Debug, Deserialize)]
struct LimitQuery {
    limit: Option<u32>,
}

#[derive(Debug, Deserialize)]
struct RepoQuery {
    name: Option<String>,
}

#[derive(Debug, Deserialize)]
struct PkgQuery {
    pkg: Option<String>,
}

fn port() -> u16 {
    std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3001)
}

fn origin_from_headers(headers: &HeaderMap) -> Option<String> {
    headers
        .get("origin")
        .and_then(|v| v.to_str().ok())
        .map(str::to_string)
}

fn json_value_with_cors(data: serde_json::Value, origin: Option<&str>) -> Response {
    let mut headers = cors::cors_headers(origin);
    http_util::apply_json_headers(&mut headers);
    (StatusCode::OK, headers, data.to_string()).into_response()
}


fn error_json(status: StatusCode, error: &str, origin: Option<&str>) -> Response {
    let mut headers = cors::cors_headers(origin);
    http_util::apply_json_headers(&mut headers);
    (
        status,
        headers,
        serde_json::to_string(&json!({ "error": error })).unwrap_or_else(|_| "{}".to_string()),
    )
        .into_response()
}

async fn healthz() -> &'static str {
    "ok"
}

/// Non-secret chat readiness (UI fail-closed; ops). Never leaks credentials.
async fn chat_ready_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    json_value_with_cors(crate::chat::chat_readiness(), origin.as_deref())
}

/// Machine-readable claim pack — one structured identity snapshot for humans
/// and external agents. Numbers are live when available; otherwise absent.
async fn claim_pack_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    let stats = match stats::get_stats().await {
        Ok(s) => Some(s),
        Err(_) => stats::cached_snapshot(),
    };
    let activity = match activity::get_activity().await {
        Ok(a) => Some(a),
        Err(_) => activity::cached_snapshot(),
    };
    let flagship = tools::get_repo_detail("pdf-reader-mcp").await;
    let ready = crate::chat::chat_readiness();
    let pack = serde_json::json!({
        "schema": "kylet.se/claim-pack/v1",
        "promise": "I build the infrastructure AI agents run on.",
        "person": {
            "name": "Kyle Tse",
            "title": "AI infrastructure builder",
            "location": "London, UK",
            "openTo": "new ventures",
            "email": "hi@kylet.se",
            "github": "https://github.com/shtse8",
            "site": "https://kylet.se"
        },
        "flagship": flagship.as_ref().map(|r| serde_json::json!({
            "repo": r.repo,
            "url": r.url,
            "stars": r.stars,
            "npm": "@sylphx/pdf-reader-mcp",
            "description": r.description,
        })),
        "metrics": stats.as_ref().map(crate::rest_projection::stats_json),
        "activity": activity.as_ref().map(crate::rest_projection::activity_json),
        "chat": ready,
        "activityDefinition": {
            "unit": "authored_commits",
            "includes": "commits authored by the account across public repositories and all branches",
            "excludes": "PRs, issues, reviews, and contribution-calendar inflation"
        },
        "updatedAt": stats::iso_now(),
    });
    json_value_with_cors(pack, origin.as_deref())
}

async fn stats_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    match stats::get_stats().await {
        Ok(data) => json_value_with_cors(crate::rest_projection::stats_json(&data), origin.as_deref()),
        Err(err) => {
            tracing::error!("stats error: {err}");
            if let Some(stale) = stats::cached_snapshot() {
                return json_value_with_cors(crate::rest_projection::stats_json_stale(&stale), origin.as_deref());
            }
            error_json(
                StatusCode::BAD_GATEWAY,
                "live data is briefly unavailable — try again shortly.",
                origin.as_deref(),
            )
        }
    }
}

async fn projects_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(12) as usize;
    let projects = tools::list_projects(limit).await;
    json_value_with_cors(
        crate::rest_projection::list_projects_json(&projects, &stats::iso_now()),
        origin.as_deref(),
    )
}

async fn repo_handler(headers: HeaderMap, Query(q): Query<RepoQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let name = q.name.unwrap_or_default();
    let repo = tools::get_repo_detail(&name).await;
    match repo {
        Some(repo) => json_value_with_cors(
            crate::rest_projection::get_repo_json(&repo, &stats::iso_now()),
            origin.as_deref(),
        ),
        None => error_json(StatusCode::NOT_FOUND, "repo not found", origin.as_deref()),
    }
}

async fn recent_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(6) as usize;
    let recent = tools::recent_activity(limit).await;
    json_value_with_cors(
        crate::rest_projection::list_recent_json(&recent, &stats::iso_now()),
        origin.as_deref(),
    )
}

async fn activity_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    match activity::get_activity().await {
        Ok(data) => {
            json_value_with_cors(crate::rest_projection::activity_json(&data), origin.as_deref())
        }
        Err(err) => {
            tracing::error!("activity error: {err}");
            if let Some(stale) = activity::cached_snapshot() {
                return json_value_with_cors(
                    crate::rest_projection::activity_json_stale(&stale),
                    origin.as_deref(),
                );
            }
            error_json(
                StatusCode::BAD_GATEWAY,
                "activity data briefly unavailable",
                origin.as_deref(),
            )
        }
    }
}

async fn downloads_handler(headers: HeaderMap, Query(q): Query<PkgQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let pkg = tools::resolve_npm_pkg(&q.pkg.unwrap_or_default());
    let valid = contract::valid_pkg(&pkg);
    let series = if valid {
        tools::npm_range(&pkg).await
    } else {
        Vec::new()
    };
    let total: u64 = series.iter().map(|d| d.downloads).sum();
    json_value_with_cors(
        crate::rest_projection::downloads_json(&pkg, &series, total, &stats::iso_now()),
        origin.as_deref(),
    )
}

async fn chat_handler(headers: HeaderMap, Json(body): Json<chat::ChatRequest>) -> Response {
    let origin = origin_from_headers(&headers);
    let cors = cors::cors_headers(origin.as_deref());
    chat::handle_chat(body, &headers, cors).await
}

async fn handle_options(req: Request, next: Next) -> Response {
    if *req.method() == Method::OPTIONS {
        let origin = req.headers().get("origin").and_then(|v| v.to_str().ok());
        return (StatusCode::NO_CONTENT, cors::cors_headers(origin)).into_response();
    }
    next.run(req).await
}

/// Lightweight access log (method, path, status, duration) for live diagnosis.
async fn access_log(req: Request, next: Next) -> Response {
    let method = req.method().clone();
    let path = req.uri().path().to_string();
    let start = Instant::now();
    let res = next.run(req).await;
    info!(
        method = %method,
        path = %path,
        status = res.status().as_u16(),
        duration_ms = start.elapsed().as_millis(),
        "http request"
    );
    res
}

pub fn router() -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(healthz))
        .route("/chat/ready", get(chat_ready_handler))
        .route("/claims", get(claim_pack_handler))
        .route("/stats", get(stats_handler))
        .route("/projects", get(projects_handler))
        .route("/repo", get(repo_handler))
        .route("/recent", get(recent_handler))
        .route("/activity", get(activity_handler))
        .route("/downloads", get(downloads_handler))
        .route("/chat", post(chat_handler))
        .layer(middleware::from_fn(access_log))
        .layer(middleware::from_fn(handle_options))
}

pub async fn serve() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let app = router();
    let listener = match tokio::net::TcpListener::bind(("0.0.0.0", port())).await {
        Ok(l) => l,
        Err(err) => {
            tracing::error!("bind failed: {err}");
            std::process::exit(1);
        }
    };
    tracing::info!("kylet-api-rust listening on :{}", port());
    if let Err(err) = axum::serve(listener, app).await {
        tracing::error!("serve failed: {err}");
        std::process::exit(1);
    }
}
