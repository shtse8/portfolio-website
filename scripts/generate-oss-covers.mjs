#!/usr/bin/env bun
/**
 * Generate README-ready OSS social covers for portfolio projects.
 *
 * Output:
 *   public/art/projects/{repoName}.jpg   (portfolio / card)
 *   public/art/projects/readme/{repoName}.png  (1280×640 for GitHub README)
 *
 * Style: clean GitHub-product social card (not generative AI).
 * Usage: bun scripts/generate-oss-covers.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

const root = join(import.meta.dir, "..");
const outDir = join(root, "public/art/projects");
const readmeDir = join(outDir, "readme");
mkdirSync(readmeDir, { recursive: true });

const portfolio = JSON.parse(
  readFileSync(join(root, "src/data/github-portfolio.json"), "utf8"),
);

/** @type {Record<string, { from: string; to: string; accent: string }>} */
const PALETTES = {
  mcp: { from: "#0f172a", to: "#1e3a5f", accent: "#38bdf8" },
  rag: { from: "#0c1a17", to: "#134e4a", accent: "#2dd4bf" },
  ai: { from: "#1a1030", to: "#3b0764", accent: "#c084fc" },
  tool: { from: "#1c1917", to: "#44403c", accent: "#fbbf24" },
  data: { from: "#0f172a", to: "#1e293b", accent: "#94a3b8" },
  default: { from: "#111827", to: "#1f2937", accent: "#a5b4fc" },
};

function paletteFor(name, desc, lang) {
  const h = `${name} ${desc} ${lang}`.toLowerCase();
  if (/mcp|protocol|reader|agent/.test(h)) return PALETTES.mcp;
  if (/rag|search|embed|semantic|coderag/.test(h)) return PALETTES.rag;
  if (/ai|llm|research|gateway|platform/.test(h)) return PALETTES.ai;
  if (/css|state|immutable|cli|util|sdk|tool|craft|silk/.test(h))
    return PALETTES.tool;
  if (/db|sql|firestore|schema|data/.test(h)) return PALETTES.data;
  return PALETTES.default;
}

function monogram(name) {
  const clean = name.replace(/[-_]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (
    name
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "OS"
  );
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(title, max = 28) {
  if (title.length <= max) return [title];
  const words = title.split(/[\s_-]+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

function svgCover({ name, title, description, language, owner, archived }) {
  const pal = paletteFor(name, description, language ?? "");
  const mono = monogram(name);
  const lines = wrapTitle(title || name, 26);
  const tag = (description || "").slice(0, 90);
  const meta = [language, archived ? "archived" : null, owner]
    .filter(Boolean)
    .join("  ·  ");

  const titleSvg = lines
    .map(
      (line, i) =>
        `<text x="80" y="${300 + i * 64}" fill="#f8fafc" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="52" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <title>${title}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1280" y2="640" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${pal.from}"/>
      <stop offset="100%" stop-color="${pal.to}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${pal.accent}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1280" height="640" fill="url(#bg)"/>
  <rect width="1280" height="640" fill="url(#grid)"/>
  <circle cx="1100" cy="120" r="220" fill="url(#shine)"/>
  <circle cx="200" cy="560" r="180" fill="${pal.accent}" fill-opacity="0.08"/>

  <!-- monogram tile -->
  <rect x="80" y="96" width="88" height="88" rx="20" fill="${pal.accent}" fill-opacity="0.15" stroke="${pal.accent}" stroke-opacity="0.55" stroke-width="2"/>
  <text x="124" y="154" text-anchor="middle" fill="${pal.accent}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="32" font-weight="700">${escapeXml(mono)}</text>

  <text x="188" y="132" fill="#94a3b8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18">${escapeXml(owner)}/${escapeXml(name)}</text>
  <text x="188" y="162" fill="#64748b" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15">${escapeXml(meta)}</text>

  ${titleSvg}

  <text x="80" y="${300 + lines.length * 64 + 28}" fill="#cbd5e1" font-family="ui-sans-serif, system-ui, sans-serif" font-size="24">${escapeXml(tag)}${description && description.length > 90 ? "…" : ""}</text>

  <!-- bottom bar -->
  <rect x="0" y="580" width="1280" height="60" fill="black" fill-opacity="0.25"/>
  <text x="80" y="616" fill="#94a3b8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16">open source · social cover · kylet.se</text>
  <circle cx="1180" cy="610" r="8" fill="${pal.accent}"/>
</svg>`;
}

// Prefer active repos with stars, then anything else we still list
const targets = portfolio.repos.filter(
  (r) =>
    !r.name.startsWith("scale-") &&
    (r.stars >= 1 || /mcp|reader|rag/i.test(r.name)),
);

let made = 0;
for (const r of targets) {
  const title = r.name
    .replace(/[-_]/g, " ")
    .replace(/\bmcp\b/gi, "MCP")
    .replace(/\bai\b/gi, "AI");
  const svg = svgCover({
    name: r.name,
    title,
    description: r.description || "",
    language: r.language,
    owner: r.owner,
    archived: r.archived,
  });
  const svgPath = join(readmeDir, `${r.name}.svg`);
  const pngPath = join(readmeDir, `${r.name}.png`);
  const jpgPath = join(outDir, `${r.name}.jpg`);
  writeFileSync(svgPath, svg);

  // Rasterize via cairosvg (Python) for portable PNG/JPG
  const py = `
import cairosvg
from PIL import Image
import io
svg = open(${JSON.stringify(svgPath)}, 'rb').read()
png_bytes = cairosvg.svg2png(bytestring=svg, output_width=1280, output_height=640)
open(${JSON.stringify(pngPath)}, 'wb').write(png_bytes)
im = Image.open(io.BytesIO(png_bytes)).convert('RGB')
# portfolio card size (match existing art)
im_card = im.resize((1376, 768), Image.Resampling.LANCZOS)
im_card.save(${JSON.stringify(jpgPath)}, 'JPEG', quality=88, optimize=True)
print('ok', ${JSON.stringify(r.name)})
`;
  const res = await $`python3 -c ${py}`.quiet().nothrow();
  if (res.exitCode === 0) {
    made++;
    process.stdout.write(`✓ ${r.name}\n`);
  } else {
    process.stderr.write(`✗ ${r.name}: ${res.stderr.toString()}\n`);
  }
}

console.log(`generated ${made}/${targets.length} covers → ${outDir}`);
console.log(`README-ready PNG/SVG → ${readmeDir}`);
