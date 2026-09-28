# kylet.se

Kyle Tse's personal site, built with [Keel Engine](https://keelengine.dev):
four static pages that Keel renders from Rust components to plain HTML, one
live Keel scene, and one small island (the contact address's Copy button).

- Site: https://kylet.se (Sylphx Hosting, org `shtse8`, project `curl-nod-67h1zf`)
- Vision: [docs/vision.md](docs/vision.md) · Capabilities: [docs/capabilities.md](docs/capabilities.md)
- Design (brand, tokens, pages, screenshots): [docs/design/](docs/design/)
- Every fact on the site and its source: [docs/design/content.md](docs/design/content.md)

## Layout

| Path | Owns |
| --- | --- |
| `site/src/lib.rs` | Routes, redirects, head metadata and the page frame (header, footer) |
| `site/src/pages.rs` | The four pages: `/`, `/about`, `/colophon`, not found |
| `site/src/content.rs` | Every fact the pages show (apps, tools, companies, timeline, track record, links) |
| `site/src/theme.rs` | Tokens and surface styles for the light and dark palettes |
| `site/src/islands.rs` | The contact island |
| `site/assets/` | Mark, icons, OG image, the scene poster, `site.css` (only named Keel gaps) and the generated `dark.css` |
| `scenes/` | The live scene (`keel_mount`) |
| `hosting/`, `nginx.conf`, `Dockerfile`, `sylphx.toml` | The image: `keel pack`, then nginx serving the pack with its redirects, headers and CSP |
| `tests/` | Browser checks (axe, 320 px, 44 px targets, redirects, 410s, CSP, the island), Lighthouse and screenshots |

The Keel revision lives in `Cargo.toml` (`[workspace.dependencies]`) and
`KEEL_PIN`; CI fails when they differ. On a pin bump run `keel migrate --check`
and then `keel migrate`.

## Commands

| Job | Command |
| --- | --- |
| Lint and checks | `cargo clippy --workspace --all-targets -- -D warnings` · `cargo test -p kylet-site` |
| Regenerate `dark.css` after a theme change | `KYLET_WRITE_DARK=1 cargo test -p kylet-site dark_stylesheet` |
| Serve with live reload | `keel dev --manifest-path site/Cargo.toml` |
| Build the site | `keel pack --profile web --release --manifest-path site/Cargo.toml` (writes `dist/web`) |
| Serve the pack as Pages would | `keel serve dist/web --manifest-path site/Cargo.toml` |
| Browser checks | `cd tests && bun install && BASE=http://127.0.0.1:4173 CHROME=/usr/bin/chromium bun browser.mjs` |
| Lighthouse (mobile, median of 3) | `cd tests && BASE=… CHROME_PATH=… bun lighthouse.mjs` |
| Screenshots | `cd tests && BASE=… OUT=../docs/design/screens bun shots.mjs` |

Keel is a private repository; `cargo` and `keel` need read access to
SylphxAI/keel (`gh auth setup-git` locally, a one-hour App token in CI and in
the image build).

## Checks and deploy

- **Pull requests:** `.github/workflows/ci.yml` on GitHub's free standard
  runner. `build` runs clippy, the site tests and `keel pack`; `browser`
  serves the pack with the production nginx config and runs the browser checks
  and Lighthouse. `ci-ok` is the check the `main` ruleset requires.
- **Deploy:** Sylphx Hosting builds `Dockerfile` on every push to `main`. The
  build reads Keel through the `keel_git_token` build secret
  (SylphxAI/cloud#9149).
- **After a deploy:** `curl -sI https://kylet.se` (200), `/about` and
  `/colophon` (200), `/story` (301 to `/about`), `/stats` (410),
  `/no-such-page` (404); then `BASE=https://kylet.se GONE=1 bun browser.mjs`
  and `bun shots.mjs` against the live site.
