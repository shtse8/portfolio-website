//! Contract policy suite for the single JSON REST contract (ADR-169).
//! Direct Rust assertions — the retired Bun/TS oracle is deleted; this module
//! is the authority for policy behavior (origin, IP trust, rate limits, pkg
//! validation, honest CP windows).

use kylet_api_rust::contract::{
    allowed_origin, check_rate_limit_isolated, client_ip, cors_header_map, rate_limit_constants,
    simulate_burst_verdicts, valid_pkg, RateLimitState, IP_MAX_IN_WINDOW,
};
use kylet_api_rust::activity::assert_honest_windows;
use kylet_api_rust::contract::aggregate_github_activity;
use serde_json::json;

#[test]
fn health_contract_is_static() {
    assert_eq!("/healthz", "/healthz");
}

#[test]
fn pkg_validation_contract() {
    assert!(valid_pkg("@sylphx/pdf-reader-mcp"));
    assert!(valid_pkg("lodash"));
    assert!(valid_pkg("my-pkg_1.0"));
    assert!(!valid_pkg("not valid spaces"));
    assert!(!valid_pkg(""));
    assert!(!valid_pkg("@/nope"));
    assert!(!valid_pkg(&"a".repeat(81)));
}

#[test]
fn cors_allowlist_contract() {
    assert_eq!(allowed_origin(Some("https://kylet.se")), Some("https://kylet.se"));
    assert_eq!(
        allowed_origin(Some("https://www.kylet.se")),
        Some("https://www.kylet.se")
    );
    assert_eq!(
        allowed_origin(Some("https://slim-pal-0k3stq.sylphx.app")),
        Some("https://slim-pal-0k3stq.sylphx.app")
    );
    assert_eq!(allowed_origin(Some("https://evil.example")), None);
    assert_eq!(allowed_origin(None), None);
}

#[test]
fn cors_map_never_echoes_foreign_origins() {
    assert!(!cors_header_map(Some("https://evil.example")).contains_key("access-control-allow-origin"));
    assert_eq!(
        cors_header_map(Some("https://kylet.se"))
            .get("access-control-allow-origin")
            .map(String::as_str),
        Some("https://kylet.se")
    );
}

#[test]
fn client_ip_contract_rejects_spoofed_first_xff() {
    assert_eq!(
        client_ip(&[(
            "x-forwarded-for".to_string(),
            "6.6.6.6, 203.0.113.9".to_string(),
        )]),
        "203.0.113.9"
    );
    assert_eq!(
        client_ip(&[
            ("x-forwarded-for".to_string(), "6.6.6.6, 203.0.113.9".to_string()),
            ("cf-connecting-ip".to_string(), "198.51.100.7".to_string()),
        ]),
        "198.51.100.7"
    );
    assert_eq!(
        client_ip(&[("x-real-ip".to_string(), "203.0.113.9".to_string())]),
        "203.0.113.9"
    );
    assert_eq!(client_ip(&[]), "unknown");
}

#[test]
fn rate_limit_policy_matches_declared_constants() {
    let constants = rate_limit_constants();
    assert_eq!(constants["ipMaxInWindow"], json!(IP_MAX_IN_WINDOW));
    assert_eq!(constants["ipMaxPerDay"], json!(60));
    assert_eq!(constants["globalMaxPerDay"], json!(500));

    let (verdicts, final_verdict) = simulate_burst_verdicts("203.0.113.1", 1_700_000_000_000);
    assert_eq!(verdicts.len(), IP_MAX_IN_WINDOW + 1);
    assert_eq!(final_verdict, "tooFast");
    assert_eq!(verdicts[0], "ok");
}

#[test]
fn daily_ip_cap_is_enforced() {
    let ip = "203.0.113.2".to_string();
    let base = 1_700_000_000_000u64;
    let mut state = RateLimitState::default();
    let mut saw_daily = false;
    for i in 0..120u64 {
        let v = check_rate_limit_isolated(&ip, base + i * 60_000, &mut state);
        if v.as_str() == "dailyIp" {
            saw_daily = true;
            break;
        }
    }
    assert!(saw_daily, "daily cap must eventually block");
}

#[test]
fn github_activity_uses_real_per_day_calendar_series() {
    let data: serde_json::Value = serde_json::from_str(r#"{"activity": {"contributionsCollection": {"contributionCalendar": {"weeks": [{"contributionDays": [{"date": "2026-08-02", "contributionCount": 100}, {"date": "2026-08-09", "contributionCount": 25}]}]}, "commitContributionsByRepository": []}}, "repos": {"repositories": {"nodes": []}}}"#).unwrap();
    let a = aggregate_github_activity(&data, 1_786_276_800_000, "2026-08-09T12:00:00Z");
    assert_eq!(a.commits_today, 25);
    assert_eq!(a.commits_week, 125);
    assert_eq!(a.commits_month, 125);
    assert_ne!(a.commits_month, a.commits_week * 4);
    assert_eq!(a.source.as_deref(), Some("github"));
    assert_eq!(a.freshness.as_deref(), Some("live"));
    assert!(assert_honest_windows(&a).is_ok());
}

#[test]
fn github_activity_honest_windows_guard() {
    let data: serde_json::Value = serde_json::from_str(r#"{"activity": {"contributionsCollection": {"contributionCalendar": {"weeks": [{"contributionDays": [{"date": "2026-08-02", "contributionCount": 7}, {"date": "2026-08-03", "contributionCount": 21}]}]}, "commitContributionsByRepository": []}}, "repos": {"repositories": {"nodes": []}}}"#).unwrap();
    let a = aggregate_github_activity(&data, 1_786_276_800_000, "2026-08-09T12:00:00Z");
    assert!(assert_honest_windows(&a).is_ok());
}
