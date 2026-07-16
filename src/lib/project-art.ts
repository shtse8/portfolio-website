/**
 * Resolve OSS project cover art.
 *
 * SSOT:
 *   public/art/projects/{repoName}.jpg
 *   public/art/projects/readme/{repoName}.png
 *
 * Generate: `bun run generate:banners`
 */

/** Case-insensitive aliases when GitHub name casing drifts. */
const ALIASES: Record<string, string> = {
  deepresearch: "DeepResearch",
  fireschema: "FireSchema",
  arbimath: "ArbiMath",
  dust: "Dust",
};

export function projectArtPath(repoName: string): string {
  const key = repoName.toLowerCase();
  const file = ALIASES[key] ?? repoName;
  // banner8 — designed social cards after docs-screenshot rollback
  return `/art/projects/${file}.jpg?v=banner8`;
}

export function readmeBannerPath(repoName: string): string {
  const key = repoName.toLowerCase();
  const file = ALIASES[key] ?? repoName;
  return `/art/projects/readme/${file}.png`;
}
