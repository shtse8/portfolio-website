# Agent entry (portfolio-website)

1. Read [`PROJECT.md`](./PROJECT.md) and [`.doctrine/project.json`](./.doctrine/project.json) for goals, boundaries, and delivery proof.
2. For architecture changes, read [`docs/adr/ADR-169-contract-simplification-clean-break.md`](./docs/adr/ADR-169-contract-simplification-clean-break.md) first. The contract is **single JSON REST** (`api-rust/src/contract.rs` + `tool_schemas.rs`) — no proto/Connect surface exists.
3. **Rust-first applies to backend only** — do not add TypeScript/Bun API authority; keep `src/` as static Next.js.
4. Chat env contract: `SYLPHX_AI_URL` + `SYLPHX_AI_API_KEY` (or `AI_GATEWAY_BASE_URL`/`AI_GATEWAY_KEY`). Never use `SYLPHX_URL` as a server credential.
5. Validate: `cd api-rust && cargo test --locked && cargo clippy --locked --lib --bins -- -D warnings`, `bun run check`, `bun run build`, and `scripts/api-smoke.sh` when touching live API behavior.
6. Baked fallbacks: regenerate via `bun run sync` after changing stats/project data.
