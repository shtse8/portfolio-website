"use client";

/**
 * WorkGraphContext — the single live dataset the whole site is built on.
 *
 * Kyle's portfolio is one connected graph: stars, downloads, repos, commits and
 * the AI answers are all nodes that relate to each other. This provider fetches
 * that data once (live, from kylet-api) and holds the cross-section *selection*
 * state, so hovering a number in the hero can highlight the repos that compose
 * it in the work graph below, clicking a project can seed the AI panel, etc.
 *
 * Nothing here is a claim: every number originates from a fetch a few seconds
 * old. When the backend is unreachable the UI degrades to the build-time figures.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchProjects,
  fetchRecent,
  fetchStats,
  type TermRepo,
  type TermStats,
} from "@/lib/terminal";

// ── capability taxonomy — maps a repo to Kyle's positioning pillars ───────────
export type Capability = "mcp" | "ai-infra" | "rag" | "tooling";
export const CAPABILITY_LABEL: Record<Capability, string> = {
  mcp: "MCP servers",
  "ai-infra": "AI infra / PaaS",
  rag: "RAG & search",
  tooling: "Dev tooling",
};
export const CAPABILITY_ORDER: Capability[] = ["mcp", "ai-infra", "rag", "tooling"];

/** Derive a repo's capabilities from its name + topics + description. */
export function repoCapabilities(r: TermRepo): Capability[] {
  const hay = `${r.name} ${r.description ?? ""} ${(r.topics ?? []).join(" ")}`.toLowerCase();
  const caps = new Set<Capability>();
  if (/mcp|model.?context|protocol/.test(hay)) caps.add("mcp");
  if (/gateway|paas|platform|infra|deploy|kubernetes|serverless|sylphx/.test(hay)) caps.add("ai-infra");
  if (/rag|embed|semantic|search|retrieval|vector|coderag/.test(hay)) caps.add("rag");
  if (/cli|tool|sdk|filesystem|reader|downloader|state|css|util|lib/.test(hay)) caps.add("tooling");
  if (caps.size === 0) caps.add("tooling");
  return [...caps];
}

/** npm package backing a repo (for the per-project download trend), if any. */
export const REPO_NPM: Record<string, string> = {
  "pdf-reader-mcp": "@sylphx/pdf-reader-mcp",
  "filesystem-mcp": "@shtse8/filesystem-mcp",
  coderag: "@sylphx/coderag",
  flow: "@sylphx/flow",
  silk: "@sylphx/silk",
  craft: "@sylphx/craft",
  "cursor-ai-downloads": "@shtse8/cursor-ai-downloads",
};

// ── static fallback — the core portfolio NEVER disappears if the API is down ──
// Approximate, curated figures; the live fetch overlays the exact numbers when
// it lands. Without this, a failed /projects call would empty the whole graph.
function fb(
  owner: string,
  name: string,
  stars: number,
  language: string,
  description: string,
  topics: string[],
): TermRepo {
  return {
    repo: `${owner}/${name}`,
    name,
    owner,
    stars,
    forks: 0,
    description,
    language,
    topics,
    homepage: null,
    url: `https://github.com/${owner}/${name}`,
    pushed: "",
    pushedAt: "",
  };
}

export const FALLBACK_PROJECTS: TermRepo[] = [
  fb("SylphxAI", "pdf-reader-mcp", 801, "TypeScript", "Production-ready MCP server for PDF processing — 5–10× faster with parallel processing and 94%+ test coverage.", ["mcp", "ai-agent", "pdf", "llm-tool"]),
  fb("shtse8", "cursor-ai-downloads", 13, "TypeScript", "Track and download official Cursor AI editor versions, with hourly automatic updates.", ["cursor", "ai", "tooling"]),
  fb("SylphxAI", "coderag", 10, "TypeScript", "Semantic code search engine with AST chunking across 15+ programming languages.", ["rag", "semantic-search", "mcp", "embeddings"]),
  fb("shtse8", "filesystem-mcp", 7, "TypeScript", "Secure, token-saving MCP filesystem server for AI agents.", ["mcp", "filesystem", "ai-agent"]),
  fb("SylphxAI", "craft", 6, "TypeScript", "Immutable state library for TypeScript with ES6 collection support — an immer alternative.", ["state-management", "immutable", "typescript"]),
  fb("SylphxAI", "DeepResearch", 5, "TypeScript", "Autonomous AI research tool using Tree-of-Thoughts and ReAct-style reasoning.", ["ai", "research", "rag"]),
  fb("SylphxAI", "silk", 5, "TypeScript", "The smallest, fastest zero-runtime CSS-in-TypeScript library.", ["css-in-js", "zero-runtime", "tooling"]),
  fb("SylphxAI", "flow", 4, "TypeScript", "CLI orchestration for AI development — Claude Code, Cursor, and other AI coding tools.", ["cli", "ai", "orchestration", "ai-infra"]),
];

