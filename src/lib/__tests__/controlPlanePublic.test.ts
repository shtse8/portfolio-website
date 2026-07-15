import { describe, expect, it } from "vitest";
import {
  assertHonestWindows,
  mapCpSummaryToActivity,
} from "../controlPlanePublic";

describe("controlPlanePublic mapping", () => {
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
    ).toThrow(/week×4/);
  });

  it("does not invent lastPush private identity from CP path", () => {
    const a = mapCpSummaryToActivity({
      summary: { commits_landed: { today: 1, d7: 2, d30: 5 } },
    });
    expect(a.lastPush).toBeNull();
  });
});
