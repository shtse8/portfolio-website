# ADR: technology-stack-profile residual honesty (kylet.se / portfolio-website)

- **Status:** Accepted (clean migrate — buffa + connectrpc product wire)
- **Date:** 2026-07-30
- **Profile:** SylphxAI/skills `technology-stack-profile`

## Context

Personal portfolio (`kylet.se`) is **dev-phase** for stack cutover (public static
site is serving, but live API is non-commerce). Highest standard requires Rust
product RPC on **buffa + connectrpc + axum**.

## Decision

1. Product wire authority is **buffa + connectrpc** (`PortfolioApiService` via
   `connectrpc::Router` fallback on the axum app).
2. **REST** (`/stats`, `/activity`, `/projects`, …) remains a **derived edge
   projection** for static-site `fetch` (ADR-168) — not a second product wire
   SSOT and not a dual prost product authority.
3. Streaming chat remains **REST SSE** (`POST /chat`) for AI SDK browser
   transport; unary Connect `Chat` is `Unimplemented` (honest residual, not dual
   stream authority).
4. **prost** product generators are **retired** (connectrpc-build + buffa only).

## Closed this clean migrate

- `api-rust` build: `connectrpc-build` + buffa (no prost).
- `connect_api.rs`: native `PortfolioApiService` densify for Health/Stats/
  Activity/ListProjects/GetRepo/ListRecent/GetDownloads/ListChatTools.
- REST projection rewritten as pure camelCase JSON (no prost-type dual SSOT).

## Remaining residual (honest)

- Unary Connect `Chat` stream not densified (REST SSE sole stream path).
- Static Next export remains TypeScript product-web (intended).
- Bun `api/` already deleted (sole Rust API authority).

## Validation

```bash
cd api-rust && cargo test
```
