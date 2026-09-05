/**
 * One-page narrative SSOT — Promise · Evidence · Engage.
 * Drives nav, IntersectionObserver, deep links, and JSON-LD.
 *
 * DOM section ids must match this list. Historical shipped-product
 * screenshot archive is not a product path (WEB-LEGACY dead).
 */

export type SectionId = "hero" | "story" | "work" | "contact";

export interface SectionConfig {
  id: SectionId;
  label: string;
  path: string;
  /** Show in the primary header nav (curated — keeps chrome clean). */
  nav?: boolean;
}

export const SECTIONS: SectionConfig[] = [
  { id: "hero", label: "Home", path: "/" },
  { id: "story", label: "Story", path: "/story", nav: true },
  { id: "work", label: "Work", path: "/work", nav: true },
  { id: "contact", label: "Contact", path: "/contact", nav: true },
];

export const NAV_SECTIONS = SECTIONS.filter((s) => s.nav);
export const SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);
export const URL_SECTION_IDS: SectionId[] = SECTIONS.filter(
  (s) => s.id !== "hero",
).map((s) => s.id);
