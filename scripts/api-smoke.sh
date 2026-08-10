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

claims="$(curl -fsS "$BASE_URL/claims")"
echo "$claims" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d.get('schema')=='kylet.se/claim-pack/v1'; assert d.get('promise')" \
  || fail "/claims: $claims"
pass "/claims"

ready="$(curl -fsS "$BASE_URL/chat/ready")"
echo "$ready" | python3 -c "import json,sys; d=json.load(sys.stdin); assert 'ready' in d; assert 'host' in d" \
  || fail "/chat/ready: $ready"
pass "/chat/ready"

# Scoped + unscoped alias must resolve to real npm series for flagship.
dl_unscoped="$(curl -fsS "$BASE_URL/downloads?pkg=pdf-reader-mcp")"
echo "$dl_unscoped" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d.get('total',0)>0, d; assert '@sylphx' in d.get('pkg','')" \
  || fail "/downloads alias: $dl_unscoped"
pass "/downloads unscoped→scoped alias"

chat_ready="$(echo "$ready" | python3 -c "import json,sys; print(json.load(sys.stdin).get('ready'))")"
if [[ "$chat_ready" != "True" && "$chat_ready" != "true" ]]; then
  echo "WARN: /chat/ready ready=false — agent fail-closed (credentials/host). Skipping chat stream assert."
else
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
fi

echo "=== portfolio-api prod smoke passed ==="