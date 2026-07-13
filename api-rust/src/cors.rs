use axum::http::{HeaderMap, HeaderValue, Method};
use crate::contract::allowed_origin;

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allowed_origins_match_bun_baseline() {
        assert_eq!(allowed_origin(Some("https://kylet.se")), "https://kylet.se");
        assert_eq!(
            allowed_origin(Some("https://loud-slab-t9c6ai.sylphx.app")),
            "https://loud-slab-t9c6ai.sylphx.app"
        );
        assert_eq!(allowed_origin(Some("https://evil.example")), "https://kylet.se");
    }
}
