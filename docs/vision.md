# kylet.se Vision

**Status:** Canonical product destination
**Identity graph:** [`capabilities.md`](capabilities.md)
**North Star package:** [`docs/NORTH_STAR.md`](NORTH_STAR.md) (2026-08-10, vision-design; no backward-compat obligation)

This document owns the long-term product destination. It does not claim the destination is landed or live. Source, checks, artifacts, deployment, readiness, customer behavior, and soak remain separate evidence layers.

## Destination

kylet.se (`https://kylet.se`) is the decision-proving portfolio of Kyle Tse — the site is the proof, not a brochure about proof — where a decision-maker (recruiter/hiring eng, founder/partner, OSS adopter, collaborator) with one job ("Is this the right person/stack/builder for X?") can, within one short session, **state, verify, and act**: state one repeatable promise, verify every material claim via live-measured / stale-labeled / absent honesty ladder, and act (contact, hire, partner, star, install, deep-link into real work) without a form or new mental model.

The promise is delivered by the **least system**: the fewest concepts, surfaces, services, and copy that still produce those three outcomes for every primary visitor job. The Rust `api-rust` is the sole live data-plane authority (single JSON REST contract: `GET /healthz`, `GET /stats`, `GET /activity`, `GET /projects`, `GET /recent`, `GET /repo`, `GET /downloads`, `POST /chat` via Sylphx AI Gateway `POST /v1/responses`); the site itself is the dogfood of the builder's AI stack (live stats/activity + agent contact plane).

## Users and their jobs

- **Decision-makers** who need one short session to answer "right person/stack/builder for X" and act on it.
- **OSS adopters** who need to verify stars/downloads/repos and deep-link to the real flagged repo.

## Not doing

- A second Rust/TS dual data-plane or dual content authority (curated catalog vs live GitHub overlay must be reconciled — `api-rust` is the authority).
- Visual density or feature-count "AI-native" chrome as power; invented marketing fog for verification.

## Product oracle

The destination is true only when a first-time visitor at `https://kylet.se` can, in one short live session, state the one promise, verify live GitHub stars/npm downloads/repos/activity via `api-rust` (`freshness=live`, `verifiedAt` honesty ladder, never-fabricated zeros), and successfully `POST /chat` a message that reaches Sylphx AI Gateway and returns an answer grounded in the 5 tools without `401 unsupported_credential`, at the live layer via the `sylphx.toml` nginx BFF + api deployment.

A static export (`out/`) build or `GET /healthz` on preview is not the live-chat-and-verify oracle. The broken `POST /chat` gateway credential boundary captured 2026-08-10 is the outstanding false for this oracle.
