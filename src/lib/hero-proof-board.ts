/**
 * Hero proof-board writer — live GitHub/npm cells only.
 *
 * Hero must render `heroProofBoard(stats)` and no other proof cells.
 * Career-scale stats (app downloads / monthly players / years) must not
 * share this board.
 */
import { HERO_PROOF, STATS, type Stat } from "./stats";
import { compact, type TermStats } from "./terminal";

export type HeroProofKind = "stars" | "downloads" | "flagship";

export interface HeroProofCell {
  id: string;
  label: string;
  display: string;
  suffix: string;
  kind: HeroProofKind;
  hint: string;
  numeric?: number;
  wide?: boolean;
}

/** Career-scale stats dest forbids on the hero proof board. */
export const CAREER_BOARD_STATS: readonly Stat[] = [
  STATS.appDownloads,
  STATS.monthlyPlayers,
  STATS.yearsExperience,
];

export function heroProofBoard(stats: TermStats | null): HeroProofCell[] {
  // An `absent` payload carries nulls; fall back to the verified baked snapshot
  // rather than printing a fabricated 0 for a number nobody measured.
  const figure = (
    live: number | null | undefined,
    baked: string,
  ): { display: string; numeric?: number } =>
    typeof live === "number"
      ? { display: compact(live), numeric: live }
      : { display: baked };

  const stars = figure(stats?.githubStars, HERO_PROOF.githubStars.display);
  const downloads = figure(
    stats?.npmDownloads,
    HERO_PROOF.npmDownloads.display,
  );
  const flagStars = figure(
    stats?.flagshipStars,
    HERO_PROOF.flagshipStars.display,
  );
  const flagDl = figure(
    stats?.flagshipDownloads,
    HERO_PROOF.flagshipDownloads.display,
  );

  return [
    {
      id: HERO_PROOF.githubStars.id,
      label: "GitHub stars",
      display: stars.display,
      suffix: "★",
      kind: "stars",
      hint: "across all repos",
      numeric: stars.numeric,
    },
    {
      id: HERO_PROOF.npmDownloads.id,
      label: "npm downloads",
      display: downloads.display,
      suffix: "/mo",
      kind: "downloads",
      hint: "across packages",
      numeric: downloads.numeric,
    },
    {
      id: HERO_PROOF.flagshipStars.id,
      label: "pdf-reader-mcp",
      display: flagStars.display,
      suffix: "★",
      kind: "flagship",
      hint: `${flagDl.display}/mo · the flagship`,
      numeric: flagStars.numeric,
      wide: true,
    },
  ];
}

/** Cells that would put unlabeled career-scale numbers on the hero board. */
export function careerScaleOnHeroBoard(
  cells: HeroProofCell[],
): HeroProofCell[] {
  const ids = new Set(CAREER_BOARD_STATS.map((s) => s.id));
  const labels = new Set(CAREER_BOARD_STATS.map((s) => s.label));
  const displays = new Set(CAREER_BOARD_STATS.map((s) => s.display));
  return cells.filter(
    (cell) =>
      ids.has(cell.id) || labels.has(cell.label) || displays.has(cell.display),
  );
}

/** Rendered-board hits for career display/label (catches extra JSX cells). */
export function careerScaleInHeroMarkup(html: string): string[] {
  const hits: string[] = [];
  for (const stat of CAREER_BOARD_STATS) {
    if (html.includes(stat.display) || html.includes(stat.label)) {
      hits.push(stat.id);
    }
  }
  return hits;
}
