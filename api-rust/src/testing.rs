//! Test-only reset hooks for integration/wiremock suites.

#[doc(hidden)]
pub fn reset_all() {
    crate::stats::reset_cache_for_tests();
    crate::activity::reset_cache_for_tests();
    crate::tools::reset_repos_cache_for_tests();
    crate::rate_limit::reset_state_for_tests();
}
