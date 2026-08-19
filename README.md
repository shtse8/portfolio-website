# kylet.se

Kyle Tse's personal proof surface: a static portfolio with a small Rust live API for evidence and the on-site agent.

- Ordinary: https://kylet.se — customer domain for this personal proof surface. HTML reachability is not the product contract.
- Preview: none — no product-owned current preview URL is declared. `https://portfolio-website-phi-six-53.vercel.app` is a leftover Vercel host, not production.
- Vision: [docs/vision.md](docs/vision.md)
- Capabilities: [docs/capabilities.md](docs/capabilities.md)
- Decisions: [docs/adr/](docs/adr/)

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
| `SYLPHX_AI_API_KEY` | Gateway bearer credential (`ck_*` / `sk-sx-*`) |
| `AI_GATEWAY_BASE_URL` / `AI_GATEWAY_KEY` / `AI_GATEWAY_API_KEY` | Explicit overrides (optional) |
| `AI_MODEL` | Responses model (default `sylphx/auto`) |

**Must not** set `AI_GATEWAY_BASE_URL` to Platform management (`api.sylphx.com`)
or `AI_GATEWAY_KEY` to a Platform product secret (`sk_prod_*`) — those produce
`unsupported_credential` and are rejected by `resolve_ai()` (ADR-169 honesty).

`SYLPHX_URL` is **never** used as a server credential. Without a valid gateway
credential the API fails closed (`503 chat is warming up`). UI probes
`GET /chat/ready` and fail-closes the agent launcher when not ready.

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
