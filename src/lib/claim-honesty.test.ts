import { describe, expect, test } from "bun:test";
import { PERSONAL_INFO, SITE_DESCRIPTION } from "@/data/personal";
import { ROLES } from "@/data/roles";
import manifest from "../../public/manifest.json";
import {
  CAREER_PEDIGREE_IDS,
  careerScaleCaption,
  LIVE_INSTRUMENT_IDS,
  SELF_ATTESTED_HISTORICAL,
  STORY_SCALE_HEADLINES,
} from "./claim-honesty";
import { HERO_PROOF, HERO_STATS, STATS } from "./stats";

describe("claim honesty", () => {
  test("hero proof instruments are live-measured GitHub/npm only", () => {
    expect(HERO_STATS).toEqual([
      HERO_PROOF.githubStars,
      HERO_PROOF.npmDownloads,
      HERO_PROOF.flagshipStars,
      HERO_PROOF.flagshipDownloads,
    ]);
    expect(HERO_STATS.length).toBeGreaterThan(0);
    for (const stat of HERO_STATS) {
      expect(stat.honesty).toBe("live-measured");
    }
    const heroIds = HERO_STATS.map((s) => s.id);
    expect(heroIds).not.toContain("downloads");
    expect(heroIds).not.toContain("players");
    expect(heroIds).not.toContain("years");
  });

  test("named live instrument stats are live-measured", () => {
    for (const id of LIVE_INSTRUMENT_IDS) {
      expect(STATS[id].honesty).toBe("live-measured");
    }
  });

  test("career pedigree stats are self-attested and not live", () => {
    for (const id of CAREER_PEDIGREE_IDS) {
      expect(STATS[id].honesty).toBe("self-attested");
    }
  });

  test("role scale metrics are self-attested historical, never verified-live", () => {
    let scale = 0;
    for (const role of ROLES) {
      for (const metric of role.metrics) {
        if (typeof metric.value === "number" && metric.value >= 1000) {
          scale += 1;
          expect(metric.honesty).toBe("self-attested");
          expect(metric.verified).not.toBe(true);
          expect(metric.source).toBe(SELF_ATTESTED_HISTORICAL);
        }
      }
    }
    expect(scale).toBeGreaterThan(0);
  });

  test("career scale caption never uses live freshness vocabulary", () => {
    const caption = careerScaleCaption("Downloads");
    expect(caption).toContain(SELF_ATTESTED_HISTORICAL);
    expect(caption.toLowerCase()).not.toMatch(/\bfreshness\b/);
    expect(caption.toLowerCase()).not.toMatch(/\bfreshness=live\b/);
  });

  test("story headlines that include career scale are labeled pedigree", () => {
    expect(STORY_SCALE_HEADLINES["minimax-ceo"]).toContain("10M");
    expect(STORY_SCALE_HEADLINES["cubeage-founder"]).toContain("10M");
    for (const headline of Object.values(STORY_SCALE_HEADLINES)) {
      expect(headline).toContain(SELF_ATTESTED_HISTORICAL);
      expect(headline.toLowerCase()).not.toContain("freshness=live");
    }
  });

  test("personal info has no contact form", () => {
    expect(Object.hasOwn(PERSONAL_INFO, "contactFormSubjects")).toBe(false);
  });

  test("site description and short bio do not present 10M+ as a live instrument", () => {
    const bio = PERSONAL_INFO.shortBio.toLowerCase();
    const desc = SITE_DESCRIPTION.toLowerCase();
    expect(bio).not.toContain("10m");
    expect(desc).not.toContain("10m");
    expect(bio).toContain("self-attested");
    expect(desc).toContain("self-attested");
    expect(bio).not.toContain("freshness=live");
    expect(desc).not.toContain("freshness=live");
  });

  test("visitor-visible role copy that names career-scale figures is labeled pedigree", () => {
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

  test("PWA manifest does not present unlabeled career-scale figures", () => {
    const desc = manifest.description.toLowerCase();
    expect(desc).not.toContain("10m");
    expect(desc).not.toMatch(/\b20 years\b/);
    expect(desc).toContain("self-attested");
    expect(desc).not.toContain("freshness=live");
  });
});
