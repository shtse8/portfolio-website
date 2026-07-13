use std::collections::HashMap;
use std::sync::Mutex;

const IP_WINDOW_MS: u64 = 3 * 60_000;
const IP_MAX_IN_WINDOW: usize = 12;
const IP_MAX_PER_DAY: usize = 60;
const GLOBAL_MAX_PER_DAY: usize = 500;
const MAP_CAP: usize = 50_000;

#[derive(Debug, PartialEq, Eq)]
pub enum LimitVerdict {
    Ok,
    TooFast,
    DailyIp,
    GlobalDaily,
}

static STATE: std::sync::OnceLock<Mutex<RateState>> = std::sync::OnceLock::new();

struct RateState {
    ip_hits: HashMap<String, Vec<u64>>,
    ip_day: HashMap<String, DayCount>,
    global_day: DayCount,
    last_prune: u64,
}

struct DayCount {
    day: i64,
    n: usize,
}

fn state() -> &'static Mutex<RateState> {
    STATE.get_or_init(|| {
        Mutex::new(RateState {
            ip_hits: HashMap::new(),
            ip_day: HashMap::new(),
            global_day: DayCount { day: -1, n: 0 },
            last_prune: 0,
        })
    })
}

fn day_number(now: u64) -> i64 {
    (now / 86_400_000) as i64
}

pub fn client_ip(headers: &[(String, String)]) -> String {
    let pick = |name: &str| -> Option<String> {
        headers
            .iter()
            .find(|(k, _)| k.eq_ignore_ascii_case(name))
            .map(|(_, v)| v.clone())
    };
    let raw = pick("x-forwarded-for")
        .and_then(|v| v.split(',').next().map(str::trim).map(str::to_string))
        .or_else(|| pick("x-real-ip"))
        .or_else(|| pick("x-envoy-external-address"))
        .or_else(|| pick("cf-connecting-ip"))
        .unwrap_or_else(|| "unknown".to_string());
    raw.chars().take(45).collect()
}

pub fn check_rate_limit(ip: &str, now: u64) -> LimitVerdict {
    let Ok(mut guard) = state().lock() else {
        return LimitVerdict::GlobalDaily;
    };
    maybe_prune(&mut guard, now);
    let day = day_number(now);
    if guard.global_day.day != day {
        guard.global_day = DayCount { day, n: 0 };
    }
    if guard.global_day.n >= GLOBAL_MAX_PER_DAY {
        return LimitVerdict::GlobalDaily;
    }
    if ip != "unknown" && (guard.ip_day.contains_key(ip) || guard.ip_day.len() < MAP_CAP) {
        let day_count = guard
            .ip_day
            .get(ip)
            .filter(|d| d.day == day)
            .map(|d| d.n)
            .unwrap_or(0);
        if day_count >= IP_MAX_PER_DAY {
            return LimitVerdict::DailyIp;
        }
        let hits: Vec<u64> = guard
            .ip_hits
            .get(ip)
            .map(|h| h.iter().copied().filter(|t| now.saturating_sub(*t) < IP_WINDOW_MS).collect())
            .unwrap_or_default();
        if hits.len() >= IP_MAX_IN_WINDOW {
            return LimitVerdict::TooFast;
        }
        let mut new_hits = hits;
        new_hits.push(now);
        guard.ip_hits.insert(ip.to_string(), new_hits);
        guard.ip_day.insert(ip.to_string(), DayCount {
            day,
            n: day_count + 1,
        });
    }
    guard.global_day.n += 1;
    LimitVerdict::Ok
}

fn maybe_prune(guard: &mut RateState, now: u64) {
    if now.saturating_sub(guard.last_prune) < 10 * 60_000 {
        return;
    }
    guard.last_prune = now;
    let day = day_number(now);
    guard.ip_hits.retain(|_, hits| {
        hits.retain(|t| now.saturating_sub(*t) < IP_WINDOW_MS);
        !hits.is_empty()
    });
    guard.ip_day.retain(|_, d| d.day == day);
}

#[doc(hidden)]
pub fn reset_state_for_tests() {
    if let Ok(mut guard) = state().lock() {
        guard.ip_hits.clear();
        guard.ip_day.clear();
        guard.global_day = DayCount { day: -1, n: 0 };
        guard.last_prune = 0;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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