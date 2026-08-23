import { describe, expect, test } from "bun:test";
import {
  normalizeObservationTime,
  proofBoardDotClass,
  proofBoardObservation,
} from "./proof-board";
import { BAKED_STATS } from "./stats";

const BAKED = "2026-08-09T20:40:47.787Z";
const LIVE_AT = "2026-08-22T12:00:00.000Z";
const STALE_AT = "2026-08-21T08:15:30.500Z";

describe("normalizeObservationTime", () => {
  test("strips fractional seconds to UTC RFC3339", () => {
    expect(normalizeObservationTime(BAKED)).toBe("2026-08-09T20:40:47Z");
  });

  test("returns null for missing or invalid input", () => {
    expect(normalizeObservationTime(undefined)).toBeNull();
    expect(normalizeObservationTime(null)).toBeNull();
    expect(normalizeObservationTime("")).toBeNull();
    expect(normalizeObservationTime("not-a-date")).toBeNull();
  });
});

describe("proofBoardObservation", () => {
  test("WorkGraph live=false never claims live even with a stats payload", () => {
    const board = proofBoardObservation({
      live: false,
      stats: { updatedAt: LIVE_AT },
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).not.toBe("live");
    expect(board.freshness).toBe("stale");
    expect(board.observedAt).toBe("2026-08-22T12:00:00Z");
  });

  test("baked path when live=false and stats missing shows verifiedAt as stale", () => {
    const board = proofBoardObservation({
      live: false,
      stats: null,
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("stale");
    expect(board.observedAt).toBe("2026-08-09T20:40:47Z");
  });

  test("loading equivalent (live=false, no stats) does not use cached/live labels", () => {
    const board = proofBoardObservation({
      live: false,
      stats: null,
      bakedVerifiedAt: BAKED,
    });
    expect(["live", "cached", "loading"]).not.toContain(board.freshness);
    expect(board.freshness).toBe("stale");
  });

  test("live fetch with observation time is live", () => {
    const board = proofBoardObservation({
      live: true,
      stats: { updatedAt: LIVE_AT, freshness: "live", stale: false },
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("live");
    expect(board.observedAt).toBe("2026-08-22T12:00:00Z");
  });

  test("successful /stats without freshness flag is live when WorkGraph is live", () => {
    const board = proofBoardObservation({
      live: true,
      stats: { updatedAt: LIVE_AT },
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("live");
    expect(board.observedAt).toBe("2026-08-22T12:00:00Z");
  });

  test("WorkGraph live with no stats uses baked verifiedAt as stale", () => {
    const board = proofBoardObservation({
      live: true,
      stats: null,
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("stale");
    expect(board.observedAt).toBe("2026-08-09T20:40:47Z");
  });

  test("API last-good stale payload is stale, not live", () => {
    const board = proofBoardObservation({
      live: true,
      stats: { updatedAt: STALE_AT, stale: true, freshness: "stale" },
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("stale");
    expect(board.observedAt).toBe("2026-08-21T08:15:30Z");
  });

  test("freshness=unavailable without a timestamp falls back to baked stale", () => {
    const board = proofBoardObservation({
      live: true,
      stats: { freshness: "unavailable" },
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("stale");
    expect(board.observedAt).toBe("2026-08-09T20:40:47Z");
  });

  test("live stats missing observation time cannot be called live", () => {
    const board = proofBoardObservation({
      live: true,
      stats: { freshness: "live" },
      bakedVerifiedAt: BAKED,
    });
    expect(board.freshness).toBe("stale");
    expect(board.observedAt).toBe("2026-08-09T20:40:47Z");
  });

  test("no live graph and no baked verification is unavailable", () => {
    const board = proofBoardObservation({
      live: false,
      stats: null,
      bakedVerifiedAt: null,
    });
    expect(board.freshness).toBe("unavailable");
    expect(board.observedAt).toBeNull();
  });

  test("freshness vocabulary is only live|stale|unavailable", () => {
    const samples = [
      proofBoardObservation({
        live: false,
        stats: null,
        bakedVerifiedAt: BAKED,
      }),
      proofBoardObservation({
        live: true,
        stats: { updatedAt: LIVE_AT },
        bakedVerifiedAt: BAKED,
      }),
      proofBoardObservation({ live: false, stats: null }),
    ];
    for (const board of samples) {
      expect(["live", "stale", "unavailable"]).toContain(board.freshness);
      expect(board.freshness).not.toBe("cached");
      expect(board.freshness).not.toBe("loading");
    }
  });
});

describe("proofBoardDotClass", () => {
  test("maps freshness to distinct instrument colours", () => {
    expect(proofBoardDotClass("live")).toBe("bg-positive");
    expect(proofBoardDotClass("stale")).toBe("bg-amber-400");
    expect(proofBoardDotClass("unavailable")).toBe("bg-text-tertiary");
  });
});

describe("shipped baked stats file", () => {
  test("WorkGraph live=false surfaces stats-baked verifiedAt and never live", () => {
    const board = proofBoardObservation({
      live: false,
      stats: null,
      bakedVerifiedAt: BAKED_STATS.verifiedAt,
    });
    expect(board.freshness).toBe("stale");
    expect(board.freshness).not.toBe("live");
    expect(board.observedAt).toBe(
      normalizeObservationTime(BAKED_STATS.verifiedAt),
    );
    expect(board.observedAt).toBeTruthy();
  });
});
