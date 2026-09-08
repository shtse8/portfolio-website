import {
  runProbe,
  getJson,
  requireValue,
  fresh,
} from "./lib/product-probe-protocol";
const count = (v: unknown) => Number.isSafeInteger(v) && Number(v) >= 0;
export const checks = {
  "WEB-PUBLIC-STATS": async ({ origin }: any) => {
    const d = await getJson(origin, "/stats");
    requireValue(
      d.freshness === "live" &&
        d.stale === false &&
        d.repositoryVisibility === "public-only/v1",
      "stats not live/public",
    );
    fresh(d.verifiedAt);
    requireValue(
      count(d.githubStars) &&
        count(d.npmDownloads) &&
        count(d.repos) &&
        d.repos > 0,
      "stats missing real repository data",
    );
  },
  "WEB-PUBLIC-PROJECTS": async ({ origin }: any) => {
    const d = await getJson(origin, "/projects");
    fresh(d.updatedAt);
    requireValue(
      Array.isArray(d.projects) &&
        d.projects.length > 0 &&
        d.projects.every(
          (r: any) =>
            typeof r.repo === "string" &&
            /^[^/]+\/[^/]+$/.test(r.repo) &&
            r.url === "https://github.com/" + r.repo &&
            count(r.stars),
        ),
      "invalid project identities",
    );
  },
  "WEB-PUBLIC-ACTIVITY": async ({ origin }: any) => {
    const d = await getJson(origin, "/activity");
    fresh(d.updatedAt);
    requireValue(
      d.freshness === "live" &&
        d.stale === false &&
        d.projectionRevision === "github-public-only/v1" &&
        ["commitsToday", "commitsWeek", "reposActiveToday"].every((k) =>
          count(d[k]),
        ),
      "activity not live/public",
    );
  },
  "WEB-PUBLIC-CLAIMS": async ({ origin }: any) => {
    const d = await getJson(origin, "/claims");
    const inc = d.activityDefinition?.includes;
    requireValue(
      d.schema === "kylet.se/claim-pack/v1" &&
        typeof d.promise === "string" &&
        d.promise.length > 0 &&
        typeof inc === "string" &&
        inc.toLowerCase().includes("public repositories") &&
        !inc.toLowerCase().includes("private"),
      "public claim definition missing",
    );
  },
  "WEB-PUBLIC-DOWNLOADS": async ({ origin }: any) => {
    const d = await getJson(origin, "/downloads?pkg=pdf-reader-mcp");
    fresh(d.updatedAt);
    requireValue(
      d.pkg === "@sylphx/pdf-reader-mcp" &&
        count(d.total) &&
        d.total > 0 &&
        Array.isArray(d.series) &&
        d.series.length > 0 &&
        d.series.every(
          (x: any) => /^\d{4}-\d{2}-\d{2}$/.test(x.day) && count(x.downloads),
        ) &&
        d.series.reduce((n: number, x: any) => n + x.downloads, 0) === d.total,
      "download series/alias mismatch",
    );
  },
};
if (import.meta.main) await runProbe("portfolio.public-projection.v1", checks);
