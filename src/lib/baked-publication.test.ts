/**
 * Baked-fallback publication oracle (docs/capabilities.md:17-19).
 *
 * `src/data/github-portfolio.json` and `src/data/stats-baked.json` are generated
 * snapshots that ship inside the static export. They are a public projection, so
 * the same rule applies to them as to the live API: only explicit-positive
 * public repository facts, and never a fabricated zero.
 *
 * The protected-canary identity mirrors `api-rust/src/canary.rs`. If a non-public
 * or visibility-unverifiable row is ever baked into the fallback, this fails.
 */
import { describe, expect, test } from "bun:test";
import portfolio from "@/data/github-portfolio.json";
import baked from "@/data/stats-baked.json";

const CANARY_NEEDLES = [
  "protected-canary-9f3c",
  "sylphx-protected-canary",
  "PROTECTED-CANARY-DO-NOT-PUBLISH",
  "987654",
];

describe("baked repository fallback is explicit-public only", () => {
  test("every baked row carries private=false and visibility=public", () => {
    expect(portfolio.repos.length).toBeGreaterThan(0);
    for (const repo of portfolio.repos) {
      expect({
        repo: repo.name,
        private: repo.private,
        visibility: repo.visibility,
      }).toEqual({
        repo: repo.name,
        private: false,
        visibility: "public",
      });
    }
  });

  test("no protected-canary fact appears in the baked fallback", () => {
    const blob = JSON.stringify(portfolio);
    for (const needle of CANARY_NEEDLES) {
      expect(blob.includes(needle)).toBe(false);
    }
  });
});

describe("baked stats fallback never fabricates a number", () => {
  test("an unsynced snapshot is null, and the visibility attestation survives", () => {
    expect(baked.repositoryVisibility).toBe("public-only/v1");
    if (baked.verifiedAt === null) {
      for (const key of [
        "githubStars",
        "npmDownloads",
        "flagshipStars",
        "flagshipDownloads",
        "repos",
      ] as const) {
        expect(baked[key]).toBeNull();
      }
    }
  });

  test("no protected-canary fact appears in the baked stats", () => {
    const blob = JSON.stringify(baked);
    for (const needle of CANARY_NEEDLES) {
      expect(blob.includes(needle)).toBe(false);
    }
  });
});
