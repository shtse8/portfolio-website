# OSS social covers

Shared product covers for portfolio cards and GitHub READMEs.

## Paths

| Surface | Path |
|---------|------|
| Portfolio card | `public/art/projects/{repoName}.jpg` (1376×768) |
| README banner | `public/art/projects/readme/{repoName}.png` (1280×640) |
| Vector source | `public/art/projects/readme/{repoName}.svg` |

## Regenerate

```bash
bun run sync:github
bun run generate:covers
```

## Drop into a repo README

```markdown
<p align="center">
  <img src="docs/social-cover.png" alt="project cover" width="100%" />
</p>
```

Copy from portfolio:

```bash
cp public/art/projects/readme/pdf-reader-mcp.png \
  ../SylphxAI/pdf-reader-mcp/docs/social-cover.png
```

Style is intentional GitHub-product social card (grid, monogram, title, tagline) —
not generative ambient art — so it matches OSS conventions and stays brand-coherent.
