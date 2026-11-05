#!/bin/sh
# Run from the workspace root. The site and CLI consume one exact public release.
set -eu
keel_version=$(cat KEEL_PIN)
grep -Fqx "keel = { package = \"sylphx-keel-engine\", version = \"=$keel_version\", default-features = false }" Cargo.toml
