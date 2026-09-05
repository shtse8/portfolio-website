import { describe, expect, test } from "bun:test";
import {
  FLAGSHIP_REPO_NAME,
  isFlagshipRepo,
  isPrimaryRepo,
  npmFromHomepage,
  PRIMARY_STAR_MIN,
  projectDocsUrl,
  projectIntro,
  projectNpm,
  projectTagline,
  projectTitle,
  sortPortfolio,
} from "./project-presentation";
import type { TermRepo } from "./terminal";

function repo(partial: Partial<TermRepo> & Pick<TermRepo, "name">): TermRepo {
  const owner = partial.owner ?? "SylphxAI";
  return {
    repo: partial.repo ?? `${owner}/${partial.name}`,
    name: partial.name,
    owner,
    stars: partial.stars ?? 1,
    forks: partial.forks ?? 0,
    description: partial.description ?? null,
    language: partial.language ?? "TypeScript",
    topics: partial.topics ?? [],
    homepage: partial.homepage ?? null,
    url: partial.url ?? `https://github.com/${owner}/${partial.name}`,
    pushed: partial.pushed ?? "2026-09-01T00:00:00Z",
    pushedAt: partial.pushedAt ?? "2026-09-01T00:00:00Z",
    archived: partial.archived,
  };
}

describe("project copy is GitHub authority", () => {
  const description =
    "Give your AI agent eyes for PDFs — structured text, tables, OCR, visual evidence";
  const homepage = "https://sylphxai.github.io/pdf-reader-mcp/";
  const pdf = repo({
    name: "pdf-reader-mcp",
    stars: 905,
    description,
    homepage,
  });

  test("title and tagline are the GitHub name and description", () => {
    expect(projectTitle(pdf)).toBe("pdf-reader-mcp");
    expect(projectTagline(pdf)).toBe(description);
    expect(projectIntro(pdf)).toBe(description);
    expect(projectDocsUrl(pdf)).toBe(homepage);
  });

  test("does not invent marketing highlights or a pretty title", () => {
    expect(projectTitle(pdf)).not.toBe("PDF Reader MCP");
    expect(projectTagline(pdf)).not.toBe("The PDF reader AI agents reach for.");
    expect(projectIntro(pdf)).not.toContain("5–10× faster");
  });

  test("empty description does not fabricate a catalog intro as tagline", () => {
    const bare = repo({ name: "mystery", description: null, homepage: null });
    expect(projectTitle(bare)).toBe("mystery");
    expect(projectTagline(bare)).toBe("");
    expect(projectDocsUrl(bare)).toBeUndefined();
    expect(projectIntro(bare)).toBe("Open-source work shipping in production.");
  });
});

describe("npm join", () => {
  test("parses scoped and unscoped packages from GitHub homepage", () => {
    expect(
      npmFromHomepage("https://www.npmjs.com/package/@shtse8/filesystem-mcp"),
    ).toBe("@shtse8/filesystem-mcp");
    expect(npmFromHomepage("https://www.npmjs.com/package/left-pad")).toBe(
      "left-pad",
    );
    expect(npmFromHomepage("https://sylphxai.github.io/pdf-reader-mcp/")).toBe(
      undefined,
    );
  });

  test("homepage npmjs wins over the downloads join map", () => {
    const fs = repo({
      name: "filesystem-mcp",
      homepage: "https://www.npmjs.com/package/@shtse8/filesystem-mcp",
    });
    expect(projectNpm(fs)).toBe("@shtse8/filesystem-mcp");
  });

  test("flagship npm comes from the api-rust join when homepage is docs", () => {
    const pdf = repo({
      name: "pdf-reader-mcp",
      homepage: "https://sylphxai.github.io/pdf-reader-mcp/",
    });
    expect(projectNpm(pdf)).toBe("@sylphx/pdf-reader-mcp");
  });
});

describe("primary grid is GitHub traction", () => {
  test("flagship join matches api-rust FLAGSHIP_REPO basename", () => {
    expect(FLAGSHIP_REPO_NAME).toBe("pdf-reader-mcp");
    expect(isFlagshipRepo(repo({ name: "pdf-reader-mcp" }))).toBe(true);
    expect(isFlagshipRepo(repo({ name: "coderag" }))).toBe(false);
  });

  test("archived repos are never primary even with stars", () => {
    expect(
      isPrimaryRepo(repo({ name: "filesystem-mcp", stars: 8, archived: true })),
    ).toBe(false);
  });

  test("active repos need GitHub stars, not a curated overlay membership", () => {
    expect(PRIMARY_STAR_MIN).toBe(3);
    expect(isPrimaryRepo(repo({ name: "coderag", stars: 12 }))).toBe(true);
    expect(isPrimaryRepo(repo({ name: "low-signal", stars: 2 }))).toBe(false);
    expect(
      isPrimaryRepo(
        repo({
          name: "catalogued-but-low",
          stars: 1,
          homepage: "https://www.npmjs.com/package/@sylphx/silk",
        }),
      ),
    ).toBe(false);
  });

  test("sorts active before archived, then stars desc", () => {
    const rows = [
      repo({ name: "old", stars: 99, archived: true }),
      repo({ name: "b", stars: 4 }),
      repo({ name: "a", stars: 4 }),
      repo({ name: "hot", stars: 20 }),
    ];
    const names = rows
      .slice()
      .sort(sortPortfolio)
      .map((r) => r.name);
    expect(names).toEqual(["hot", "a", "b", "old"]);
  });
});
