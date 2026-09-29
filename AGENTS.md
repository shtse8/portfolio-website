# Agent instructions (portfolio-website)

kylet.se is Kyle Tse's personal site: four static pages rendered by Keel Engine,
one live Keel scene, one small island. Owner: Kyle. Read
[README.md](README.md), [docs/vision.md](docs/vision.md) and
[docs/design/README.md](docs/design/README.md) before changing anything.

## Working rules

- Every visible fact comes from [docs/design/content.md](docs/design/content.md).
  Add the fact there, with its source, before a page shows it; the site's whole
  value is that a visitor can trust it, and an unsourced line breaks that.
- Style through the Keel theme (`site/src/theme.rs`). `site/assets/site.css`
  holds only what Keel cannot say yet, each block naming its Keel issue; when the
  issue lands, move the block onto the theme and delete it, so the file shrinks
  toward zero.
- After a theme change, regenerate `site/assets/dark.css`:
  `KYLET_WRITE_DARK=1 cargo test -p kylet-site dark_stylesheet`. A test fails
  when it is stale.
- Change the Keel revision in `Cargo.toml` and `KEEL_PIN` together (CI fails when
  they differ), then run `keel migrate --check` and `keel migrate`.
- No cookies, analytics, forms, accounts or server API. The site is static on
  purpose: nothing to break, nothing to leak, nothing that goes stale
  ([ADR-170](docs/adr/ADR-170-keel-site-api-retired.md)).
- Keel is a private repository. Locally run `gh auth setup-git`; CI mints a
  one-hour read-only App token ([docs/reference/fast-trunk-ci.md](docs/reference/fast-trunk-ci.md)).
- CI runs on `ubuntu-latest`, free for a public repository. Larger runners are
  billed, so use none.

## Commands

- Checks: `cargo clippy --workspace --all-targets -- -D warnings`, then
  `cargo test -p kylet-site`.
- Build: `keel pack --profile web --release --manifest-path site/Cargo.toml`.
- Browser checks and screenshots: see [README.md](README.md#commands). Check at
  390, 820 and 1440 px, light and dark.

## Post-deploy check

`curl -sI` on `/`, `/about` and `/colophon` (200), `/story` (301 to `/about`),
`/stats` (410) and `/no-such-page` (404); then
`BASE=https://kylet.se GONE=1 bun browser.mjs` in `tests/`. The old Next.js site
answers `/stats` with 200 and `/colophon` with 404, so those two tell you which
site is live.
