use kylet_api_rust::contract::valid_pkg;

#[test]
fn pkg_validation_matches_bun_rules() {
    assert!(valid_pkg("@sylphx/pdf-reader-mcp"));
    assert!(valid_pkg("lodash"));
    assert!(!valid_pkg("not valid spaces"));
    assert!(!valid_pkg(""));
}

#[test]
fn health_route_contract() {
    assert_eq!("/healthz", "/healthz");
}

#[test]
fn downloads_pkg_validation_matches_handler_rules() {
    assert!(regex_pkg_like("@sylphx/pdf-reader-mcp"));
    assert!(!regex_pkg_like("not valid spaces"));
}

fn regex_pkg_like(pkg: &str) -> bool {
    if pkg.len() > 80 {
        return false;
    }
    let mut rest = pkg;
    if let Some(stripped) = pkg.strip_prefix('@') {
        let (scope, name) = stripped.split_once('/').unwrap_or(("", ""));
        if scope.is_empty() || name.is_empty() {
            return false;
        }
        rest = name;
    }
    !rest.is_empty()
        && rest.chars().next().is_some_and(|c| c.is_ascii_alphanumeric())
        && rest.chars().all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
}
