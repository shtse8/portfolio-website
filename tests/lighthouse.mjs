// Lighthouse, mobile, on every page of the site served at BASE: three runs
// per page, the median performance run is judged, and every category must be
// at least 95. The not-found page is left out: it answers 404 by design, and
// Lighthouse refuses to score a page whose document fails to load
// (browser.mjs covers it with axe, the overflow and target checks instead).
//
//   BASE=http://127.0.0.1:3000 CHROME_PATH=/usr/bin/chromium bun lighthouse.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";

const base = process.env.BASE ?? "http://127.0.0.1:3000";
const out = process.env.OUT ?? "lighthouse";
mkdirSync(out, { recursive: true });
const pages = { home: "/", about: "/about", colophon: "/colophon" };
let low = false;
const rows = [];
for (const [name, path] of Object.entries(pages)) {
  const runs = [];
  for (const i of [1, 2, 3]) {
    const file = `${out}/${name}-${i}.json`;
    try {
      execFileSync("bunx", ["lighthouse@12", base + path, "--quiet", "--output=json", `--output-path=${file}`,
        "--chrome-flags=--headless=new --no-sandbox"], { stdio: "inherit" });
    } catch { /* a failed run leaves its report; a missing score fails below */ }
    runs.push(JSON.parse(readFileSync(file, "utf8")));
  }
  const perf = runs.map((r) => Math.round(r.categories.performance.score * 100));
  const median = [...perf].sort((a, b) => a - b)[1];
  const r = runs[perf.indexOf(median)];
  const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const a = r.audits;
  rows.push(`${name.padEnd(9)} perf ${s.performance} (${perf.join(", ")})  a11y ${s.accessibility}  bp ${s["best-practices"]}  seo ${s.seo}  LCP ${a["largest-contentful-paint"].displayValue}  CLS ${a["cumulative-layout-shift"].numericValue.toFixed(3)}  TBT ${a["total-blocking-time"].displayValue}`);
  for (const k of Object.keys(s)) if (!(s[k] >= 95)) { console.log(`FAIL ${name} ${k} ${s[k]}`); low = true; }
}
console.log(rows.join("\n"));
process.exit(low ? 1 : 0);
