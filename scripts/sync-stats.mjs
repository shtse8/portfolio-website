#!/usr/bin/env bun
/**
 * Bake live /stats into src/data/stats-baked.json — the honest offline
 * fallback for hero numbers + metadata (the browser overlays live /stats
 * when the API is up; this file is only used when it is not).
 *
 * Usage: bun scripts/sync-stats.mjs
 * Env:   STATS_BASE_URL (default https://kylet.se)
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const base = (process.env.STATS_BASE_URL ?? "https://kylet.se").replace(
  /\/$/,
  "",
);

const res = await fetch(`${base}/stats`, {
  headers: { accept: "application/json" },
  signal: AbortSignal.timeout(15_000),
});
if (!res.ok) {
  console.error(`FAIL /stats http ${res.status}`);
  process.exit(1);
}
const stats = await res.json();
for (const key of [
  "githubStars",
  "npmDownloads",
  "flagshipStars",
  "flagshipDownloads",
  "repos",
  "updatedAt",
]) {
  if (!(key in stats)) {
    console.error(`FAIL /stats missing key ${key}`);
    process.exit(1);
  }
}
const baked = {
  verifiedAt: new Date().toISOString(),
  source: `${base}/stats`,
  githubStars: stats.githubStars,
  npmDownloads: stats.npmDownloads,
  flagshipStars: stats.flagshipStars,
  flagshipDownloads: stats.flagshipDownloads,
  repos: stats.repos,
  updatedAt: stats.updatedAt,
};
const out = join(root, "src/data/stats-baked.json");
writeFileSync(out, `${JSON.stringify(baked, null, 2)}\n`);
console.log(`wrote ${out} (verifiedAt ${baked.verifiedAt})`);
