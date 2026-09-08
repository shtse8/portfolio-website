import { afterEach, expect, test } from "bun:test";
import { checks } from "./apps-product-probe";
const saved = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = saved;
});
const now = () => new Date().toISOString();
function respond(data: unknown) {
  globalThis.fetch = (async (url: any, opts: any) => {
    expect(String(url).startsWith("https://selected.example/")).toBe(true);
    expect(opts.redirect).toBe("error");
    return Response.json(data);
  }) as any;
}
const input = { origin: "https://selected.example" };
test("live public stats accepted; stale and fabricated empty data rejected", async () => {
  const valid = {
    freshness: "live",
    stale: false,
    repositoryVisibility: "public-only/v1",
    verifiedAt: now(),
    githubStars: 12,
    npmDownloads: 30,
    repos: 1,
  };
  respond(valid);
  await checks["WEB-PUBLIC-STATS"](input);
  for (const patch of [
    { stale: true },
    { freshness: "stale" },
    { repos: 0 },
    { verifiedAt: "2020-01-01T00:00:00Z" },
    { repositoryVisibility: "all" },
  ]) {
    respond({ ...valid, ...patch });
    await expect(checks["WEB-PUBLIC-STATS"](input)).rejects.toThrow();
  }
});
test("download alias requires actual conserving series", async () => {
  const valid = {
    pkg: "@sylphx/pdf-reader-mcp",
    updatedAt: now(),
    total: 7,
    series: [{ day: "2026-09-08", downloads: 7 }],
  };
  respond(valid);
  await checks["WEB-PUBLIC-DOWNLOADS"](input);
  for (const patch of [
    { series: [] },
    { total: 8 },
    { pkg: "pdf-reader-mcp" },
  ]) {
    respond({ ...valid, ...patch });
    await expect(checks["WEB-PUBLIC-DOWNLOADS"](input)).rejects.toThrow();
  }
});
test("chat is never an accepted assertion", () => {
  expect(Object.keys(checks).some((id) => id.includes("CHAT"))).toBe(false);
});
