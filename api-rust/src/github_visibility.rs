//! Default-deny GitHub repository visibility boundary.
//!
//! Server credentials may see non-public repositories. No GitHub repository
//! object may cross into a public projection unless GitHub positively reports
//! both `private: false`/`isPrivate: false` and `visibility: public`.

use serde_json::Value;

/// Strict public predicate shared by REST and GraphQL repository projections.
#[must_use]
pub fn is_explicitly_public(is_private: Option<bool>, visibility: Option<&str>) -> bool {
    matches!(is_private, Some(false))
        && visibility.is_some_and(|value| value.eq_ignore_ascii_case("public"))
}

/// Apply the strict predicate to a GraphQL repository object.
#[must_use]
pub fn graphql_repo_is_explicitly_public(repo: &Value) -> bool {
    is_explicitly_public(
        repo.get("isPrivate").and_then(Value::as_bool),
        repo.get("visibility").and_then(Value::as_str),
    )
}

/// Apply the strict predicate to a REST repository object.
#[must_use]
pub fn rest_value_is_explicitly_public(repo: &Value) -> bool {
    is_explicitly_public(
        repo.get("private").and_then(Value::as_bool),
        repo.get("visibility").and_then(Value::as_str),
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn visibility_is_default_deny() {
        assert!(is_explicitly_public(Some(false), Some("public")));
        assert!(is_explicitly_public(Some(false), Some("PUBLIC")));
        assert!(!is_explicitly_public(Some(true), Some("public")));
        assert!(!is_explicitly_public(Some(false), Some("internal")));
        assert!(!is_explicitly_public(Some(false), Some("private")));
        assert!(!is_explicitly_public(Some(false), None));
        assert!(!is_explicitly_public(None, Some("public")));
    }

    #[test]
    fn graphql_objects_require_both_positive_fields() {
        assert!(graphql_repo_is_explicitly_public(
            &json!({"isPrivate": false, "visibility": "PUBLIC"})
        ));
        assert!(!graphql_repo_is_explicitly_public(
            &json!({"isPrivate": false})
        ));
        assert!(!graphql_repo_is_explicitly_public(
            &json!({"isPrivate": true, "visibility": "PUBLIC"})
        ));
    }

    #[test]
    fn rest_objects_require_both_positive_fields() {
        assert!(rest_value_is_explicitly_public(
            &json!({"private": false, "visibility": "public"})
        ));
        assert!(!rest_value_is_explicitly_public(
            &json!({"private": false, "visibility": "internal"})
        ));
        assert!(!rest_value_is_explicitly_public(&json!({"private": false})));
    }
}
