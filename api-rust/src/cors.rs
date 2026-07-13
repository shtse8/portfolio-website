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
#[cfg(test)]
mod fleet_web_finish_wave5_tests {
    use super::*;
    use axum::http::Method;

    #[test]
    fn is_preflight_only_options() {
        assert!(is_preflight(&Method::OPTIONS));
        assert!(!is_preflight(&Method::GET));
        assert!(!is_preflight(&Method::POST));
        assert!(!is_preflight(&Method::PUT));
    }

    #[test]
    fn cors_headers_surface_methods_and_vary() {
        let h = cors_headers(Some("https://kyletse.com"));
        assert_eq!(
            h.get("access-control-allow-origin").unwrap().to_str().unwrap(),
            "https://kyletse.com"
        );
        assert_eq!(
            h.get("access-control-allow-methods").unwrap().to_str().unwrap(),
            "GET, POST, OPTIONS"
        );
        assert_eq!(
            h.get("access-control-allow-headers").unwrap().to_str().unwrap(),
            "content-type"
        );
        assert_eq!(
            h.get("access-control-max-age").unwrap().to_str().unwrap(),
            "86400"
        );
        assert_eq!(h.get("vary").unwrap().to_str().unwrap(), "origin");
    }

    #[test]
    fn cors_headers_unknown_origin_falls_back_default() {
        let h = cors_headers(Some("https://evil.example"));
        let origin = h.get("access-control-allow-origin").unwrap().to_str().unwrap();
        // must be one of the allowlist defaults, not the evil origin
        assert_ne!(origin, "https://evil.example");
        assert!(!origin.is_empty());
    }
}

#[cfg(test)]
mod fleet_web_finish_wave6_tests {
    use super::*;
    use axum::http::Method;

    #[test]
    fn is_preflight_only_options() {
        assert!(is_preflight(&Method::OPTIONS));
        assert!(!is_preflight(&Method::GET));
        assert!(!is_preflight(&Method::POST));
        assert!(!is_preflight(&Method::PUT));
        assert!(!is_preflight(&Method::DELETE));
        assert!(!is_preflight(&Method::HEAD));
    }

    #[test]
    fn cors_headers_never_reflect_unknown_origin() {
        let h = cors_headers(Some("https://attacker.example"));
        let origin = h
            .get(axum::http::header::ACCESS_CONTROL_ALLOW_ORIGIN)
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        assert_ne!(origin, "https://attacker.example");
        assert!(!origin.is_empty());
    }
}
