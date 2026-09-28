# ADR-170: kylet.se is a static Keel site; api-rust and the on-site agent are retired

- **Status:** Accepted
- **Date:** 2026-09-28
- **Supersedes:** ADR-168 (Rust API as the site's live authority) and ADR-169 (its single JSON REST contract), both deleted with the code they governed; git history keeps them

## Context

The site was a Next.js static export plus `api-rust`, a Rust service for live
GitHub and npm figures and an on-site AI agent. By 2026-09-26 the data routes
answered `freshness: "absent"` (the API held no GitHub credential after #89),
and the agent's persona and tools were out of date, so it could not meet the
rule that the site invents nothing. Owner#739 moves our websites onto Keel
Engine, with kylet.se as Stage 1 pilot 2.

## Decision

- The site is four static pages built with Keel (`site/`), exported by
  `keel pack` and served by nginx. Facts come only from
  `docs/design/content.md`.
- `api-rust` and the agent are deleted, with the `api` service in
  `sylphx.toml`, the nginx proxy blocks and the AI gateway host, model and
  key settings, so the repository names no AI endpoint or key format. nginx answers the old API
  paths with 410.
- No data is lost: the API had no database or volume, only in-memory rate
  limits.

## Consequences

- No live counters on the site. A figure appears only when it has a source.
- A Sylphx AI demo on the site, if wanted later, is its own outcome: it answers
  only from `content.md` and calls the platform with the environment's own key.
