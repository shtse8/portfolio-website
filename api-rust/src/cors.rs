use axum::http::{HeaderMap, HeaderValue, Method};
use kylet_api_rust::contract::allowed_origin;

pub fn cors_headers(origin: Option<&str>) -> HeaderMap {
    let mut headers = HeaderMap::new();
    headers.insert(
        "access-control-allow-origin",
        HeaderValue::from_static(allowed_origin(origin)),
    );
    headers.insert(
        "access-control-allow-methods",
        HeaderValue::from_static("GET, POST, OPTIONS"),
    );
    headers.insert(
        "access-control-allow-headers",
        HeaderValue::from_static("content-type"),
    );
    headers.insert(
        "access-control-max-age",
        HeaderValue::from_static("86400"),
    );
    headers.insert("vary", HeaderValue::from_static("origin"));
    headers
}

pub fn is_preflight(method: &Method) -> bool {
    method == Method::OPTIONS
}