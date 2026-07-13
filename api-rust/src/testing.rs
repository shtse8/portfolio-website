//! Test-only reset hooks for integration/wiremock suites.

use std::sync::{Mutex, MutexGuard};

/// Process-wide lock for tests that mutate process env + static caches.
static ENV_LOCK: Mutex<()> = Mutex::new(());

#[doc(hidden)]
pub struct EnvGuard {
    _lock: MutexGuard<'static, ()>,
    keys: Vec<String>,
}

impl EnvGuard {
    pub fn acquire(keys: &[&str]) -> Self {
        let lock = ENV_LOCK.lock().unwrap_or_else(|e| e.into_inner());
        crate::stats::reset_cache_for_tests();
        crate::activity::reset_cache_for_tests();
        crate::tools::reset_repos_cache_for_tests();
        crate::rate_limit::reset_state_for_tests();
        Self {
            _lock: lock,
            keys: keys.iter().map(|s| (*s).to_string()).collect(),
        }
    }

    pub fn set(&self, key: &str, value: &str) {
        // SAFETY: held under ENV_LOCK; tests serialise env mutation via this guard.
        unsafe { std::env::set_var(key, value) };
    }
}

impl Drop for EnvGuard {
    fn drop(&mut self) {
        for key in &self.keys {
            unsafe { std::env::remove_var(key) };
        }
        crate::stats::reset_cache_for_tests();
        crate::activity::reset_cache_for_tests();
        crate::tools::reset_repos_cache_for_tests();
        crate::rate_limit::reset_state_for_tests();
    }
}

#[doc(hidden)]
pub fn reset_all() {
    crate::stats::reset_cache_for_tests();
    crate::activity::reset_cache_for_tests();
    crate::tools::reset_repos_cache_for_tests();
    crate::rate_limit::reset_state_for_tests();
}
