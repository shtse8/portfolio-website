# kylet.se Vision

**Status:** Canonical product destination
**Identity graph:** [`capabilities.md`](capabilities.md)
**North Star package:** [`docs/NORTH_STAR.md`](NORTH_STAR.md) (2026-08-10, vision-design; no backward-compat obligation)

This document owns the long-term product destination. It does not claim the destination is landed or live. Source, checks, artifacts, deployment, readiness, customer behavior, and soak remain separate evidence layers.

## Destination

kylet.se (`https://kylet.se`) is Kyle Tse's **finished personal proof surface** — the site is the proof, not a brochure about proof. A decision-maker (recruiter/hiring eng, founder/partner, OSS adopter, collaborator) with one job ("Is this the right person/stack/builder for X?") can, within one short session, **state, verify, and act**.

The promise is delivered by the **least system**: four visitor-visible surfaces, one live data plane, and no form.

1. **Promise (hero)** — one repeatable line: Kyle builds the infrastructure AI agents run on. Beside it, live GitHub/npm instruments with the honesty ladder (`live` / `stale` / `absent`). Career-scale numbers do not share this board.
2. **Story** — five eras (Nakuz → MiniMax → Cubeage → Epiow → Sylphx) as career context. Scale figures here are **self-attested historical pedigree**, labeled as such. They are not live instruments and must not use `freshness=live` vocabulary.
3. **Work** — the work graph is explicit-public GitHub facts via `api-rust`. No curated overlay catalog. No second content authority.
4. **Act** — mailto `hi@kylet.se`, GitHub, LinkedIn, and the on-site agent. No form. Mailto is WEB-SITE's no-form Correctness fallback when the agent is fail-closed; it is not a substitute for WEB-CHAT.

The Rust `api-rust` is the sole live data-plane authority (single JSON REST contract: `GET /healthz`, `GET /stats`, `GET /activity`, `GET /projects`, `GET /recent`, `GET /repo`, `GET /downloads`, `GET /claims`, `POST /chat` via Sylphx AI Gateway `POST /v1/responses`). The site itself is the dogfood of the builder's AI stack (live stats/activity + agent contact plane).

GitHub repository publication is explicit-public only. A repository fact is publishable only when upstream data positively proves `private=false` and `visibility=public` (or the GraphQL equivalents `isPrivate=false` and `visibility=PUBLIC`). A server credential is upstream read capability, never publication authority. Non-public or unverifiable repository facts fail closed before entering anonymous responses, `WEB-CHAT` repository tools, caches, claims, activity, or baked/generated fallbacks. This boundary covers `GET /repo`, repository lists in `GET /projects` and `GET /recent`, `GET /stats`, `GET /activity`, `GET /claims`, and every repository-dependent chat tool.

## Users and their jobs

- **Decision-makers** who need one short session to answer "right person/stack/builder for X" and act on it (mailto without a form, and a grounded chat turn).
- **OSS adopters** who need to verify stars/downloads/repos and deep-link to the real flagged repo.

## Not doing

- A second Rust/TS dual data-plane or dual content authority. `api-rust` is the sole live data-plane and work-graph content authority.
- Visual density or feature-count "AI-native" chrome as power.
- Invented marketing fog for verification — including career-scale numbers presented as live GitHub/npm proof.
- A contact form.
- An archive or screenshot catalog as a product path.
- Proto/Connect as a second public contract.

## Product oracle

The destination is true only when a first-time visitor at `https://kylet.se` can, in one short live session:

- **State** the one promise on the hero.
- **Verify** live explicit-public GitHub stars/npm downloads/repos/activity via `api-rust` (`freshness=live`, `verifiedAt` honesty ladder, never-fabricated zeros), with `GET /stats` attesting `repositoryVisibility=public-only/v1`, `GET /activity` attesting `projectionRevision=github-public-only/v1`, a redacted protected canary absent from every applicable repository response, list/recent/project projection, activity/claim/fallback, and `WEB-CHAT` repository tool, and an explicit-public control remaining available on the same customer path.
- **Distinguish** Story's self-attested career pedigree from the hero/Work live instruments (career scale is labeled historical/self-attested; it never borrows `freshness=live`).
- **Act** via mailto `hi@kylet.se` without a form (WEB-SITE Correctness fallback; mailto does not close WEB-CHAT).
- **Ask** via a grounded `POST /chat` turn that reaches Sylphx AI Gateway and returns an answer grounded in the 5 tools without gateway `401` (`unsupported_credential`, `invalid_api_key`, or equivalent), at the live layer via the `sylphx.toml` nginx BFF + api deployment.

A static export (`out/`) build, `GET /healthz`, or `GET /chat/ready` reporting `ready=true` is not this oracle. Destination-true still requires the grounded chat turn. Live-attested public-only stats/activity plus labeled career pedigree is the verify half.
