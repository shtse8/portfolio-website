import { describe, expect, test } from "bun:test";
import {
  CAPABILITY_LABEL,
  CAPABILITY_ORDER,
  REPO_NPM,
  repoCapabilities,
} from "./capabilities";

describe("repoCapabilities", () => {
  test("classifies MCP servers", () => {
    const caps = repoCapabilities({
      name: "pdf-reader-mcp",
      description: "MCP server for PDF processing",
      topics: ["mcp", "ai-agent"],
    });
    expect(caps).toContain("mcp");
  });

  test("classifies RAG from name/topics", () => {
    const caps = repoCapabilities({
      name: "coderag",
      description: "semantic code search",
      topics: ["rag", "vector"],
    });
    expect(caps).toContain("rag");
  });

  test("classifies AI infra from keywords", () => {
    const caps = repoCapabilities({
      name: "gateway",
      description: "AI gateway and PaaS platform",
      topics: ["infra"],
    });
    expect(caps).toContain("ai-infra");
  });

  test("falls back to tooling when nothing matches", () => {
    const caps = repoCapabilities({
      name: "mystery-repo",
      description: null,
      topics: [],
    });
    expect(caps).toEqual(["tooling"]);
  });
});

test("capability labels and order are stable", () => {
  expect(CAPABILITY_ORDER).toEqual(["mcp", "ai-infra", "rag", "tooling"]);
  expect(CAPABILITY_LABEL.mcp).toBe("MCP servers");
});

test("npm map covers the flagship", () => {
  expect(REPO_NPM["pdf-reader-mcp"]).toBe("@sylphx/pdf-reader-mcp");
});
