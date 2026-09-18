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
use std::time::{Duration, Instant};
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
    /// Optional explicit owner — a deep link may name the owner, which turns
    /// the lookup into a single probe instead of an owner sweep.
    owner: Option<String>,
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

/// Hard visitor-facing budget for every upstream-derived answer. It must stay
/// under the ~5 s edge timeout cited in `tools.rs` (nginx/Envoy), so a hanging
/// upstream — a socket that accepts and never answers — still yields the honest
/// 200 stale/absent payload instead of an edge 504.
///
/// All six upstream-derived routes are wrapped in `within_request_budget`:
/// `/stats`, `/activity`, `/claims`, `/projects`, `/recent` and
/// `/downloads`. The owner-walking list routes (`/projects`, `/recent`) probe
/// the five owners *concurrently* (`tools::list_all_repos_with_observed_at`),
/// so one deadline bounds the whole walk instead of one 8 s client timeout per
/// owner. `/repo` additionally keeps its own tighter
/// `tools::REPO_PROBE_TIMEOUT`.
const REQUEST_BUDGET: Duration = Duration::from_secs(4);

/// Absolute deadline for one visitor request. It is anchored *before* any
/// upstream work starts: a per-future timer armed lazily would let each
/// concurrent leg of `/claims` start its own clock after the previous leg had
/// already spent time, and the join would then overshoot the edge timeout.
fn request_deadline() -> tokio::time::Instant {
    tokio::time::Instant::now() + REQUEST_BUDGET
}

/// Resolve one upstream-derived future under the request deadline. `None` means
/// the deadline elapsed (a hung or blocked upstream); the caller must answer
/// with the honest stale/absent projection rather than wait on the upstream.
async fn within_request_budget<F, T>(deadline: tokio::time::Instant, fut: F) -> Option<T>
where
    F: std::future::Future<Output = T>,
{
    tokio::time::timeout_at(deadline, fut).await.ok()
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
    // Resolve the three upstream-derived parts concurrently, each under the
    // shared request budget. The previous serial composition spent the sum of
    // three upstream timeouts (8 s + 8 s + 3 s), so one hung upstream pushed the
    // whole pack past the edge budget; the join bounds it to a single budget.
    let deadline = request_deadline();
    let (stats_out, activity_out, flagship_out) = tokio::join!(
        within_request_budget(deadline, stats::get_stats()),
        within_request_budget(deadline, activity::get_activity()),
        within_request_budget(deadline, tools::get_repo_detail("pdf-reader-mcp")),
    );
    // Track whether each part was actually measured *in time*. A last-good
    // snapshot served because the deadline elapsed (or the upstream failed) is
    // not live: projecting it through `stats_json` would stamp
    // `freshness:"live"` / `source:"github-public"` on data that `/stats`
    // answers with `stale` / `github-public-stale`. The numbers stay the real
    // measurements; only the label follows the same honesty ladder as `/stats`
    // and `/activity`.
    let (stats, stats_live) = match stats_out {
        Some(Ok(s)) => (Some(s), true),
        _ => (stats::last_good_snapshot(), false),
    };
    let (activity, activity_live) = match activity_out {
        Some(Ok(a)) => (Some(a), true),
        _ => (activity::cached_snapshot(), false),
    };
    let flagship = flagship_out.flatten();
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
        "metrics": stats.as_ref().map(|s| {
            if stats_live {
                crate::rest_projection::stats_json(s)
            } else {
                crate::rest_projection::stats_json_stale(s)
            }
        }),
        "activity": activity.as_ref().map(|a| {
            if activity_live {
                crate::rest_projection::activity_json(a)
            } else {
                crate::rest_projection::activity_json_stale(a)
            }
        }),
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
    let live = match within_request_budget(request_deadline(), stats::get_stats()).await {
        Some(Ok(data)) => Some(data),
        Some(Err(err)) => {
            tracing::error!("stats error: {err}");
            None
        }
        // A budget overrun is "the upstream did not answer", not a reason to
        // hold the visitor past the edge timeout.
        None => {
            tracing::warn!("stats request budget elapsed; serving honest fallback");
            None
        }
    };
    if let Some(data) = live {
        return json_value_with_cors(crate::rest_projection::stats_json(&data), origin.as_deref());
    }
    // Fail soft, never 5xx: serve the last verified snapshot marked stale, or an
    // explicit `absent` payload. A visitor always gets a valid JSON answer with
    // a freshness label and verifiedAt.
    if let Some(stale) = stats::last_good_snapshot() {
        return json_value_with_cors(
            crate::rest_projection::stats_json_stale(&stale),
            origin.as_deref(),
        );
    }
    json_value_with_cors(crate::rest_projection::stats_json_absent(), origin.as_deref())
}

