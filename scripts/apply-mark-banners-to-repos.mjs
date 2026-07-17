#!/usr/bin/env bun
/**
 * Apply Sylphx Mark (mark.sylphx.com) live SVG banners into portfolio repo READMEs.
 *
 * Replaces third-party / static docs/banner.png social headers with our product:
 *   https://mark.sylphx.com/api/v1/banner?...
 *
 * For each repo in github-portfolio.json (active, non-scale):
 *   1. Ensure README has a centered Mark banner (insert or replace old banner blocks)
 *   2. Commit + push to default branch
 *
 * Usage:
 *   bun scripts/apply-mark-banners-to-repos.mjs
 *   bun scripts/apply-mark-banners-to-repos.mjs --dry-run
 *   bun scripts/apply-mark-banners-to-repos.mjs --only=pdf-reader-mcp,coderag
 *   bun scripts/apply-mark-banners-to-repos.mjs --limit=15
 */
import { $ } from "bun";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = join(import.meta.dir, "..");
const portfolio = JSON.parse(
  readFileSync(join(root, "src/data/github-portfolio.json"), "utf8"),
);
const dry = process.argv.includes("--dry-run");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg
  ? new Set(onlyArg.slice("--only=".length).split(",").filter(Boolean))
  : null;
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.slice("--limit=".length)) || 0 : 0;

const MARK = "https://mark.sylphx.com/api/v1/banner";

/** Stable style assignment so each repo keeps a consistent identity. */
const STYLES = [
  "wave",
  "aurora",
  "mesh",
  "plasma",
  "holo",
  "neon",
  "liquid",
  "glass",
  "orbit",
  "meteor",
  "constellation",
  "void",
  "firefly",
  "silk",
];

const THEME_BY_OWNER = {
  shtse8: "tokyonight",
  SylphxAI: "tokyonight",
  Cubeage: "cubeage",
  EpiowAI: "epiow",
  OzyrixLtd: "ozyrix",
};

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function markUrl(r) {
  const style = STYLES[hashName(r.name) % STYLES.length];
  const theme = THEME_BY_OWNER[r.owner] || "tokyonight";
  const text = r.name.replace(/[-_]/g, " ");
  const desc = (r.description || "Open source · Sylphx ecosystem").slice(0, 80);
  const p = new URLSearchParams({
    type: style,
    theme,
    text,
    desc,
    height: "200",
    animation: "rise",
    credit: "0",
  });
  return `${MARK}?${p}`;
}

function markBlock(r) {
  const url = markUrl(r);
  const alt = `${r.name} — Sylphx Mark banner`;
  return `<p align="center">
  <img src="${url}" alt="${alt}" width="100%" />
</p>

`;
}

/** Old portfolio static banners + common third-party README headers we replace. */
const OLD_BANNER_RE =
  /<p align="center">\s*<img[^>]*(?:docs\/banner\.png|art\/projects\/readme\/|mark\.sylphx\.com\/api\/v1\/banner|capsule-render\.vercel\.app|github-readme-stats|readme-typing-svg)[^>]*>\s*<\/p>\s*/gi;

function hasMarkBanner(readme) {
  return /mark\.sylphx\.com\/api\/v1\/banner/i.test(readme);
}

function injectOrReplace(readme, r) {
  const block = markBlock(r);
  if (OLD_BANNER_RE.test(readme)) {
    const next = readme.replace(OLD_BANNER_RE, block);
    return { text: next, changed: next !== readme };
  }
  if (hasMarkBanner(readme)) {
    return { text: readme, changed: false };
  }
  const h1 = readme.match(/^# .+$/m);
  if (h1 && h1.index != null) {
    let i = h1.index + h1[0].length;
    if (readme[i] === "\n") i++;
    return { text: readme.slice(0, i) + "\n" + block + readme.slice(i), changed: true };
  }
  return { text: block + readme, changed: true };
}

const work = tmpdir();
let ok = 0;
let skip = 0;
let fail = 0;
let n = 0;

const candidates = portfolio.repos
  .filter((r) => !String(r.name).startsWith("scale-"))
  .filter((r) => !r.archived)
  .filter((r) => !only || only.has(r.name))
  .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));

for (const r of candidates) {
  if (limit > 0 && n >= limit) break;
  n++;
  const full = `${r.owner}/${r.name}`;
  const dir = mkdtempSync(join(work, `mark-banner-${r.name}-`));
  try {
    const clone = await $`gh repo clone ${full} ${dir} -- --depth=1`.quiet().nothrow();
    if (clone.exitCode !== 0) {
      console.log(`fail clone ${full}: ${clone.stderr.toString().slice(0, 160)}`);
      fail++;
      continue;
    }

    const readmePath = join(dir, "README.md");
    const original = existsSync(readmePath)
      ? readFileSync(readmePath, "utf8")
      : `# ${r.name}\n\n${r.description || ""}\n`;
    const { text, changed } = injectOrReplace(original, r);
    if (!changed) {
      console.log(`noop ${full}`);
      skip++;
      continue;
    }
    writeFileSync(readmePath, text);

    if (dry) {
      console.log(`dry ${full} → ${markUrl(r).slice(0, 90)}…`);
      ok++;
      continue;
    }

    await $`git -C ${dir} add README.md`.quiet();
    const st = await $`git -C ${dir} status --porcelain`.quiet();
    if (!st.stdout.toString().trim()) {
      console.log(`noop ${full}`);
      skip++;
      continue;
    }
    await $`git -C ${dir} commit -m ${"docs: use Sylphx Mark live banner (mark.sylphx.com)"}`.quiet();
    const push = await $`git -C ${dir} push origin HEAD`.quiet().nothrow();
    if (push.exitCode !== 0) {
      console.log(`fail push ${full}: ${push.stderr.toString().slice(0, 200)}`);
      fail++;
    } else {
      console.log(`ok ${full}`);
      ok++;
    }
  } catch (e) {
    console.log(`fail ${full}: ${e}`);
    fail++;
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {}
  }
}

console.log(`\ndone ok=${ok} skip=${skip} fail=${fail} dry=${dry} considered=${n}`);
