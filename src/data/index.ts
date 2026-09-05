// Single data surface for the portfolio.
// Organizations/roles in their own files; `PERSONAL_INFO` in `./personal`.
// Dual `PROJECTS` / `SHIPPED_PRODUCTS` catalog is retired (WEB-LEGACY dead).

export * from "./organizations";
export { PERSONAL_INFO } from "./personal";
export * from "./roles";
export * from "./types";

/** Format a large number with a compact suffix (K, M, B). */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toString();
}
