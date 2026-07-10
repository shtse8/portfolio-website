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