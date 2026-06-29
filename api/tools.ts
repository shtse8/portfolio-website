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
const UPSTREAM_TIMEOUT_MS = 8_000;

/** fetch with a hard deadline so a slow GitHub/npm can't hold a request slot. */
async function fetchT(url: string, init: RequestInit = {}, ms = UPSTREAM_TIMEOUT_MS): Promise<Response> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

function gh(path: string): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  return fetchT(`https://api.github.com${path}`, {
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
    const res = await fetchT(
      `https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(pkg)}`,
    );
    if (!res.ok) return [];
    return (await res.json()).downloads ?? [];
  } catch {
    return [];
  }
}

// The agent's tools live in index.ts (AI SDK `tool()` definitions) and call the
// exported primitives above directly — one data layer for both the REST
// endpoints and the chat agent.
