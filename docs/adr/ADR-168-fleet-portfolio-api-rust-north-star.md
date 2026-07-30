# ADR-168 — Fleet Portfolio API Rust North Star architecture

- **Status:** Accepted
- **Date:** 2026-07-09
- **Relates to:** ADR-167 (SylphxAI/doctrine)
- **Change class:** `required-future` for portfolio API; `advisory` for fleet

## Context

The portfolio site (`kylet.se`) is a static Next.js export for the marketing surface.
Live behavior — GitHub/npm stats and the "Ask my AI" agent chat — runs in a separate
Bun/TypeScript service (`api/`) deployed as a second Sylphx service (platform dogfood).

The static web build (`out/`) must remain TypeScript Next.js with no server runtime.
Only the small API authority (`/stats`, `/chat`, agent tools) migrates to Rust per
doctrine [ADR-167](https://github.com/SylphxAI/doctrine/blob/main/docs/adr/ADR-167-boundary-contract-stack-and-platform-pillars.md):
Rust-first backends, Protobuf+Buf SSOT, Connect/gRPC default where cross-boundary
contracts exist. The public HTTP surface stays REST-compatible for the static site's
`fetch` calls — a derived projection, not a second SSOT.

Fleet cutover registry: **api-rust adopted** as sole API authority; static web remains TypeScript.

## Decision

### 1. North Star production stack (portfolio-website repo)

| Layer | North Star | Transitional (until sunset slice) |
| --- | --- | --- |
| Cross-boundary contract | Protobuf + Buf (`proto/portfolio/v1/`) | Inline Zod/hand-written TS in `api/` |
| Browser↔API transport | HTTP REST (curl-friendly, CORS-stable) | unchanged public contract |
| Internal service transport | Connect RPC / gRPC (if multi-service later) | direct HTTP handlers |
| API authority | Rust `api-rust/` | Bun `api/` (`index.ts`, `tools.ts`, `persona.ts`) |
| Static web | TypeScript Next.js static export | unchanged — no server components for live API |
| AI agent | Sylphx AI Gateway via Rust client | `@ai-sdk/openai-compatible` in Bun |
| Deploy | Second Sylphx service (API only) | unchanged two-service manifest |

### 2. Ownership matrix

| Concern | Owner | Portfolio may | Portfolio must not |
| --- | --- | --- | --- |
| Site content, design, static export | **portfolio-website** | Own `src/`, `out/` | Add server runtime to static export |
| Live stats + chat API | **portfolio-website** `api-rust/` | Own agent persona + tool wiring | Hold model provider keys (Gateway only) |
| Model routing, usage | **SylphxAI/sylphx-ai** (Gateway) | Route all inference through Gateway | Bypass Gateway |
| Deploy / cluster | **SylphxAI/platform** | Consume `sylphx.toml` bindings | Import cluster internals |

### 3. Strangler-fig cutover posture

- **S0:** `api-rust/` Cargo workspace + `/stats` drop-in parity (GitHub GraphQL + npm cache semantics).
- **S1:** `/chat` agent stream parity; tool surface (`tools.ts` behavior) replicated in Rust.
- **S2:** Sylphx deploy manifest points API service to Rust image; shadow or blue-green on `sylphx.app`.
- **S3:** Delete Bun `api/` authority; static site `fetch` URLs unchanged.
- CORS allowlist (`kylet.se`, preview hosts) preserved byte-for-byte.

### 4. Contract stack (ADR-167 alignment)

- **Protobuf + Buf** is SSOT for API request/response types and agent tool definitions.
- **Public edge** remains REST/JSON derived from proto (browser `fetch` compatibility).
- **Connect RPC / gRPC** available for future internal consumers; not required for static-site `fetch`.
- Bun `api/` is transitional; no indefinite dual semantics.

## Alternatives considered

| Alternative | Why rejected |
| --- | --- |
| Migrate static Next export to Rust SSR | Violates TS web-only pillar; site is intentionally static |
| Keep Bun API permanently | Contradicts ADR-167; registry already tracks Rust cutover |
| Merge API into Next server | Breaks static export architecture and two-service deploy |

## Consequences

- `api-rust/` becomes authoritative; `api/` deleted after prod readback.
- `src/` and static export pipeline untouched.
- Agent continues to dogfood Sylphx AI Gateway from Rust client.
- Fleet registry row advances from "in progress" only with `/stats` + `/chat` parity proof.

## Validation

- `/stats` response shape matches Bun baseline (GitHub stars aggregate, npm downloads, cache headers)
- `/chat` SSE/stream contract unchanged for Terminal and site agent UI
- CORS preflight passes for production and preview origins
- Sylphx deploy digest readback + health green on API service after flip

## Implementation status (2026-07-13)

| Slice | Status | Evidence |
| --- | --- | --- |
| S0 `/stats` parity | **Done** | `api-rust/src/stats.rs`, `cargo test` |
| S1 `/chat` + tools | **Done** | `api-rust/src/chat.rs`, `api-rust/src/tools.rs`, prod SSE smoke |
| S2 Sylphx API deploy | **Done** | `sylphx.toml` builds `api-rust/Dockerfile`; preview base `slim-pal-0k3stq.sylphx.app` |
| S3 Sunset Bun `api/` | **Done** | Removed in commit `177ffa9`; Rust is sole API authority |
| Proto SSOT | **Adopted (REST slice)** | `proto/portfolio/v1/{api,chat}.proto` + `prost-build` + `contract` REST projection; Connect optional |

Fleet registry row for this repo should read **adopted** for API authority (Rust), with frontend remaining TypeScript static export.

## Amendment 2026-07-30 — technology-stack-profile product wire

- Product wire: **buffa + connectrpc + axum** (`PortfolioApiService`).
- REST public edge remains derived projection for static-site `fetch`.
- prost product generator retired.

