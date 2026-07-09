use axum::http::{header, HeaderMap, HeaderValue};

pub fn json_content_type() -> HeaderValue {
    HeaderValue::from_static("application/json")
}

pub fn event_stream_content_type() -> HeaderValue {
    HeaderValue::from_static("text/event-stream")
}

pub fn no_cache() -> HeaderValue {
    HeaderValue::from_static("no-cache")
}

pub fn apply_json_headers(headers: &mut HeaderMap) {
    headers.insert(header::CONTENT_TYPE, json_content_type());
}