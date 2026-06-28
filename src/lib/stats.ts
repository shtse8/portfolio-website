/**
 * Proof / stats — single source of truth.
 *
 * Every public number on the site reads from here, so figures can never drift
 * (the old site showed "490+", "500+", 171, and 597 for GitHub stars in
 * different places). Each stat carries a raw value, a display string, a scope,
 * and a source note so the claim is honest and traceable.
 *
 * GitHub + npm figures are live-verified across @shtse8 and the SylphxAI /
 * Cubeage / EpiowAI orgs as of `VERIFIED_ON` (non-fork repos; npm last-month).
 * A build-time fetch can later refresh them automatically.
 */

export type StatScope = "lifetime" | "company" | "repo" | "org-aggregate" | "personal";

export interface Stat {
  id: string;
  value: number;
  display: string;
  label: string;
  scope: StatScope;
  source: string; // URL or short attestation note
}

export const VERIFIED_ON = "2026-06-28";

export const STATS = {
  yearsExperience: {
    id: "years",
    value: 20,
    display: "20+",
    label: "Years building",
    scope: "lifetime",
    source: "Career since Nakuz (2006)",
  },
  appDownloads: {
    id: "downloads",
    value: 10_000_000,
    display: "10M+",
    label: "App downloads",
    scope: "company",
    source: "Cubeage — global mobile game installs",
  },
  monthlyPlayers: {
    id: "players",
    value: 10_000_000,
    display: "10M+",
    label: "Monthly players",
    scope: "company",
    source: "MiniMax / Funimax — peak Facebook MAU",
  },
  githubStars: {
    id: "stars",
    value: 987,
    display: "~990",
    label: "GitHub stars",
    scope: "org-aggregate",
    source: "Live: 928 SylphxAI + @shtse8 + Cubeage / EpiowAI (non-fork)",
  },
  npmDownloads: {
    id: "npm-downloads",
    value: 27_038,
    display: "27K+",
    label: "npm downloads / month",
    scope: "org-aggregate",
    source: "@sylphx + @shtse8 packages — npm last-month (pdf-reader-mcp 24.3K)",
  },
  flagshipStars: {
    id: "flagship-stars",
    value: 801,
    display: "801",
    label: "Stars · pdf-reader-mcp",
    scope: "repo",
    source: "github.com/SylphxAI/pdf-reader-mcp",
  },
  flagshipDownloads: {
    id: "flagship-downloads",
    value: 24_319,
    display: "24K+",
    label: "Downloads / mo · pdf-reader-mcp",
    scope: "repo",
    source: "npmjs.com/package/@sylphx/pdf-reader-mcp — last-month",
  },
  commits: {
    id: "commits",
    value: 4654,
    display: "4.6K+",
    label: "Commits",
    scope: "personal",
    source: "GitHub @shtse8",
  },
  companies: {
    id: "companies",
    value: 5,
    display: "5",
    label: "Companies founded",
    scope: "lifetime",
    source: "Nakuz, MiniMax, Cubeage, Sylphx, Epiow",
  },
  repos: {
    id: "repos",
    value: 139,
    display: "130+",
    label: "Public repositories",
    scope: "personal",
    source: "GitHub @shtse8",
  },
} satisfies Record<string, Stat>;

/**
 * Curated 4-stat set for the hero — AI-adoption first, then scale credibility.
 * npm downloads/mo + total stars prove the open-source AI tooling is used;
 * app downloads + years prove a track record of shipping at scale.
 */
export const HERO_STATS: Stat[] = [
  STATS.npmDownloads,
  STATS.githubStars,
  STATS.appDownloads,
  STATS.yearsExperience,
];
