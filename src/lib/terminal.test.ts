import { describe, expect, test } from "bun:test";
import { compact, sparkline, timeAgo } from "./terminal";

describe("compact", () => {
  test("formats with Intl compact notation", () => {
    expect(compact(27038)).toBe("27K");
    expect(compact(1239)).toBe("1.2K");
    expect(compact(987)).toBe("987");
  });
});

describe("sparkline", () => {
  test("renders a unicode series", () => {
    const s = sparkline([0, 5, 10, 5]);
    expect(s.length).toBe(4);
    expect(s).toMatch(/^[▁▂▃▄▅▆▇█]+$/);
  });

  test("handles empty and flat series", () => {
    expect(sparkline([])).toBe("");
    expect(sparkline([3, 3, 3])).toBe("▁▁▁");
  });
});

describe("timeAgo", () => {
  test("renders relative time for valid ISO", () => {
    expect(timeAgo(new Date().toISOString())).toMatch(/ago|now/);
  });

  test("returns em dash for invalid input", () => {
    expect(timeAgo("not-a-date")).toBe("—");
  });
});
