// Browser checks over the site pack (dist/web), served at BASE:
// - every page, light and dark, at 320, 390 and 1440 px: loads without
//   script errors, has no sideways scroll, and axe (WCAG 2.2 AA) finds nothing;
// - every link and button is at least 44 px tall;
// - the previous site's pages answer 301, its API paths 410 (nginx only);
// - the scene stays a poster until the reader interacts;
// - the contact island copies on press;
// - unknown paths get the 404 page.
//
//   BASE=http://127.0.0.1:4173 CHROME=/usr/bin/chromium bun browser.mjs
import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const base = process.env.BASE ?? "http://127.0.0.1:4173";
const axe = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? "/usr/bin/chromium",
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const failures = [];
const fail = (msg) => { failures.push(msg); console.log(`FAIL ${msg}`); };
const pages = ["/", "/about", "/colophon", "/no-such-page"];

async function open(path, width, scheme = "light") {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errors.push(m.text()));
  // Content-security-policy violations surface as script errors.
  await page.evaluateOnNewDocument(() => document.addEventListener("securitypolicyviolation", (e) =>
    console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`)));
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
  await page.setCacheEnabled(false);
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  const res = await page.goto(base + path, { waitUntil: "networkidle0" });
  return { page, errors, status: res.status() };
}

for (const path of pages) {
  for (const scheme of ["light", "dark"]) {
    for (const width of [320, 390, 1440]) {
      const { page, errors, status } = await open(path, width, scheme);
      const where = `${path} ${scheme} @${width}`;
      const want = path === "/no-such-page" ? 404 : 200;
      if (status !== want) fail(`${where}: status ${status}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 0) fail(`${where}: scrolls sideways by ${overflow}px`);
      if (width !== 320) {
        // Evaluated through DevTools, so the page's policy (no inline script) still holds.
        await page.evaluate(axe);
        const { violations } = await page.evaluate(() =>
          axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }));
        for (const v of violations) fail(`${where}: axe ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`);
        const small = await page.evaluate(() =>
          [...document.querySelectorAll("a[href], button")]
            // Links inside a sentence are exempt (WCAG 2.5.8 inline exception).
            .filter((e) => e.offsetParent !== null && e.id !== "skip" && e.parentElement.tagName !== "P")
            .filter((e) => e.getBoundingClientRect().height < 44)
            .map((e) => `${e.id || e.textContent.trim()} ${Math.round(e.getBoundingClientRect().height)}px`));
        if (small.length) fail(`${where}: targets under 44px: ${small.join(", ")}`);
      }
      if (errors.length) fail(`${where}: script errors: ${errors.join(" | ")}`);
      await page.close();
    }
  }
}

// Pages of the previous site answer 301 to where their content lives now.
const moved = { story: "/about", work: "/#work", contact: "/#contact" };
for (const [from, to] of Object.entries(moved)) {
  for (const path of [`/${from}`, `/${from}/`]) {
    const res = await fetch(base + path, { redirect: "manual" });
    const location = new URL(res.headers.get("location") ?? "", base);
    if (res.status !== 301 || location.pathname + location.hash !== to) fail(`${path}: ${res.status} to ${location.pathname}${location.hash}, not 301 to ${to}`);
  }
}

// The retired API's paths are gone for good (answered by nginx in the image).
if (process.env.GONE === "1") {
  for (const path of ["/stats", "/activity", "/projects", "/recent", "/repo", "/downloads", "/claims", "/chat", "/chat/ready"]) {
    const res = await fetch(base + path, { redirect: "manual" });
    if (res.status !== 410) fail(`${path}: ${res.status}, not 410`);
  }
}

// Every page's canonical URL is the URL the host serves, not a redirect.
for (const path of ["/", "/about", "/colophon"]) {
  const html = await (await fetch(base + path)).text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) { fail(`${path} has no canonical URL`); continue; }
  const served = await fetch(base + new URL(canonical).pathname, { redirect: "manual" });
  if (served.status !== 200) fail(`${path}: canonical ${canonical} answers ${served.status}, not 200`);
}

// The scene is a poster until the reader interacts.
{
  const { page, errors } = await open("/", 1440);
  const canvases = await page.$$eval("canvas", (c) => c.length);
  if (canvases !== 0) fail(`home starts ${canvases} engine canvases before any interaction`);
  const poster = await page.$eval("#hero-scene img", (i) => i.complete && i.naturalWidth > 0);
  if (!poster) fail("the hero poster did not load");
  if (errors.length) fail(`home scene: script errors: ${errors.join(" | ")}`);
  await page.close();
}

// The contact island: it loads as it nears the viewport, and the first tap
// on Copy works even when that tap is what loads the client (no lost tap).
if (process.env.ISLANDS !== "0") {
  for (const how of ["scroll", "first-tap"]) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setRequestInterception(true);
    page.on("request", (r) => (r.url().includes("/_keel/scenes-") ? r.abort() : r.continue()));
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(base + "/", { waitUntil: "networkidle0" });
    await page.$eval("#email-copy", (e) => e.scrollIntoView({ block: "center" }));
    if (how === "scroll") {
      await page.waitForFunction(() => window.__keel_hydrated === true, { timeout: 20000 })
        .catch(() => fail("the islands client did not load when the contact came into view"));
    } else if (await page.evaluate(() => window.__keel_hydrated === true)) {
      // Scrolling already loaded it; the first-tap case needs a cold island.
      await page.close();
      continue;
    }
    const href = await page.$eval("#email-address", (e) => e.getAttribute("href"));
    if (href !== "mailto:hi@kylet.se") fail(`contact links to ${href}`);
    await page.click("#email-copy");
    await page.waitForFunction(() => document.querySelector("#email-status")?.textContent === "Copied", { timeout: 20000 })
      .catch(() => fail(`${how}: the first tap on Copy did not report that it copied`));
    if (errors.length) fail(`contact island (${how}): script errors: ${errors.join(" | ")}`);
    await page.close();
  }
  // A cold island: tap before the client is near (its request held back until the tap).
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(base + "/", { waitUntil: "networkidle0" });
  const cold = await page.evaluate(() => window.__keel_hydrated !== true);
  await page.$eval("#email-copy", (e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.click("#email-copy");
  await page.waitForFunction(() => document.querySelector("#email-status")?.textContent === "Copied", { timeout: 20000 })
    .catch(() => fail(`immediate tap (cold=${cold}): the first tap on Copy was lost`));
  if (errors.length) fail(`contact island (immediate tap): script errors: ${errors.join(" | ")}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.log(`${failures.length} failure(s)`);
  process.exit(1);
}
console.log("browser checks passed");
