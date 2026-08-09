#!/usr/bin/env bun
/**
 * Structural gate for the Signal & Craft portfolio surface.
 * Checks source (and optional export) for design markers that prove the
 * shipped redesign is present — not cinema gimmicks.
 *
 * Usage:
 *   bun scripts/check-cinematic-markers.mjs
 *   bun scripts/check-cinematic-markers.mjs --with-export
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const withExport = process.argv.includes("--with-export");

/** @type {{ id: string; path: string; patterns: RegExp[] }[]} */
const SOURCE_CHECKS = [
  {
    id: "layout-display-font",
    path: "src/app/layout.tsx",
    patterns: [/from "next\/font\/google"/, /Syne/, /--font-display/],
  },
  {
    id: "globals-signal-craft",
    path: "src/app/globals.css",
    patterns: [/SIGNAL & CRAFT/, /--font-display/, /\.text-display/],
  },
  {
    id: "page-no-progress-chrome",
    path: "src/app/page.tsx",
    patterns: [
      /data-design|Header/,
      // must NOT import progress or film grain
    ],
  },
  {
    id: "hero-signal",
    path: "src/components/Hero.tsx",
    patterns: [
      /data-design="signal-craft"/,
      /text-display/,
      /bg-grid mask-fade-b/,
      /btn-primary btn-lg/,
    ],
  },
  {
    id: "story-cards-not-sticky",
    path: "src/components/StoryArc.tsx",
    patterns: [
      /era-web\.jpg|era-social\.jpg|era-mobile\.jpg|era-ai\.jpg|era-consulting\.jpg/,
      /EraCard/,
      /from-surface via-surface/,
    ],
  },
  {
    id: "hero-art-asset",
    path: "public/art/hero-infra.jpg",
    patterns: [], // existence only
  },
];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function read(rel) {
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    fail(`missing file ${rel}`);
    return null;
  }
  return readFileSync(abs, "utf8");
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (
      name.endsWith(".html") ||
      name.endsWith(".css") ||
      name.endsWith(".js")
    )
      acc.push(p);
  }
  return acc;
}

console.log(`design-markers check · root=${root} · withExport=${withExport}`);

// Negative checks on page.tsx
{
  const page = read("src/app/page.tsx");
  if (page) {
    if (/ScrollProgress/.test(page)) fail("page still imports ScrollProgress");
    else ok("page-no-ScrollProgress");
    if (/FilmGrain/.test(page)) fail("page still imports FilmGrain");
    else ok("page-no-FilmGrain");
  }
}

// Story must not use sticky full-viewport holds
{
  const story = read("src/components/StoryArc.tsx");
  if (story) {
    if (/min-h-\[140vh\]|min-h-\[160vh\]|ReelProgress/.test(story)) {
      fail("story still uses sticky reel / tall holds");
    } else {
      ok("story-no-sticky-reel");
    }
  }
}

for (const check of SOURCE_CHECKS) {
  const abs = join(root, check.path);
  if (!existsSync(abs)) {
    fail(`missing ${check.path}`);
    continue;
  }
  if (check.patterns.length === 0) {
    ok(`${check.id} (exists)`);
    continue;
  }
  const body = readFileSync(abs, "utf8");
  const missing = check.patterns.filter((re) => !re.test(body));
  if (missing.length) {
    fail(`${check.id}: missing ${missing.map((r) => r.source).join(", ")}`);
  } else {
    ok(check.id);
  }
}

// Art assets
for (const f of [
  "public/art/hero-infra.jpg",
  "public/art/era-web.jpg",
  "public/art/era-social.jpg",
  "public/art/era-mobile.jpg",
  "public/art/era-ai.jpg",
  "public/art/era-consulting.jpg",
  "public/companys/sylphx.png",
  "public/companys/epiow.png",
]) {
  if (!existsSync(join(root, f))) fail(`missing ${f}`);
  else ok(`asset ${f}`);
}

if (withExport) {
  const outIndex = join(root, "out/index.html");
  if (!existsSync(outIndex)) {
    fail("out/index.html missing — run bun run build first");
  } else {
    const html = readFileSync(outIndex, "utf8");
    if (!/signal-craft|hero-infra|syne_/i.test(html)) {
      fail("export missing signal-craft / hero-infra / syne markers");
    } else ok("export signal markers");
    if (!/art\/hero-infra|BrandCover|signal-craft|text-display/.test(html)) {
      // may be in JS chunk
      const assets = walk(join(root, "out/_next"));
      const blob = assets
        .slice(0, 400)
        .map((p) => {
          try {
            return readFileSync(p, "utf8");
          } catch {
            return "";
          }
        })
        .join("\n");
      if (!/hero-infra/.test(blob) && !/hero-infra/.test(html)) {
        fail("export missing hero-infra asset reference");
      } else ok("export hero-infra ref");
    } else ok("export hero-infra in html");
  }
}

if (process.exitCode && process.exitCode !== 0) {
  console.error("design-markers: FAILED");
  process.exit(process.exitCode);
}
console.log("design-markers: PASSED");
