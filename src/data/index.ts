// Single data surface for the portfolio.
// PROJECTS + SHIPPED_PRODUCTS live in `./projects`; organizations/roles in
// their own files; `PERSONAL_INFO` in `./personal`. Legacy skill/philosophy
// catalogs and unused formatters are retired (ADR-169).

export * from "./organizations";
export { PERSONAL_INFO } from "./personal";
export type { ShippedProduct } from "./projects";
export { PROJECT_CATEGORIES, PROJECTS, SHIPPED_PRODUCTS } from "./projects";
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
