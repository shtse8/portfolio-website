#!/usr/bin/env bun
/**
 * Capture real UI screenshots for OSS projects that expose a demo/docs site.
 * Writes: public/art/projects/screenshots/{repoName}.png
 * Optional short demo GIF when --gif is set and UI is interactive enough.
 *
 * Usage: bun scripts/screenshot-oss-ui.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

const root = join(import.meta.dir, "..");
const outDir = join(root, "public/art/projects/screenshots");
const gifDir = join(root, "public/art/projects/gifs");
mkdirSync(outDir, { recursive: true });
mkdirSync(gifDir, { recursive: true });

/** Map portfolio repo name → live URL worth screenshotting */
const UI_TARGETS = [
  {
    name: "pdf-reader-mcp",
    url: "https://sylphxai.github.io/pdf-reader-mcp/",
    wait: 2000,
  },
  {
    name: "firestore_odm",
    url: "https://sylphxai.github.io/firestore_odm",
    wait: 2000,
  },
  {
    name: "webgpu",
    url: "https://webgpu-ruddy.vercel.app",
    wait: 3000,
  },
  {
    name: "media-curator",
    url: "https://media-curator.vercel.app",
    wait: 3000,
    gif: true,
  },
  {
    name: "FireSchema",
    url: "https://shtse8.github.io/FireSchema/",
    wait: 2000,
  },
  {
    name: "craft",
    url: "https://craft-sepia.vercel.app",
    wait: 2500,
  },
  {
    name: "silk",
    url: "https://silk-lake.vercel.app",
    wait: 2500,
  },
  {
    name: "flow",
    url: "https://flow-sylphx.vercel.app",
    wait: 2500,
  },
  {
    name: "rapid",
    url: "https://zen-sylphx.vercel.app",
    wait: 2500,
  },
  {
    name: "code",
    url: "https://code-sylphx.vercel.app",
    wait: 2500,
  },
  {
    name: "rag-server-mcp",
    url: "https://rag-server-mcp.vercel.app",
    wait: 2500,
  },
  {
    name: "effect",
    url: "https://sylphxltd.github.io/effect/",
    wait: 2000,
  },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

let ok = 0;
for (const t of UI_TARGETS) {
  const page = await context.newPage();
  const out = join(outDir, `${t.name}.png`);
  try {
    const res = await page.goto(t.url, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    const status = res?.status() ?? 0;
    if (status >= 400) {
      console.log(`skip ${t.name} http ${status}`);
      await page.close();
      continue;
    }
    await page.waitForTimeout(t.wait ?? 1500);
    // dismiss cookie banners if any
    try {
      await page.keyboard.press("Escape");
    } catch {}
    await page.screenshot({ path: out, fullPage: false });
    console.log(`shot ${t.name} → ${out}`);
    ok++;

    // optional multi-frame GIF for selected UIs
    if (t.gif) {
      const framesDir = join(gifDir, t.name);
      mkdirSync(framesDir, { recursive: true });
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, 180);
        await page.waitForTimeout(350);
        await page.screenshot({
          path: join(framesDir, `f${String(i).padStart(2, "0")}.png`),
        });
      }
      const gifPath = join(gifDir, `${t.name}.gif`);
      // Prefer ffmpeg palette gif if available
      const ff = await $`which ffmpeg`.quiet().nothrow();
      if (ff.exitCode === 0) {
        await $`ffmpeg -y -framerate 2 -i ${framesDir}/f%02d.png -vf "scale=960:-1:flags=lanczos,fps=2" -loop 0 ${gifPath}`.quiet().nothrow();
        if (existsSync(gifPath)) console.log(`gif ${t.name} → ${gifPath}`);
      } else {
        console.log(`gif skipped (no ffmpeg) for ${t.name}`);
      }
    }
  } catch (e) {
    console.log(`fail ${t.name}: ${String(e).slice(0, 180)}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`done screenshots ok=${ok}/${UI_TARGETS.length}`);
