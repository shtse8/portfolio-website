use crate::contract::cors_header_map;
use axum::http::{HeaderMap, HeaderValue, Method};

/// CORS policy for the browser BFF surface (single JSON REST contract).
/// `access-control-allow-origin` is only emitted for allowlisted origins
/// (see `contract::allowed_origin`); foreign origins get no echo and the
/// browser blocks the response.
pub fn cors_headers(origin: Option<&str>) -> HeaderMap {
    let mut headers = HeaderMap::new();
    for (key, value) in cors_header_map(origin) {
        let Ok(name) = axum::http::header::HeaderName::from_bytes(key.as_bytes()) else {
            continue;
        };
        if let Ok(v) = HeaderValue::from_str(&value) {
            headers.insert(name, v);
        }
    }
    headers
}

pub fn is_preflight(method: &Method) -> bool {
    method == Method::OPTIONS
}
