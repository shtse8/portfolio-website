#!/usr/bin/env bun
/**
 * Product Plate banners — portfolio cards + README art.
 *
 * Art direction (not a widget farm):
 *   - One quiet field, one accent story, name as the hero
 *   - Domain-aware palette + composition (MCP / data / media / infra / default)
 *   - Exact type via SVG (never AI-garbled lettering)
 *   - Static first; motion is Mark's job for embeds
 *
 * Output:
 *   public/art/projects/{name}.jpg              portfolio card (1376×768)
 *   public/art/projects/readme/{name}.png       README (1280×640)
 *   public/art/projects/readme/{name}.svg       source
 *
 * Usage: bun scripts/generate-oss-banners.mjs
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

/** Curated display names / taglines — craft beats raw GitHub. */
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
  synth: {
    title: "Synth",
    tagline: "Synthesis and generation tools",
  },
  skills: {
    title: "Skills",
    tagline: "Agent skills catalog and runtime",
  },
  tsnum: {
    title: "tsnum",
    tagline: "TypeScript numeric utilities",
  },
  "architecture-reader-mcp": {
    title: "Architecture Reader MCP",
    tagline: "Read software architecture with evidence",
  },
  "talos-fleet-controller": {
    title: "Talos Fleet Controller",
    tagline: "Fleet control for Talos Linux clusters",
  },
  "control-plane": {
    title: "Control Plane",
    tagline: "Agent-native work ledger and delivery graph",
  },
  doctrine: {
    title: "Doctrine",
    tagline: "Engineering doctrine and fleet standards",
  },
  platform: {
    title: "Platform",
    tagline: "Sylphx platform surface",
  },
  gateway: {
    title: "Gateway",
    tagline: "AI gateway and routing surface",
  },
  "Google-Photos-Delete-Tool": {
    title: "Google Photos Delete Tool",
    tagline: "Stable bulk cleanup for Google Photos",
  },
  "image-reader-mcp": {
    title: "Image Reader MCP",
    tagline: "Vision-ready image intelligence for agents",
  },
  "video-reader-mcp": {
    title: "Video Reader MCP",
    tagline: "Understand video with structured evidence",
  },
  "smart-reader-mcp": {
    title: "Smart Reader MCP",
    tagline: "Multi-format reading for agent workflows",
  },
  "rag-server-mcp": {
    title: "RAG Server MCP",
    tagline: "Retrieval layer for agent knowledge",
  },
  "mcp-server-sdk": {
    title: "MCP Server SDK",
    tagline: "Build production MCP servers faster",
  },
  Nebula: {
    title: "Nebula",
    tagline: "Dart tooling and experiments",
  },
  mark: {
    title: "Mark",
    tagline: "Embeddable SVG marks for READMEs",
  },
};

/** Domain palettes — fewer, more intentional. */
const DOMAINS = {
  mcp: {
    from: "#07101f",
    mid: "#0c2744",
    to: "#123a52",
    accent: "#38bdf8",
    accent2: "#7dd3fc",
    ink: "#f8fafc",
    muted: "#94a3b8",
    motif: "nodes",
  },
  data: {
    from: "#0a1210",
    mid: "#0f2f28",
    to: "#134e4a",
    accent: "#2dd4bf",
    accent2: "#5eead4",
    ink: "#f0fdfa",
    muted: "#99a3a0",
    motif: "bars",
  },
  media: {
    from: "#140a18",
    mid: "#2a1050",
    to: "#3b0764",
    accent: "#c084fc",
    accent2: "#e9d5ff",
    ink: "#faf5ff",
    muted: "#a78bba",
    motif: "frames",
  },
  infra: {
    from: "#0b0d12",
    mid: "#151a24",
    to: "#1e293b",
    accent: "#94a3b8",
    accent2: "#cbd5e1",
    ink: "#f8fafc",
    muted: "#64748b",
    motif: "grid",
  },
  agent: {
    from: "#100c08",
    mid: "#2a1810",
    to: "#7c2d12",
    accent: "#fb923c",
    accent2: "#fdba74",
    ink: "#fff7ed",
    muted: "#a8a29e",
    motif: "orbit",
  },
  math: {
    from: "#0c0a14",
    mid: "#1a1030",
    to: "#312e81",
    accent: "#818cf8",
    accent2: "#a5b4fc",
    ink: "#eef2ff",
    muted: "#9ca3af",
    motif: "wave",
  },
  default: {
    from: "#0b1220",
    mid: "#132033",
    to: "#1e3a5f",
    accent: "#60a5fa",
    accent2: "#93c5fd",
    ink: "#f8fafc",
    muted: "#94a3b8",
    motif: "soft",
  },
};

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function domainFor(name, language, description) {
  const hay = `${name} ${description || ""} ${language || ""}`.toLowerCase();
  if (/mcp|agent|llm|rag|reader|skill/.test(hay)) return "mcp";
  if (/photo|media|image|video|curator|gpu|webgpu|3d|flutter3d/.test(hay))
    return "media";
  if (
    /talos|k8s|cluster|fleet|platform|infra|deploy|controller|gateway/.test(hay)
  )
    return "infra";
  if (/firestore|odm|schema|sql|db|data|spectra|json/.test(hay)) return "data";
  if (/math|num|arbimath|tsnum|synth/.test(hay)) return "math";
  if (/research|deep|cursor|ai/.test(hay)) return "agent";
  return "default";
}

