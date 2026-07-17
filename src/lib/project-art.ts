/**
 * Resolve OSS project cover art.
 *
 * SSOT for own-project portfolio cards: Sylphx Mark live banners
 *   https://mark.sylphx.com/api/v1/banner?...
 *
 * Local JPEG/PNG under public/art/projects/ remain available for README
 * export tooling and offline fallbacks — not the product card SSOT.
 */

export const MARK_BANNER_ORIGIN = "https://mark.sylphx.com";
export const MARK_BANNER_PATH = "/api/v1/banner";

/** Stable style assignment so each repo keeps a consistent identity. */
const STYLES = [
  "wave",
  "aurora",
  "mesh",
  "plasma",
  "holo",
  "neon",
  "liquid",
  "glass",
  "orbit",
  "meteor",
  "constellation",
  "void",
  "firefly",
  "silk",
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

/**
 * Product SSOT: live Mark banner URL for portfolio project cards.
 * Same identity function as scripts/apply-mark-banners-to-repos.mjs.
 */
export function markBannerUrl(
  repoName: string,
  opts?: { description?: string | null; theme?: string },
): string {
  const style = STYLES[hashName(repoName) % STYLES.length];
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
    height: "200",
    animation: "rise",
    credit: "0",
  });
  return `${MARK_BANNER_ORIGIN}${MARK_BANNER_PATH}?${p.toString()}`;
}

/** @deprecated Prefer markBannerUrl — kept as alias for card cover path. */
export function projectArtPath(repoName: string): string {
  return markBannerUrl(repoName);
}

export function readmeBannerPath(repoName: string): string {
  const key = repoName.toLowerCase();
  const file = ALIASES[key] ?? repoName;
  return `/art/projects/readme/${file}.png`;
}

/** Local designed JPEG (export tooling / optional offline). Not product SSOT. */
export function localProjectArtPath(repoName: string): string {
  const key = repoName.toLowerCase();
  const file = ALIASES[key] ?? repoName;
  return `/art/projects/${file}.jpg?v=banner8`;
}
