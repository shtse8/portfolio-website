pub mod activity;
pub mod app;
pub mod chat;
pub mod contract;
pub mod cors;
pub mod http_util;
pub mod persona;
pub mod proto;
pub mod rate_limit;
pub mod rest_projection;
pub mod stats;
pub mod tool_schemas;
pub mod tools;
pub mod upstream;
#[doc(hidden)]
pub mod testing;

pub async fn run() {
    app::serve().await;
}
