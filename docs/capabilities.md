# kylet.se identity graph

**Status:** Identity registry. Not live proof.
**Scope:** kylet.se — decision-proving portfolio site + live API.
**Vision:** [`vision.md`](vision.md)
**North Star:** [`NORTH_STAR.md`](NORTH_STAR.md)
**Cite:** the **ID** column.

This file is the identity graph. It is not a PRD, ADR index, or live grade. Destination stays in [`vision.md`](vision.md). Field law stays in `api-rust`, `src/`, `sylphx.toml`, and the Gateway wire. If this file conflicts with those, this file is wrong.

```text
ID | Identity | Fate | Depends on | Done when
```

## Repository publication authority

Repository facts in `WEB-STATS`, repository-dependent `WEB-CHAT` tools, and `WEB-SITE` claims/fallbacks have one publication authority: explicit positive GitHub public-visibility evidence (`private=false` and `visibility=public`, or GraphQL `isPrivate=false` and `visibility=PUBLIC`). A server credential grants upstream read capability only; it never grants publication authority. Non-public or visibility-unverifiable repository facts fail closed before any public response, tool result, cache, claim, activity projection, or fallback.

The live oracle covers anonymous `GET /repo`, repository lists in `GET /projects` and `GET /recent`, `GET /stats`, `GET /activity`, `GET /claims`, generated fallbacks, and every repository-dependent `WEB-CHAT` tool: a redacted protected canary and its facts are absent while an explicit-public control remains available on the same applicable customer path. `GET /stats` must attest `repositoryVisibility=public-only/v1`; `GET /activity` must attest `projectionRevision=github-public-only/v1`.

## Graph

| ID | Identity | Fate | Depends on | Done when |
| --- | --- | --- | --- | --- |
| WEB-STATS | Live work-graph + stats data plane (SylphxAI/pdf-reader-mcp etc.) | live | — | `GET /repo` / `GET /projects` / `GET /recent` / `GET /stats` / `GET /activity` / `GET /claims` / `GET /downloads` via `api-rust` (sole live authority, single JSON REST contract ADR-169) return only explicit-public GitHub repository facts and live-measured stars, npm downloads, repos, and commits with `freshness=live` + `verifiedAt` honesty (stale-on-fail, never-fabricated zeros); stats attest `repositoryVisibility=public-only/v1`, activity attests `projectionRevision=github-public-only/v1`, and the protected-canary/public-control oracle above passes at the live layer behind the `sylphx.toml` nginx BFF + api deploy; dual curated-catalog vs overlay content is retired to one authority. |
| WEB-CHAT | Agent contact plane (Sylphx AI Gateway dogfood) | live | WEB-STATS | `POST /chat` (Rate: 12/3min, 60/day per IP) over Sylphx AI Gateway `POST /v1/responses` with persona + 5 tools (`list_projects`, `get_repo`, `recent_activity`, `search_projects`, `npm_downloads`) answers and deep-links at the live layer at `https://kylet.se` without gateway `401` (`unsupported_credential`, `invalid_api_key`, or equivalent); every repository-dependent tool obeys the explicit-public publication authority above, excludes the redacted protected canary, and keeps an explicit-public control available. |
| WEB-SITE | Finished personal proof surface (least system) + navigation | live | WEB-STATS | Next.js static export `out/` at the live layer is four surfaces and no form: Promise (hero) states the one line beside live GitHub/npm instruments only; Story presents Nakuz→MiniMax→Cubeage→Epiow→Sylphx with career-scale figures labeled self-attested historical pedigree and never `freshness=live`; Work is explicit-public GitHub/`api-rust` (no overlay catalog); Act is mailto `hi@kylet.se` + GitHub/LinkedIn, with mailto the no-form Correctness fallback. The on-site agent is WEB-CHAT (depends WEB-STATS, not a WEB-SITE Done-when). `GET /claims` is the copyable snapshot of live instruments + promise, not career-scale pedigree. Repository claims, caches, and baked/generated fallbacks carry only explicit-public, revision-fenced GitHub facts. |
| WEB-LEGACY | Dual data-plane as product | dead | — | Prior dual Rust/TS wiring, inventoried 29-screenshot residual catalog, and `projects.ts` 2.3k-line dual content that invents a second browsing truth carry no live fate; `api-rust` single JSON REST contract is the writer. |

Edges are hard prerequisites. A preview build on Pages or a `200` on the edge without live `freshness=live` and a green chat turn does not close a node.
