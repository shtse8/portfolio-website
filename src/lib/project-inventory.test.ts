import { describe, expect, test } from "bun:test";
import {
  adoptLiveProjects,
  fallbackProjectsFromSnapshot,
  isExplicitlyPublicSnapshot,
  type SnapshotRepo,
} from "./project-inventory";
import type { TermRepo } from "./terminal";

function snap(
  partial: Partial<SnapshotRepo> & Pick<SnapshotRepo, "name">,
): SnapshotRepo {
  return {
    owner: partial.owner ?? "shtse8",
    name: partial.name,
    stars: partial.stars ?? 1,
    archived: partial.archived,
    private: partial.private ?? false,
    visibility: partial.visibility ?? "public",
    description: partial.description ?? "",
    language: partial.language ?? "TypeScript",
    topics: partial.topics ?? [],
    homepage: partial.homepage ?? null,
    url: partial.url ?? `https://github.com/shtse8/${partial.name}`,
    pushedAt: partial.pushedAt ?? "2026-09-01T00:00:00Z",
  };
}

function live(partial: Partial<TermRepo> & Pick<TermRepo, "name">): TermRepo {
  const owner = partial.owner ?? "shtse8";
  return {
    repo: partial.repo ?? `${owner}/${partial.name}`,
    name: partial.name,
    owner,
    stars: partial.stars ?? 1,
    forks: partial.forks ?? 0,
    description: partial.description ?? null,
    language: partial.language ?? "TypeScript",
    topics: partial.topics ?? [],
    homepage: partial.homepage ?? null,
    url: partial.url ?? `https://github.com/${owner}/${partial.name}`,
    pushed: partial.pushed ?? "2026-09-01T00:00:00Z",
    pushedAt: partial.pushedAt ?? "2026-09-01T00:00:00Z",
    archived: partial.archived,
  };
}

describe("isExplicitlyPublicSnapshot", () => {
  test("requires private=false and visibility=public", () => {
    expect(
      isExplicitlyPublicSnapshot({ private: false, visibility: "public" }),
    ).toBe(true);
    expect(
      isExplicitlyPublicSnapshot({ private: true, visibility: "public" }),
    ).toBe(false);
    expect(
      isExplicitlyPublicSnapshot({ private: false, visibility: "internal" }),
    ).toBe(false);
    expect(isExplicitlyPublicSnapshot({ private: false })).toBe(false);
    expect(isExplicitlyPublicSnapshot({ visibility: "public" })).toBe(false);
  });
});

describe("fallbackProjectsFromSnapshot", () => {
  test("keeps explicit-public rows and drops private/unverifiable", () => {
    const projects = fallbackProjectsFromSnapshot([
      snap({ name: "pdf-reader-mcp", owner: "SylphxAI", stars: 900 }),
      snap({ name: "secret", private: true, visibility: "private", stars: 99 }),
      snap({ name: "internal", private: false, visibility: "internal" }),
      snap({ name: "mystery" }), // default public
    ]);
    expect(projects.map((p) => p.repo)).toEqual([
      "SylphxAI/pdf-reader-mcp",
      "shtse8/mystery",
    ]);
  });

  test("does not invent scale- occupancy rows", () => {
    const projects = fallbackProjectsFromSnapshot([
      snap({ name: "scale-thing", stars: 50 }),
      snap({ name: "keep-me", stars: 3 }),
    ]);
    expect(projects.map((p) => p.name)).toEqual(["keep-me"]);
  });
});

describe("adoptLiveProjects", () => {
  const fallback = [
    live({ name: "fallback-only", stars: 40, archived: true }),
    live({ name: "shared", stars: 5, archived: true }),
  ];

  test("non-empty live list replaces fallback inventory", () => {
    const liveList = [
      live({ name: "shared", stars: 12 }),
      live({ name: "live-only", stars: 8 }),
    ];
    const { projects, liveProjects } = adoptLiveProjects(fallback, liveList);
    expect(liveProjects).toBe(true);
    expect(projects.map((p) => p.name)).toEqual(["shared", "live-only"]);
    expect(projects.map((p) => p.name)).not.toContain("fallback-only");
    expect(projects.find((p) => p.name === "shared")?.stars).toBe(12);
  });

  test("empty live list keeps fallback (fail closed, not a second catalog)", () => {
    const { projects, liveProjects } = adoptLiveProjects(fallback, []);
    expect(liveProjects).toBe(false);
    expect(projects).toEqual(fallback);
  });

  test("failed live fetch keeps fallback", () => {
    expect(adoptLiveProjects(fallback, null).liveProjects).toBe(false);
    expect(adoptLiveProjects(fallback, undefined).projects).toEqual(fallback);
  });

  test("copies archived from snapshot onto matching live rows when live omits it", () => {
    const { projects } = adoptLiveProjects(fallback, [
      live({ name: "shared", stars: 12 }),
    ]);
    expect(projects).toHaveLength(1);
    expect(projects[0]?.archived).toBe(true);
  });

  test("live archived flag wins over snapshot", () => {
    const { projects } = adoptLiveProjects(fallback, [
      live({ name: "shared", stars: 12, archived: false }),
    ]);
    expect(projects[0]?.archived).toBe(false);
  });
});
