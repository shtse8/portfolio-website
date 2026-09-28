#!/bin/sh
# Turn the pack's host rules into nginx config, so the redirects and headers
# keel pack writes (`_redirects`, `_headers`: the site's Route::redirect
# routes, keel-web's header rules and keel pack's Content-Security-Policy)
# have one source. Usage: pack-rules.sh DIST OUT_DIR
# writes OUT_DIR/pack-headers.conf (the `/*` headers, sent on every response)
# and OUT_DIR/pack-rules.conf (a location per redirect and per exact path
# with headers of its own).
#
# `_redirects`: `FROM TO STATUS` lines, exact paths only (the site has no
# patterns). `_headers`: a path line, then indented `Name: value` lines.
set -eu
dist=$1 out=$2
header_lines() { # $1: path; prints `add_header` lines for that block
  awk -v want="$1" '
    /^[^ \t]/ { path = $0; next }
    path == want && /^[ \t]+[A-Za-z-]+:/ {
      sub(/^[ \t]+/, ""); name = $0; sub(/:.*/, "", name); value = $0; sub(/^[^:]*:[ \t]*/, "", value)
      gsub(/"/, "\\\"", value)
      printf "add_header %s \"%s\" always;\n", name, value
    }' "$dist/_headers"
}
header_lines '/*' > "$out/pack-headers.conf"
{
  awk 'NF == 3 && $1 !~ /\*/ { printf "location = %s { return %s %s; }\n", $1, $3, $2 }' "$dist/_redirects"
  for path in $(awk '/^\// && $0 != "/*" { print }' "$dist/_headers"); do
    printf 'location = %s { include /etc/nginx/snippets/headers.conf; %s }\n' "$path" "$(header_lines "$path" | tr '\n' ' ')"
  done
} > "$out/pack-rules.conf"
