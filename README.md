# portfolio-website — kylet.se

Kyle Tse's personal portfolio (`kylet.se`): a static marketing site with a small
Rust live API. Clean-break contract model per [ADR-169](./docs/adr/ADR-169-contract-simplification-clean-break.md).

## Stack

- **Web:** Next.js static export (TypeScript) → nginx (`Dockerfile`, port 3000).
  No server runtime in the web image; nginx is the BFF proxying API routes.
- **API:** Rust `api-rust` (`sylphx.toml` `api` service, port 3001) — stats,
  activity, projects, downloads, and AI chat via the Sylphx AI Gateway
  Responses wire.
- **Contract:** single JSON REST contract (`api-rust/src/contract.rs` +
  `tool_schemas.rs`). No proto/Connect surface.

## Chat env contract (server-side only)

| Var | Purpose |
| --- | --- |
| `SYLPHX_AI_URL` | Gateway base (default `https://api.sylphx.ai`, normalized to `/v1`) |
| `SYLPHX_AI_API_KEY` | Gateway bearer credential |
| `AI_GATEWAY_BASE_URL` / `AI_GATEWAY_KEY` | Explicit overrides (optional) |

`SYLPHX_URL` (the platform public browser connection URL) is **never** used as a
server credential. Without a credential the API fails closed
(`503 chat is warming up`).

## Dev

```bash
bun install
bun run dev          # static site dev server :4311
cd api-rust && cargo run
```

## Verify (source)

```bash
bun run check        # biome + tsc + bun test
bun run build        # static export
cd api-rust && cargo test --locked
cd api-rust && cargo clippy --locked --lib --bins -- -D warnings
```

## Sync baked fallbacks

```bash
bun run sync         # github-portfolio.json + stats-baked.json from live
```

## Production proof

```bash
scripts/api-smoke.sh # against https://kylet.se (BASE_URL overridable)
```
