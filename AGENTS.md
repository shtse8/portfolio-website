# Agent entry (portfolio-website)

1. Read [`PROJECT.md`](./PROJECT.md) and [`.doctrine/project.json`](./.doctrine/project.json) for goals, boundaries, and delivery proof.
2. For architecture changes, read [`docs/adr/ADR-168-fleet-portfolio-api-rust-north-star.md`](./docs/adr/ADR-168-fleet-portfolio-api-rust-north-star.md) first.
3. **Rust-first applies to backend only** — do not add TypeScript/Bun API authority; keep `src/` as static Next.js.
4. Upstream doctrine: https://github.com/SylphxAI/doctrine (ADR-167 boundary contract stack).
5. Validate API slices with `cd api-rust && cargo test --locked` and `scripts/api-smoke.sh` when touching live API behavior.
