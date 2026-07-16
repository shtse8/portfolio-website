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
const SKIP_NAME =
  /^(renovate-config|\.github|bun-workflow-test|website|configs|rook-ceph-fork|skills-public-cleanroom)$/i;
// Always keep product/tooling surface even at 0–1★ (MCP family, synth, etc.)
const KEEP_ALWAYS =
  /mcp|rag|reader|coderag|craft|silk|rapid|flow|vex|pura|webgpu|media-curator|spectra|video|image|smart-read|consultant|platform|synth|skills|lens|talos|control-plane|doctrine|gateway|codec|ast|luzzy|hookyard|morphle|voidbite|tsnum|viszy|qonduit|tryit|spiron|photo-dedup|agent-workbench|alpha-foundry|architecture-reader/i;

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

function pushRepo(r, source, orgLogin) {
  if (r.fork || SKIP_NAME.test(r.name)) return;
  const stars = r.stargazers_count ?? 0;
  const archived = Boolean(r.archived);
  // Active: stars≥1 or product-name match. Archived: only if stars≥3 (UI deprioritizes).
  if (!archived && stars < 1 && !KEEP_ALWAYS.test(r.name)) return;
  if (archived && stars < 3) return;
  repos.push({
    owner: orgLogin ?? r.owner?.login ?? "shtse8",
    name: r.name,
    stars,
    archived,
    description: r.description ?? "",
    language: r.language,
    topics: r.topics ?? [],
    homepage: r.homepage || null,
    url: r.html_url,
    pushedAt: r.pushed_at ?? "",
    source,
    orgLogin: orgLogin ?? null,
  });
}

for (const org of adminOrgs) {
  const list =
    (await ghJson(`orgs/${org}/repos?per_page=100&type=public`)) ?? [];
  for (const r of list) pushRepo(r, "org", org);
}

const personal =
  (await ghJson("users/shtse8/repos?per_page=100&type=owner")) ?? [];
for (const r of personal) pushRepo(r, "personal", null);

const seen = new Set();
const uniq = [];
// Active first (by stars), then archived (by stars) — portfolio signal order
for (const r of repos.sort((a, b) => {
  if (a.archived !== b.archived) return a.archived ? 1 : -1;
  return b.stars - a.stars || a.name.localeCompare(b.name);
})) {
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
const archivedN = uniq.filter((r) => r.archived).length;
console.log(
  `wrote ${uniq.length} repos (${archivedN} archived) → ${path}`,
);
