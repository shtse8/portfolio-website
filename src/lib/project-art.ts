/**
 * Project cover art resolution.
 *
 * Surface split (beauty-first SSOT):
 *   - Portfolio cards  → local Product Plate JPEGs (16:9-ish, designed hierarchy)
 *   - GitHub / README   → Sylphx Mark live banners (embed dogfood)
 *
 * Local files under public/art/projects/ are the card identity surface.
 * Mark is the embeddable mark API — not a drop-in for tall product tiles.
 */

export const MARK_BANNER_ORIGIN = "https://mark.sylphx.com";
export const MARK_BANNER_PATH = "/api/v1/banner";

/** Classic / plate-friendly Mark types for README embeds (not showcase carnival). */
const README_STYLES = [
  "wave",
  "waving",
  "soft",
  "glass",
  "aurora",
  "product",
  "oss",
  "terminal",
  "mesh",
  "rounded",
] as const;

/** Case-insensitive aliases when GitHub name casing drifts (local art only). */
const ALIASES: Record<string, string> = {
  deepresearch: "DeepResearch",
  fireschema: "FireSchema",
  arbimath: "ArbiMath",
  dust: "Dust",
};

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

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
  return `/art/projects/${file}.jpg?v=plate1`;
}

/** @deprecated Prefer localProjectArtPath for cards — alias kept for call sites. */
export function projectArtPath(repoName: string): string {
  return localProjectArtPath(repoName);
}

/**
 * README / embed SSOT: live Mark banner URL.
 * Defaults favor calm plate-friendly composition (not rise + plasma).
 */
export function markBannerUrl(
  repoName: string,
  opts?: {
    description?: string | null;
    theme?: string;
    /** Override banner type; default stable hash over classic pool. */
    type?: string;
    animation?: string;
    layout?: string;
  },
): string {
  const style =
    opts?.type ?? README_STYLES[hashName(repoName) % README_STYLES.length];
  const theme = opts?.theme ?? "tokyonight";
  const text = repoName.replace(/[-_]/g, " ");
  const desc = (opts?.description || "Open source · Sylphx ecosystem").slice(
    0,
    80,
  );
  const p = new URLSearchParams({
    type: style,
    theme,
    text,
    desc,
    height: "220",
    layout: opts?.layout ?? "plate",
    animation: opts?.animation ?? "none",
    credit: "0",
  });
  return `${MARK_BANNER_ORIGIN}${MARK_BANNER_PATH}?${p.toString()}`;
}

export function readmeBannerPath(repoName: string): string {
  const file = artFileKey(repoName);
  return `/art/projects/readme/${file}.png`;
}
