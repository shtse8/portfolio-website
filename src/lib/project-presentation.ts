/**
 * Work-graph presentation from GitHub facts (api-rust / explicit-public snapshot).
 *
 * WEB-STATS dest: dual curated-catalog vs overlay content is retired to one
 * authority. Titles, taglines, intros, and links come from the live repo row.
 * `REPO_NPM` is a join onto `GET /downloads`, not a second product inventory.
 */

import { REPO_NPM } from "./capabilities";
import type { TermRepo } from "./terminal";

/** Basename of api-rust `FLAGSHIP_REPO` (`SylphxAI/pdf-reader-mcp`). */
export const FLAGSHIP_REPO_NAME = "pdf-reader-mcp";

export const PRIMARY_STAR_MIN = 3;

export function npmFromHomepage(
  homepage: string | null | undefined,
): string | undefined {
  if (!homepage) return undefined;
  try {
    const url = new URL(homepage);
    if (!/(^|\.)npmjs\.com$/i.test(url.hostname)) return undefined;
    const match = url.pathname.match(/^\/package\/(@[^/]+\/[^/]+|[^/]+)\/?$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

export function projectTitle(repo: { name: string }): string {
  return repo.name;
}

export function projectTagline(repo: { description?: string | null }): string {
  return repo.description?.trim() ?? "";
}

export function projectIntro(repo: { description?: string | null }): string {
  return repo.description?.trim() || "Open-source work shipping in production.";
}

export function projectDocsUrl(repo: {
  homepage?: string | null;
}): string | undefined {
  const home = repo.homepage?.trim();
  return home || undefined;
}

export function projectNpm(repo: {
  name: string;
  homepage?: string | null;
}): string | undefined {
  return npmFromHomepage(repo.homepage) ?? REPO_NPM[repo.name];
}

export function isFlagshipRepo(repo: { name: string }): boolean {
  return repo.name.toLowerCase() === FLAGSHIP_REPO_NAME;
}

export function isArchivedRepo(repo: { archived?: boolean }): boolean {
  return Boolean(repo.archived);
}

/** Primary grid: GitHub traction, not a curated overlay list. */
export function isPrimaryRepo(repo: TermRepo): boolean {
  if (isArchivedRepo(repo)) return false;
  return repo.stars >= PRIMARY_STAR_MIN;
}

export function sortPortfolio(a: TermRepo, b: TermRepo): number {
  const archivedDelta = Number(isArchivedRepo(a)) - Number(isArchivedRepo(b));
  if (archivedDelta !== 0) return archivedDelta;
  return b.stars - a.stars || a.name.localeCompare(b.name);
}
