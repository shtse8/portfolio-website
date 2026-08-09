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
// Live /projects fetch overlays fresher numbers when the API is up.
export const FALLBACK_PROJECTS: TermRepo[] = (
  githubPortfolio.repos as Array<{
    owner: string;
    name: string;
    stars: number;
    archived?: boolean;
    description: string;
    language: string | null;
    topics: string[];
    homepage: string | null;
    url: string;
    pushedAt: string;
  }>
)
  // Keep inventory for expand; UI primary-filters by stars + active.
  .filter((r) => !r.name.startsWith("scale-"))
  .slice(0, 60)
  .map((r) => ({
    repo: `${r.owner}/${r.name}`,
    name: r.name,
    owner: r.owner,
    stars: r.stars,
    forks: 0,
    description: r.description || null,
    language: r.language,
    topics: r.topics ?? [],
    homepage: r.homepage,
    url: r.url,
    pushed: r.pushedAt,
    pushedAt: r.pushedAt,
    archived: Boolean(r.archived),
  }));

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
      // only overlay live projects if the call actually returned some — never
      // replace the curated fallback with an empty list.
      if (p.status === "fulfilled" && p.value.projects.length > 0) {
        // Merge live overlay with synced catalog so owned-org repos never disappear
        // when the API returns a shorter top-N list.
        const byRepo = new Map<string, TermRepo>();
        for (const r of FALLBACK_PROJECTS) byRepo.set(r.repo.toLowerCase(), r);
        for (const r of p.value.projects) {
          const key = r.repo.toLowerCase();
          const prev = byRepo.get(key);
          // Live API may omit archived — keep snapshot flag from sync.
          byRepo.set(key, {
            ...r,
            archived: r.archived ?? prev?.archived,
          });
        }
        const merged = [...byRepo.values()].sort((a, b) => {
          if (Boolean(a.archived) !== Boolean(b.archived))
            return a.archived ? 1 : -1;
          return b.stars - a.stars;
        });
        setProjects(merged);
        setLiveProjects(true);
        any = true;
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
