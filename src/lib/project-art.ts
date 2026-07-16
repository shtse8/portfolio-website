/**
 * Resolve OSS project cover art.
 *
 * Convention (shareable with READMEs):
 *   public/art/projects/{repoName}.jpg           — portfolio card (1376×768)
 *   public/art/projects/readme/{repoName}.png    — 1280×640 GitHub README banner
 *   public/art/projects/readme/{repoName}.svg    — source vector
 *
 * Generate / refresh: `bun run generate:covers`
 * ProjectCover falls back to BrandCover if the file 404s.
 */

export function projectArtPath(repoName: string): string {
  // Deterministic social cover named after the GitHub repo (SSOT).
  return `/art/projects/${repoName}.jpg`;
}

export function readmeBannerPath(repoName: string): string {
  return `/art/projects/readme/${repoName}.png`;
}
