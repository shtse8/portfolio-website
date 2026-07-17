#!/usr/bin/env bun
/**
 * Sync public repos from GitHub orgs where the authenticated user is admin/owner
 * (plus personal owner repos). Writes src/data/github-portfolio.json
 *
 * Policy:
 * - Non-fork product repos: stars≥1 or KEEP_ALWAYS name match
 * - Notable forks kept when stars≥NOTABLE_FORK_STARS (e.g. Google-Photos-Delete-Tool 144★)
 * - Paginated org/user lists (not a single page of 100)
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
  /mcp|rag|reader|coderag|craft|silk|rapid|flow|vex|pura|webgpu|media-curator|spectra|video|image|smart-read|consultant|platform|synth|skills|lens|talos|control-plane|doctrine|gateway|codec|ast|luzzy|hookyard|morphle|voidbite|tsnum|viszy|qonduit|tryit|spiron|photo-dedup|agent-workbench|alpha-foundry|architecture-reader|mark|portfolio/i;
/** Owned forks with real portfolio signal (personal flagship tools that began as forks). */
const NOTABLE_FORK_STARS = 30;
const NOTABLE_FORK_NAMES = /google-photos-delete-tool/i;

async function ghJson(path) {
  const r = await $`gh api ${path}`.quiet().nothrow();
  if (r.exitCode !== 0) return null;
  return JSON.parse(r.stdout.toString());
}

/** Paginate gh api (Link headers) into one array. */
async function ghJsonAll(path) {
  const r = await $`gh api --paginate ${path}`.quiet().nothrow();
  if (r.exitCode !== 0) return [];
  const text = r.stdout.toString().trim();
  if (!text) return [];
  // --paginate concatenates JSON arrays
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // multi-array stream: ][
    try {
      return JSON.parse(`[${text.replace(/\]\s*\[/g, ",")}]`).flat();
    } catch {
      return [];
    }
  }
  return [];
}

const memberships = (await ghJson("user/memberships/orgs")) ?? [];
const adminOrgs = memberships
  .filter((m) => m.role === "admin" && m.state === "active")
  .map((m) => m.organization.login)
  .filter((login) => !/test|family|hypothesis/i.test(login));

console.log("admin orgs:", adminOrgs.join(", "));

const repos = [];

function keepRepo(r) {
  if (SKIP_NAME.test(r.name)) return false;
  const stars = r.stargazers_count ?? 0;
  const archived = Boolean(r.archived);
  const fork = Boolean(r.fork);
  if (fork) {
    // Portfolio signal: keep high-star forks we actively own (not random forks).
    if (NOTABLE_FORK_NAMES.test(r.name)) return true;
    if (stars >= NOTABLE_FORK_STARS && !archived) return true;
    return false;
  }
  // Active: stars≥1 or product-name match. Archived: only if stars≥3 (UI deprioritizes).
  if (!archived && stars < 1 && !KEEP_ALWAYS.test(r.name)) return false;
  if (archived && stars < 3) return false;
  return true;
}

function pushRepo(r, source, orgLogin) {
  if (!keepRepo(r)) return;
  const stars = r.stargazers_count ?? 0;
  const archived = Boolean(r.archived);
  repos.push({
    owner: orgLogin ?? r.owner?.login ?? "shtse8",
    name: r.name,
    stars,
    archived,
    fork: Boolean(r.fork),
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
  const list = await ghJsonAll(`orgs/${org}/repos?per_page=100&type=public`);
  for (const r of list) pushRepo(r, "org", org);
}

const personal = await ghJsonAll("users/shtse8/repos?per_page=100&type=owner");
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
