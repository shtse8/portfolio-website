#!/usr/bin/env bash
# WEB-STATS BFF: Platform injects API_INTERNAL_URL as :3001 (container PORT).
# Knative queue-proxy is :80. Rendered nginx must not proxy to :3001.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF="${ROOT}/nginx.conf"

fail() { echo "FAIL: $*" >&2; exit 1; }

[[ -f "$CONF" ]] || fail "nginx.conf missing"

if grep -q '\${API_INTERNAL_URL}' "$CONF"; then
  fail "nginx.conf must not envsubst API_INTERNAL_URL (Platform sets :3001)"
fi

python3 - "$CONF" <<'PY'
import re, sys
from pathlib import Path

src = Path(sys.argv[1]).read_text()
injected = "http://api.portfolio-website.sylphx.internal:3001"
rendered = src.replace("${PORT}", "3000").replace("${API_INTERNAL_URL}", injected)

upstream = re.search(r'set \$bff_upstream\s+"([^"]+)";', rendered)
if not upstream:
    sys.exit("FAIL: $bff_upstream is missing")
if ":3001" in upstream.group(1) or injected in upstream.group(1):
    sys.exit(f"FAIL: $bff_upstream uses container port: {upstream.group(1)}")
if upstream.group(1) != "http://api.portfolio-website.svc.cluster.local":
    sys.exit(f"FAIL: $bff_upstream is not the api ksvc on implied :80: {upstream.group(1)}")

passes = re.findall(r"(?m)^\s*proxy_pass\s+([^;]+);", rendered)
if not passes:
    sys.exit("FAIL: no proxy_pass directives")
bad = [p for p in passes if p.strip() != "$bff_upstream$request_uri"]
if bad:
    sys.exit(f"FAIL: proxy_pass must keep request URI; got {bad}")

print("check-bff-upstream: PASS — BFF upstream is ksvc :80; :3001 injection cannot become proxy_pass")
PY
