#!/usr/bin/env python3
"""Write the site's Content-Security-Policy header for nginx from the pack.

keel-web puts one inline module script on island pages (the loader that
imports the islands client when an island nears the viewport). Until
keel-pack emits a policy with hashes itself (keel#3808), this reads every
exported page, hashes each inline script the browser would run (JSON data
blocks are not run), and allows exactly those hashes. No 'unsafe-inline' for
scripts. Usage: csp.py DIST > csp.conf
"""
import base64, hashlib, pathlib, re, sys

dist = pathlib.Path(sys.argv[1])
script = re.compile(r"<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>", re.S)
hashes = set()
for page in dist.rglob("*.html"):
    for m in script.finditer(page.read_text(encoding="utf-8")):
        attrs = m.group("attrs")
        if "src=" in attrs or re.search(r'type="application/(ld\+)?json"', attrs):
            continue
        digest = base64.b64encode(hashlib.sha256(m.group("body").encode()).digest()).decode()
        hashes.add(f"'sha256-{digest}'")
policy = "; ".join([
    "default-src 'none'",
    " ".join(["script-src 'self' 'wasm-unsafe-eval'", *sorted(hashes)]),
    # Each page's styles are one inline <style> keel-web writes; hashed or
    # nonced once keel#3808 lands.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
])
print(f'add_header Content-Security-Policy "{policy}" always;')