// ── highlight model — what a hovered hero stat lights up in the graph ─────────
export type HighlightKind = "stars" | "downloads" | "flagship" | null;

interface WorkGraphState {
  stats: TermStats | null;
  projects: TermRepo[];
  recent: TermRepo[];
  loading: boolean;
  live: boolean; // true once at least one live fetch landed
  liveProjects: boolean; // true once the projects fetch overlaid the fallback
  // cross-section selection
  highlight: HighlightKind;
  setHighlight: (h: HighlightKind) => void;
  flashHighlight: (h: HighlightKind) => void;
  isHighlighted: (r: TermRepo) => boolean;
  capability: Capability | null;
  setCapability: (c: Capability | null) => void;
  selected: string | null; // selected repo full_name (expanded card)
  setSelected: (repo: string | null) => void;
  // AI panel seed (a question pre-filled from context)
  askSeed: string | null;
  ask: (question: string) => void;
  clearAsk: () => void;
}

const Ctx = createContext<WorkGraphState | null>(null);

export function WorkGraphProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<TermStats | null>(null);
  // seed with the curated fallback so the graph is never empty (API-down safe);
  // the live fetch replaces it the moment it lands.
  const [projects, setProjects] = useState<TermRepo[]>(FALLBACK_PROJECTS);
  const [recent, setRecent] = useState<TermRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [liveProjects, setLiveProjects] = useState(false);

  const [highlight, setHighlightRaw] = useState<HighlightKind>(null);
  const flashing = useRef(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [capability, setCapability] = useState<Capability | null>(null);

  // Hover sets a transient highlight; a click "flashes" it for a few seconds so
  // the linkage survives the navigation scroll. While a flash is active a
  // hover-leave (null) must NOT clear it, but a genuine hover of another stat
  // overrides it. One managed timer, cleaned up on unmount.
  const setHighlight = useCallback((h: HighlightKind) => {
    if (flashing.current) {
      if (h === null) return;
      flashing.current = false;
      if (flashTimer.current) { clearTimeout(flashTimer.current); flashTimer.current = null; }
    }
    setHighlightRaw(h);
  }, []);
  const flashHighlight = useCallback((h: HighlightKind) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashing.current = h !== null;
    setHighlightRaw(h);
    if (h !== null) {
      flashTimer.current = setTimeout(() => {
        flashing.current = false;
        flashTimer.current = null;
        setHighlightRaw(null);
      }, 3000);
    }
  }, []);
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);
  const [selected, setSelected] = useState<string | null>(null);
  const [askSeed, setAskSeed] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, p, r] = await Promise.allSettled([fetchStats(), fetchProjects(14), fetchRecent(8)]);
      if (!alive) return;
      let any = false;
      if (s.status === "fulfilled") { setStats(s.value); any = true; }
      // only overlay live projects if the call actually returned some — never
      // replace the curated fallback with an empty list.
      if (p.status === "fulfilled" && p.value.projects.length > 0) { setProjects(p.value.projects); setLiveProjects(true); any = true; }
      if (r.status === "fulfilled") { setRecent(r.value.recent); any = true; }
      setLive(any);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const isHighlighted = useCallback(
    (r: TermRepo) => {
      if (!highlight) return false;
      if (highlight === "flagship") return /pdf-reader-mcp/i.test(r.name);
      if (highlight === "downloads") return r.name in REPO_NPM;
      return r.stars > 0; // stars: every starred repo contributes
    },
    [highlight],
  );

  const ask = useCallback((question: string) => setAskSeed(question), []);
  const clearAsk = useCallback(() => setAskSeed(null), []);

  const value = useMemo<WorkGraphState>(
    () => ({
      stats, projects, recent, loading, live, liveProjects,
      highlight, setHighlight, flashHighlight, isHighlighted,
      capability, setCapability,
      selected, setSelected,
      askSeed, ask, clearAsk,
    }),
    [stats, projects, recent, loading, live, liveProjects, highlight, setHighlight, flashHighlight, isHighlighted, capability, selected, askSeed, ask, clearAsk],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkGraph(): WorkGraphState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorkGraph must be used within WorkGraphProvider");
  return v;
}
