//! TRUE differential parity: TS contract oracle vs native Rust contract SSOT.
//!
//! Fail-closed — no SKIP-as-pass. Oracle subprocess must succeed before comparison.
//! Bounded slice entrypoints (rej-010):
//! - health, pkgValidation, cors, clientIp, rateLimitConstants, activity, proto-contract
//! See scripts/run-portfolio-differential.sh

use std::fs;
use std::path::PathBuf;
use std::process::Command;

use kylet_api_rust::contract::{
    aggregate_activity_from_graphql, allowed_origin, client_ip, cors_header_map,
    proto_contract_summary, rate_limit_constants, simulate_burst_verdicts, valid_pkg,
};
use serde::Deserialize;
use serde_json::{json, Value};

fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..")
}

#[derive(Debug, Deserialize)]
struct OracleCase {
    id: String,
    slice: String,
    domain: String,
    input: Value,
    output: Value,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct OracleCorpus {
    corpus_version: u32,
    fixture_corpus_hash: String,
    cases: Vec<OracleCase>,
}

fn load_oracle_corpus() -> OracleCorpus {
    if let Ok(path) = std::env::var("PORTFOLIO_ORACLE_JSON") {
        let raw = fs::read_to_string(&path)
            .unwrap_or_else(|error| panic!("read oracle artifact {path}: {error}"));
        return serde_json::from_str(&raw).expect("oracle artifact must be valid JSON");
    }

    let script = repo_root().join("scripts/differential/portfolio-api-oracle.ts");
    let output = Command::new("bun")
        .arg("run")
        .arg(&script)
        .current_dir(repo_root())
        .output()
        .unwrap_or_else(|error| panic!("spawn TS oracle at {}: {error}", script.display()));

    assert!(
        output.status.success(),
        "TS oracle failed:\nstdout: {}\nstderr: {}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );

    serde_json::from_slice(&output.stdout).expect("oracle output must be valid JSON")
}

fn evaluate_rust(case: &OracleCase) -> Value {
    match case.domain.as_str() {
        "healthz" => json!({ "status": "ok" }),
        "validPkg" => json!(valid_pkg(
            case.input
                .get("pkg")
                .and_then(Value::as_str)
                .unwrap_or_default()
        )),
        "allowedOrigin" => {
            let origin = case.input.get("origin").and_then(Value::as_str);
            json!(allowed_origin(origin))
        }
        "corsHeaders" => {
            let origin = case.input.get("origin").and_then(Value::as_str);
            json!(cors_header_map(origin))
        }
        "clientIp" => {
            let headers: Vec<(String, String)> = case
                .input
                .get("headers")
                .and_then(Value::as_array)
                .map(|rows| {
                    rows.iter()
                        .filter_map(|row| {
                            let pair = row.as_array()?;
                            Some((
                                pair.first()?.as_str()?.to_string(),
                                pair.get(1)?.as_str()?.to_string(),
                            ))
                        })
                        .collect()
                })
                .unwrap_or_default();
            json!(client_ip(&headers))
        }
        "constants" => rate_limit_constants(),
        "burst" => {
            let ip = case.input.get("ip").and_then(Value::as_str).unwrap_or("");
            let base = case.input.get("base").and_then(Value::as_u64).unwrap_or(0);
            let (verdicts, final_verdict) = simulate_burst_verdicts(ip, base);
            json!({ "verdicts": verdicts, "final": final_verdict })
        }
        "aggregate" => {
            let graphql = case.input.get("graphql").cloned().unwrap_or(json!({}));
            let owner_keys: Vec<String> = case
                .input
                .get("ownerKeys")
                .and_then(Value::as_array)
                .map(|keys| {
                    keys.iter()
                        .filter_map(Value::as_str)
                        .map(str::to_string)
                        .collect()
                })
                .unwrap_or_default();
            let now_ms = case.input.get("nowMs").and_then(Value::as_u64).unwrap_or(0);
            let updated_at = case
                .input
                .get("updatedAt")
                .and_then(Value::as_str)
                .unwrap_or("");
            let payload =
                aggregate_activity_from_graphql(&graphql, &owner_keys, now_ms, updated_at);
            serde_json::to_value(payload).expect("activity payload json")
        }
        "service" => {
            let rel = case.input.get("path").and_then(Value::as_str).unwrap_or("");
            proto_contract_summary(&repo_root().join(rel))
        }
        other => panic!("unknown oracle domain: {other}"),
    }
}

fn run_slice_cases(corpus: &OracleCorpus, slice: &str) {
    for case in corpus.cases.iter().filter(|c| c.slice == slice) {
        let actual = evaluate_rust(case);
        assert_eq!(
            actual, case.output,
            "case {} ({}) mismatch",
            case.id, case.domain
        );
    }
}

fn run_all_cases(corpus: &OracleCorpus) {
    for case in &corpus.cases {
        let actual = evaluate_rust(case);
        assert_eq!(
            actual, case.output,
            "case {} ({}) mismatch",
            case.id, case.domain
        );
    }
}

#[test]
fn health_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "health");
}

#[test]
fn pkg_validation_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "pkgValidation");
}

#[test]
fn cors_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "cors");
}

#[test]
fn client_ip_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "clientIp");
}

#[test]
fn rate_limit_constants_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "rateLimitConstants");
}

#[test]
fn activity_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "activity");
}

#[test]
fn proto_contract_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_slice_cases(&corpus, "proto-contract");
}

#[test]
fn portfolio_differential_matches_ts_oracle() {
    let corpus = load_oracle_corpus();
    run_all_cases(&corpus);
}

#[test]
fn cors_headers_match_contract() {
    let headers = cors_header_map(Some("https://kylet.se"));
    assert_eq!(
        headers.get("access-control-allow-origin").map(String::as_str),
        Some("https://kylet.se")
    );
    assert_eq!(
        headers.get("access-control-allow-methods").map(String::as_str),
        Some("GET, POST, OPTIONS")
    );
}