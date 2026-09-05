import type { TermRepo } from "./terminal";

/** Synced GitHub snapshot row (`github-portfolio.json`). */
export type SnapshotRepo = {
  owner: string;
  name: string;
  stars: number;
  archived?: boolean;
  private?: boolean;
  visibility?: string;
  description: string;
  language: string | null;
  topics: string[];
  homepage: string | null;
  url: string;
  pushedAt: string;
};

/** Publication authority: explicit public only. Missing fields fail closed. */
export function isExplicitlyPublicSnapshot(r: {
  private?: boolean;
  visibility?: string;
}): boolean {
  return r.private === false && r.visibility === "public";
}

/** API-down inventory from the synced explicit-public snapshot. */
export function fallbackProjectsFromSnapshot(
  repos: SnapshotRepo[],
  limit = 60,
): TermRepo[] {
  return repos
    .filter(isExplicitlyPublicSnapshot)
    .filter((r) => !r.name.startsWith("scale-"))
    .slice(0, limit)
    .map((r) => ({
      repo: `${r.owner}/${r.name}`,
      name: r.name,
      owner: r.owner,
      stars: r.stars,
      forks: 0,
      description: r.description || null,
      language: r.language,
      topics: r.topics ?? [],
      homepage: r.homepage,
      url: r.url,
      pushed: r.pushedAt,
      pushedAt: r.pushedAt,
      archived: Boolean(r.archived),
    }));
}

/**
 * Live `/projects` is the sole browsing inventory when it returns a non-empty
 * list. Fallback stays only when the live fetch fails or is empty.
 * Copying `archived` onto matching live rows is a field enrich (live may omit
 * the flag), not a second catalog of fallback-only repos.
 */
export function adoptLiveProjects(
  fallback: TermRepo[],
  live: TermRepo[] | null | undefined,
): { projects: TermRepo[]; liveProjects: boolean } {
  if (!live || live.length === 0) {
    return { projects: fallback, liveProjects: false };
  }
  const archivedByRepo = new Map(
    fallback.map((r) => [r.repo.toLowerCase(), r.archived] as const),
  );
  return {
    projects: live.map((r) => ({
      ...r,
      archived: r.archived ?? archivedByRepo.get(r.repo.toLowerCase()),
    })),
    liveProjects: true,
  };
}
