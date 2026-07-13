# Portfolio Website

Public portfolio for Kyle Tse (`kylet.se`): a **TypeScript Next.js static export** for the
marketing surface, plus a **Rust `api-rust` service** for live GitHub/npm stats, terminal
data, and the on-site AI agent (Sylphx AI Gateway).

## Lifecycle

- State: `production`
- Layer: `application`
- Machine manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Ship fast, static portfolio UX from `src/` → `out/` (no server runtime in the web image).
- Run all live API authority in Rust per [ADR-168](./docs/adr/ADR-168-fleet-portfolio-api-rust-north-star.md)
  and Sylphx doctrine [ADR-167](https://github.com/SylphxAI/doctrine/blob/main/docs/adr/ADR-167-boundary-contract-stack-and-platform-pillars.md)
  (**Rust-first backends; TypeScript for browser UI**).

## Non-Goals

- Migrating the static site to Rust SSR.
- Holding model-provider API keys (Gateway only).
- Owning Sylphx Platform cluster control plane.

## Boundary

| Concern | Owner in this repo |
| --- | --- |
| Static pages, components, content | `src/`, `public/`, Next static export |
| Live API (`/stats`, `/chat`, terminal routes) | `api-rust/` |
| Cross-boundary contract SSOT | `proto/portfolio/v1/` + `buf.yaml` |
| Deploy manifest | `sylphx.toml` (web + api services) |

## Public Surfaces

- Browser site: static export served by nginx (`Dockerfile`).
- Live API: `api-rust` HTTP routes (REST JSON for `fetch`; proto is SSOT).
- Default API base for builds: `NEXT_PUBLIC_API_BASE` (see `src/lib/api.ts`).

## Delivery

- **Web:** `bun run build` → nginx image.
- **API:** `api-rust/Dockerfile` release binary; health at `/healthz`.
- **Production proof:** `scripts/api-smoke.sh` (health, stats, projects, activity, chat SSE).
- **Local API tests:** `cd api-rust && cargo test --locked`.

## Commercial Direction

`not-applicable` — personal portfolio; no paid entitlements in this repository.
