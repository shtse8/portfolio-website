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
## Amendment 2026-08-29 — public GitHub projection hard cut

- Server GitHub credentials are an upstream read capability, never publication
  authority. Every repository object is default-deny unless GitHub positively
  reports both `private=false`/`isPrivate=false` and `visibility=public`.
- Repository lists use public-only upstream selectors where supported and still
  apply the local predicate before conversion or caching. `/repo` and chat
  `get_repo` share that boundary.
- `/stats` GraphQL connections use `privacy: PUBLIC`; repository nodes are
  locally verified before star aggregation, and repository `totalCount` is used
  only on those explicitly public-filtered connections. The owned/non-fork and
  notable-fork policies apply only after the public boundary.
- `/activity` commit searches require `is:public`. GraphQL repository identities
  request `isPrivate` and `visibility`; unverifiable/non-public identities do not
  contribute to `reposActiveToday` or `lastPush`. Durable snapshots require
  projection revision `github-public-only/v1`, so pre-cut snapshots cannot be
  served stale. `/claims` describes and embeds only this public activity.
- Authenticated build sync applies the same local predicate. The pre-cut baked
  stats aggregate was removed; it remains unavailable until regenerated from a
  live response attested `repositoryVisibility=public-only/v1`.

This is a hard cut. There is no compatibility path that publishes repository
objects or aggregates from token-visible, missing, internal, or private state.

### Security design contract

| Item | Binding |
| --- | --- |
| Assets | Non-public repository identity/content/metadata; integrity of public repository, star, count, activity, and claim projections. |
| Actors | GitHub as upstream issuer; the server credential as read capability; anonymous REST visitors; the chat gateway/tool caller; authenticated build sync. |
| Entry points | GitHub REST/GraphQL/search responses; `/repo`, `/projects`, `/recent`, `/stats`, `/activity`, `/claims`; chat repository tools; generated JSON fallbacks and process/durable caches. |
| Trust/data flow | Credential-visible GitHub response → product-owned strict visibility predicate/public-only query → typed public projection → cache or response. Raw credential-visible repository objects never enter public projection storage. |
| Highest-consequence misuse | An anonymous caller names or discovers a repository the server credential can read but the public cannot; token-visible counts or activity reveal non-public work; a pre-cut baked/durable fallback republishes those facts after upstream failure. |
| Mitigation | Require positive public evidence on every repository object, public-only upstream selectors/counts, fail closed on unverifiable stats objects, revision-fence activity last-good state, and remove pre-cut aggregate fallback. |
| Owners | This repository owns the projection predicates, queries, tools, caches, fallbacks, contract, and tests. The credential owner separately owns rotation/least privilege; the runtime owner separately owns deployment and cache/process replacement. |
| Pre/post oracle | Synthetic private, internal, and missing-visibility objects yield REST 404/chat null and never appear in lists/activity; public controls still appear; stats query contains `privacy: PUBLIC` and returns only with `public-only/v1`; activity search contains `is:public`; pre-cut durable/baked values are rejected. |

Residual outside this source candidate: the current runtime remains unsafe until a
judged SHA is landed, built, deployed, old processes/caches are replaced, and the
live anonymous canary plus public-only aggregate/activity/claims oracles pass.
Credential rotation and least-privilege scope are owned by the credential
authority, not this Product source write.
