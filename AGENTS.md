# Agent entry (portfolio-website)

1. Read [`README.md`](./README.md) and [`docs/design/README.md`](./docs/design/README.md) first.
2. Every visible fact comes from [`docs/design/content.md`](./docs/design/content.md). Add a fact there, with its source, before the page shows it.
3. Styling goes on the Keel theme (`site/src/theme.rs`). `site/assets/site.css` holds only what Keel cannot say yet, each block naming its Keel issue; when the issue lands, move the block onto the theme and delete it.
4. After a theme change, regenerate `site/assets/dark.css` (`KYLET_WRITE_DARK=1 cargo test -p kylet-site dark_stylesheet`).
5. Keel pin bumps: change `Cargo.toml` and `KEEL_PIN` together, then `keel migrate --check` and `keel migrate`.
6. Validate: `cargo clippy --workspace --all-targets -- -D warnings`, `cargo test -p kylet-site`, `keel pack`, then `tests/browser.mjs` and screenshots at 390, 820 and 1440 px in light and dark.
