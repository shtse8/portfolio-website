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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import githubPortfolio from "@/data/github-portfolio.json";
import {
  CAPABILITY_LABEL,
  CAPABILITY_ORDER,
  type Capability,
  REPO_NPM,
  repoCapabilities,
} from "@/lib/capabilities";
import {
  adoptLiveProjects,
  fallbackProjectsFromSnapshot,
} from "@/lib/project-inventory";
import { isFlagshipRepo } from "@/lib/project-presentation";
import {
  fetchProjects,
  fetchRecent,
  fetchStats,
  type TermRepo,
  type TermStats,
} from "@/lib/terminal";

export type { Capability };
// Capability taxonomy + npm map live in the pure module (unit-testable).
export { CAPABILITY_LABEL, CAPABILITY_ORDER, REPO_NPM, repoCapabilities };

// ── static fallback from synced GitHub admin-org + personal owner repos ───────
// Source of truth: `bun scripts/sync-github-portfolio.mjs` → github-portfolio.json
// Live /projects fetch *replaces* this list when the API returns repos.
export const FALLBACK_PROJECTS: TermRepo[] = fallbackProjectsFromSnapshot(
  githubPortfolio.repos,
);

// ── highlight model — what a hovered hero stat lights up in the graph ─────────
export type HighlightKind = "stars" | "downloads" | "flagship" | null;

interface WorkGraphState {
  stats: TermStats | null;
  projects: TermRepo[];
  recent: TermRepo[];
  loading: boolean;
  live: boolean; // true once at least one live fetch landed
  liveProjects: boolean; // true once live /projects replaced the fallback inventory
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
  // Seed with the synced explicit-public fallback so the graph is never empty
  // (API-down safe). A successful live /projects list replaces it; it is not merged.
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
      if (flashTimer.current) {
        clearTimeout(flashTimer.current);
        flashTimer.current = null;
      }
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
  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [askSeed, setAskSeed] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, p, r] = await Promise.allSettled([
        fetchStats(),
        fetchProjects(40),
        fetchRecent(8),
      ]);
      if (!alive) return;
      let any = false;
      if (s.status === "fulfilled") {
        setStats(s.value);
        any = true;
      }
      // Replace fallback with live inventory when the call returns repos.
      // An empty payload is treated as fetch failure (keep fallback).
      if (p.status === "fulfilled") {
        const adopted = adoptLiveProjects(FALLBACK_PROJECTS, p.value.projects);
        setProjects(adopted.projects);
        if (adopted.liveProjects) {
          setLiveProjects(true);
          any = true;
        }
      }
      if (r.status === "fulfilled") {
        setRecent(r.value.recent);
        any = true;
      }
      setLive(any);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const isHighlighted = useCallback(
    (r: TermRepo) => {
      if (!highlight) return false;
      if (highlight === "flagship") return isFlagshipRepo(r);
      if (highlight === "downloads") return r.name in REPO_NPM;
      return r.stars > 0; // stars: every starred repo contributes
    },
    [highlight],
  );

  const ask = useCallback((question: string) => setAskSeed(question), []);
  const clearAsk = useCallback(() => setAskSeed(null), []);

  const value = useMemo<WorkGraphState>(
    () => ({
      stats,
      projects,
      recent,
      loading,
      live,
      liveProjects,
      highlight,
      setHighlight,
      flashHighlight,
      isHighlighted,
      capability,
      setCapability,
      selected,
      setSelected,
      askSeed,
      ask,
      clearAsk,
    }),
    [
      stats,
      projects,
      recent,
      loading,
      live,
      liveProjects,
      highlight,
      setHighlight,
      flashHighlight,
      isHighlighted,
      capability,
      selected,
      askSeed,
      ask,
      clearAsk,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkGraph(): WorkGraphState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorkGraph must be used within WorkGraphProvider");
  return v;
}
