#!/usr/bin/env bun
/**
 * Generate GitHub-style OSS social banners (1280×640) for portfolio + READMEs.
 *
 * Pattern (like xai-org/grok-build and most serious OSS):
 *   - Clear product identity (name + tagline)
 *   - Strong visual field (gradient + monogram tile + soft geometry)
 *   - Exact text via SVG (not AI-garbled lettering)
 *
 * Output:
 *   public/art/projects/{name}.jpg              portfolio card (1376×768)
 *   public/art/projects/readme/{name}.png       README banner (1280×640)
 *   public/art/projects/readme/{name}.svg       source
 *
 * Usage: bun scripts/generate-oss-banners.mjs
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

const root = join(import.meta.dir, "..");
const outDir = join(root, "public/art/projects");
const readmeDir = join(outDir, "readme");
mkdirSync(readmeDir, { recursive: true });

const portfolio = JSON.parse(
  readFileSync(join(root, "src/data/github-portfolio.json"), "utf8"),
);

/** Optional curated titles / taglines (fallback to repo metadata). */
const CURATED = {
  "pdf-reader-mcp": {
    title: "PDF Reader MCP",
    tagline: "The PDF intelligence layer for AI agents",
  },
  coderag: {
    title: "CodeRAG",
    tagline: "Semantic code search with AST chunking",
  },
  "filesystem-mcp": {
    title: "Filesystem MCP",
    tagline: "Secure, token-saving filesystem for agents",
  },
  webgpu: {
    title: "WebGPU for Node",
    tagline: "wgpu-rs powered GPU compute from Node.js",
  },
  DeepResearch: {
    title: "DeepResearch",
    tagline: "Autonomous research with Tree-of-Thoughts",
  },
  "media-curator": {
    title: "Media Curator",
    tagline: "Organize and dedupe large photo libraries",
  },
  firestore_odm: {
    title: "Firestore ODM",
    tagline: "Type-safe Firestore for Dart / Flutter",
  },
  "cursor-ai-downloads": {
    title: "Cursor AI Downloads",
    tagline: "Track official Cursor builds, hourly",
  },
  spectra: {
    title: "Spectra",
    tagline: "Dart data classes → JSON Schema & OpenAPI",
  },
  lens: {
    title: "Lens",
    tagline: "Type-safe real-time API framework",
  },
  FireSchema: {
    title: "FireSchema",
    tagline: "Schema tooling for Firestore",
  },
  ArbiMath: {
    title: "ArbiMath",
    tagline: "Arbitrary-precision math for PHP 8",
  },
  Dust: {
    title: "Dust",
    tagline: "Component-based Dart web framework",
  },
};

const PALETTES = [
  { from: "#0B1220", to: "#1E3A5F", accent: "#38BDF8", ink: "#F8FAFC" },
  { from: "#0C1A17", to: "#134E4A", accent: "#2DD4BF", ink: "#F8FAFC" },
  { from: "#1A1030", to: "#3B0764", accent: "#C084FC", ink: "#F8FAFC" },
  { from: "#1C1917", to: "#44403C", accent: "#FBBF24", ink: "#FAFAF9" },
  { from: "#0F172A", to: "#1E293B", accent: "#94A3B8", ink: "#F8FAFC" },
  { from: "#1C0A0A", to: "#7C2D12", accent: "#FB923C", ink: "#FFF7ED" },
];

function palette(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

function monogram(name) {
  const clean = name.replace(/[-_]/g, " ").trim().split(/\s+/);
  if (clean.length >= 2) return (clean[0][0] + clean[1][0]).toUpperCase();
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "OS";
}

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\bmcp\b/gi, "MCP")
    .replace(/\bai\b/gi, "AI")
    .replace(/\bodm\b/gi, "ODM")
    .replace(/\bapi\b/gi, "API");
}

