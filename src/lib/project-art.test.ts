import { describe, expect, test } from "bun:test";
import {
  MARK_BANNER_ORIGIN,
  markBannerUrl,
  projectArtPath,
} from "./project-art";

describe("markBannerUrl product SSOT", () => {
  test("returns mark.sylphx.com /api/v1/banner for own projects", () => {
    const url = markBannerUrl("Google-Photos-Delete-Tool", {
      description: "Fast Chrome extension",
    });
    expect(url.startsWith(`${MARK_BANNER_ORIGIN}/api/v1/banner?`)).toBe(true);
    expect(url).toContain("type=");
    expect(url).toContain("theme=tokyonight");
    expect(url).toContain("text=Google+Photos+Delete+Tool");
    expect(url).toContain("animation=rise");
    expect(url).not.toContain("/art/projects/");
    expect(url).not.toContain("shields.io");
  });

  test("projectArtPath aliases to Mark SSOT (not local banner8)", () => {
    const url = projectArtPath("pdf-reader-mcp");
    expect(url).toContain("mark.sylphx.com/api/v1/banner");
    expect(url).not.toContain("banner8");
  });

  test("stable style for same name", () => {
    expect(markBannerUrl("coderag")).toBe(markBannerUrl("coderag"));
  });
});
