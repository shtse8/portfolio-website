import type { TechSkill } from "@/data/types";

/**
 * Capabilities = the ~20 raw skill categories collapsed into a handful of
 * legible DOMAINS. The point is breadth made scannable, not a 142-item cloud.
 */
export type DomainKey =
  | "languages"
  | "frontend"
  | "backend"
  | "ai"
  | "games"
  | "specialist";

export type Domain = {
  key: DomainKey;
  label: string;
  blurb: string;
};

/** Curated display order — reads as an engineering arc, foundations → frontier. */
export const DOMAINS: Domain[] = [
  { key: "languages", label: "Languages", blurb: "The languages I reach for, from typed frontends to systems work." },
  { key: "frontend", label: "Frontend & UI", blurb: "Interfaces, design systems and the modern rendering layer." },
  { key: "backend", label: "Backend & Infra", blurb: "APIs, data, real-time and the cloud they run on." },
  { key: "ai", label: "AI & MCP", blurb: "LLM tooling, the Model Context Protocol, embeddings and applied ML." },
  { key: "games", label: "Games & Mobile", blurb: "Engines, multiplayer and mobile — from a 10M-player studio." },
  { key: "specialist", label: "Web3, Fintech & More", blurb: "Crypto and DeFi, trading systems, growth and two decades of long tail." },
];

/**
 * Curated signature skills — the headline of the section. These lead the "core"
 * row (with their real, honest years) and are boosted to the front of their
 * domain card. Ordered for narrative: deep modern web → backend → games → the
 * current AI focus → infra. Pure years-sorting buries these under 2000-era tech
 * (HTML/AJAX/Discuz all carry the most calendar years), which reads dated, so we
 * curate the lead and let years stay truthful.
 */
const FEATURED_IDS: readonly string[] = [
  "typescript",
  "react",
  "nextjs",
  "nodejs",
  "python",
  "unity3d",
  "mcp",
  "docker",
];

/**
 * Dated or abstract entries kept for breadth (they still count) but demoted to
 * the back of each card so concrete, recognisable technologies headline.
 */
const DEMOTE_IDS = new Set<string>([
  "ajax",
  "discuz",
  "rss",
  "flash",
  "seo",
  "digital-marketing",
  "google-adsense",
  "frontend-development",
  "web-framework",
  "responsive-design",
  "responsive-web-design",
  "mobile-first",
  "mobile-web",
  "virtual-dom",
  "type-safety",
  "immutable-data",
  "functional-programming",
  "state-management",
  "data-visualization",
]);

/** Skills that belong in "Languages" regardless of their raw category tag. */
const LANGUAGE_IDS = new Set<string>([
  "typescript",
  "javascript",
  "python",
  "java",
  "csharp",
  "php",
  "go",
  "dart",
  "lua",
  "solidity",
]);

/**
 * Raw category → domain. Engineering practice (qa, tooling) folds into infra;
 * anything unmapped (blockchain, finance, monetization, marketing, management,
 * social, data, algorithms, security, legacy) lands in "specialist".
 */
const CATEGORY_TO_DOMAIN: Record<string, DomainKey> = {
  frontend: "frontend",
  backend: "backend",
  devops: "backend",
  database: "backend",
  api: "backend",
  qa: "backend",
  tools: "backend",
  ai: "ai",
  game: "games",
  mobile: "games",
};

export function domainForSkill(skill: TechSkill): DomainKey {
  if (LANGUAGE_IDS.has(skill.id)) return "languages";
  return CATEGORY_TO_DOMAIN[skill.category] ?? "specialist";
}

export type DomainGroup = {
  key: DomainKey;
  label: string;
  blurb: string;
  count: number;
  /** Always-visible curated lead skills. */
  headliners: TechSkill[];
  /** The hidden tail, revealed via progressive disclosure (ADR: "disclosure works"). */
  rest: TechSkill[];
  /** Convenience: rest.length, used for the "+N more" affordance. */
  remainder: number;
};

export type Capabilities = {
  domains: DomainGroup[];
  core: TechSkill[];
  total: number;
};

const FEATURED_RANK = new Map(FEATURED_IDS.map((id, i) => [id, i]));

/** 0 = featured (leads), 1 = normal, 2 = demoted (dated/abstract, trails). */
function tier(skill: TechSkill): 0 | 1 | 2 {
  if (FEATURED_RANK.has(skill.id)) return 0;
  if (DEMOTE_IDS.has(skill.id)) return 2;
  return 1;
}

/** Featured-first, then by real years (desc), then name — keeps cards senior. */
function headlinerCompare(a: TechSkill, b: TechSkill): number {
  const ta = tier(a);
  const tb = tier(b);
  if (ta !== tb) return ta - tb;
  if (ta === 0) return FEATURED_RANK.get(a.id)! - FEATURED_RANK.get(b.id)!;
  return b.yearsOfExperience - a.yearsOfExperience || a.name.localeCompare(b.name);
}

/**
 * Group skills into domains, each carrying its strongest skills up front plus an
 * honest total, and surface a curated set of signature skills as "core"
 * highlights (with their real years).
 */
export function buildCapabilities(
  skills: TechSkill[],
  opts: { headliners?: number; core?: number } = {},
): Capabilities {
  const headlinerCount = opts.headliners ?? 7;
  const coreCount = opts.core ?? 8;
  const byId = new Map(skills.map((s) => [s.id, s]));

  const buckets = new Map<DomainKey, TechSkill[]>(DOMAINS.map((d) => [d.key, []]));
  for (const skill of skills) buckets.get(domainForSkill(skill))!.push(skill);

  const domains: DomainGroup[] = DOMAINS.map((d) => {
    const list = [...(buckets.get(d.key) ?? [])].sort(headlinerCompare);
    const headliners = list.slice(0, headlinerCount);
    const rest = list.slice(headlinerCount);
    return {
      key: d.key,
      label: d.label,
      blurb: d.blurb,
      count: list.length,
      headliners,
      rest,
      remainder: rest.length,
    };
  }).filter((g) => g.count > 0);

  const core = FEATURED_IDS.map((id) => byId.get(id))
    .filter((s): s is TechSkill => !!s && s.yearsOfExperience > 0)
    .slice(0, coreCount);

  return { domains, core, total: skills.length };
}

/** Render years honestly: whole numbers stay clean, halves keep their .5. */
export function formatYears(years: number): string {
  return `${Number.isInteger(years) ? years : years.toFixed(1)}y`;
}