function bannerSvg({ name, title, tagline, owner, language, archived }) {
  const pal = palette(name);
  const mono = monogram(name);
  const meta = [owner, language, archived ? "archived" : null]
    .filter(Boolean)
    .join("  ·  ");
  const t = escapeXml(title);
  const tag = escapeXml((tagline || "").slice(0, 96));
  const m = escapeXml(meta);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1280" y2="640" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${pal.from}"/>
      <stop offset="100%" stop-color="${pal.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 180) rotate(90) scale(420 420)">
      <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${pal.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1280" height="640" fill="url(#bg)"/>
  <rect width="1280" height="640" fill="url(#grid)"/>
  <rect width="1280" height="640" fill="url(#glow)"/>

  <!-- soft product geometry -->
  <g opacity="0.55">
    <rect x="860" y="140" width="260" height="180" rx="28" stroke="${pal.accent}" stroke-opacity="0.55" stroke-width="2" fill="${pal.accent}" fill-opacity="0.06"/>
    <rect x="940" y="260" width="240" height="170" rx="28" stroke="${pal.accent}" stroke-opacity="0.35" stroke-width="2" fill="none"/>
    <circle cx="1040" cy="320" r="110" stroke="${pal.accent}" stroke-opacity="0.25" stroke-width="2" fill="none"/>
    <circle cx="1040" cy="320" r="54" fill="${pal.accent}" fill-opacity="0.18"/>
  </g>

  <!-- monogram tile -->
  <rect x="80" y="96" width="96" height="96" rx="24" fill="${pal.accent}" fill-opacity="0.16" stroke="${pal.accent}" stroke-opacity="0.7" stroke-width="2"/>
  <text x="128" y="158" text-anchor="middle" fill="${pal.accent}" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="700">${escapeXml(mono)}</text>

  <text x="200" y="132" fill="#94A3B8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18">${m}</text>
  <text x="200" y="168" fill="#64748B" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15">open source · social banner</text>

  <text x="80" y="320" fill="${pal.ink}" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="64" font-weight="700">${t}</text>
  <text x="80" y="380" fill="#CBD5E1" font-family="ui-sans-serif, system-ui, sans-serif" font-size="26">${tag}</text>

  <rect x="0" y="576" width="1280" height="64" fill="#000000" fill-opacity="0.28"/>
  <text x="80" y="615" fill="#94A3B8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16">github.com/${escapeXml(owner)}/${escapeXml(name)}</text>
  <circle cx="1200" cy="608" r="8" fill="${pal.accent}"/>
</svg>`;
}

const targets = portfolio.repos.filter(
  (r) => !String(r.name).startsWith("scale-") && (r.stars >= 1 || /mcp|reader|rag/i.test(r.name)),
);

let n = 0;
for (const r of targets) {
  const curated = CURATED[r.name] ?? {};
  const title = curated.title ?? titleCase(r.name);
  const tagline = curated.tagline ?? r.description ?? "";
  const svg = bannerSvg({
    name: r.name,
    title,
    tagline,
    owner: r.owner,
    language: r.language,
    archived: r.archived,
  });

  const svgPath = join(readmeDir, `${r.name}.svg`);
  const pngPath = join(readmeDir, `${r.name}.png`);
  const jpgPath = join(outDir, `${r.name}.jpg`);
  writeFileSync(svgPath, svg);

  const py = `
import cairosvg, io
from PIL import Image
svg = open(${JSON.stringify(svgPath)}, "rb").read()
png = cairosvg.svg2png(bytestring=svg, output_width=1280, output_height=640)
open(${JSON.stringify(pngPath)}, "wb").write(png)
im = Image.open(io.BytesIO(png)).convert("RGB")
im.resize((1376, 768), Image.Resampling.LANCZOS).save(${JSON.stringify(jpgPath)}, "JPEG", quality=90, optimize=True)
print("ok")
`;
  const res = await $`python3 -c ${py}`.quiet().nothrow();
  if (res.exitCode === 0) {
    n++;
    process.stdout.write(`✓ ${r.name}\n`);
  } else {
    process.stderr.write(`✗ ${r.name}: ${res.stderr.toString()}\n`);
  }
}

console.log(`\ngenerated ${n}/${targets.length} banners`);
console.log(`portfolio: ${outDir}/{name}.jpg`);
console.log(`readme:    ${readmeDir}/{name}.png`);
