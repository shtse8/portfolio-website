# OSS social banners (portfolio + README)

One designed banner family for portfolio cards and GitHub READMEs.

| Surface | Path |
|---------|------|
| Portfolio card | `public/art/projects/{repoName}.jpg` (1376×768) |
| GitHub README | `public/art/projects/readme/{repoName}.png` (1280×640) |
| Vector source | `public/art/projects/readme/{repoName}.svg` |

## What style we use

| Project type | Banner |
|--------------|--------|
| **MCP / library / SDK / CLI** (no product UI) | **Designed social banner** — monogram + exact title + tagline |
| **Real product UI** (TUI, desktop app, interactive product surface) | Optional **product screenshot** of that product — not a docs website |

**Do not** use docs-site screenshots or “scroll the documentation” GIFs as the identity for MCP tools. That misrepresents the product (an agent protocol server is not a marketing microsite).

Grok Build’s README works because the screenshot **is** the product (the TUI). Docs pages are not the product for `pdf-reader-mcp`.

## Regenerate / apply

```bash
bun run sync:github
bun run generate:banners      # designed banners for all listed repos
bun run apply:oss-banners     # push docs/banner.png + README embed
```

## README embed

```markdown
<p align="center">
  <img src="docs/banner.png" alt="Project banner" width="100%" />
</p>
```

## Pipeline

1. **Default: designed banner** with code-rendered text (never AI-garbled names).
2. **Screenshot only** when the capture is the actual product surface users run.
3. **One SSOT** — same banner in portfolio and README.
