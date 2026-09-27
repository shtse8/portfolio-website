use crate::contract::PUBLIC_STATS_REVISION;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

const STATS_TTL_MS: u64 = 10 * 60 * 1000;
const DEFAULT_LAST_GOOD_PATH: &str = "/var/lib/portfolio-api/stats-last-good.json";

/// Durable last verified snapshot, stamped with the projection revision that
/// produced it. A file written under another revision is ignored, so an
/// unverifiable number can never be replayed from disk.
#[derive(Serialize, Deserialize)]
struct LastGoodEnvelope {
    revision: String,
    payload: StatsPayload,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatsPayload {
    pub github_stars: u64,
    pub npm_downloads: u64,
    pub flagship_stars: u64,
    pub flagship_downloads: u64,
    pub by_owner: std::collections::HashMap<String, u64>,
    pub repos: u64,
    pub updated_at: String,
}

static CACHE: std::sync::OnceLock<Mutex<Option<(u64, StatsPayload)>>> = std::sync::OnceLock::new();

/// In-memory last verified snapshot (mirrors the durable file).
static LAST_GOOD: std::sync::OnceLock<Mutex<Option<StatsPayload>>> = std::sync::OnceLock::new();

fn cache() -> &'static Mutex<Option<(u64, StatsPayload)>> {
    CACHE.get_or_init(|| Mutex::new(None))
}

fn last_good() -> &'static Mutex<Option<StatsPayload>> {
    LAST_GOOD.get_or_init(|| Mutex::new(None))
}

/// Durable snapshot path (env-overridable for tests).
pub fn last_good_path() -> PathBuf {
    env::var("STATS_LAST_GOOD_PATH")
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(DEFAULT_LAST_GOOD_PATH))
}

fn write_last_good_file(data: &StatsPayload) {
    let path = last_good_path();
    if let Some(parent) = path.parent() {
        if let Err(e) = fs::create_dir_all(parent) {
            tracing::warn!(
                error = %e,
                path = %path.display(),
                "stats last_good: could not create parent dir"
            );
            return;
        }
    }
    let envelope = LastGoodEnvelope {
        revision: PUBLIC_STATS_REVISION.to_string(),
        payload: data.clone(),
    };
    match serde_json::to_vec(&envelope) {
        Ok(bytes) => {
            let tmp = path.with_extension("json.tmp");
            if let Err(e) = fs::write(&tmp, &bytes) {
                tracing::warn!(error = %e, path = %tmp.display(), "stats last_good write tmp failed");
                return;
            }
            if let Err(e) = fs::rename(&tmp, &path) {
                if let Err(e2) = fs::write(&path, &bytes) {
                    tracing::warn!(
                        error = %e,
                        fallback = %e2,
                        path = %path.display(),
                        "stats last_good durable write failed"
                    );
                }
                let _ = fs::remove_file(&tmp);
            }
        }
        Err(e) => tracing::warn!(error = %e, "stats last_good encode failed"),
    }
}

fn read_last_good_from_path(path: &Path) -> Option<StatsPayload> {
    let bytes = fs::read(path).ok()?;
    let envelope: LastGoodEnvelope = serde_json::from_slice(&bytes).ok()?;
    (envelope.revision == PUBLIC_STATS_REVISION).then_some(envelope.payload)
}

fn read_last_good_file() -> Option<StatsPayload> {
    read_last_good_from_path(&last_good_path())
}

/// Last verified snapshot regardless of age — the fail-soft answer source.
/// Callers must serve it marked `stale` with its own `verifiedAt`.
pub fn last_good_snapshot() -> Option<StatsPayload> {
    if let Ok(guard) = last_good().lock() {
        if let Some(data) = guard.as_ref() {
            return Some(data.clone());
        }
    }
    if let Some(data) = read_last_good_file() {
        if let Ok(mut guard) = last_good().lock() {
            *guard = Some(data.clone());
        }
        return Some(data);
    }
    None
}

fn store_success(now: u64, data: &StatsPayload) {
    if let Ok(mut guard) = cache().lock() {
        *guard = Some((now, data.clone()));
    }
    if let Ok(mut guard) = last_good().lock() {
        *guard = Some(data.clone());
    }
    write_last_good_file(data);
}

#[doc(hidden)]
pub fn seed_last_good_for_tests(data: StatsPayload) {
    if let Ok(mut guard) = last_good().lock() {
        *guard = Some(data.clone());
    }
    let path = last_good_path();
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    let envelope = LastGoodEnvelope {
        revision: PUBLIC_STATS_REVISION.to_string(),
        payload: data,
    };
    if let Ok(bytes) = serde_json::to_vec(&envelope) {
        let _ = fs::write(&path, bytes);
    }
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

/// Aggregate star counts came from GitHub GraphQL, which needs a credential.
/// The site holds no GitHub credential (the api retires with the Keel
/// rebuild), so the aggregate is reported absent, never guessed.
async fn compute_stats() -> Result<StatsPayload, String> {
    Err(NO_GITHUB_CREDENTIAL.to_string())
}

pub const NO_GITHUB_CREDENTIAL: &str = "github aggregate needs a credential; none is configured";

pub fn iso_now() -> String {
    time::OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
}

/// RFC3339 rendering of a millisecond Unix observation time. Projections that
/// serve a possibly-cached payload must report the payload's own observation
/// time as `verifiedAt` — never the time the response happened to be built.
pub fn iso_from_millis(ms: u64) -> String {
    time::OffsetDateTime::from_unix_timestamp_nanos(i128::from(ms) * 1_000_000)
        .map(|dt| {
            dt.format(&time::format_description::well_known::Rfc3339)
                .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
        })
        .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
}

pub fn cached_snapshot() -> Option<StatsPayload> {
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < STATS_TTL_MS {
                return Some(data.clone());
            }
        }
    }
    None
}

pub async fn get_stats() -> Result<StatsPayload, String> {
    let now = now_ms();
    if let Ok(guard) = cache().lock() {
        if let Some((at, data)) = guard.as_ref() {
            if now.saturating_sub(*at) < STATS_TTL_MS {
                return Ok(data.clone());
            }
        }
    }
    let data = compute_stats().await?;
    store_success(now, &data);
    Ok(data)
}

#[doc(hidden)]
pub fn reset_cache_for_tests() {
    if let Ok(mut guard) = cache().lock() {
        *guard = None;
    }
    if let Ok(mut guard) = last_good().lock() {
        *guard = None;
    }
    let _ = fs::remove_file(last_good_path());
}
