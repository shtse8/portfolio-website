import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHonestWindows,
  fetchCpPublicSummary,
  HAS_CP_PUBLIC,
  mapCpSummaryToActivity,
} from "../controlPlanePublic";

const here = dirname(fileURLToPath(import.meta.url));

describe("controlPlanePublic mapping (BFF-parity helpers only)", () => {
  it("maps CP summary without inventing week×4 month", () => {
    const a = mapCpSummaryToActivity({
      schema_version: "public.profile.v1",
      projection_revision: "sha256:abc",
      as_of: "2026-07-15T00:00:00Z",
      freshness: { state: "live" },
      summary: {
        commits_landed: {
          today: 12,
          d7: 80,
          d30: 300,
          d30_is_not_week_times_four: true,
          prior_day_matched_elapsed: 10,
        },
        projects_active: { count: 4 },
      },
    });
    expect(a.commitsToday).toBe(12);
    expect(a.commitsWeek).toBe(80);
    expect(a.commitsMonth).toBe(300);
    expect(a.commitsMonth).not.toBe(a.commitsWeek * 4);
    expect(a.source).toBe("control-plane-public");
    expect(a.d30IsNotWeekTimesFour).toBe(true);
    expect(() => assertHonestWindows(a)).not.toThrow();
  });

  it("rejects week×4 equality as dual-authority bug signal", () => {
    expect(() =>
      assertHonestWindows({
        commitsWeek: 10,
        commitsMonth: 40,
        d30IsNotWeekTimesFour: true,
      }),
    ).toThrow(/dual-authority bug|commitsMonth equals commitsWeek/);
  });

  it("does not invent lastPush private identity from CP path", () => {
    const a = mapCpSummaryToActivity({
      summary: { commits_landed: { today: 1, d7: 2, d30: 5 } },
    });
    expect(a.lastPush).toBeNull();
  });

  it("browser CP path is hard-disabled (fail closed)", async () => {
    expect(HAS_CP_PUBLIC).toBe(false);
    expect(await fetchCpPublicSummary()).toBeNull();
  });
});

describe("LiveTicker single metric authority", () => {
  it("does not reference NEXT_PUBLIC_CP or glad-word Control Plane host", () => {
    const tickerPath = join(here, "../../components/LiveTicker.tsx");
    const src = readFileSync(tickerPath, "utf8");
    expect(src).not.toMatch(/NEXT_PUBLIC_CP/);
    expect(src).not.toMatch(/glad-word/);
    expect(src).not.toMatch(/fetchCpPublicSummary/);
    expect(src).not.toMatch(/HAS_CP_PUBLIC/);
    expect(src).not.toMatch(/controlPlanePublic/);
    // Same-origin BFF only.
    expect(src).toMatch(/\/activity/);
    expect(src).toMatch(/API_BASE/);
  });

  it("api.ts defaults to empty same-origin base (not slim-pal or CP host)", () => {
    const apiPath = join(here, "../api.ts");
    const src = readFileSync(apiPath, "utf8");
    expect(src).toMatch(/DEFAULT_API_BASE\s*=\s*""/);
    // Must not hard-code a CP or API host as the default (comments OK).
    expect(src).not.toMatch(/DEFAULT_API_BASE\s*=\s*["']https?:\/\//);
    expect(src).not.toMatch(/glad-word-ommriy/);
    expect(src).not.toMatch(/NEXT_PUBLIC_CP_/);
  });
});
