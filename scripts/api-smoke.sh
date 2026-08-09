#!/usr/bin/env bash
# Production smoke for kylet-api-rust (single JSON REST contract, ADR-169).
set -euo pipefail

BASE_URL="${BASE_URL:-https://kylet.se}"

fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "PASS: $*"; }

echo "=== portfolio-api prod smoke $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "base: $BASE_URL"

healthz="$(curl -fsS "$BASE_URL/healthz")"
[[ "$healthz" == *"ok"* ]] || fail "/healthz: $healthz"
pass "/healthz"

stats="$(curl -fsS "$BASE_URL/stats")"
echo "$stats" | python3 -c "import json,sys; d=json.load(sys.stdin); assert 'githubStars' in d" \
  || fail "/stats: $stats"
pass "/stats"

projects="$(curl -fsS "$BASE_URL/projects")"
echo "$projects" | python3 -c "import json,sys; d=json.load(sys.stdin); assert isinstance(d.get('projects'), list); assert d.get('updatedAt')" \
  || fail "/projects: $projects"
pass "/projects"

activity="$(curl -fsS "$BASE_URL/activity")"
echo "$activity" | python3 -c "import json,sys; d=json.load(sys.stdin); assert 'commitsToday' in d; assert 'commitsWeek' in d; assert 'reposActiveToday' in d" \
  || fail "/activity: $activity"
pass "/activity"

chat_tmp="$(mktemp)"
chat_code="$(curl -sS -m 45 -o "$chat_tmp" -w "%{http_code}" -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","parts":[{"type":"text","text":"Who is Kyle in one sentence?"}]}]}')"
[[ "$chat_code" == "200" ]] || fail "/chat http $chat_code: $(head -c 400 "$chat_tmp")"
if grep -q 'gateway error\|"type":"error"' "$chat_tmp"; then
  fail "/chat stream error: $(grep -o 'errorText[^}]*' "$chat_tmp" | head -1 || head -c 400 "$chat_tmp")"
fi
if ! grep -q 'text-delta\|"type":"text"' "$chat_tmp"; then
  fail "/chat missing text stream: $(head -c 400 "$chat_tmp")"
fi
pass "/chat SSE with text content"
rm -f "$chat_tmp"

echo "=== portfolio-api prod smoke passed ==="