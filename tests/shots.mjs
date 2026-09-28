// Screenshots of every page at phone, tablet and desktop size, light and
// dark, from the site served at BASE, into OUT (docs/design/screens/).
//
//   BASE=http://127.0.0.1:4173 CHROME=/usr/bin/chromium OUT=../docs/design/screens bun shots.mjs
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const base = process.env.BASE ?? "http://127.0.0.1:4173";
const out = process.env.OUT ?? "shots";
const full = process.env.FULL !== "0";
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "/usr/bin/chromium", args: ["--no-sandbox"] });
const pages = { home: "/", about: "/about", colophon: "/colophon", "404": "/no-such-page" };
const sizes = { phone: [390, 844], tablet: [820, 1180], desktop: [1440, 900] };
for (const [name, path] of Object.entries(pages)) {
  for (const [size, [width, height]] of Object.entries(sizes)) {
    for (const scheme of ["light", "dark"]) {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
      await page.setViewport({ width, height, deviceScaleFactor: 2 });
      await page.goto(base + path, { waitUntil: "networkidle0" });
      await page.screenshot({ path: `${out}/${name}-${size}-${scheme}.webp`, type: "webp", quality: 80, fullPage: full });
      await page.close();
    }
  }
}
await browser.close();
console.log("shots written to", out);
