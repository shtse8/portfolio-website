/**
 * Capability taxonomy — maps a repo to Kyle's positioning pillars.
 * Pure module (no React) so the rules are unit-testable.
 */

export type Capability = "mcp" | "ai-infra" | "rag" | "tooling";

export const CAPABILITY_LABEL: Record<Capability, string> = {
  mcp: "MCP servers",
  "ai-infra": "AI infra / PaaS",
  rag: "RAG & search",
  tooling: "Dev tooling",
};

export const CAPABILITY_ORDER: Capability[] = [
  "mcp",
  "ai-infra",
  "rag",
  "tooling",
];

export interface CapabilityRepo {
  name: string;
  description?: string | null;
  topics?: string[];
}

/** Derive a repo's capabilities from its name + topics + description. */
export function repoCapabilities(r: CapabilityRepo): Capability[] {
  const hay =
    `${r.name} ${r.description ?? ""} ${(r.topics ?? []).join(" ")}`.toLowerCase();
  const caps = new Set<Capability>();
  if (/mcp|model.?context|protocol/.test(hay)) caps.add("mcp");
  if (
    /gateway|paas|platform|infra|deploy|kubernetes|serverless|sylphx/.test(hay)
  )
    caps.add("ai-infra");
  if (/rag|embed|semantic|search|retrieval|vector|coderag/.test(hay))
    caps.add("rag");
  if (/cli|tool|sdk|filesystem|reader|downloader|state|css|util|lib/.test(hay))
    caps.add("tooling");
  if (caps.size === 0) caps.add("tooling");
  return [...caps];
}

/** npm package backing a repo (for the per-project download trend), if any. */
export const REPO_NPM: Record<string, string> = {
  "pdf-reader-mcp": "@sylphx/pdf-reader-mcp",
  "filesystem-mcp": "@sylphx/filesystem-mcp",
  coderag: "@sylphx/coderag",
  flow: "@sylphx/flow",
  silk: "@sylphx/silk",
  craft: "@sylphx/craft",
  rapid: "@sylphx/rapid",
  "cursor-ai-downloads": "@shtse8/cursor-ai-downloads",
};
