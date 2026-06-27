/**
 * Proof / stats — single source of truth.
 *
 * Every public number on the site reads from here, so figures can never drift
 * (the old site showed "490+", "500+", 171, and 597 for GitHub stars in
 * different places). Each stat carries a raw value, a display string, a scope,
 * and a source note so the claim is honest and traceable.
 *
 * Values are Kyle-attested from the data layer (GITHUB_STATS / roles) as of the
 * `verifiedOn` date. A build-time GitHub fetch can later refresh the GitHub ones.
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

export const VERIFIED_ON = "2026-06-27";

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
    value: 768,
    display: "760+",
    label: "GitHub stars",
    scope: "org-aggregate",
    source: "171 personal + 597 across SylphxAI / Cubeage / EpiowAI orgs",
  },
  flagshipStars: {
    id: "flagship-stars",
    value: 492,
    display: "492",
    label: "Stars · pdf-reader-mcp",
    scope: "repo",
    source: "github.com/SylphxAI/pdf-reader-mcp",
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
    value: 119,
    display: "100+",
    label: "Public repositories",
    scope: "personal",
    source: "GitHub @shtse8",
  },
} satisfies Record<string, Stat>;

/** Curated 4-stat set for the hero — distinct, non-overlapping, credibility-first. */
export const HERO_STATS: Stat[] = [
  STATS.yearsExperience,
  STATS.appDownloads,
  STATS.githubStars,
  STATS.commits,
];
