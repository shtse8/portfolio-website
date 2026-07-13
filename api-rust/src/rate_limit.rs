use crate::contract::{
    client_ip as contract_client_ip, check_rate_limit_isolated, LimitVerdict as ContractLimitVerdict,
    RateLimitState,
};
use std::sync::Mutex;

#[derive(Debug, PartialEq, Eq)]
pub enum LimitVerdict {
    Ok,
    TooFast,
    DailyIp,
    GlobalDaily,
}

impl From<ContractLimitVerdict> for LimitVerdict {
    fn from(value: ContractLimitVerdict) -> Self {
        match value {
            ContractLimitVerdict::Ok => Self::Ok,
            ContractLimitVerdict::TooFast => Self::TooFast,
            ContractLimitVerdict::DailyIp => Self::DailyIp,
            ContractLimitVerdict::GlobalDaily => Self::GlobalDaily,
        }
    }
}

static STATE: std::sync::OnceLock<Mutex<RateLimitState>> = std::sync::OnceLock::new();

fn state() -> &'static Mutex<RateLimitState> {
    STATE.get_or_init(|| Mutex::new(RateLimitState::default()))
}

pub fn client_ip(headers: &[(String, String)]) -> String {
    contract_client_ip(headers)
}

pub fn check_rate_limit(ip: &str, now: u64) -> LimitVerdict {
    let Ok(mut guard) = state().lock() else {
        return LimitVerdict::GlobalDaily;
    };
    check_rate_limit_isolated(ip, now, &mut guard).into()
}

#[doc(hidden)]
pub fn reset_state_for_tests() {
    if let Ok(mut guard) = state().lock() {
        *guard = RateLimitState::default();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::contract::IP_MAX_IN_WINDOW;

    #[test]
    fn rate_limit_blocks_burst() {
        let ip = "203.0.113.1".to_string();
        let base = 1_700_000_000_000u64;
        for i in 0..IP_MAX_IN_WINDOW {
            assert_eq!(check_rate_limit(&ip, base + i as u64), LimitVerdict::Ok);
        }
        assert_eq!(
            check_rate_limit(&ip, base + IP_MAX_IN_WINDOW as u64),
            LimitVerdict::TooFast
        );
    }
}
