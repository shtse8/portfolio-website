import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroProofGrid } from "@/components/HeroProofGrid";
import { SITE_DESCRIPTION } from "@/data/personal";
import {
  calculateTotalExperience,
  getRolesSortedByDate,
  ROLES,
} from "@/data/roles";
import type { TermStats } from "@/lib/terminal";
import manifest from "../../public/manifest.json";
import {
  SELF_ATTESTED_HISTORICAL,
  STORY_SCALE_HEADLINES,
} from "./claim-honesty";
import {
  careerScaleInHeroMarkup,
  careerScaleOnHeroBoard,
  type HeroProofCell,
  heroProofBoard,
} from "./hero-proof-board";
import { STATS } from "./stats";
import {
  STORY_SECTION,
  storyCareerVisitorCopy,
  storyChapters,
  storyCopyBorrowsLiveFreshness,
  storyYears,
  unlabeledStoryScale,
} from "./story-surface";

const noop = () => {};

const LIVE_STATS: TermStats = {
  githubStars: 12,
  npmDownloads: 34,
  flagshipStars: 56,
  flagshipDownloads: 78,
  byOwner: {},
  repos: 3,
  updatedAt: "2026-09-05T14:00:00Z",
  freshness: "live",
};

function renderBoard(cells: HeroProofCell[]): string {
  return renderToStaticMarkup(
    createElement(HeroProofGrid, {
      cells,
      onHover: noop,
      onClick: noop,
    }),
  );
}

describe("hero proof board (owning writer)", () => {
  test("unlabeled career-scale numbers do not share the hero proof board", () => {
    for (const stats of [null, LIVE_STATS] as const) {
      const cells = heroProofBoard(stats);
      expect(careerScaleOnHeroBoard(cells)).toEqual([]);
      expect(careerScaleInHeroMarkup(renderBoard(cells))).toEqual([]);
    }
  });

  test("oracle goes red when a career-scale cell is planted on the board", () => {
    const planted: HeroProofCell[] = [
      ...heroProofBoard(null),
      {
        id: STATS.appDownloads.id,
        label: STATS.appDownloads.label,
        display: STATS.appDownloads.display,
        suffix: "",
        kind: "downloads",
        hint: "",
      },
    ];
    expect(careerScaleOnHeroBoard(planted).length).toBeGreaterThan(0);
    expect(careerScaleInHeroMarkup(renderBoard(planted))).toContain(
      STATS.appDownloads.id,
    );
  });
});

describe("story career copy (owning writer)", () => {
  const chapters = storyChapters(getRolesSortedByDate());
  const years = storyYears(calculateTotalExperience());
  const lines = storyCareerVisitorCopy(chapters, STORY_SECTION, years);

  test("scale captions and scale-bearing headlines are labeled pedigree", () => {
    expect(chapters.some((ch) => ch.scaleNumber)).toBe(true);
    expect(unlabeledStoryScale(chapters)).toEqual([]);
    expect(STORY_SECTION.title.toLowerCase()).not.toMatch(
      /10m|twenty years|20 years/,
    );
    expect(STORY_SECTION.description).toContain(SELF_ATTESTED_HISTORICAL);
    expect(years.caption).toBe(SELF_ATTESTED_HISTORICAL);
  });

  test("story career copy never borrows freshness=live", () => {
    expect(storyCopyBorrowsLiveFreshness(lines)).toEqual([]);
  });

  test("oracle goes red when story copy borrows freshness=live", () => {
    expect(
      storyCopyBorrowsLiveFreshness(["career scale · freshness=live"]),
    ).toEqual(["career scale · freshness=live"]);
  });
});

describe("published visitor bytes", () => {
  test("story headlines that include career scale are labeled pedigree", () => {
    expect(STORY_SCALE_HEADLINES["minimax-ceo"]).toContain("10M");
    expect(STORY_SCALE_HEADLINES["cubeage-founder"]).toContain("10M");
    for (const headline of Object.values(STORY_SCALE_HEADLINES)) {
      expect(headline).toContain(SELF_ATTESTED_HISTORICAL);
      expect(headline.toLowerCase()).not.toContain("freshness=live");
    }
  });

  test("rendered role copy that names career-scale figures is labeled pedigree", () => {
    const blobs: string[] = [];
    for (const role of ROLES) {
      blobs.push(role.description);
      blobs.push(...role.responsibilities);
      blobs.push(...(role.keyAchievements ?? []));
    }
    const scale = blobs.filter((s) =>
      /10m|\bmillion|\b500k\b|\b500,000\b|\b3k\+|\b3,000\+/i.test(s),
    );
    expect(scale.length).toBeGreaterThan(0);
    for (const line of scale) {
      expect(line).toContain(SELF_ATTESTED_HISTORICAL);
      expect(line.toLowerCase()).not.toContain("freshness=live");
    }
  });

  test("site description does not present 10M+ as a live instrument", () => {
    const desc = SITE_DESCRIPTION.toLowerCase();
    expect(desc).not.toContain("10m");
    expect(desc).toContain("self-attested");
    expect(desc).not.toContain("freshness=live");
  });

  test("PWA manifest does not present unlabeled career-scale figures", () => {
    const desc = manifest.description.toLowerCase();
    expect(desc).not.toContain("10m");
    expect(desc).not.toMatch(/\b20 years\b/);
    expect(desc).toContain("self-attested");
    expect(desc).not.toContain("freshness=live");
  });
});
