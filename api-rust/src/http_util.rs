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
#[cfg(test)]
mod fleet_web_finish_wave5_tests {
    use super::*;
    use axum::http::header;

    #[test]
    fn content_type_constants() {
        assert_eq!(json_content_type().to_str().unwrap(), "application/json");
        assert_eq!(
            event_stream_content_type().to_str().unwrap(),
            "text/event-stream"
        );
        assert_eq!(no_cache().to_str().unwrap(), "no-cache");
    }

    #[test]
    fn apply_json_headers_sets_content_type() {
        let mut h = HeaderMap::new();
        apply_json_headers(&mut h);
        assert_eq!(
            h.get(header::CONTENT_TYPE).unwrap().to_str().unwrap(),
            "application/json"
        );
    }
}
