//! Input validation shared by HTTP handlers (parity with retired Bun `api/`).

pub fn valid_npm_pkg(pkg: &str) -> bool {
    if pkg.is_empty() || pkg.len() > 80 {
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
        && rest
            .chars()
            .next()
            .is_some_and(|c| c.is_ascii_alphanumeric())
        && rest
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
}

pub fn valid_repo_name(name: &str) -> bool {
    let raw = name.trim().trim_start_matches(|c: char| c == '/' || c == '.');
    let raw = raw.rsplit('/').next().unwrap_or(raw);
    !raw.is_empty()
        && raw.len() <= 100
        && raw
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn npm_pkg_matches_bun_regex() {
        assert!(valid_npm_pkg("@sylphx/pdf-reader-mcp"));
        assert!(!valid_npm_pkg("not valid spaces"));
    }
}
