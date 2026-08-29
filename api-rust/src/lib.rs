//! kylet.se portfolio API — single JSON REST contract (ADR-169 clean break).
//! Rust is the sole API authority; the browser BFF is nginx proxying these
//! routes to this service. No proto/Connect surface remains.

pub mod activity;
pub mod app;
pub mod chat;
pub mod contract;
pub mod cors;
pub mod github_visibility;
pub mod http_util;
pub mod persona;
pub mod rate_limit;
pub mod rest_projection;
pub mod stats;
#[doc(hidden)]
pub mod testing;
pub mod tool_schemas;
pub mod tools;
pub mod upstream;

pub async fn run() {
    app::serve().await;
}
