/**
 * Centralized section configuration — the single source of truth for the
 * one-page narrative. Drives nav, the IntersectionObserver, deep links, and
 * the JSON-LD navigation element.
 */

export type SectionId =
  | "hero"
  | "work"
  | "ask"
  | "experience"
  | "contact";

export interface SectionConfig {
  id: SectionId;
  label: string;
  path: string;
  /** Show in the primary header nav (a curated subset keeps the header clean). */
  nav?: boolean;
}

export const SECTIONS: SectionConfig[] = [
  { id: "hero", label: "Home", path: "/" },
  { id: "work", label: "Work", path: "/work", nav: true },
  { id: "ask", label: "Ask", path: "/ask", nav: true },
  { id: "experience", label: "Experience", path: "/experience", nav: true },
  { id: "contact", label: "Contact", path: "/contact", nav: true },
];

export const NAV_SECTIONS = SECTIONS.filter((s) => s.nav);
export const SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);
export const URL_SECTION_IDS: SectionId[] = SECTIONS.filter((s) => s.id !== "hero").map((s) => s.id);
