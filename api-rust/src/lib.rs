//! kylet.se portfolio API — technology-stack-profile product wire:
//! **buffa + connectrpc + axum**, with REST projections for static-site `fetch` (ADR-168).

pub mod activity;
pub mod app;
pub mod chat;
pub mod connect_api;
pub mod contract;
pub mod cors;
pub mod http_util;
pub mod persona;
pub mod rate_limit;
pub mod rest_projection;
pub mod stats;
pub mod tool_schemas;
pub mod tools;
pub mod upstream;
#[doc(hidden)]
pub mod testing;

/// Generated Connect/Protobuf types (buffa + connectrpc-build).
pub mod proto {
    connectrpc::include_generated!();
}

pub async fn run() {
    app::serve().await;
}