async fn projects_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(12) as usize;
    let measured = within_request_budget(
        request_deadline(),
        tools::list_projects_with_observed_at(limit),
    )
    .await;
    match measured {
        Some((projects, observed_ms)) => json_value_with_cors(
            crate::rest_projection::list_projects_json(
                &projects,
                &stats::iso_from_millis(observed_ms),
            ),
            origin.as_deref(),
        ),
        // The owner walk did not finish in time: an empty list is `absent`, not
        // a verified-empty portfolio, and the visitor still gets a 200.
        None => {
            tracing::warn!("projects request budget elapsed; serving honest absent fallback");
            json_value_with_cors(
                crate::rest_projection::list_projects_absent_json(),
                origin.as_deref(),
            )
        }
    }
}

async fn repo_handler(headers: HeaderMap, Query(q): Query<RepoQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let name = q.name.unwrap_or_default();
    match tools::get_repo_detail_in(q.owner.as_deref(), &name).await {
        tools::RepoLookup::Found(repo) => json_value_with_cors(
            crate::rest_projection::get_repo_json(&repo, &stats::iso_now()),
            origin.as_deref(),
        ),
        // The upstream answered and proved no public repository of that name.
        tools::RepoLookup::NotFound => {
            error_json(StatusCode::NOT_FOUND, "repo not found", origin.as_deref())
        }
        // The upstream did not answer. Never substitute a repo, and never make
        // the visitor wear an edge 5xx: an explicit null + reason is honest.
        tools::RepoLookup::UpstreamUnavailable(reason) => {
            tracing::warn!(reason = %reason, repo = %name, "repo lookup: upstream unavailable");
            json_value_with_cors(crate::rest_projection::repo_absent_json(), origin.as_deref())
        }
    }
}

async fn recent_handler(headers: HeaderMap, Query(q): Query<LimitQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let limit = q.limit.unwrap_or(6) as usize;
    let measured = within_request_budget(
        request_deadline(),
        tools::recent_activity_with_observed_at(limit),
    )
    .await;
    match measured {
        Some((recent, observed_ms)) => json_value_with_cors(
            crate::rest_projection::list_recent_json(&recent, &stats::iso_from_millis(observed_ms)),
            origin.as_deref(),
        ),
        // Same ladder as `/projects`: nothing observed in time is `absent`.
        None => {
            tracing::warn!("recent request budget elapsed; serving honest absent fallback");
            json_value_with_cors(
                crate::rest_projection::list_recent_absent_json(),
                origin.as_deref(),
            )
        }
    }
}

async fn activity_handler(headers: HeaderMap) -> Response {
    let origin = origin_from_headers(&headers);
    let live = match within_request_budget(request_deadline(), activity::get_activity()).await {
        Some(Ok(data)) => Some(data),
        Some(Err(err)) => {
            tracing::error!("activity error: {err}");
            None
        }
        None => {
            tracing::warn!("activity request budget elapsed; serving honest fallback");
            None
        }
    };
    if let Some(data) = live {
        return json_value_with_cors(
            crate::rest_projection::activity_json(&data),
            origin.as_deref(),
        );
    }
    // Fail soft, never 5xx — last verified snapshot as stale, else an explicit
    // `absent` payload with null (never zero) counts.
    if let Some(stale) = activity::cached_snapshot() {
        return json_value_with_cors(
            crate::rest_projection::activity_json_stale(&stale),
            origin.as_deref(),
        );
    }
    json_value_with_cors(
        crate::rest_projection::activity_json_absent(),
        origin.as_deref(),
    )
}

async fn downloads_handler(headers: HeaderMap, Query(q): Query<PkgQuery>) -> Response {
    let origin = origin_from_headers(&headers);
    let pkg = tools::resolve_npm_pkg(&q.pkg.unwrap_or_default());
    let valid = contract::valid_pkg(&pkg);
    let series = if valid {
        // The npm range fetch is upstream-derived too: a hanging registry must
        // not hold the visitor past the edge timeout. An empty series inside the
        // budget is the same honest "nothing verified" answer the fast-fail path
        // already gives.
        match within_request_budget(request_deadline(), tools::npm_range(&pkg)).await {
            Some(days) => days,
            None => {
                tracing::warn!("downloads request budget elapsed; serving honest empty series");
                Vec::new()
            }
        }
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
