/**
 * kylet-api — the small backend that powers the live parts of kylet.se.
 *
 *   GET  /stats — live GitHub stars (aggregate, GraphQL) + npm downloads, cached;
 *                 the numbers on the site refresh themselves, no rebuild needed.
 *   POST /chat  — "Ask my AI about Kyle": a real AGENT (not a scripted bot). It
 *                 runs on Sylphx's own AI Gateway (the platform Kyle builds) and
 *                 calls live tools — read GitHub, search projects, pull stats —
 *                 then answers grounded in this minute's truth. The browser sees
 *                 each tool call, so visitors watch it act like an agent.
 *
 * Runs on Sylphx as a second service of the portfolio project (dogfooding).
 *
 * Live surface: /stats /projects /repo /recent /downloads + the /chat agent —
 * the Terminal and the agent read the same data source (see tools.ts).
 */

import { SYSTEM_PROMPT } from "./persona";
import {
  TOOL_SCHEMAS,
  TOOL_RUNNERS,
  bindLiveStats,
  listProjects,
  getRepoDetail,
  recentActivity,
  npmRange,
} from "./tools";

const PORT = Number(process.env.PORT ?? 3001);

// ── CORS ──────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  "https://kylet.se",
  "https://www.kylet.se",
  "https://loud-slab-t9c6ai.sylphx.app",
  "http://localhost:3000",
]);
function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://kylet.se";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}
function json(data: unknown, origin: string | null, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders(origin) },
  });
}

// ── /stats — live GitHub + npm, cached ────────────────────────────────────────
const GITHUB_OWNERS = [
  { login: "shtse8", kind: "user" as const },
  { login: "SylphxAI", kind: "organization" as const },
  { login: "Cubeage", kind: "organization" as const },
  { login: "EpiowAI", kind: "organization" as const },
];
const NPM_PACKAGES = [
  "@sylphx/pdf-reader-mcp", "@sylphx/coderag", "@sylphx/flow", "@sylphx/silk",
  "@sylphx/craft", "@sylphx/rapid", "@sylphx/spectra", "@shtse8/filesystem-mcp",
  "@shtse8/pdf-reader-mcp", "@shtse8/cursor-ai-downloads",
];
const FLAGSHIP_REPO = "SylphxAI/pdf-reader-mcp";
const FLAGSHIP_NPM = "@sylphx/pdf-reader-mcp";

interface StatsPayload {
  githubStars: number; npmDownloads: number; flagshipStars: number;
  flagshipDownloads: number; byOwner: Record<string, number>; repos: number; updatedAt: string;
}
let statsCache: { at: number; data: StatsPayload } | null = null;
const STATS_TTL_MS = 10 * 60 * 1000;

async function githubGraphQL(query: string): Promise<any> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { authorization: `bearer ${token}`, "content-type": "application/json", "user-agent": "kylet-api" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`github graphql ${res.status}`);
  const body = await res.json();
  if (body.errors) throw new Error(`github graphql: ${JSON.stringify(body.errors).slice(0, 200)}`);
  return body.data;
}

