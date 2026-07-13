use std::env;

fn non_empty_env(key: &str) -> Option<String> {
    env::var(key)
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
}

/// True when callers explicitly overrode the REST API base (wiremock / custom host).
fn github_api_base_overridden() -> bool {
    non_empty_env("GITHUB_API_BASE").is_some()
}

pub fn github_api_base() -> String {
    non_empty_env("GITHUB_API_BASE")
        .unwrap_or_else(|| "https://api.github.com".to_string())
        .trim_end_matches('/')
        .to_string()
}

pub fn npm_api_base() -> String {
    non_empty_env("NPM_API_BASE")
        .unwrap_or_else(|| "https://api.npmjs.org".to_string())
        .trim_end_matches('/')
        .to_string()
}

pub fn github_graphql_url() -> String {
    // When GITHUB_API_BASE is set (wiremock / custom host), GraphQL must follow that
    // base. GitHub Actions always injects GITHUB_GRAPHQL_URL=https://api.github.com/graphql,
    // which would otherwise pin GraphQL to production and break injectable upstream tests.
    if github_api_base_overridden() {
        return format!("{}/graphql", github_api_base());
    }
    non_empty_env("GITHUB_GRAPHQL_URL")
        .unwrap_or_else(|| format!("{}/graphql", github_api_base()))
}

pub fn github_rest_url(path: &str) -> String {
    format!("{}{}", github_api_base(), path)
}

pub fn npm_url(path: &str) -> String {
    format!("{}{}", npm_api_base(), path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serial_test::serial;

    #[test]
    #[serial]
    fn graphql_follows_api_base_override_even_when_gha_graphql_url_set() {
        // SAFETY: serialized via #[serial]; env restored at end.
        unsafe {
            std::env::set_var("GITHUB_API_BASE", "http://127.0.0.1:9");
            std::env::set_var("GITHUB_GRAPHQL_URL", "https://api.github.com/graphql");
        }
        assert_eq!(github_graphql_url(), "http://127.0.0.1:9/graphql");
        unsafe {
            std::env::remove_var("GITHUB_API_BASE");
            std::env::remove_var("GITHUB_GRAPHQL_URL");
        }
    }

    #[test]
    #[serial]
    fn graphql_honors_explicit_url_when_api_base_unset() {
        unsafe {
            std::env::remove_var("GITHUB_API_BASE");
            std::env::set_var("GITHUB_GRAPHQL_URL", "https://example.test/graphql");
        }
        assert_eq!(github_graphql_url(), "https://example.test/graphql");
        unsafe {
            std::env::remove_var("GITHUB_GRAPHQL_URL");
        }
    }
}
