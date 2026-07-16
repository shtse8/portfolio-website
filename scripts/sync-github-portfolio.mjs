#!/usr/bin/env bun
/**
 * Sync public non-fork repos from GitHub orgs where the authenticated user
 * is admin/owner (plus personal owner repos). Writes src/data/github-portfolio.json
 *
 * Usage: bun scripts/sync-github-portfolio.mjs
 * Requires: gh auth with repo read.
 */
import { $ } from "bun";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const SKIP_NAME = /^(renovate-config|\.github|bun-workflow-test|website)$/i;
const KEEP_ZERO =
  /mcp|rag|reader|coderag|craft|silk|rapid|flow|vex|pura|webgpu|media-curator|spectra|video|image|smart-read|consultant|platform/i;

async function ghJson(path) {
  const r = await $`gh api ${path}`.quiet().nothrow();
  if (r.exitCode !== 0) return null;
  return JSON.parse(r.stdout.toString());
}

const memberships = (await ghJson("user/memberships/orgs")) ?? [];
const adminOrgs = memberships
  .filter((m) => m.role === "admin" && m.state === "active")
  .map((m) => m.organization.login)
  .filter((login) => !/test|family|ozyrix|hypothesis/i.test(login));

console.log("admin orgs:", adminOrgs.join(", "));

const repos = [];

for (const org of adminOrgs) {
  const list = (await ghJson(`orgs/${org}/repos?per_page=100&type=public`)) ?? [];
  for (const r of list) {
    if (r.fork || SKIP_NAME.test(r.name)) continue;
    const stars = r.stargazers_count ?? 0;
    if (stars < 2 && !KEEP_ZERO.test(r.name)) continue;
    repos.push({
      owner: org,
      name: r.name,
      stars,
      description: r.description ?? "",
      language: r.language,
      topics: r.topics ?? [],
      homepage: r.homepage || null,
      url: r.html_url,
      pushedAt: r.pushed_at ?? "",
      source: "org",
      orgLogin: org,
    });
  }
}

const personal = (await ghJson("users/shtse8/repos?per_page=100&type=owner")) ?? [];
for (const r of personal) {
  if (r.fork || SKIP_NAME.test(r.name)) continue;
  const stars = r.stargazers_count ?? 0;
  if (stars < 2 && !KEEP_ZERO.test(r.name)) continue;
  repos.push({
    owner: "shtse8",
    name: r.name,
    stars,
    description: r.description ?? "",
    language: r.language,
    topics: r.topics ?? [],
    homepage: r.homepage || null,
    url: r.html_url,
    pushedAt: r.pushed_at ?? "",
    source: "personal",
    orgLogin: null,
  });
}

const seen = new Set();
const uniq = [];
for (const r of repos.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))) {
  const k = `${r.owner}/${r.name}`;
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(r);
}

const payload = {
  syncedAt: new Date().toISOString(),
  adminOrgs,
  repos: uniq,
};

const path = join(root, "src/data/github-portfolio.json");
writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`wrote ${uniq.length} repos → ${path}`);
