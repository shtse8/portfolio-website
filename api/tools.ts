/**
 * Live data layer — the reason nothing on kylet.se is a claim.
 *
 * Each function below hits live GitHub / npm and returns this minute's truth.
 * They are consumed two ways, from one source:
 *   1. The AGENT — exposed as OpenAI-compatible tools (TOOL_SCHEMAS / TOOL_RUNNERS)
 *      so `ask "…"` answers are grounded in real data, tool-calls shown live.
 *   2. The TERMINAL — exposed as plain REST (see index.ts) so `ls projects`,
 *      `cat <repo>`, `ship --recent`, `trace <claim>` operate on the same data.
 * One owner per capability; the terminal and the agent never drift apart.
 */

const GH_OWNERS = ["shtse8", "SylphxAI", "Cubeage", "EpiowAI"];

function gh(path: string): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  return fetch(`https://api.github.com${path}`, {
    headers: {
      "user-agent": "kylet-api",
      accept: "application/vnd.github+json",
      ...(token ? { authorization: `bearer ${token}` } : {}),
    },
  });
}

export interface RepoSummary {
  repo: string; // owner/name
  name: string;
  owner: string;
  stars: number;
  forks: number;
  description: string | null;
  language: string | null;
  topics: string[];
  homepage: string | null;
  url: string;
  pushed: string; // ISO date (yyyy-mm-dd)
  pushedAt: string; // full ISO
}

function toSummary(r: any): RepoSummary {
  return {
    repo: r.full_name,
    name: r.name,
    owner: r.owner?.login ?? r.full_name?.split("/")[0] ?? "",
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    description: r.description ?? null,
    language: r.language ?? null,
    topics: r.topics ?? [],
    homepage: r.homepage || null,
    url: r.html_url,
    pushed: r.pushed_at?.slice(0, 10) ?? "",
    pushedAt: r.pushed_at ?? "",
  };
}

// ── live primitives ───────────────────────────────────────────────────────────
let reposCache: { at: number; data: RepoSummary[] } | null = null;
const REPOS_TTL_MS = 5 * 60 * 1000;

async function listAllRepos(): Promise<RepoSummary[]> {
  if (reposCache && Date.now() - reposCache.at < REPOS_TTL_MS) return reposCache.data;
  const out: RepoSummary[] = [];
  for (const owner of GH_OWNERS) {
    try {
      const res = await gh(`/users/${owner}/repos?per_page=100&sort=updated&type=owner`);
      if (res.ok) {
        const raw = (await res.json()) as any[];
        out.push(...raw.filter((r) => !r.fork && !r.archived).map(toSummary));
      }
    } catch {
      /* skip an owner that errors */
    }
  }
  // Only cache a non-empty result, so a transient GitHub blip doesn't pin emptiness.
  if (out.length) reposCache = { at: Date.now(), data: out };
  return out;
}

/** All real projects, most-starred first (the `ls projects` index). */
export async function listProjects(limit = 12): Promise<RepoSummary[]> {
  const lim = Math.min(Math.max(Math.trunc(Number(limit)) || 12, 1), 40);
  const repos = (await listAllRepos())
    .filter((r) => r.stars > 0 || (r.description?.length ?? 0) > 0)
    .sort((a, b) => b.stars - a.stars);
  return repos.slice(0, lim);
}

/** One repo's live detail, resolved across Kyle's owners (`cat <repo>`). */
export async function getRepoDetail(nameRaw: string): Promise<RepoSummary | null> {
  const raw = String(nameRaw || "").trim().replace(/^.*\//, "");
  // Only real GitHub repo names — reject path-like / malformed input before it
  // reaches the upstream URL (defence-in-depth; the host is already fixed).
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(raw)) return null;
  for (const owner of GH_OWNERS) {
    try {
      const res = await gh(`/repos/${owner}/${encodeURIComponent(raw)}`);
      if (res.ok) return toSummary(await res.json());
    } catch {
      /* try next owner */
    }
  }
  return null;
}

/** What Kyle shipped recently — latest pushes across orgs (`ship --recent`). */
export async function recentActivity(limit = 6): Promise<RepoSummary[]> {
  return (await listAllRepos())
    .filter((r) => r.pushedAt)
    .sort((a, b) => +new Date(b.pushedAt) - +new Date(a.pushedAt))
    .slice(0, Math.min(Math.max(limit, 1), 12));
}

/** Keyword search over the project set, best matches first. */
export async function searchProjects(query: string): Promise<RepoSummary[]> {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return (await listAllRepos())
    .map((r) => {
      const hay = `${r.name} ${r.description ?? ""} ${r.topics.join(" ")} ${r.language ?? ""}`.toLowerCase();
      return { r, score: terms.filter((t) => hay.includes(t)).length };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || b.r.stars - a.r.stars)
    .slice(0, 6)
    .map((m) => m.r);
}

/** npm daily downloads for the last 30 days — powers the `cat` sparkline + trace. */
export async function npmRange(pkg: string): Promise<{ day: string; downloads: number }[]> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(pkg)}`,
    );
    if (!res.ok) return [];
    return (await res.json()).downloads ?? [];
  } catch {
    return [];
  }
}

// ── agent tool surface (delegates to the same live primitives) ─────────────────
export const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "get_recent_activity",
      description:
        "Get what Kyle has shipped recently — his latest pushed/updated public repositories across his orgs, with time + stars. Use for 'what is he working on / what did he ship lately'.",
      parameters: {
        type: "object",
        properties: { limit: { type: "integer", description: "How many recent repos (default 6, max 12)" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_repo",
      description:
        "Get live details for one of Kyle's repositories by name (stars, description, language, topics, last update, homepage). Use when asked about a specific project like pdf-reader-mcp, coderag.",
      parameters: {
        type: "object",
        properties: { name: { type: "string", description: "Repo name, e.g. 'pdf-reader-mcp' (with or without owner)" } },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_projects",
      description:
        "Search Kyle's repositories by keyword/topic (e.g. 'MCP', 'RAG', 'state management') and return top matches by stars. Use to find what he's built in an area.",
      parameters: {
        type: "object",
        properties: { query: { type: "string", description: "Keyword or topic to search for" } },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_live_stats",
      description:
        "Get Kyle's live aggregate numbers right now: total GitHub stars, total monthly npm downloads, and the flagship pdf-reader-mcp's stars + downloads.",
      parameters: { type: "object", properties: {} },
    },
  },
] as const;

export type ToolRunner = (args: Record<string, unknown>) => Promise<string>;

let get_live_stats: ToolRunner = async () => JSON.stringify({ note: "stats unavailable" });
/** Wired from index.ts so the tool reuses the same cached /stats computation. */
export function bindLiveStats(fn: () => Promise<unknown>) {
  get_live_stats = async () => JSON.stringify(await fn());
}

export const TOOL_RUNNERS: Record<string, ToolRunner> = {
  get_recent_activity: async (a) => JSON.stringify(await recentActivity(Number(a.limit) || 6)),
  get_repo: async (a) => {
    const r = await getRepoDetail(String(a.name ?? ""));
    return JSON.stringify(r ?? { error: `repo not found under Kyle's owners` });
  },
  search_projects: async (a) => {
    const r = await searchProjects(String(a.query ?? ""));
    return JSON.stringify(r.length ? r : { note: "no direct matches; try a broader term" });
  },
  get_live_stats: (a) => get_live_stats(a),
};
