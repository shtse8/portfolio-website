# ADR-169 — Contract simplification & clean break (single JSON REST contract)

- **Status:** Accepted
- **Date:** 2026-08-09
- **Supersedes:** proto/Connect product wire in ADR-168 amendment (2026-07-30) and
  `ADR-technology-stack-profile-residual.md`
- **Change class:** clean break — no backward compatibility, no residual paths

## Context

kylet.se shipped a "proto SSOT" story (buffa + connectrpc product wire) that was
nominal, not real: the browser consumed REST JSON only, no internal consumer ever
called the Connect service, tool definitions were triplicated (proto,
`tool_schemas.rs`, `agent_tool_catalog` with hardcoded `parameters_json`), and the
REST projections were hand-written rather than generated from proto. The live
chat also failed with `401 unsupported_credential` because `resolve_ai()` parsed
the platform's **public browser** connection URL (`SYLPHX_URL`) as a server
credential and called the retired `/v1/chat/completions` wire.

## Decision

1. **Single JSON REST contract.** `api-rust/src/contract.rs` +
   `api-rust/src/tool_schemas.rs` are the SSOT. Proto, Buf, connectrpc, buffa,
   `build.rs`, `connect_api.rs`, and `proto/` are deleted. REST handlers remain
   the browser BFF surface; the AI-SDK SSE protocol to the browser is unchanged.
2. **Chat wire = Sylphx AI Gateway Responses API.** Server env contract is
   `SYLPHX_AI_URL` (default `https://api.sylphx.ai`, normalized to `/v1`) +
   `SYLPHX_AI_API_KEY` (bearer), with `AI_GATEWAY_BASE_URL`/`AI_GATEWAY_KEY` as
   explicit overrides. `SYLPHX_URL` is never used. Gateway call is
   `POST {base}/responses` (stream: true); public `/v1/chat/completions` is
   retired upstream (2026-08-09). Client disconnect cancels the gateway stream.
3. **Trusted client IP.** Rate limiting keys on `cf-connecting-ip` →
   `x-real-ip` → last `x-forwarded-for` entry → `x-envoy-external-address`;
   client-spoofed first XFF entries are ignored. CORS echoes
   `access-control-allow-origin` only for allowlisted origins.
4. **Security + hygiene.** nginx adds HSTS/CSP/nosniff/XFO/Referrer-Policy/
   Permissions-Policy; the dead `/tech-stack → /capabilities/` redirect is
   removed; `robots.txt`/`sitemap.xml` stay repo-owned; static hero/metadata
   numbers come from a build-time baked `/stats` snapshot
   (`scripts/sync-stats.mjs` → `src/data/stats-baked.json`) with `verifiedAt`;
   dead frontend/Rust files, dual lockfiles, cross-repo push scripts, and the
   TS differential oracle are deleted.
5. **CI means something.** `source-ci/pass` now runs biome, `tsc`, `bun test`,
   the static export build, `cargo clippy -D warnings`, and the full Rust test
   suite. Platform still builds production once from main.

## Consequences

- One contract to read, one env contract for chat, one preview host story.
- Live numbers are honest: baked fallback carries `verifiedAt`; `/activity`
  keeps the stale-on-fail ladder (authenticated CP projection only; the legacy
  anonymous public path is retired).
- The connect-rpc-internal gap in `.doctrine` is closed as `not-applicable`
  until a real consumer exists.

## Validation

```bash
cd api-rust && cargo test --locked && cargo clippy --locked --lib --bins -- -D warnings
bun run check          # biome + tsc + bun test
bun run build          # static export
scripts/api-smoke.sh   # against https://kylet.se (default)
```

## Amendment 2026-08-09 (b) — /activity authority is live GitHub GraphQL

- The Control Plane projection feed was stale/broken since 2026-07-16; the owner
  chose **real GitHub commit numbers**. `/activity` now computes commits
  today/7d/30d directly from GitHub GraphQL (users via `contributionsCollection`,
  orgs via default-branch commit history), with the same honesty ladder
  (TTL cache, durable last-good, stale-on-fail, never fabricated zeros).
- `commits_month` is a REAL 30-day series from GitHub — never week×4.
- `CP_PROJECTION_*` / `CP_PUBLIC_*` env and the CP mapping code are retired.
- `source` is `github` (live) / `github-stale` (fail-over).
