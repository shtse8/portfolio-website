//! Protected-canary / explicit-public-control oracle (docs/capabilities.md:19).
//!
//! Repository publication authority is proven negatively as well as positively:
//! a redacted protected canary repository and its facts must be absent from every
//! public projection, cache and fallback, while an explicit-public control stays
//! available on the same customer path.
//!
//! The canary identity lives here — not scattered across test files — so the
//! fixture, the HTTP oracle, the cache/fallback sweep and the baked-data guard all
//! name the same thing and cannot drift apart.

use serde_json::{json, Value};

/// Redacted protected canary repository. Not provably public in any fixture; it
/// must never cross into a response, cache or fallback.
pub const CANARY_REPO: &str = "protected-canary-9f3c";
/// Owner of the canary. Deliberately not a real portfolio owner.
pub const CANARY_OWNER: &str = "sylphx-protected-canary";
/// Distinctive star count, so a leaked *fact* is detectable and not only a name.
pub const CANARY_STARS: u64 = 987_654;
/// Marker embedded in canary description/topics.
pub const CANARY_MARKER: &str = "PROTECTED-CANARY-DO-NOT-PUBLISH";

/// Explicit-public control that must remain available on the same path.
pub const PUBLIC_CONTROL_REPO: &str = "pdf-reader-mcp";
pub const PUBLIC_CONTROL_OWNER: &str = "SylphxAI";
pub const PUBLIC_CONTROL_STARS: u64 = 905;

/// Every literal that identifies the canary or one of its facts.
#[must_use]
pub fn canary_needles() -> Vec<String> {
    vec![
        CANARY_MARKER.to_string(),
        format!("{CANARY_OWNER}/{CANARY_REPO}"),
        CANARY_REPO.to_string(),
        CANARY_OWNER.to_string(),
        CANARY_STARS.to_string(),
    ]
}

/// First canary fact found in `haystack`, if any.
///
/// Callers treat `Some` as a publication-authority violation: a non-public or
/// visibility-unverifiable repository fact reached a public surface.
#[must_use]
pub fn canary_leak(haystack: &[u8]) -> Option<String> {
    let text = String::from_utf8_lossy(haystack);
    canary_needles().into_iter().find(|n| text.contains(n.as_str()))
}

/// Assert a payload is clean, returning the offending literal on violation.
pub fn assert_no_canary(haystack: &[u8]) -> Result<(), String> {
    match canary_leak(haystack) {
        Some(needle) => Err(format!("protected canary leaked: {needle}")),
        None => Ok(()),
    }
}

/// REST repository object that is NOT provably public: `private` is false but
/// `visibility` is absent — exactly what an anonymous GitHub REST response looks
/// like. The strict predicate must reject it.
#[must_use]
pub fn rest_unverifiable_canary() -> Value {
    json!({
        "full_name": format!("{CANARY_OWNER}/{CANARY_REPO}"),
        "name": CANARY_REPO,
        "owner": { "login": CANARY_OWNER },
        "stargazers_count": CANARY_STARS,
        "forks_count": 0,
        "description": CANARY_MARKER,
        "language": "Rust",
        "topics": [CANARY_MARKER],
        "homepage": Value::Null,
        "html_url": format!("https://github.com/{CANARY_OWNER}/{CANARY_REPO}"),
        "pushed_at": "2026-09-18T08:00:00Z",
        "fork": false,
        "archived": false,
        "private": false
    })
}

/// REST repository object for a private repository as a credentialed read sees it.
#[must_use]
pub fn rest_private_canary() -> Value {
    let mut v = rest_unverifiable_canary();
    if let Some(obj) = v.as_object_mut() {
        obj.insert("private".to_string(), Value::Bool(true));
        obj.insert("visibility".to_string(), json!("private"));
    }
    v
}

/// GraphQL repository node for the visibility-unverifiable canary.
#[must_use]
pub fn graphql_unverifiable_canary() -> Value {
    json!({
        "nameWithOwner": format!("{CANARY_OWNER}/{CANARY_REPO}"),
        "pushedAt": "2026-09-18T08:00:00Z",
        "stargazerCount": CANARY_STARS,
        "isFork": false,
        "isPrivate": false
    })
}

/// GraphQL repository node for the private canary.
#[must_use]
pub fn graphql_private_canary() -> Value {
    json!({
        "nameWithOwner": format!("{CANARY_OWNER}/{CANARY_REPO}"),
        "pushedAt": "2026-09-18T08:00:00Z",
        "stargazerCount": CANARY_STARS,
        "isFork": false,
        "isPrivate": true,
        "visibility": "PRIVATE"
    })
}

/// REST repository object for the explicit-public control.
#[must_use]
pub fn rest_public_control() -> Value {
    json!({
        "full_name": format!("{PUBLIC_CONTROL_OWNER}/{PUBLIC_CONTROL_REPO}"),
        "name": PUBLIC_CONTROL_REPO,
        "owner": { "login": PUBLIC_CONTROL_OWNER },
        "stargazers_count": PUBLIC_CONTROL_STARS,
        "forks_count": 12,
        "description": "Give your AI agent eyes for PDFs.",
        "language": "TypeScript",
        "topics": ["mcp"],
        "homepage": "https://npmjs.com/package/@sylphx/pdf-reader-mcp",
        "html_url": format!("https://github.com/{PUBLIC_CONTROL_OWNER}/{PUBLIC_CONTROL_REPO}"),
        "pushed_at": "2026-09-17T10:00:00Z",
        "fork": false,
        "archived": false,
        "private": false,
        "visibility": "public"
    })
}

/// GraphQL repository node for the explicit-public control.
#[must_use]
pub fn graphql_public_control() -> Value {
    json!({
        "nameWithOwner": format!("{PUBLIC_CONTROL_OWNER}/{PUBLIC_CONTROL_REPO}"),
        "pushedAt": "2026-09-17T10:00:00Z",
        "stargazerCount": PUBLIC_CONTROL_STARS,
        "isFork": false,
        "isPrivate": false,
        "visibility": "PUBLIC"
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn canary_detection_covers_name_owner_marker_and_value() {
        assert!(canary_leak(format!("x {CANARY_REPO} y").as_bytes()).is_some());
        assert!(canary_leak(format!("x {CANARY_OWNER} y").as_bytes()).is_some());
        assert!(canary_leak(format!("x {CANARY_MARKER} y").as_bytes()).is_some());
        assert!(canary_leak(format!("x {CANARY_STARS} y").as_bytes()).is_some());
        assert!(canary_leak(b"{\"repo\":\"pdf-reader-mcp\"}").is_none());
        assert!(assert_no_canary(b"clean").is_ok());
    }

    #[test]
    fn canary_fixtures_are_not_provably_public() {
        assert!(!crate::github_visibility::rest_value_is_explicitly_public(
            &rest_unverifiable_canary()
        ));
        assert!(!crate::github_visibility::rest_value_is_explicitly_public(
            &rest_private_canary()
        ));
        assert!(!crate::github_visibility::graphql_repo_is_explicitly_public(
            &graphql_unverifiable_canary()
        ));
        assert!(!crate::github_visibility::graphql_repo_is_explicitly_public(
            &graphql_private_canary()
        ));
        assert!(crate::github_visibility::rest_value_is_explicitly_public(
            &rest_public_control()
        ));
        assert!(crate::github_visibility::graphql_repo_is_explicitly_public(
            &graphql_public_control()
        ));
    }
}