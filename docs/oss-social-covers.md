# OSS social banners (portfolio + README)

**Beauty-first surface split** (do not force one bitmap URL for every surface):

| Surface | SSOT | Notes |
|---------|------|--------|
| Portfolio card | `public/art/projects/{repoName}.jpg` (1376×768) | Product Plate — monogram + hierarchy |
| GitHub README (static export) | `public/art/projects/readme/{repoName}.png` (1280×640) | Optional offline |
| GitHub README (live embed) | Mark `markBannerUrl` → `layout=plate&animation=none` | Dogfood Mark |
| Vector source | `public/art/projects/readme/{repoName}.svg` | Generator input |

Mark is the **embed API**, not a drop-in crop of a 4:1 strip into a 16:10 card.

## What style we use

| Project type | Banner |
|--------------|--------|
| **MCP / library / SDK / CLI** (no product UI) | **Designed social banner** — monogram + exact title + tagline |
| **Real product UI** (TUI, desktop app, interactive product surface) | Optional **product screenshot** of that product — not a docs website |

**Do not** use docs-site screenshots or “scroll the documentation” GIFs as the identity for MCP tools. That misrepresents the product (an agent protocol server is not a marketing microsite).

Grok Build’s README works because the screenshot **is** the product (the TUI). Docs pages are not the product for `pdf-reader-mcp`.

## Regenerate

```bash
bun run sync:github
bun run generate:banners      # designed banners for all listed repos
bun run generate:covers       # local card plates + README PNG/SVG sources
```

Cross-repo auto-push scripts were retired (ADR-169): banner/cover changes are applied via normal PRs.
