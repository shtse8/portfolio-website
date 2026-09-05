/**
 * Story surface writer — career-scale figures as labeled pedigree.
 *
 * StoryArc must render this module's section copy, chapters, and year
 * caption. Career copy must never borrow freshness=live.
 */
import { formatNumber } from "@/data";
import type { Role } from "@/data/types";
import {
  careerScaleCaption,
  SELF_ATTESTED_HISTORICAL,
  STORY_SCALE_HEADLINES,
} from "./claim-honesty";

export const STORY_SECTION = {
  index: "01",
  eyebrow: "The journey",
  title: "Five eras. One builder.",
  description:
    "From a Hong Kong gaming forum in 2006 to AI infrastructure today. Scale figures in this section are self-attested historical pedigree — not live GitHub/npm instruments. Companies are chapters of the same career, not a second product catalog.",
} as const;

export interface StoryScaleNumber {
  value: number;
  label: string;
  display: string;
  caption: string;
}

export interface EraChapter {
  role: Role;
  era: string;
  startYear: string;
  headline: string;
  image: string;
  imageAlt: string;
  scaleNumber?: StoryScaleNumber;
  projects?: string[];
}

function eraProofPoints(role: Role): string[] {
  const fromAchievements = role.keyAchievements?.slice(0, 5) ?? [];
  if (fromAchievements.length > 0) return fromAchievements;
  return (role.responsibilities ?? []).slice(0, 4);
}

const ERA_META: Record<
  string,
  { era: string; headline: string; image: string; imageAlt: string }
> = {
  "nakuz-cto": {
    era: "Web · Community",
    headline: "Hong Kong's gaming portal",
    image: "/art/era-web.jpg",
    imageAlt: "Ambient visual derived from Nakuz brand and portal materials",
  },
  "minimax-ceo": {
    era: "Social Gaming",
    headline: STORY_SCALE_HEADLINES["minimax-ceo"],
    image: "/art/era-social.jpg",
    imageAlt: "Ambient visual derived from MiniMax / Funimax social games",
  },
  "cubeage-founder": {
    era: "Mobile Gaming",
    headline: STORY_SCALE_HEADLINES["cubeage-founder"],
    image: "/art/era-mobile.jpg",
    imageAlt: "Ambient visual derived from Cubeage mobile game products",
  },
  "epiow-cto": {
    era: "Enterprise · Platform",
    headline: "Organization operating system",
    // cache-bust: ambient was regenerated from official E-Orbit mark
    image: "/art/era-consulting.jpg?v=eorbit2",
    imageAlt:
      "Ambient visual derived from the official Epiow E-Orbit brand mark",
  },
  "sylphx-founder": {
    era: "AI · Open Source",
    headline: "The infrastructure AI agents run on",
    image: "/art/era-ai.jpg",
    imageAlt:
      "Ambient visual derived from Sylphx brand mark and AI platform identity",
  },
};

export function getScaleNumber(role: Role): StoryScaleNumber | undefined {
  if (!role.metrics.length) return undefined;
  const m = role.metrics.reduce((best, cur) => {
    if (typeof cur.value !== "number") return best;
    if (!best || typeof best.value !== "number" || cur.value > best.value) {
      return cur;
    }
    return best;
  });
  if (typeof m.value !== "number" || m.value < 1000) return undefined;
  const label =
    m.label ||
    m.unit ||
    (m.type === "downloads"
      ? "Downloads"
      : m.type === "users"
        ? "Users"
        : "Scale");
  return {
    value: m.value,
    label,
    display: formatNumber(m.value),
    caption: careerScaleCaption(label),
  };
}

export function storyChapters(roles: Role[]): EraChapter[] {
  const chapters: EraChapter[] = [];
  for (const role of roles) {
    const meta = ERA_META[role.id];
    if (!meta) continue;
    const scaleNumber = getScaleNumber(role);
    chapters.push({
      role,
      era: meta.era,
      startYear: role.period.start.substring(0, 4),
      headline: meta.headline,
      image: meta.image,
      imageAlt: meta.imageAlt,
      ...(scaleNumber ? { scaleNumber } : {}),
      projects: eraProofPoints(role),
    });
  }
  return chapters;
}

export function storyYears(years: number): {
  display: string;
  label: string;
  caption: string;
} {
  return {
    display: `${years}+`,
    label: "years of building",
    caption: SELF_ATTESTED_HISTORICAL,
  };
}

const LIVE_FRESHNESS = /freshness\s*=\s*live/i;

export function storyCareerVisitorCopy(
  chapters: EraChapter[],
  section: typeof STORY_SECTION = STORY_SECTION,
  years: ReturnType<typeof storyYears> = storyYears(0),
): string[] {
  const lines: string[] = [
    section.title,
    section.description,
    years.display,
    years.label,
    years.caption,
  ];
  for (const ch of chapters) {
    lines.push(ch.headline, ch.era);
    if (ch.scaleNumber) {
      lines.push(
        ch.scaleNumber.caption,
        ch.scaleNumber.display,
        ch.scaleNumber.label,
      );
    }
    lines.push(ch.role.description);
    lines.push(...(ch.role.keyAchievements ?? []));
    lines.push(...(ch.role.responsibilities ?? []));
    lines.push(...(ch.projects ?? []));
  }
  return lines;
}

export function storyCopyBorrowsLiveFreshness(lines: string[]): string[] {
  return lines.filter((line) => LIVE_FRESHNESS.test(line));
}

export function unlabeledStoryScale(chapters: EraChapter[]): string[] {
  const misses: string[] = [];
  for (const ch of chapters) {
    if (
      ch.scaleNumber &&
      !ch.scaleNumber.caption.includes(SELF_ATTESTED_HISTORICAL)
    ) {
      misses.push(`${ch.role.id}:caption`);
    }
    if (
      /10m|\b500k\b|\bmillion\b/i.test(ch.headline) &&
      !ch.headline.includes(SELF_ATTESTED_HISTORICAL)
    ) {
      misses.push(`${ch.role.id}:headline`);
    }
  }
  return misses;
}
