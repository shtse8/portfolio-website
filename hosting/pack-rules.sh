#!/bin/sh
# Turn the pack's host rules into nginx locations, so the redirects and
# headers keel pack writes for Cloudflare Pages (`_redirects`, `_headers`,
# from the site's Route::redirect routes and keel-web's header rules) have one
# source. Usage: pack-rules.sh DIST > rules.conf
#
# `_redirects`: `FROM TO STATUS` lines, exact paths only (the site has no
# patterns); each becomes `location = FROM { return STATUS TO; }`.
# `_headers`: a path line, then indented `Name: value` lines. `/*` holds the
# headers every response gets (nginx.conf sets those once); an exact path
# becomes a location that adds its headers to the site-wide ones.
set -eu
dist=$1
awk 'NF == 3 && $1 !~ /\*/ { printf "location = %s { return %s %s; }\n", $1, $3, $2 }' "$dist/_redirects"
awk '
  /^[^ \t]/ { path = $0; next }
  path != "/*" && /^[ \t]+[A-Za-z-]+:/ {
    sub(/^[ \t]+/, ""); name = $0; sub(/:.*/, "", name); value = $0; sub(/^[^:]*:[ \t]*/, "", value)
    printf "location = %s { include /etc/nginx/snippets/headers.conf; add_header %s \"%s\" always; }\n", path, name, value
  }
' "$dist/_headers"
