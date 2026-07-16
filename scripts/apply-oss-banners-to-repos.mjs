#!/usr/bin/env bun
/**
 * Apply shared OSS social banners into every listed GitHub repo README.
 *
 * For each repo in github-portfolio.json:
 *   1. Ensure docs/banner.png exists (from portfolio public/art/projects/readme/)
 *   2. Insert README banner block at top if missing
 *   3. Commit + push to default branch (main/master)
 *
 * Source of truth: designed banners in public/art/projects/readme/{name}.png
 * (MCP/library identity — not docs-site screenshots).
 *
 * Usage:
 *   bun scripts/apply-oss-banners-to-repos.mjs
 *   bun scripts/apply-oss-banners-to-repos.mjs --dry-run
 *   bun scripts/apply-oss-banners-to-repos.mjs --only=pdf-reader-mcp,coderag
 */
import { $ } from "bun";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
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

const BANNER_BLOCK = (alt) => `<p align="center">
  <img src="docs/banner.png" alt="${alt}" width="100%" />
</p>

`;

function hasBanner(readme) {
  return /docs\/banner\.png|art\/projects\/readme\//i.test(readme);
}

function injectBanner(readme, alt) {
  if (hasBanner(readme)) return { text: readme, changed: false };
  const block = BANNER_BLOCK(alt);
  // Prefer after first H1 if present, else top
  const h1 = readme.match(/^# .+$/m);
  if (h1 && h1.index != null) {
    const end = h1.index + h1[0].length;
    // after the H1 line
    let i = end;
    if (readme[i] === "\n") i++;
    return { text: readme.slice(0, i) + "\n" + block + readme.slice(i), changed: true };
  }
  return { text: block + readme, changed: true };
}

function bannerSource(name) {
  // Designed social banners only. Docs-site screenshots are the wrong metaphor
  // for MCP/library repos (use generate-oss-banners.mjs).
  const designed = join(root, "public/art/projects/readme", `${name}.png`);
  if (existsSync(designed)) return designed;
  return null;
}

const work = tmpdir();
let ok = 0;
let skip = 0;
let fail = 0;

for (const r of portfolio.repos) {
  if (String(r.name).startsWith("scale-")) continue;
  if (only && !only.has(r.name)) continue;

  const full = `${r.owner}/${r.name}`;
  const src = bannerSource(r.name);
  if (!src) {
    console.log(`skip ${full} (no banner asset)`);
    skip++;
    continue;
  }

  const dir = mkdtempSync(join(work, `oss-banner-${r.name}-`));
  try {
    // shallow clone
    const clone = await $`gh repo clone ${full} ${dir} -- --depth=1`.quiet().nothrow();
    if (clone.exitCode !== 0) {
      console.log(`fail clone ${full}: ${clone.stderr.toString().slice(0, 200)}`);
      fail++;
      continue;
    }

    const docs = join(dir, "docs");
    mkdirSync(docs, { recursive: true });
    const destBanner = join(docs, "banner.png");

    copyFileSync(src, destBanner);

    const readmePath = join(dir, "README.md");
    const originalReadme = existsSync(readmePath)
      ? readFileSync(readmePath, "utf8")
      : `# ${r.name}\n\n${r.description || ""}\n`;
    let readme = originalReadme;

    // Remove mistaken docs-scroll demo GIFs (not product demos for MCP tools)
    const demoGif = join(docs, "demo.gif");
    let removedDemo = false;
    if (existsSync(demoGif)) {
      try {
        rmSync(demoGif);
        removedDemo = true;
      } catch {}
      readme = readme.replace(
        /\n*<p align="center">\s*<img src="docs\/demo\.gif"[^>]*>\s*<\/p>\s*/gi,
        "\n",
      );
    }

    const inj = injectBanner(readme, `${r.name} banner`);
    const nextReadme = inj.text;
    if (nextReadme !== originalReadme) {
      writeFileSync(readmePath, nextReadme);
    }

    if (dry) {
      console.log(
        `dry ${full} banner=${src.split("/").slice(-2).join("/")} readme=${inj.changed} demoRemoved=${removedDemo}`,
      );
      ok++;
      continue;
    }

    await $`git -C ${dir} add docs/banner.png README.md`.quiet();
    if (removedDemo) {
      await $`git -C ${dir} add -u docs/demo.gif`.quiet().nothrow();
    }
    const st = await $`git -C ${dir} status --porcelain`.quiet();
    if (!st.stdout.toString().trim()) {
      console.log(`noop ${full}`);
      skip++;
      continue;
    }
    await $`git -C ${dir} commit -m ${"docs: designed social banner only (no docs-site screenshot/GIF)"}`.quiet();
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

console.log(`\ndone ok=${ok} skip=${skip} fail=${fail} dry=${dry}`);
