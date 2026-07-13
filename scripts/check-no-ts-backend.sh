#!/usr/bin/env bash
# ADR-168 S3 gate: Bun api/ backend authority must remain deleted; api-rust is sole API SSOT.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
violations=0

report_violation() {
  echo "VIOLATION: $*"
  violations=$((violations + 1))
}

if [[ -d "${ROOT}/api" ]]; then
  report_violation "api/ directory must remain deleted (Bun backend retired)"
fi

if [[ ! -d "${ROOT}/api-rust" ]]; then
  report_violation "api-rust/ authority tree missing"
fi

if [[ ! -f "${ROOT}/api-rust/src/main.rs" ]]; then
  report_violation "api-rust/src/main.rs missing"
fi

if [[ -f "${ROOT}/package.json" ]] && grep -qE '"api/' "${ROOT}/package.json"; then
  report_violation "package.json must not reference deleted api/ scripts"
fi

if [[ "${violations}" -gt 0 ]]; then
  echo ""
  echo "FAIL: ${violations} TS backend authority violation(s)."
  exit 1
fi

echo "check-no-ts-backend: PASS — api/ absent; api-rust authority present"