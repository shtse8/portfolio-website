import { describe, expect, test } from "bun:test";
import { VALID_SECTIONS, VALID_URL_SECTIONS } from "../lib/constants";
import { NAV_SECTIONS, SECTIONS, URL_SECTION_IDS } from "./sections";

describe("one-page public section table", () => {
  test("nav, URL sections, and catch-all params are Promise · Evidence · Engage", () => {
    expect(SECTIONS).toEqual([
      { id: "hero", label: "Home", path: "/" },
      { id: "story", label: "Story", path: "/story", nav: true },
      { id: "work", label: "Work", path: "/work", nav: true },
      { id: "contact", label: "Contact", path: "/contact", nav: true },
    ]);
    expect(NAV_SECTIONS.map((s) => s.id)).toEqual(["story", "work", "contact"]);
    expect(URL_SECTION_IDS).toEqual(["story", "work", "contact"]);
    expect(VALID_SECTIONS).toEqual(["hero", "story", "work", "contact"]);
    expect(VALID_URL_SECTIONS).toEqual(["story", "work", "contact"]);
  });
});
