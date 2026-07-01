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
import { listProjects, getRepoDetail, recentActivity, searchProjects, npmRange } from "./tools";
import { streamText, convertToModelMessages, isStepCount, tool, type UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

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
const MAX_TURNS = 14; // cap conversation length fed to the model
const CHAT_TIMEOUT_MS = 60_000; // hard deadline for a whole chat turn
// ── agent tools (ADR-2942 dogfood) ────────────────────────────────────────────
// Real tool-calling through the Sylphx AI Gateway. Each tool hits live data
// so the agent's answers are grounded in this minute's truth — no more
// live-context injection workaround (the gateway now supports tools natively).
const AGENT_TOOLS = {
  list_projects: tool({
    description: "List Kyle's top projects by live GitHub stars. Use when the user asks about his work, repos, or what he's built.",
    inputSchema: z.object({ limit: z.number().optional().describe("max results (default 12)") }),
    execute: async ({ limit }) => listProjects(limit ?? 12),
  }),
  get_repo: tool({
    description: "Get live details (stars, forks, description, language, topics) for a specific repository. Pass the repo name like 'pdf-reader-mcp' or 'owner/name'.",
    inputSchema: z.object({ name: z.string().describe("repo name or owner/name") }),
    execute: async ({ name }) => getRepoDetail(name),
  }),
  recent_activity: tool({
    description: "Show Kyle's most recently shipped repos (by last push date). Use when the user asks what's new or recently updated.",
    inputSchema: z.object({ limit: z.number().optional().describe("max results (default 6)") }),
    execute: async ({ limit }) => recentActivity(limit ?? 6),
  }),
  search_projects: tool({
    description: "Search Kyle's repos by keyword. Use when the user asks about a specific topic, technology, or keyword.",
    inputSchema: z.object({ query: z.string().describe("search keyword") }),
    execute: async ({ query }) => searchProjects(query),
  }),
  npm_downloads: tool({
    description: "Get the last month of npm download counts for a package (e.g. '@sylphx/pdf-reader-mcp'). Use when the user asks about package popularity or install counts.",
    inputSchema: z.object({ pkg: z.string().describe("npm package name") }),
    execute: async ({ pkg }) => npmRange(pkg),
  }),
};

// ── cost / abuse guard ────────────────────────────────────────────────────────
// The chat costs real money per message (it calls the AI Gateway). This is a
// personal portfolio, so the goal is to BOUND runaway cost simply, not to build
// a fraud system. In-memory + per-replica: with N replicas the effective ceiling
// is ~N× these numbers, which is an acceptable bound for a portfolio; the global
// daily cap is the real backstop against a determined spammer / bot.
const IP_WINDOW_MS = 3 * 60_000; // sliding window
const IP_MAX_IN_WINDOW = 12; // ≤ 12 questions / 3 min / IP
const IP_MAX_PER_DAY = 60; // ≤ 60 questions / day / IP
const GLOBAL_MAX_PER_DAY = 500; // hard daily backstop across everyone (per replica)

const ipHits = new Map<string, number[]>();
const ipDay = new Map<string, { day: number; n: number }>();
let globalDay = { day: -1, n: 0 };
let lastPrune = 0;
const MAP_CAP = 50_000; // bound memory against x-forwarded-for spoofing/rotation
const dayNumber = (now: number) => Math.floor(now / 86_400_000);

function clientIp(req: Request): string {
  // NOTE: x-forwarded-for is set by the platform gateway but is ultimately
  // spoofable; per-IP limits are best-effort, and the global daily cap is what
  // actually bounds cost against IP rotation. Bound the key length so a giant
  // spoofed header can't bloat the maps.
  const raw =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-envoy-external-address") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  return raw.slice(0, 45); // max length of an IPv6 + zone literal
}

type LimitVerdict = { ok: true } | { ok: false; status: number; error: string };

function checkRateLimit(ip: string, now: number): LimitVerdict {
  const day = dayNumber(now);
  if (globalDay.day !== day) globalDay = { day, n: 0 };
  if (globalDay.n >= GLOBAL_MAX_PER_DAY) {
    return { ok: false, status: 503, error: "My AI has answered a lot today and is resting — please try again tomorrow, or reach me at hi@kylet.se." };
  }
  // Per-IP limits only when we have an IP AND the maps aren't saturated (a
  // spoofed-XFF flood could otherwise grow them unbounded). At capacity we fall
  // back to the global cap alone — which is the real bound against IP rotation.
  if (ip !== "unknown" && (ipDay.has(ip) || ipDay.size < MAP_CAP)) {
    const d = ipDay.get(ip);
    const dayCount = d && d.day === day ? d.n : 0;
    if (dayCount >= IP_MAX_PER_DAY) {
      return { ok: false, status: 429, error: "You've reached today's question limit. Come back tomorrow — or just email Kyle at hi@kylet.se." };
    }
    const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
    if (hits.length >= IP_MAX_IN_WINDOW) {
      return { ok: false, status: 429, error: "Slow down a moment — that's a lot of questions very fast. Try again shortly." };
    }
    hits.push(now);
    ipHits.set(ip, hits);
    ipDay.set(ip, { day, n: dayCount + 1 });
  }
  globalDay.n += 1;
  return { ok: true };
}

/** Keep the in-memory maps from growing unbounded. */
function maybePrune(now: number): void {
  if (now - lastPrune < 10 * 60_000) return;
  lastPrune = now;
  for (const [ip, hits] of ipHits) {
    const live = hits.filter((t) => now - t < IP_WINDOW_MS);
    if (live.length) ipHits.set(ip, live);
    else ipHits.delete(ip);
  }
  const day = dayNumber(now);
  for (const [ip, d] of ipDay) if (d.day !== day) ipDay.delete(ip);
}

async function handleChat(req: Request, origin: string | null): Promise<Response> {
  const { baseUrl, key } = resolveAi();
  if (!baseUrl || !key) {
    return json({ error: "chat is warming up — the AI gateway isn't wired yet." }, origin, 503);
  }
  let body: { messages?: UIMessage[] };
  try { body = await req.json(); } catch { return json({ error: "invalid JSON" }, origin, 400); }
  const messages = (Array.isArray(body.messages) ? body.messages : []).slice(-MAX_TURNS);
  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    return json({ error: "send at least one user message" }, origin, 400);
  }
  // cheap DoS guard: reject an absurdly large payload before doing paid work.
  if (JSON.stringify(messages).length > 60_000) {
    return json({ error: "that message is too long — please trim it." }, origin, 413);
  }
  // cost/abuse guard — charged only for a VALID chat attempt, right before the
  // first paid call, so malformed requests can't grief the quota.
  const now = Date.now();
  maybePrune(now);
  const verdict = checkRateLimit(clientIp(req), now);
  if (!verdict.ok) return json({ error: verdict.error }, origin, verdict.status);

  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(messages);
  } catch {
    return json({ error: "couldn't read that conversation — start a new one." }, origin, 400);
  }

  // The AI SDK handles streaming + message state. The gateway now supports
  // real tool-calling (ADR-2942), so the agent calls live tools directly —
  // no more system-prompt context injection. Temperature is omitted so the
  // model uses its default (the Gateway rejects temperature != 1 for sonnet).
  const gateway = createOpenAICompatible({ name: "sylphx", baseURL: baseUrl, apiKey: key });
  const result = streamText({
    model: gateway.chatModel(AI_MODEL),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    tools: AGENT_TOOLS,
    stopWhen: isStepCount(3),
    abortSignal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
  });

  return result.toUIMessageStreamResponse({
    headers: corsHeaders(origin),
    onError: (error) => {
      // Log the real cause server-side; the client only ever gets a safe line.
      console.error("chat stream error:", error instanceof Error ? error.message : error);
      return "The agent hit a snag — please try again, or reach Kyle at hi@kylet.se.";
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
        console.error("api error:", err instanceof Error ? err.message : err);
        return json({ error: "live data is briefly unavailable — try again shortly." }, origin, 502);
      }
    }
    // ── live terminal data (same source the agent uses) ──────────────────────
    if (url.pathname === "/projects" && req.method === "GET") {
      try {
        const limit = Number(url.searchParams.get("limit")) || 12;
        return json({ projects: await listProjects(limit), updatedAt: new Date().toISOString() }, origin, 200);
      } catch (err) {
        console.error("api error:", err instanceof Error ? err.message : err);
        return json({ error: "live data is briefly unavailable — try again shortly." }, origin, 502);
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
        console.error("api error:", err instanceof Error ? err.message : err);
        return json({ error: "live data is briefly unavailable — try again shortly." }, origin, 502);
      }
    }
    if (url.pathname === "/recent" && req.method === "GET") {
      try {
        const limit = Number(url.searchParams.get("limit")) || 6;
        return json({ recent: await recentActivity(limit), updatedAt: new Date().toISOString() }, origin, 200);
      } catch (err) {
        console.error("api error:", err instanceof Error ? err.message : err);
        return json({ error: "live data is briefly unavailable — try again shortly." }, origin, 502);
      }
    }
    if (url.pathname === "/downloads" && req.method === "GET") {
      try {
        const pkg = url.searchParams.get("pkg") ?? "";
        // Only real npm package names — keeps this from being an arbitrary
        // outbound-request proxy.
        const validPkg = /^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/i.test(pkg) && pkg.length <= 80;
        const series = validPkg ? await npmRange(pkg) : [];
        const total = series.reduce((a, b) => a + (b.downloads ?? 0), 0);
        return json({ pkg, series, total, updatedAt: new Date().toISOString() }, origin, 200);
      } catch (err) {
        console.error("api error:", err instanceof Error ? err.message : err);
        return json({ error: "live data is briefly unavailable — try again shortly." }, origin, 502);
      }
    }
    if (url.pathname === "/chat" && req.method === "POST") return handleChat(req, origin);
    return json({ error: "not found" }, origin, 404);
  },
});

console.log(`kylet-api listening on :${PORT}`);
