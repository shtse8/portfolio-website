import { describe, expect, test } from "bun:test";
import { localProjectArtPath, projectArtPath } from "./project-art";

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
