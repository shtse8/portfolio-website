use axum::{
    extract::Request,
    extract::Query,
    middleware::{self, Next},
    http::{HeaderMap, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use serde_json::json;
use crate::activity;
use crate::chat;
use crate::contract;
use crate::cors;
use crate::http_util;
use crate::stats;
use crate::tools;
use crate::stats::iso_now;
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


fn json_value_with_cors(data: serde_json::Value, origin: Option<&str>) -> Response {
    let mut headers = cors::cors_headers(origin);
    http_util::apply_json_headers(&mut headers);
    (
        StatusCode::OK,
        headers,
        data.to_string(),
    )
        .into_response()
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

pub async fn healthz() -> &'static str {
    "ok"
}

pub async fn stats_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    match stats::get_stats().await {
        Ok(data) => json_value_with_cors(crate::rest_projection::stats_json(&data), origin.as_deref()),
        Err(err) => {
            tracing::error!("stats error: {err}");
            if let Some(stale) = stats::cached_snapshot() {
                return json_value_with_cors(crate::rest_projection::stats_json_stale(&stale), origin.as_deref());
            }
            json_value_with_cors(
                json!({ "error": "live data is briefly unavailable — try again shortly." }),
                origin.as_deref(),
            )
        }
    }
}

pub async fn projects_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(12) as usize;
    match async {
        let projects = tools::list_projects(limit).await;
        Ok::<_, String>(projects)
    }
    .await
    {
        Ok(projects) => json_value_with_cors(crate::rest_projection::list_projects_json(&projects, &iso_now()), origin.as_deref()),
        Err(_) => error_json(
            StatusCode::BAD_GATEWAY,
            "live data is briefly unavailable — try again shortly.",
            origin.as_deref(),
        ),
    }
}

pub async fn repo_handler(headers: HeaderMap, Query(q): Query<RepoQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let name = q.name.unwrap_or_default();
    match tools::get_repo_detail(&name).await {
        Some(repo) => json_value_with_cors(crate::rest_projection::get_repo_json(&repo, &iso_now()), origin.as_deref()),
        None => error_json(
            StatusCode::NOT_FOUND,
            &format!("no such repo under Kyle's owners: {}", name.chars().take(60).collect::<String>()),
            origin.as_deref(),
        ),
    }
}

pub async fn recent_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(6) as usize;
    let recent = tools::recent_activity(limit).await;
    json_value_with_cors(crate::rest_projection::list_recent_json(&recent, &iso_now()), origin.as_deref())
}

pub async fn activity_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    match activity::get_activity().await {
        Ok(data) => json_value_with_cors(crate::rest_projection::activity_json(&data), origin.as_deref()),
        Err(err) => {
            tracing::error!("activity error: {err}");
            if let Some(stale) = activity::cached_snapshot() {
                return json_value_with_cors(crate::rest_projection::activity_json_stale(&stale), origin.as_deref());
            }
            json_value_with_cors(
                json!({ "error": "activity data briefly unavailable" }),
                origin.as_deref(),
            )
        }
    }
}

pub async fn downloads_handler(headers: HeaderMap, Query(q): Query<PkgQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let pkg = q.pkg.unwrap_or_default();
    let valid = contract::valid_pkg(&pkg);
    let series = if valid {
        tools::npm_range(&pkg).await
    } else {
        Vec::new()
    };
    let total: u64 = series.iter().map(|d| d.downloads).sum();
    json_value_with_cors(crate::rest_projection::downloads_json(&pkg, &series, total, &iso_now()), origin.as_deref())
}

pub async fn chat_handler(headers: HeaderMap, Json(body): Json<chat::ChatRequest>) -> Response {
    let origin = origin_from_headers(&headers);
    let cors = cors::cors_headers(origin.as_deref());
    chat::handle_chat(body, &headers, cors).await
}

pub async fn method_router(
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
        ("GET", "/activity") => activity_handler(headers).await,
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


pub async fn handle_options(req: Request, next: Next) -> Response {
    if *req.method() == Method::OPTIONS {
        let origin = req
            .headers()
            .get("origin")
            .and_then(|v| v.to_str().ok());
        return (StatusCode::NO_CONTENT, cors::cors_headers(origin)).into_response();
    }
    next.run(req).await
}

pub fn router() -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(healthz))
        .route("/stats", get(stats_handler))
        .route("/projects", get(projects_handler))
        .route("/repo", get(repo_handler))
        .route("/recent", get(recent_handler))
        .route("/activity", get(activity_handler))
        .route("/downloads", get(downloads_handler))
        .route("/chat", post(chat_handler))
        .fallback(fallback)
        .layer(middleware::from_fn(handle_options))
}

pub async fn serve() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::new("info"))
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

pub async fn fallback(
    method: Method,
    uri: axum::http::Uri,
    headers: HeaderMap,
    body: Option<Json<chat::ChatRequest>>,
) -> Response {
    let path = uri.path().to_string();
    method_router(method, path, headers, body, None, None, None).await
}