function monogram(name) {
  const clean = name.replace(/[-_]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (clean.length >= 2) return (clean[0][0] + clean[1][0]).toUpperCase();
  // CamelCase / PascalCase → first letters of humps (ArbiMath → AM)
  const humps = name.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g);
  if (humps && humps.length >= 2) {
    return (humps[0][0] + humps[1][0]).toUpperCase();
  }
  return (
    name
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "OS"
  );
}

function titleCase(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\bmcp\b/gi, "MCP")
    .replace(/\bai\b/gi, "AI")
    .replace(/\bodm\b/gi, "ODM")
    .replace(/\bapi\b/gi, "API")
    .replace(/\brag\b/gi, "RAG")
    .replace(/\bsdk\b/gi, "SDK");
}

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Right-side art — one motif, not a random carnival. */
function motifArt(motif, pal, seed) {
  const a = pal.accent;
  const a2 = pal.accent2;
  const s = seed % 7;
  switch (motif) {
    case "nodes": {
      // Soft constellation / graph — MCP / agents
      const nodes = [
        [980, 200],
        [1120, 260],
        [1040, 360],
        [920, 320],
        [1180, 340],
        [1080, 180],
      ];
      let edges = "";
      for (let i = 0; i < nodes.length - 1; i++) {
        const [x1, y1] = nodes[i];
        const [x2, y2] = nodes[(i + 1 + s) % nodes.length];
        edges += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${a}" stroke-opacity="0.22" stroke-width="1.5"/>`;
      }
      const dots = nodes
        .map(
          ([x, y], i) =>
            `<circle cx="${x}" cy="${y}" r="${i % 2 ? 7 : 5}" fill="${a}" fill-opacity="${0.25 + (i % 3) * 0.08}"/>`,
        )
        .join("");
      return `<g opacity="0.95">${edges}${dots}
        <circle cx="1040" cy="280" r="120" fill="none" stroke="${a}" stroke-opacity="0.12" stroke-width="1"/>
      </g>`;
    }
    case "bars": {
      // Spectrum / data bars
      let bars = "";
      for (let i = 0; i < 9; i++) {
        const h = 40 + ((seed + i * 17) % 140);
        const x = 900 + i * 32;
        bars += `<rect x="${x}" y="${480 - h}" width="18" height="${h}" rx="6" fill="${i % 2 ? a : a2}" fill-opacity="${0.18 + (i % 4) * 0.05}"/>`;
      }
      return `<g>${bars}
        <path d="M900 200 C980 120, 1080 320, 1180 180" fill="none" stroke="${a}" stroke-opacity="0.28" stroke-width="2"/>
      </g>`;
    }
    case "frames": {
      // Nested frames — media
      return `<g opacity="0.9">
        <rect x="880" y="150" width="280" height="200" rx="22" fill="${a}" fill-opacity="0.07" stroke="${a}" stroke-opacity="0.45" stroke-width="1.5"/>
        <rect x="940" y="250" width="260" height="190" rx="22" fill="none" stroke="${a2}" stroke-opacity="0.28" stroke-width="1.5"/>
        <circle cx="1060" cy="300" r="48" fill="${a}" fill-opacity="0.14"/>
        <path d="M1044 300 L1056 312 L1082 284" fill="none" stroke="${a2}" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
    }
    case "grid": {
      // Quiet infra lattice + one accent column
      return `<g>
        <rect x="900" y="140" width="2" height="360" fill="${a}" fill-opacity="0.35"/>
        <rect x="940" y="180" width="200" height="1" fill="${a}" fill-opacity="0.2"/>
        <rect x="940" y="240" width="160" height="1" fill="${a}" fill-opacity="0.15"/>
        <rect x="940" y="300" width="220" height="1" fill="${a}" fill-opacity="0.12"/>
        <rect x="940" y="360" width="120" height="1" fill="${a}" fill-opacity="0.18"/>
        <circle cx="900" cy="200" r="5" fill="${a}" fill-opacity="0.7"/>
        <circle cx="900" cy="320" r="5" fill="${a}" fill-opacity="0.45"/>
        <circle cx="900" cy="440" r="5" fill="${a}" fill-opacity="0.3"/>
      </g>`;
    }
    case "orbit": {
      return `<g opacity="0.95">
        <circle cx="1050" cy="300" r="150" fill="none" stroke="${a}" stroke-opacity="0.18" stroke-width="1.5" stroke-dasharray="4 10"/>
        <circle cx="1050" cy="300" r="95" fill="none" stroke="${a2}" stroke-opacity="0.22" stroke-width="1.5"/>
        <circle cx="1050" cy="300" r="36" fill="${a}" fill-opacity="0.2"/>
        <circle cx="1185" cy="250" r="8" fill="${a2}" fill-opacity="0.65"/>
        <circle cx="920" cy="380" r="6" fill="${a}" fill-opacity="0.5"/>
      </g>`;
    }
    case "wave": {
      return `<g opacity="0.9">
        <path d="M860 360 C920 280, 980 440, 1040 320 S1160 280, 1220 360" fill="none" stroke="${a}" stroke-opacity="0.35" stroke-width="2.5"/>
        <path d="M860 400 C930 330, 990 470, 1050 360 S1160 330, 1220 400" fill="none" stroke="${a2}" stroke-opacity="0.22" stroke-width="2"/>
        <circle cx="1040" cy="320" r="10" fill="${a}" fill-opacity="0.4"/>
      </g>`;
    }
    default:
      return `<g opacity="0.85">
        <rect x="900" y="160" width="240" height="160" rx="32" fill="${a}" fill-opacity="0.08" stroke="${a}" stroke-opacity="0.35" stroke-width="1.5"/>
        <circle cx="1100" cy="380" r="90" fill="none" stroke="${a2}" stroke-opacity="0.2" stroke-width="1.5"/>
      </g>`;
  }
}

function bannerSvg({ name, title, tagline, owner, language, description }) {
  const domainKey = domainFor(name, language, description);
  const pal = DOMAINS[domainKey];
  const seed = hashName(name);
  const mono = monogram(title || name);
  const t = escapeXml(title);
  const tag = escapeXml((tagline || "").slice(0, 88));
  const ownerLine = escapeXml(`${owner}`);
  const repoLine = escapeXml(name);
  const domainLabel = escapeXml(
    domainKey === "default" ? "open source" : domainKey,
  );

  // Title size: shorter names get larger display
  const titleSize = title.length > 22 ? 52 : title.length > 16 ? 58 : 64;
  const titleY = tag ? 340 : 360;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="640" x2="1280" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${pal.from}"/>
      <stop offset="48%" stop-color="${pal.mid}"/>
      <stop offset="100%" stop-color="${pal.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(1020 220) rotate(70) scale(480 400)">
      <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.38"/>
      <stop offset="55%" stop-color="${pal.accent2}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${pal.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </linearGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0" in="n"/>
    </filter>
  </defs>

  <rect width="1280" height="640" fill="url(#bg)"/>
  <rect width="1280" height="640" fill="url(#glow)"/>
  <rect width="1280" height="640" fill="url(#vignette)"/>
  <rect width="1280" height="640" filter="url(#grain)" opacity="0.55"/>

  ${motifArt(pal.motif, pal, seed)}

  <!-- Identity column -->
  <rect x="72" y="88" width="88" height="88" rx="22" fill="${pal.accent}" fill-opacity="0.12"
    stroke="${pal.accent}" stroke-opacity="0.65" stroke-width="1.5"/>
  <text x="116" y="144" text-anchor="middle" fill="${pal.accent}"
    font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    font-size="32" font-weight="700" letter-spacing="0.04em">${escapeXml(mono)}</text>

  <text x="180" y="122" fill="${pal.muted}"
    font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" letter-spacing="0.04em">${ownerLine}</text>
  <text x="180" y="150" fill="${pal.muted}" fill-opacity="0.75"
    font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="13">${domainLabel}</text>

  <!-- Hairline under meta -->
  <rect x="72" y="210" width="72" height="2" rx="1" fill="${pal.accent}" fill-opacity="0.55"/>

  <text x="72" y="${titleY}" fill="${pal.ink}"
    font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    font-size="${titleSize}" font-weight="700" letter-spacing="-0.03em">${t}</text>
  ${
    tag
      ? `<text x="72" y="${titleY + 52}" fill="${pal.muted}"
    font-family="ui-sans-serif, system-ui, sans-serif"
    font-size="22" font-weight="450">${tag}</text>`
      : ""
  }

  <!-- Floor bar -->
  <rect x="0" y="560" width="1280" height="80" fill="url(#floor)"/>
  <text x="72" y="608" fill="${pal.muted}"
    font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14">github.com/${ownerLine}/${repoLine}</text>
  <circle cx="1208" cy="604" r="6" fill="${pal.accent}" fill-opacity="0.85"/>
</svg>`;
}

const targets = portfolio.repos.filter(
  (r) =>
    !String(r.name).startsWith("scale-") &&
    (r.stars >= 1 ||
      /mcp|reader|rag|mark|doctrine|platform|gateway|control/i.test(r.name)),
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
    description: r.description,
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
im.resize((1376, 768), Image.Resampling.LANCZOS).save(${JSON.stringify(jpgPath)}, "JPEG", quality=92, optimize=True)
print("ok")
`;
  const res = await $`python3 -c ${py}`.quiet().nothrow();
  if (res.exitCode === 0) {
    n++;
    process.stdout.write(
      `✓ ${r.name} [${domainFor(r.name, r.language, r.description)}]\n`,
    );
  } else {
    process.stderr.write(`✗ ${r.name}: ${res.stderr.toString()}\n`);
  }
}

console.log(`\ngenerated ${n}/${targets.length} product plates`);
console.log(`portfolio: ${outDir}/{name}.jpg`);
console.log(`readme:    ${readmeDir}/{name}.png`);
