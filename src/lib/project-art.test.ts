import { describe, expect, test } from "bun:test";
import {
  MARK_BANNER_ORIGIN,
  localProjectArtPath,
  markBannerUrl,
  projectArtPath,
} from "./project-art";

describe("portfolio card SSOT — Product Plate local art", () => {
  test("localProjectArtPath points at designed JPEG plates", () => {
    const path = localProjectArtPath("pdf-reader-mcp");
    expect(path.startsWith("/art/projects/pdf-reader-mcp.jpg")).toBe(true);
    expect(path).toContain("v=plate2");
    expect(path).not.toContain("mark.sylphx.com");
    expect(path).not.toContain("shields.io");
  });

  test("projectArtPath is card SSOT (local plate), not Mark strip", () => {
    const path = projectArtPath("coderag");
    expect(path).toContain("/art/projects/coderag.jpg");
    expect(path).not.toContain("mark.sylphx.com");
  });

  test("alias casing for curated local files", () => {
    expect(localProjectArtPath("deepresearch")).toContain("DeepResearch.jpg");
  });
});

describe("markBannerUrl — README / embed SSOT", () => {
  test("returns mark.sylphx.com banner with plate-friendly defaults", () => {
    const url = markBannerUrl("Google-Photos-Delete-Tool", {
      description: "Fast Chrome extension",
    });
    expect(url.startsWith(`${MARK_BANNER_ORIGIN}/api/v1/banner?`)).toBe(true);
    expect(url).toContain("type=");
    expect(url).toContain("theme=tokyonight");
    expect(url).toContain("text=Google+Photos+Delete+Tool");
    expect(url).toContain("layout=plate");
    expect(url).toContain("animation=none");
    expect(url).not.toContain("animation=rise");
    expect(url).not.toContain("/art/projects/");
  });

  test("stable style for same name", () => {
    expect(markBannerUrl("coderag")).toBe(markBannerUrl("coderag"));
  });
});