async function fetchGithubStars(): Promise<{ total: number; byOwner: Record<string, number>; repos: number }> {
  const blocks = GITHUB_OWNERS.map((o, i) => {
    const conn = `repositories(first: 100, isFork: false, orderBy: { field: STARGAZERS, direction: DESC })`;
    if (o.kind === "user")
      return `o${i}: user(login: "${o.login}") { repositories(ownerAffiliations: OWNER, first: 100, isFork: false, orderBy: { field: STARGAZERS, direction: DESC }) { totalCount nodes { stargazerCount } } }`;
    return `o${i}: organization(login: "${o.login}") { repositories: ${conn} { totalCount nodes { stargazerCount } } }`;
  }).join("\n");
  const data = await githubGraphQL(`{ ${blocks} }`);
  const byOwner: Record<string, number> = {};
  let total = 0, repos = 0;
  GITHUB_OWNERS.forEach((o, i) => {
    const conn = data[`o${i}`]?.repositories;
    const stars = (conn?.nodes ?? []).reduce((s: number, n: any) => s + (n.stargazerCount ?? 0), 0);
    byOwner[o.login] = stars; total += stars; repos += conn?.totalCount ?? 0;
  });
  return { total, byOwner, repos };
}
async function npmMonthly(pkg: string): Promise<number> {
  try {
    const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(pkg)}`);
    if (!res.ok) return 0;
    return (await res.json()).downloads ?? 0;
  } catch { return 0; }
}
async function fetchNpmDownloads(): Promise<{ total: number; flagship: number }> {
  const counts = await Promise.all(NPM_PACKAGES.map(npmMonthly));
  return { total: counts.reduce((a, b) => a + b, 0), flagship: counts[NPM_PACKAGES.indexOf(FLAGSHIP_NPM)] ?? 0 };
}
async function fetchFlagshipStars(): Promise<number> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${FLAGSHIP_REPO}`, {
      headers: { "user-agent": "kylet-api", ...(token ? { authorization: `bearer ${token}` } : {}) },
    });
    return res.ok ? (await res.json()).stargazers_count ?? 0 : 0;
  } catch { return 0; }
}
async function computeStats(): Promise<StatsPayload> {
  const [gh, npm, flagshipStars] = await Promise.all([fetchGithubStars(), fetchNpmDownloads(), fetchFlagshipStars()]);
  return {
    githubStars: gh.total, npmDownloads: npm.total,
    flagshipStars: flagshipStars || gh.byOwner.SylphxAI || 0, flagshipDownloads: npm.flagship,
    byOwner: gh.byOwner, repos: gh.repos, updatedAt: new Date().toISOString(),
  };
}
async function getStats(): Promise<StatsPayload> {
  const now = Date.now();
  if (statsCache && now - statsCache.at < STATS_TTL_MS) return statsCache.data;
  const data = await computeStats();
  statsCache = { at: now, data };
  return data;
}
bindLiveStats(getStats); // the get_live_stats agent tool reuses the cached computation

// ── AI config — resolve from the auto-injected project connection URL ─────────
// SYLPHX_URL is injected into every service as `sylphx://<key>@<host>[/v1]`. We
// reuse it to reach the project's own AI Gateway endpoint (OpenAI-compatible).
// AI_GATEWAY_KEY / AI_GATEWAY_BASE_URL override it (e.g. to use an sk_ secret).
function resolveAi(): { baseUrl: string; key: string } {
  const overrideBase = process.env.AI_GATEWAY_BASE_URL?.trim();
  const overrideKey = process.env.AI_GATEWAY_KEY?.trim();
  const conn = process.env.SYLPHX_URL?.trim() ?? "";
  const m = conn.match(/^sylphx:\/\/([^@]+)@([^/]+)/);
  const cred = m?.[1] ?? "";
  const host = m?.[2] ?? "";
  const baseUrl = (overrideBase || (host ? `https://${host}/v1` : "")).replace(/\/$/, "");
  return { baseUrl, key: overrideKey || cred };
}
const AI_MODEL = process.env.AI_MODEL ?? "claude-sonnet-4-6";
const MAX_USER_CHARS = 1500;
const MAX_TURNS = 14;
const MAX_TOOL_ROUNDS = 4;

async function llmCall(baseUrl: string, key: string, messages: any[], useTools: boolean): Promise<any> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 900,
      temperature: 0.5,
      messages,
      ...(useTools ? { tools: TOOL_SCHEMAS, tool_choice: "auto" } : {}),
    }),
  });
  if (!res.ok) throw new Error(`ai ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  return res.json();
}

function sse(controller: ReadableStreamDefaultController, obj: unknown) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`));
}

