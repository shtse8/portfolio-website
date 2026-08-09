/**
 * Curated deep catalog for open-source products shown on the site.
 * Keys match GitHub repo `name` (as returned by /projects and FALLBACK_PROJECTS).
 * Art files live at public/art/projects/{id}.jpg
 */

export type ProjectCatalogEntry = {
  id: string;
  /** Matches TermRepo.name */
  repoName: string;
  title: string;
  tagline: string;
  /** Longer intro for the detail surface */
  intro: string;
  highlights: string[];
  art: string;
  artAlt: string;
  docsUrl?: string;
  npm?: string;
  flagship?: boolean;
};

export const PROJECT_CATALOG: ProjectCatalogEntry[] = [
  {
    id: "pdf-reader-mcp",
    repoName: "pdf-reader-mcp",
    title: "PDF Reader MCP",
    tagline: "The PDF reader AI agents reach for.",
    intro:
      "A production Model Context Protocol server for PDF processing. Parallel extraction, layout-aware reading order, and agent-friendly tools — built so coding agents can open, search, and reason over documents without fragile scraping.",
    highlights: [
      "5–10× faster than typical alternatives via parallel processing",
      "94%+ test coverage · 103+ passing tests",
      "Live stars + npm downloads on the site (fetch /stats /downloads)",
      "Works with Claude Code, Desktop, VS Code, Cursor, Windsurf, Smithery",
    ],
    art: "/art/projects/pdf-reader-mcp.jpg",
    artAlt: "Ambient product visual for PDF Reader MCP",
    docsUrl: "https://www.npmjs.com/package/@sylphx/pdf-reader-mcp",
    npm: "@sylphx/pdf-reader-mcp",
    flagship: true,
  },
  {
    id: "coderag",
    repoName: "coderag",
    title: "CodeRAG",
    tagline: "Semantic code search with AST chunking.",
    intro:
      "Hybrid TF-IDF + vector search over real codebases. AST-aware chunking across 15+ languages, sub-50ms queries, and MCP integration so agents retrieve the right context instead of dumping whole repos into context windows.",
    highlights: [
      "AST chunking via Synth parsers · 15+ languages",
      "Sub-50ms search latency on large codebases",
      "SQLite cache · live file watching · incremental updates",
      "Indexes ~1–2k files/sec with low memory per 1k files",
    ],
    art: "/art/projects/coderag.jpg",
    artAlt: "Ambient product visual for CodeRAG",
    npm: "@sylphx/coderag",
  },
  {
    id: "filesystem-mcp",
    repoName: "filesystem-mcp",
    title: "Filesystem MCP",
    tagline: "Secure, token-saving filesystem for agents.",
    intro:
      "An MCP filesystem server designed for agent safety and context economy — scoped access, efficient reads, and tools that keep tokens under control while still letting agents navigate real project trees.",
    highlights: [
      "Agent-safe filesystem tool surface",
      "Built for token efficiency in long agent loops",
      "MCP-compatible across major coding clients",
    ],
    art: "/art/projects/filesystem-mcp.jpg",
    artAlt: "Ambient product visual for Filesystem MCP",
    npm: "@shtse8/filesystem-mcp",
  },
  {
    id: "craft",
    repoName: "craft",
    title: "Craft",
    tagline: "Immutable TypeScript state — Immer alternative.",
    intro:
      "A small, fast immutable state library with first-class ES6 Map/Set support, JSON Patch, and benchmarks that regularly beat Immer on common workloads — without giving up ergonomics.",
    highlights: [
      "~3.1 KB gzipped",
      "Up to 35× faster on large Set ops (repo benchmarks)",
      "JSON Patch (RFC 6902) + introspection utilities",
      "168+ tests · zero runtime dependencies",
    ],
    art: "/art/projects/craft.jpg",
    artAlt: "Ambient product visual for Craft",
    npm: "@sylphx/craft",
  },
  {
    id: "silk",
    repoName: "silk",
    title: "Silk",
    tagline: "Smallest zero-runtime CSS-in-TypeScript.",
    intro:
      "A CSS-in-TypeScript library optimized for size and zero runtime cost — type-safe styles that compile away, for product UIs that care about bundle discipline.",
    highlights: [
      "Zero-runtime CSS-in-TS",
      "Tiny footprint · tree-shake friendly",
      "Type-safe authoring surface",
    ],
    art: "/art/projects/silk.jpg",
    artAlt: "Ambient product visual for Silk",
    npm: "@sylphx/silk",
  },
  {
    id: "flow",
    repoName: "flow",
    title: "Flow",
    tagline: "CLI orchestration for AI coding tools.",
    intro:
      "Orchestrate Claude Code, Cursor, and other AI coding agents from one CLI surface — so multi-tool workflows become scripts instead of tribal knowledge.",
    highlights: [
      "Multi-agent CLI orchestration",
      "Built for AI-native developer workflows",
      "Composable automation entrypoint",
    ],
    art: "/art/projects/flow.jpg",
    artAlt: "Ambient product visual for Flow",
    npm: "@sylphx/flow",
  },
  {
    id: "DeepResearch",
    repoName: "DeepResearch",
    title: "DeepResearch",
    tagline: "Autonomous research with Tree-of-Thoughts.",
    intro:
      "An autonomous research agent that combines Tree-of-Thoughts and ReAct-style loops to investigate hard questions — structured exploration instead of one-shot chat.",
    highlights: [
      "Tree-of-Thoughts + ReAct reasoning",
      "Autonomous multi-step investigation",
      "Built for complex research tasks",
    ],
    art: "/art/projects/deepresearch.jpg",
    artAlt: "Ambient product visual for DeepResearch",
  },
  {
    id: "cursor-ai-downloads",
    repoName: "cursor-ai-downloads",
    title: "Cursor AI Downloads",
    tagline: "Track official Cursor builds, hourly.",
    intro:
      "A utility that tracks and surfaces official Cursor editor builds with frequent updates — so teams and agents can pin, download, and verify the exact binary they mean.",
    highlights: [
      "Hourly automatic updates",
      "Official build tracking",
      "Agent/tooling friendly",
    ],
    art: "/art/projects/cursor-ai-downloads.jpg",
    artAlt: "Ambient product visual for Cursor AI Downloads",
    npm: "@shtse8/cursor-ai-downloads",
  },
  {
    id: "Google-Photos-Delete-Tool",
    repoName: "Google-Photos-Delete-Tool",
    title: "Google Photos Delete Tool",
    tagline: "Bulk-delete Google Photos — fast, stable, Chrome extension.",
    intro:
      "A personal high-signal utility for cleaning large Google Photos libraries: intelligent batch deletion, smart scrolling for 10k+ libraries, and a Chrome extension used by thousands. Actively maintained fork with 140+ GitHub stars.",
    highlights: [
      "Chrome Web Store 4.7/5 rating — live star count on the card",
      "Batch delete with progress + retry",
      "Handles large libraries (10,000+ photos)",
      "Extension + script-injection modes",
    ],
    art: "/projects/google-photos-delete/1.jpg",
    artAlt: "Google Photos Delete Tool",
    docsUrl:
      "https://chromewebstore.google.com/detail/google-photos-delete-tool/jiahfbbfpacpolomdjlpdpiljllcdenb",
  },
];

export const PROJECT_CATALOG_BY_NAME: Record<string, ProjectCatalogEntry> =
  Object.fromEntries(PROJECT_CATALOG.map((p) => [p.repoName, p]));

export function catalogForRepoName(
  name: string,
): ProjectCatalogEntry | undefined {
  return PROJECT_CATALOG_BY_NAME[name];
}
