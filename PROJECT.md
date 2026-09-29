# Portfolio Website

kylet.se, Kyle Tse's personal site: four static pages built with Keel Engine,
served by nginx on Sylphx Hosting.

## Lifecycle

- State: `production`
- Layer: `application`
- Machine manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Show who Kyle is, what he builds and how to reach him, with only sourced
  facts ([docs/design/content.md](docs/design/content.md)).
- Be a Keel Engine website in production: the
  pages, the theme and the scene are Keel; the site's own CSS covers only
  named Keel gaps.

## Non-goals

- A server API or an on-site agent. Both retired on 2026-09-28
  ([ADR-170](docs/adr/ADR-170-keel-site-api-retired.md)).
- Forms, accounts, cookies or analytics.

## Boundary

| Concern | Owner in this repo |
| --- | --- |
| Pages, copy, theme, island | `site/` |
| The live scene | `scenes/` |
| Serving, headers, redirects, CSP | `Dockerfile`, `nginx.conf`, `hosting/` |
| Deploy manifest | `sylphx.toml` (one `web` service) |
| The engine | SylphxAI/keel at `KEEL_PIN` (not this repo) |

## Delivery

- Checks: GitHub Actions on pull requests and `main` (`ci-ok`), on GitHub's
  free standard runner (public repository).
- Deploy: Sylphx Hosting builds the image on every push to `main`.
- Production check: see [README.md](README.md#checks-and-deploy).

## Commercial direction

`not-applicable`: a personal site with nothing for sale.
