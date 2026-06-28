/**
 * Agent tools — the reason "Ask my AI" isn't a generic chatbox.
 *
 * The model is given these as OpenAI-compatible function tools. When it needs
 * real data it CALLS one, we run it against live GitHub/npm, hand the result
 * back, and the answer is grounded in this minute's truth. The frontend renders
 * each call ("⚡ reading GitHub…") so visitors SEE it act like an agent — which
 * is exactly the infrastructure Kyle builds.
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

/** OpenAI-compatible tool schemas advertised to the model. */
export const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "get_recent_activity",
      description:
        "Get what Kyle has shipped recently — his latest pushed/updated public repositories across his orgs, with the commit message and time. Use for 'what is he working on / what did he ship lately'.",
      parameters: {
        type: "object",
        properties: { limit: { type: "integer", description: "How many recent repos (default 6, max 10)" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_repo",
      description:
        "Get live details for one of Kyle's repositories by name (stars, description, language, topics, last update, homepage). Use when asked about a specific project like pdf-reader-mcp, coderag, craft, silk, flow.",
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
        "Search Kyle's repositories by keyword/topic (e.g. 'MCP', 'RAG', 'state management', 'CSS') and return the top matches by stars. Use to find what he's built in an area.",
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

async function listAllRepos(): Promise<any[]> {
  const out: any[] = [];
  for (const owner of GH_OWNERS) {
    try {
      const res = await gh(`/users/${owner}/repos?per_page=100&sort=updated&type=owner`);
      if (res.ok) out.push(...(await res.json()));
    } catch {
      /* skip an owner that errors */
    }
  }
  return out.filter((r) => !r.fork);
}

const get_recent_activity: ToolRunner = async (args) => {
  const limit = Math.min(Number(args.limit) || 6, 10);
  const repos = (await listAllRepos())
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, limit)
    .map((r) => ({
      repo: r.full_name,
      pushed: r.pushed_at?.slice(0, 10),
      stars: r.stargazers_count,
      description: r.description,
      language: r.language,
    }));
  return JSON.stringify(repos);
};

const get_repo: ToolRunner = async (args) => {
  const raw = String(args.name || "").trim().replace(/^.*\//, "");
  if (!raw) return JSON.stringify({ error: "no repo name" });
  // Try each owner until one resolves.
  for (const owner of GH_OWNERS) {
    try {
      const res = await gh(`/repos/${owner}/${raw}`);
      if (res.ok) {
        const r = await res.json();
        return JSON.stringify({
          repo: r.full_name,
          stars: r.stargazers_count,
          forks: r.forks_count,
          description: r.description,
          language: r.language,
          topics: r.topics,
          homepage: r.homepage,
          pushed: r.pushed_at?.slice(0, 10),
          url: r.html_url,
        });
      }
    } catch {
      /* try next owner */
    }
  }
  return JSON.stringify({ error: `repo "${raw}" not found under Kyle's owners` });
};

const search_projects: ToolRunner = async (args) => {
  const q = String(args.query || "").toLowerCase().trim();
  if (!q) return JSON.stringify({ error: "empty query" });
  const terms = q.split(/\s+/);
  const matches = (await listAllRepos())
    .map((r) => {
      const hay = `${r.name} ${r.description ?? ""} ${(r.topics ?? []).join(" ")} ${r.language ?? ""}`.toLowerCase();
      const score = terms.filter((t) => hay.includes(t)).length;
      return { r, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || b.r.stargazers_count - a.r.stargazers_count)
    .slice(0, 6)
    .map(({ r }) => ({ repo: r.full_name, stars: r.stargazers_count, description: r.description, topics: r.topics }));
  return JSON.stringify(matches.length ? matches : { note: "no direct matches; try a broader term" });
};

let get_live_stats: ToolRunner = async () => JSON.stringify({ note: "stats unavailable" });
/** Wired from index.ts so the tool reuses the same cached /stats computation. */
export function bindLiveStats(fn: () => Promise<unknown>) {
  get_live_stats = async () => JSON.stringify(await fn());
}

export const TOOL_RUNNERS: Record<string, ToolRunner> = {
  get_recent_activity,
  get_repo,
  search_projects,
  get_live_stats: (a) => get_live_stats(a),
};
