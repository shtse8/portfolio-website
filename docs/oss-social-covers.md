# OSS social banners (portfolio + README)

Serious open-source projects put a **banner image** near the top of the README
(example: [xai-org/grok-build](https://github.com/xai-org/grok-build) uses a
real product screenshot of the TUI).

We keep **one asset family** for both:

| Surface | Path |
|---------|------|
| Portfolio card | `public/art/projects/{repoName}.jpg` (1376×768) |
| GitHub README | `public/art/projects/readme/{repoName}.png` (1280×640) |
| Vector source | `public/art/projects/readme/{repoName}.svg` |

## What style we use

| Project type | Best banner source |
|--------------|--------------------|
| App / TUI / website with UI | **Real screenshot** of the product (grok-build style) |
| Library / MCP / CLI with no UI | **Designed social banner** (name + monogram + tagline) |

We generate the designed banners with **exact text in SVG** (not AI lettering).
Optional AI art is only a background plate when needed — never the only identity.

## Regenerate

```bash
bun run sync:github
bun run generate:banners          # designed banners for all listed repos
bun run screenshot:oss-ui         # real UI screenshots when demos are live
bun run apply:oss-banners         # push docs/banner.png + README embed to each repo
```

UI screenshots land in `public/art/projects/screenshots/` and take priority over
designed banners when applying to READMEs. Demo GIFs (when produced) go to
`public/art/projects/gifs/` and can be linked as `docs/demo.gif`.

## Drop into a repo README

```markdown
<p align="center">
  <img src="docs/banner.png" alt="Project banner" width="100%" />
</p>
```

Copy from this portfolio repo:

```bash
cp public/art/projects/readme/pdf-reader-mcp.png \
  ../SylphxAI/pdf-reader-mcp/docs/banner.png
```

## Pipeline (honest)

1. **Prefer real evidence** — screenshot a running UI when the product has one.
2. **Designed banner** — for libraries/MCP: monogram + accurate title/tagline.
3. **Optional beautify** — AI can polish a screenshot background or abstract plate;
   product identity (name, logo) stays code-rendered so it stays correct.
4. **One SSOT** — same banner in portfolio grid and README.
