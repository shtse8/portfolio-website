#!/usr/bin/env bun
/**
 * Structural gate: cinematic portfolio surface is present in source and (when
 * present) the static export. Runs against real shipped paths — no hard-coded
 * "expected pass" stubs.
 *
 * Usage:
 *   bun scripts/check-cinematic-markers.mjs
 *   bun scripts/check-cinematic-markers.mjs --with-export   # also require out/
 *
 * Exit 0 only when every required marker is found.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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
    id: "globals-cinematic-tokens",
    path: "src/app/globals.css",
    patterns: [/CINEMATIC EDITORIAL/, /--font-display/, /\.text-display-xl/, /--ease-cinematic/],
  },
  {
    id: "page-filmgrain",
    path: "src/app/page.tsx",
    patterns: [/FilmGrain/, /from "@\/components\/cinematic\/FilmGrain"/],
  },
  {
    id: "hero-display-xl",
    path: "src/components/Hero.tsx",
    patterns: [/text-display-xl/, /AmbientField/, /ScrollCue/, /data-cinematic-hero/, /Act 01/],
  },
  {
    id: "story-sticky-scenes",
    path: "src/components/StoryArc.tsx",
    patterns: [/sticky/, /min-h-\[140vh\]|min-h-\[160vh\]/, /text-year-watermark|Scene/, /useScroll/],
  },
  {
    id: "filmgrain-component",
    path: "src/components/cinematic/FilmGrain.tsx",
    patterns: [/export default function FilmGrain/, /fractalNoise|feTurbulence/],
  },
  {
    id: "ambient-field-component",
    path: "src/components/cinematic/AmbientField.tsx",
    patterns: [/export default function AmbientField/, /blur-\[/],
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

function walkHtml(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, acc);
    else if (name.endsWith(".html") || name.endsWith(".css") || name.endsWith(".js")) acc.push(p);
  }
  return acc;
}

console.log(`cinematic-markers check · root=${root} · withExport=${withExport}`);

for (const check of SOURCE_CHECKS) {
  const body = read(check.path);
  if (body == null) continue;
  const missing = check.patterns.filter((re) => !re.test(body));
  if (missing.length) {
    fail(`${check.id} (${check.path}): missing ${missing.map((r) => r.source).join(", ")}`);
  } else {
    ok(`${check.id}`);
  }
}

// Export surface (optional unless --with-export)
const outIndex = join(root, "out/index.html");
if (withExport) {
  if (!existsSync(outIndex)) {
    fail("out/index.html missing — run bun run build first");
  } else {
    const html = readFileSync(outIndex, "utf8");
    const exportMarkers = [
      { id: "export-font-display-css-var", re: /--font-display|font-display|syne/i },
      { id: "export-has-stylesheet", re: /_next\/static/ },
    ];
    for (const m of exportMarkers) {
      if (!m.re.test(html)) fail(`export ${m.id}: not found in out/index.html`);
      else ok(`export ${m.id}`);
    }

    // Scan CSS/JS chunks for cinematic class residue shipped to browser
    const assets = walkHtml(join(root, "out/_next"));
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
    const chunkMarkers = [
      { id: "chunk-text-display-xl", re: /text-display-xl/ },
      { id: "chunk-year-watermark-or-scene", re: /text-year-watermark|Scene 0|min-h-\[140vh\]|sticky/ },
      { id: "chunk-cinematic-or-film", re: /cinematic|FilmGrain|fractalNoise|feTurbulence/i },
    ];
    for (const m of chunkMarkers) {
      if (!m.re.test(blob) && !m.re.test(html)) {
        // sticky may minify differently — require at least display-xl + one atmosphere marker
        if (m.id === "chunk-year-watermark-or-scene") {
          if (!/text-year-watermark|140vh|160vh/.test(blob) && !/text-year-watermark|140vh|160vh/.test(html)) {
            fail(`export ${m.id}: not found in out assets`);
          } else ok(`export ${m.id}`);
        } else {
          fail(`export ${m.id}: not found in out assets`);
        }
      } else {
        ok(`export ${m.id}`);
      }
    }
    ok(`export scanned ${assets.length} assets under out/_next`);
  }
} else if (existsSync(outIndex)) {
  ok("out/index.html present (export not required this run)");
}

if (process.exitCode && process.exitCode !== 0) {
  console.error("cinematic-markers: FAILED");
  process.exit(process.exitCode);
}
console.log("cinematic-markers: PASSED");
