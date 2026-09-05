# Portfolio Website

Public portfolio for Kyle Tse (`kylet.se`): a **TypeScript Next.js static export** for the
marketing surface, plus a **Rust `api-rust` service** for live GitHub/npm stats, activity,
terminal data, and the on-site AI agent (Sylphx AI Gateway).

## Lifecycle

- State: `production`
- Layer: `application`
- Machine manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Ship fast, static portfolio UX from `src/` → `out/` (no server runtime in the web image).
- Run all live API authority in Rust with a **single JSON REST contract** (ADR-169).
- Chat calls the Sylphx AI Gateway Responses wire with server-side credentials only.

## Non-Goals

- Migrating the static site to Rust SSR.
- Holding model-provider API keys (Gateway only).
- Owning Sylphx Platform cluster control plane.
- Maintaining a proto/Connect surface with no consumer.

## Boundary

| Concern | Owner in this repo |
| --- | --- |
| Static pages, components, content | `src/`, `public/`, Next static export |
| Live API (`/stats`, `/activity`, `/projects`, `/recent`, `/repo`, `/downloads`, `/chat`, `/chat/ready`, `/claims`) | `api-rust/` (single REST JSON contract; evidence graph + claim pack) |
| Contract SSOT | `api-rust/src/contract.rs` + `api-rust/src/tool_schemas.rs` |
| Deploy manifest | `sylphx.toml` (web + api services) |

## Public Surfaces

- Browser site: static export served by nginx (`Dockerfile`), nginx is the BFF proxy.
- Live API: `api-rust` REST JSON routes.
- Default API base for builds: `NEXT_PUBLIC_API_BASE` (see `src/lib/api.ts`); same-origin
  by default via the nginx BFF.

## Delivery

- **Web:** `bun run build` → nginx image.
- **API:** `api-rust/Dockerfile` release binary; health at `/healthz`.
- **Source CI (fast trunk):** biome, `tsc`, `bun test`, static export build, `cargo clippy -D warnings`, `cargo test --locked`.
- **Production proof:** `scripts/api-smoke.sh` (default `https://kylet.se`): health, stats,
  projects, activity, chat SSE.
- **Baked fallbacks:** `bun run sync` refreshes explicit-public repository records
  and accepts stats only from a `repositoryVisibility=public-only/v1` response.
  Until then the repository-derived aggregate fallback is unavailable.

## Commercial Direction

`not-applicable` — personal portfolio; no paid entitlements in this repository.

## Product authority

- [Product vision](./docs/vision.md) — canonical destination and North Star
  Metric.
- [Capability DAG](./docs/capabilities.md) — stable `WEB-*` responsibilities,
  prerequisites, and completion oracles.