async function handleChat(req: Request, origin: string | null): Promise<Response> {
  const { baseUrl, key } = resolveAi();
  if (!baseUrl || !key) {
    return json({ error: "chat is warming up — the AI gateway isn't wired yet." }, origin, 503);
  }
  let payload: { messages?: Array<{ role: string; content: string }> };
  try { payload = await req.json(); } catch { return json({ error: "invalid JSON" }, origin, 400); }
  const history = (Array.isArray(payload.messages) ? payload.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_USER_CHARS) }));
  if (!history.length || history[history.length - 1].role !== "user") {
    return json({ error: "send at least one user message" }, origin, 400);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }, ...history];
      try {
        // Agent loop: let the model call tools until it's ready to answer.
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const data = await llmCall(baseUrl, key, messages, round < MAX_TOOL_ROUNDS);
          const msg = data.choices?.[0]?.message ?? {};
          const calls = msg.tool_calls ?? [];
          if (calls.length && round < MAX_TOOL_ROUNDS) {
            messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: calls });
            for (const call of calls) {
              const name = call.function?.name ?? "";
              sse(controller, { type: "tool", name });
              let args: Record<string, unknown> = {};
              try { args = JSON.parse(call.function?.arguments || "{}"); } catch { /* */ }
              const runner = TOOL_RUNNERS[name];
              const result = runner ? await runner(args).catch((e) => JSON.stringify({ error: String(e) })) : JSON.stringify({ error: "unknown tool" });
              messages.push({ role: "tool", tool_call_id: call.id, content: result });
            }
            continue; // ask the model again with the tool results
          }
          // Final answer — chunk it out for a live typing feel.
          const text: string = msg.content ?? "";
          for (const chunk of text.match(/[\s\S]{1,18}/g) ?? []) {
            sse(controller, { type: "text", delta: chunk });
            await new Promise((r) => setTimeout(r, 12));
          }
          break;
        }
        sse(controller, { type: "done" });
      } catch (e) {
        sse(controller, { type: "error", message: e instanceof Error ? e.message : "error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache",
      connection: "keep-alive",
      ...corsHeaders(origin),
    },
  });
}

// ── server ────────────────────────────────────────────────────────────────────
Bun.serve({
  port: PORT,
  idleTimeout: 120,
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get("origin");
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (url.pathname === "/healthz" || url.pathname === "/readyz") return new Response("ok");
    if (url.pathname === "/stats" && req.method === "GET") {
      try { return json(await getStats(), origin, 200); }
      catch (err) {
        if (statsCache) return json({ ...statsCache.data, stale: true }, origin, 200);
        return json({ error: String(err).slice(0, 160) }, origin, 502);
      }
    }
    // ── live terminal data (same source the agent uses) ──────────────────────
    if (url.pathname === "/projects" && req.method === "GET") {
      try {
        const limit = Number(url.searchParams.get("limit")) || 12;
        return json({ projects: await listProjects(limit), updatedAt: new Date().toISOString() }, origin, 200);
      } catch (err) {
        return json({ error: String(err).slice(0, 160) }, origin, 502);
      }
    }
    if (url.pathname === "/repo" && req.method === "GET") {
      try {
        const name = url.searchParams.get("name") ?? "";
        const repo = await getRepoDetail(name);
        return repo
          ? json({ repo, updatedAt: new Date().toISOString() }, origin, 200)
          : json({ error: `no such repo under Kyle's owners: ${name.slice(0, 60)}` }, origin, 404);
      } catch (err) {
        return json({ error: String(err).slice(0, 160) }, origin, 502);
      }
    }
    if (url.pathname === "/recent" && req.method === "GET") {
      try {
        const limit = Number(url.searchParams.get("limit")) || 6;
        return json({ recent: await recentActivity(limit), updatedAt: new Date().toISOString() }, origin, 200);
      } catch (err) {
        return json({ error: String(err).slice(0, 160) }, origin, 502);
      }
    }
    if (url.pathname === "/downloads" && req.method === "GET") {
      try {
        const pkg = url.searchParams.get("pkg") ?? "";
        const series = pkg ? await npmRange(pkg) : [];
        const total = series.reduce((a, b) => a + (b.downloads ?? 0), 0);
        return json({ pkg, series, total, updatedAt: new Date().toISOString() }, origin, 200);
      } catch (err) {
        return json({ error: String(err).slice(0, 160) }, origin, 502);
      }
    }
    if (url.pathname === "/chat" && req.method === "POST") return handleChat(req, origin);
    return json({ error: "not found" }, origin, 404);
  },
});

console.log(`kylet-api listening on :${PORT}`);
