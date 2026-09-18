#!/usr/bin/env bun
/**
 * Static-export shell gate — navigation must exist without JavaScript.
 *
 * The site is "the proof"; a visitor who never hydrates (no-JS, slow device,
 * failed chunk) must still be able to see and follow the primary navigation.
 * That is only true if the header markup is in the exported HTML rather than
 * rendered after mount. This gate reads the built out/ tree and fails when the
 * header is missing.
 *
 * Usage:
 *   bun scripts/check-static-header.mjs     # requires out/ (runs after next build)
 *
 * Wired into `bun run build` so a regression fails the same command CI runs.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
let failures = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failures += 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function read(rel) {
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    fail(`missing ${rel}`);
    return null;
  }
  return readFileSync(abs, "utf8");
}

console.log(`static-shell check · root=${root}`);

// 1. Source regression guard: the header must not re-acquire a
//    "render nothing until mounted" gate.
{
  const header = read("src/components/Header.tsx");
  if (header) {
    if (/if\s*\(\s*!mounted\s*\)\s*return\s+null/.test(header)) {
      fail(
        "Header.tsx gates its markup behind mount again (return null until mounted)",
      );
    } else {
      ok("header-source-renders-without-mount");
    }
  }
}

// 2. Build output: every exported document carries the header and its links.
const DOCS = [
  "out/index.html",
  "out/story/index.html",
  "out/work/index.html",
  "out/contact/index.html",
];

const MARKERS = [
  { id: "header-element", pattern: /<header[\s>]/, label: "<header> element" },
  {
    id: "primary-nav",
    pattern: /aria-label="Primary"/,
    label: 'nav aria-label="Primary"',
  },
  { id: "nav-story", pattern: /href="\/story"/, label: 'link href="/story"' },
  { id: "nav-work", pattern: /href="\/work"/, label: 'link href="/work"' },
  {
    id: "nav-contact",
    pattern: /href="\/contact"/,
    label: 'link href="/contact"',
  },
  {
    id: "github-profile",
    pattern: /aria-label="GitHub profile"/,
    label: "GitHub profile link",
  },
  { id: "wordmark", pattern: />KT</, label: "wordmark" },
];

for (const rel of DOCS) {
  const html = read(rel);
  if (!html) continue;
  const missing = MARKERS.filter((m) => !m.pattern.test(html));
  if (missing.length) {
    fail(`${rel}: missing ${missing.map((m) => m.label).join(", ")}`);
  } else {
    ok(`${rel}: header + primary nav in static HTML`);
  }
}

if (failures > 0) {
  console.error(`static-shell: FAILED (${failures} problem(s))`);
  process.exit(1);
}
console.log("static-shell: PASSED");
