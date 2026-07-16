#!/usr/bin/env bun
/**
 * Apply shared OSS social banners into every listed GitHub repo README.
 *
 * For each repo in github-portfolio.json:
 *   1. Ensure docs/banner.png exists (from portfolio public/art/projects/readme/)
 *   2. Insert README banner block at top if missing
 *   3. Commit + push to default branch (main/master)
 *
 * Optional: if public/art/projects/screenshots/{name}.png exists, prefer it as
 * docs/banner.png (real UI screenshot path).
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
  const shot = join(root, "public/art/projects/screenshots", `${name}.png`);
  const shotJpg = join(root, "public/art/projects/screenshots", `${name}.jpg`);
  const designed = join(root, "public/art/projects/readme", `${name}.png`);
  if (existsSync(shot)) return shot;
  if (existsSync(shotJpg)) return shotJpg;
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

    // Convert jpg screenshot → png if needed
    if (src.endsWith(".jpg") || src.endsWith(".jpeg")) {
      await $`python3 -c ${`
from PIL import Image
Image.open(${JSON.stringify(src)}).convert("RGB").save(${JSON.stringify(destBanner)}, "PNG", optimize=True)
`}`.quiet();
    } else {
      copyFileSync(src, destBanner);
    }

    // Also keep a README-sized social if source was screenshot (resize 1280x640 center-crop)
    if (src.includes("/screenshots/")) {
      await $`python3 -c ${`
from PIL import Image
im=Image.open(${JSON.stringify(src)}).convert("RGB")
# letterbox into 1280x640
tw,th=1280,640
im.thumbnail((tw,th), Image.Resampling.LANCZOS)
canvas=Image.new("RGB",(tw,th),(11,18,32))
x=(tw-im.width)//2; y=(th-im.height)//2
canvas.paste(im,(x,y))
canvas.save(${JSON.stringify(destBanner)}, "PNG", optimize=True)
# also refresh portfolio card
card=canvas.resize((1376,768), Image.Resampling.LANCZOS)
card.save(${JSON.stringify(join(root, "public/art/projects", r.name + ".jpg"))}, "JPEG", quality=90)
print("screenshot-banner")
`}`.quiet();
    }

    const readmePath = join(dir, "README.md");
    let readme = existsSync(readmePath)
      ? readFileSync(readmePath, "utf8")
      : `# ${r.name}\n\n${r.description || ""}\n`;
    const inj = injectBanner(readme, `${r.name} banner`);
    if (inj.changed) writeFileSync(readmePath, inj.text);

    if (dry) {
      console.log(`dry ${full} banner=${src.split("/").slice(-2).join("/")} readme=${inj.changed}`);
      ok++;
      continue;
    }

    await $`git -C ${dir} add docs/banner.png README.md`.quiet();
    const st = await $`git -C ${dir} status --porcelain`.quiet();
    if (!st.stdout.toString().trim()) {
      console.log(`noop ${full}`);
      skip++;
      continue;
    }
    await $`git -C ${dir} commit -m ${"docs: add social banner (shared portfolio asset)"}`.quiet();
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
