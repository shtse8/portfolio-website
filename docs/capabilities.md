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

## Graph

| ID | Identity | Fate | Depends on | Done when |
| --- | --- | --- | --- | --- |
| WEB-STATS | Live work-graph + stats data plane (SylphxAI/pdf-reader-mcp etc.) | live | — | `GET /stats` / `GET /projects` / `GET /activity` / `GET /downloads` via `api-rust` (sole live authority, single JSON REST contract ADR-169) return live-measured GitHub stars, npm downloads, repos, commits with `freshness=live` + `verifiedAt` honesty (stale-on-fail, never-fabricated zeros) at the live layer behind the `sylphx.toml` nginx BFF + api deploy; dual curated-catalog vs overlay content is retired to one authority. |
| WEB-CHAT | Agent contact plane (Sylphx AI Gateway dogfood) | live | WEB-STATS | `POST /chat` (Rate: 12/3min, 60/day per IP) over Sylphx AI Gateway `POST /v1/responses` with persona + 5 tools (`list_projects`, `get_repo`, `recent_activity`, `search_projects`, `npm_downloads`) answers and deep-links at the live layer at `https://kylet.se` without `gateway 401 unsupported_credential`. |
| WEB-SITE | One-page narrative site (least system) + navigation | live | WEB-STATS | Next.js static export `out/` single promise per visitor job completes `state → verify → act` (contact/hire/partner/star/install/deep-link) without a form at the live layer. |
| WEB-LEGACY | Dual data-plane as product | dead | — | Prior dual Rust/TS wiring, inventoried 29-screenshot residual catalog, and `projects.ts` 2.3k-line dual content that invents a second browsing truth carry no live fate; `api-rust` single JSON contract is the writer. |

Edges are hard prerequisites. A preview build on Pages or a `200` on the edge without live `freshness=live` and a green chat turn does not close a node.
