use std::env;

pub fn github_api_base() -> String {
    env::var("GITHUB_API_BASE")
        .ok()
        .filter(|s| !s.trim().is_empty())
        .unwrap_or_else(|| "https://api.github.com".to_string())
        .trim_end_matches('/')
        .to_string()
}

pub fn npm_api_base() -> String {
    env::var("NPM_API_BASE")
        .ok()
        .filter(|s| !s.trim().is_empty())
        .unwrap_or_else(|| "https://api.npmjs.org".to_string())
        .trim_end_matches('/')
        .to_string()
}

pub fn github_graphql_url() -> String {
    env::var("GITHUB_GRAPHQL_URL")
        .ok()
        .filter(|s| !s.trim().is_empty())
        .unwrap_or_else(|| format!("{}/graphql", github_api_base()))
}

pub fn github_rest_url(path: &str) -> String {
    format!("{}{}", github_api_base(), path)
}

pub fn npm_url(path: &str) -> String {
    format!("{}{}", npm_api_base(), path)
}
