/**
 * Project cover art resolution.
 *
 * Surface split (beauty-first SSOT):
 *   - Portfolio cards  → local Product Plate JPEGs (16:9-ish, designed hierarchy)
 *   - GitHub / README   → Mark banners written in each README
 *
 * Local files under public/art/projects/ are the card identity surface.
 */

/** Case-insensitive aliases when GitHub name casing drifts (local art only). */
const ALIASES: Record<string, string> = {
  deepresearch: "DeepResearch",
  fireschema: "FireSchema",
  arbimath: "ArbiMath",
  dust: "Dust",
};

function artFileKey(repoName: string): string {
  const key = repoName.toLowerCase();
  return ALIASES[key] ?? repoName;
}

/**
 * Portfolio card SSOT: designed Product Plate JPEG (1376×768).
 * Matches ProjectCover 16:10 frame without crop mutilation of a 4:1 strip.
 */
export function localProjectArtPath(repoName: string): string {
  const file = artFileKey(repoName);
  return `/art/projects/${file}.jpg?v=plate2`;
}

/** @deprecated Prefer localProjectArtPath for cards — alias kept for call sites. */
export function projectArtPath(repoName: string): string {
  return localProjectArtPath(repoName);
}

export function readmeBannerPath(repoName: string): string {
  const file = artFileKey(repoName);
  return `/art/projects/readme/${file}.png`;
}
