#!/usr/bin/env bash
# Portfolio API differential parity — TS contract oracle vs Rust contract SSOT.
# Fail-closed: requires bun (no SKIP-as-pass). See ADR-168 / rej-010.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRATCH="${SCRATCH_DIR:-/tmp/portfolio-api-differential}"
mkdir -p "$SCRATCH"
LOG="$SCRATCH/differential.log"
ARTIFACT="$SCRATCH/verification.json"
ORACLE_JSON="$SCRATCH/oracle.json"
SLICE_FILTER="all"
: >"$LOG"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slice)
      SLICE_FILTER="${2:-}"
      shift 2
      ;;
    *)
      echo "::error::unknown argument: $1" | tee -a "$LOG"
      exit 1
      ;;
  esac
done

case "$SLICE_FILTER" in
  all|health|pkgValidation|cors|clientIp|rateLimitConstants|activity|proto-contract) ;;
  *)
    echo "::error::invalid --slice value: $SLICE_FILTER" | tee -a "$LOG"
    exit 1
    ;;
esac

cd "$REPO_ROOT"

if ! command -v bun >/dev/null 2>&1; then
  echo "::error::bun required for portfolio differential parity — no SKIP-as-pass" | tee -a "$LOG"
  exit 1
fi

echo "=== portfolio API differential parity $(date -Iseconds) slice=${SLICE_FILTER} ===" | tee -a "$LOG"

echo "--- check-no-ts-backend gate ---" | tee -a "$LOG"
bash "$REPO_ROOT/scripts/check-no-ts-backend.sh" 2>&1 | tee -a "$LOG"

echo "--- build Rust artifacts ---" | tee -a "$LOG"
(
  cd "$REPO_ROOT/api-rust"
  cargo build 2>&1
) | tee -a "$LOG"

echo "--- TS contract oracle (deleted Bun api/ north-star semantics) ---" | tee -a "$LOG"
bun run "$REPO_ROOT/scripts/differential/portfolio-api-oracle.ts" >"$ORACLE_JSON" 2>>"$LOG"

run_rust_slice_test() {
  local label="$1"
  local test_name="$2"
  echo "--- Rust bounded slice: $label ---" | tee -a "$LOG"
  PORTFOLIO_ORACLE_JSON="$ORACLE_JSON" \
    cargo test --manifest-path "$REPO_ROOT/api-rust/Cargo.toml" --test portfolio_differential "$test_name" -- --nocapture 2>&1 | tee -a "$LOG"
}

case "$SLICE_FILTER" in
  health) run_rust_slice_test "health" health_differential_matches_ts_oracle ;;
  pkgValidation) run_rust_slice_test "pkgValidation" pkg_validation_differential_matches_ts_oracle ;;
  cors) run_rust_slice_test "cors" cors_differential_matches_ts_oracle ;;
  clientIp) run_rust_slice_test "clientIp" client_ip_differential_matches_ts_oracle ;;
  rateLimitConstants)
    run_rust_slice_test "rateLimitConstants" rate_limit_constants_differential_matches_ts_oracle
    ;;
  activity) run_rust_slice_test "activity" activity_differential_matches_ts_oracle ;;
  proto-contract)
    run_rust_slice_test "proto-contract" proto_contract_differential_matches_ts_oracle
    ;;
  all)
    run_rust_slice_test "health" health_differential_matches_ts_oracle
    run_rust_slice_test "pkgValidation" pkg_validation_differential_matches_ts_oracle
    run_rust_slice_test "cors" cors_differential_matches_ts_oracle
    run_rust_slice_test "clientIp" client_ip_differential_matches_ts_oracle
    run_rust_slice_test "rateLimitConstants" rate_limit_constants_differential_matches_ts_oracle
    run_rust_slice_test "activity" activity_differential_matches_ts_oracle
    run_rust_slice_test "proto-contract" proto_contract_differential_matches_ts_oracle
    echo "--- Rust differential test (full corpus) ---" | tee -a "$LOG"
    PORTFOLIO_ORACLE_JSON="$ORACLE_JSON" \
      cargo test --manifest-path "$REPO_ROOT/api-rust/Cargo.toml" --test portfolio_differential portfolio_differential_matches_ts_oracle -- --nocapture 2>&1 | tee -a "$LOG"
    ;;
esac

