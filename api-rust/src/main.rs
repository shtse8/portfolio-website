mod chat;
mod cors;
mod http_util;
mod persona;
mod rate_limit;
mod stats;
mod tools;

use axum::{
    extract::Query,
    http::{HeaderMap, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use serde_json::json;
use stats::iso_now;
use std::env;
use tracing_subscriber::EnvFilter;

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
    env::var("PORT")
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

fn json_with_cors<T: serde::Serialize>(data: T, origin: Option<&str>) -> Response {
    let mut headers = cors::cors_headers(origin);
    http_util::apply_json_headers(&mut headers);
    (
        StatusCode::OK,
        headers,
        serde_json::to_string(&data).unwrap_or_else(|_| "{}".to_string()),
    )
        .into_response()
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

async fn stats_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    match stats::get_stats().await {
        Ok(data) => json_with_cors(data, origin.as_deref()),
        Err(err) => {
            tracing::error!("stats error: {err}");
            json_with_cors(
                json!({ "error": "live data is briefly unavailable — try again shortly." }),
                origin.as_deref(),
            )
        }
    }
}

async fn projects_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(12) as usize;
    match async {
        let projects = tools::list_projects(limit).await;
        Ok::<_, String>(projects)
    }
    .await
    {
        Ok(projects) => json_with_cors(
            json!({ "projects": projects, "updatedAt": iso_now() }),
            origin.as_deref(),
        ),
        Err(_) => error_json(
            StatusCode::BAD_GATEWAY,
            "live data is briefly unavailable — try again shortly.",
            origin.as_deref(),
        ),
    }
}

async fn repo_handler(headers: HeaderMap, Query(q): Query<RepoQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let name = q.name.unwrap_or_default();
    match tools::get_repo_detail(&name).await {
        Some(repo) => json_with_cors(json!({ "repo": repo, "updatedAt": iso_now() }), origin.as_deref()),
        None => error_json(
            StatusCode::NOT_FOUND,
            &format!("no such repo under Kyle's owners: {}", name.chars().take(60).collect::<String>()),
            origin.as_deref(),
        ),
    }
}

async fn recent_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(6) as usize;
    let recent = tools::recent_activity(limit).await;
    json_with_cors(
        json!({ "recent": recent, "updatedAt": iso_now() }),
        origin.as_deref(),
    )
}

async fn downloads_handler(headers: HeaderMap, Query(q): Query<PkgQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let pkg = q.pkg.unwrap_or_default();
    let valid = regex_pkg(&pkg);
    let series = if valid {
        tools::npm_range(&pkg).await
    } else {
        Vec::new()
    };
    let total: u64 = series.iter().map(|d| d.downloads).sum();
    json_with_cors(
        json!({ "pkg": pkg, "series": series, "total": total, "updatedAt": iso_now() }),
        origin.as_deref(),
    )
}

fn regex_pkg(pkg: &str) -> bool {
    if pkg.len() > 80 {
        return false;
    }
    regex_simple(pkg)
}

fn regex_simple(pkg: &str) -> bool {
    let mut chars = pkg.chars();
    if pkg.starts_with('@') {
        let scope: String = chars.by_ref().take_while(|c| *c != '/').collect();
        if !scope.starts_with('@') || scope.len() < 2 {
            return false;
        }
        if chars.next() != Some('/') {
            return false;
        }
    }
    let name: String = chars.collect();
    !name.is_empty()
        && name
            .chars()
            .next()
            .is_some_and(|c| c.is_ascii_alphanumeric())
        && name
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
}

async fn chat_handler(headers: HeaderMap, Json(body): Json<chat::ChatRequest>) -> Response {
    let origin = origin_from_headers(&headers);
    let cors = cors::cors_headers(origin.as_deref());
    chat::handle_chat(body, &headers, cors).await
}

async fn method_router(
    method: Method,
    path: String,
    headers: HeaderMap,
    body: Option<Json<chat::ChatRequest>>,
    query_limit: Option<Query<LimitQuery>>,
    query_repo: Option<Query<RepoQuery>>,
    query_pkg: Option<Query<PkgQuery>>,
) -> Response {
    let origin = origin_from_headers(&headers);
    if cors::is_preflight(&method) {
        return (StatusCode::NO_CONTENT, cors::cors_headers(origin.as_deref())).into_response();
    }
    match (method.as_str(), path.as_str()) {
        ("GET", "/healthz") | ("GET", "/readyz") => healthz().await.into_response(),
        ("GET", "/stats") => stats_handler(headers).await,
        ("GET", "/projects") => {
            projects_handler(headers, query_limit.unwrap_or(Query(LimitQuery { limit: None })))
                .await
        }
        ("GET", "/repo") => {
            repo_handler(headers, query_repo.unwrap_or(Query(RepoQuery { name: None })))
                .await
        }
        ("GET", "/recent") => {
            recent_handler(headers, query_limit.unwrap_or(Query(LimitQuery { limit: None })))
                .await
        }
        ("GET", "/downloads") => {
            downloads_handler(headers, query_pkg.unwrap_or(Query(PkgQuery { pkg: None })))
                .await
        }
        ("POST", "/chat") => {
            if let Some(Json(b)) = body {
                chat_handler(headers, Json(b)).await
            } else {
                error_json(StatusCode::BAD_REQUEST, "invalid JSON", origin.as_deref())
            }
        }
        _ => error_json(StatusCode::NOT_FOUND, "not found", origin.as_deref()),
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::new("info"))
        .init();

    let app = Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(healthz))
        .route("/stats", get(stats_handler))
        .route("/projects", get(projects_handler))
        .route("/repo", get(repo_handler))
        .route("/recent", get(recent_handler))
        .route("/downloads", get(downloads_handler))
        .route("/chat", post(chat_handler))
        .fallback(fallback);

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

async fn fallback(
    method: Method,
    uri: axum::http::Uri,
    headers: HeaderMap,
    body: Option<Json<chat::ChatRequest>>,
) -> Response {
    let path = uri.path().to_string();
    method_router(method, path, headers, body, None, None, None).await
}