CANDIDATE_SHA="${CANDIDATE_SHA:-$(git -C "$REPO_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)}"
BASELINE_TS_SHA="$(git -C "$REPO_ROOT" log -1 --format=%H -- scripts/differential api-rust/src/contract.rs api-rust/tests/portfolio_differential.rs 2>/dev/null || echo unknown)"
RUST_SHA="$CANDIDATE_SHA"
BEHAVIOR_SPEC_HASH="$(sha256sum "$REPO_ROOT/scripts/differential/fixtures/portfolio-api-corpus.json" "$REPO_ROOT/docs/specs/portfolio-api-parity-slice.json" 2>/dev/null | awk '{print $1}' | sha256sum | awk '{print $1}' || echo missing)"
FIXTURE_CORPUS_HASH="$(jq -r '.fixtureCorpusHash' "$ORACLE_JSON")"
CONTRACT_HASH="$(sha256sum "$REPO_ROOT/api-rust/src/contract.rs" 2>/dev/null | awk '{print $1}' || echo missing)"
CASE_COUNT="$(jq '.cases | length' "$ORACLE_JSON")"
HEALTH_CASES="$(jq '[.cases[] | select(.slice == "health")] | length' "$ORACLE_JSON")"
PKG_CASES="$(jq '[.cases[] | select(.slice == "pkgValidation")] | length' "$ORACLE_JSON")"
CORS_CASES="$(jq '[.cases[] | select(.slice == "cors")] | length' "$ORACLE_JSON")"
CLIENT_IP_CASES="$(jq '[.cases[] | select(.slice == "clientIp")] | length' "$ORACLE_JSON")"
RATE_CASES="$(jq '[.cases[] | select(.slice == "rateLimitConstants")] | length' "$ORACLE_JSON")"
ACTIVITY_CASES="$(jq '[.cases[] | select(.slice == "activity")] | length' "$ORACLE_JSON")"
PROTO_CASES="$(jq '[.cases[] | select(.slice == "proto-contract")] | length' "$ORACLE_JSON")"

jq -n \
  --arg verifiedAt "$(date -Iseconds)" \
  --arg candidateSha "$CANDIDATE_SHA" \
  --arg baselineTsSha "$BASELINE_TS_SHA" \
  --arg rustCandidateSha "$RUST_SHA" \
  --arg behaviorSpecHash "$BEHAVIOR_SPEC_HASH" \
  --arg fixtureCorpusHash "$FIXTURE_CORPUS_HASH" \
  --arg contractHash "$CONTRACT_HASH" \
  --arg sliceFilter "$SLICE_FILTER" \
  --argjson caseCount "$CASE_COUNT" \
  --argjson healthCaseCount "$HEALTH_CASES" \
  --argjson pkgCaseCount "$PKG_CASES" \
  --argjson corsCaseCount "$CORS_CASES" \
  --argjson clientIpCaseCount "$CLIENT_IP_CASES" \
  --argjson rateCaseCount "$RATE_CASES" \
  --argjson activityCaseCount "$ACTIVITY_CASES" \
  --argjson protoCaseCount "$PROTO_CASES" \
  '{
    schemaVersion: 2,
    repo: "shtse8/portfolio-website",
    slice: (if $sliceFilter == "all" then "activity-api|backend-caps" else $sliceFilter end),
    sliceFilter: $sliceFilter,
    status: "differential_green",
    verifiedAt: $verifiedAt,
    lastComparedMainSha: $candidateSha,
    mergeGroupSha: $candidateSha,
    baselineTsSha: $baselineTsSha,
    rustCandidateSha: $rustCandidateSha,
    behaviorSpecHash: $behaviorSpecHash,
    fixtureCorpusHash: $fixtureCorpusHash,
    contractHash: $contractHash,
    caseCount: $caseCount,
    healthCaseCount: $healthCaseCount,
    pkgCaseCount: $pkgCaseCount,
    corsCaseCount: $corsCaseCount,
    clientIpCaseCount: $clientIpCaseCount,
    rateCaseCount: $rateCaseCount,
    activityCaseCount: $activityCaseCount,
    protoCaseCount: $protoCaseCount,
    harness: "scripts/run-portfolio-differential.sh",
    differentialTest: "api-rust/tests/portfolio_differential.rs#portfolio_differential_matches_ts_oracle",
    oracle: "scripts/differential/portfolio-api-oracle.ts",
    gate: "scripts/check-no-ts-backend.sh",
    capabilitiesProven: [
      "api-activity-feed",
      "api-cors-rate-limit",
      "api-health-ready",
      "api-terminal-tools",
      "proto-portfolio-contract"
    ]
  }' >"$ARTIFACT"

echo "portfolio-differential: OK (cases=$CASE_COUNT health=$HEALTH_CASES pkg=$PKG_CASES cors=$CORS_CASES clientIp=$CLIENT_IP_CASES rate=$RATE_CASES activity=$ACTIVITY_CASES proto=$PROTO_CASES corpus=$FIXTURE_CORPUS_HASH)" | tee -a "$LOG"
echo "verification artifact: $ARTIFACT" | tee -a "$LOG"