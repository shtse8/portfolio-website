/**
 * kylet-api — the small backend that powers the live parts of kylet.se.
 *
 * Two jobs, both consumed client-side by the static portfolio:
 *   GET  /stats — live GitHub stars (aggregate, GraphQL) + npm downloads
 *                 (aggregate), cached in-memory; the numbers on the site refresh
 *                 themselves, no rebuild or manual edit needed.
 *   POST /chat  — "Ask my AI about Kyle": streamed Claude answers, grounded in a
 *                 system prompt built from Kyle's real bio/projects/stats, served
 *                 through Sylphx's OWN AI Gateway (the platform Kyle builds).
 *
 * Runs on Sylphx as a second service of the portfolio project (dogfooding).
 */

const PORT = Number(process.env.PORT ?? 3001);

// ── CORS ────────────────────────────────────────────────────────────────────
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
// The @sylphx / @shtse8 packages whose downloads we sum. The flagship dominates,
// but summing the real set keeps the "downloads/month" figure honest.
const NPM_PACKAGES = [
  "@sylphx/pdf-reader-mcp",
  "@sylphx/coderag",
  "@sylphx/flow",
  "@sylphx/silk",
  "@sylphx/craft",
  "@sylphx/rapid",
  "@sylphx/spectra",
  "@shtse8/filesystem-mcp",
  "@shtse8/pdf-reader-mcp",
  "@shtse8/cursor-ai-downloads",
];
const FLAGSHIP_REPO = "SylphxAI/pdf-reader-mcp";
const FLAGSHIP_NPM = "@sylphx/pdf-reader-mcp";

interface StatsPayload {
  githubStars: number;
  npmDownloads: number;
  flagshipStars: number;
  flagshipDownloads: number;
  byOwner: Record<string, number>;
  repos: number;
  updatedAt: string;
}

let statsCache: { at: number; data: StatsPayload } | null = null;
const STATS_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function githubGraphQL(query: string): Promise<any> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
      "content-type": "application/json",
      "user-agent": "kylet-api",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`github graphql ${res.status}`);
  const body = await res.json();
  if (body.errors) throw new Error(`github graphql: ${JSON.stringify(body.errors).slice(0, 200)}`);
  return body.data;
}

async function fetchGithubStars(): Promise<{ total: number; byOwner: Record<string, number>; repos: number }> {
  // One query, one alias per owner. Top-100-by-stars per owner is exact for the
  // aggregate — repos past the top 100 carry ~0 stars (verified: Cubeage's 256
  // repos hold 6 stars). isFork:false excludes forks.
  const blocks = GITHUB_OWNERS.map((o, i) => {
    const conn = `repositories(first: 100, isFork: false, orderBy: { field: STARGAZERS, direction: DESC })`;
    if (o.kind === "user") {
      return `o${i}: user(login: "${o.login}") { ${conn.replace("repositories(", "repositories(ownerAffiliations: OWNER, ")} { totalCount nodes { stargazerCount } } }`;
    }
    return `o${i}: organization(login: "${o.login}") { repositories: ${conn} { totalCount nodes { stargazerCount } } }`;
  }).join("\n");
  const data = await githubGraphQL(`{ ${blocks} }`);
  const byOwner: Record<string, number> = {};
  let total = 0;
  let repos = 0;
  GITHUB_OWNERS.forEach((o, i) => {
    const node = data[`o${i}`];
    const conn = node?.repositories ?? node?.repositories;
    const stars = (conn?.nodes ?? []).reduce((s: number, n: any) => s + (n.stargazerCount ?? 0), 0);
    byOwner[o.login] = stars;
    total += stars;
    repos += conn?.totalCount ?? 0;
  });
  return { total, byOwner, repos };
}

async function npmMonthly(pkg: string): Promise<number> {
  try {
    const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(pkg)}`);
    if (!res.ok) return 0;
    const body = await res.json();
    return typeof body.downloads === "number" ? body.downloads : 0;
  } catch {
    return 0;
  }
}

async function fetchNpmDownloads(): Promise<{ total: number; flagship: number }> {
  const counts = await Promise.all(NPM_PACKAGES.map(npmMonthly));
  const total = counts.reduce((a, b) => a + b, 0);
  const flagship = counts[NPM_PACKAGES.indexOf(FLAGSHIP_NPM)] ?? 0;
  return { total, flagship };
}

async function fetchFlagshipStars(): Promise<number> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${FLAGSHIP_REPO}`, {
      headers: { "user-agent": "kylet-api", ...(token ? { authorization: `bearer ${token}` } : {}) },
    });
    if (!res.ok) return 0;
    return (await res.json()).stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

async function computeStats(): Promise<StatsPayload> {
  const [gh, npm, flagshipStars] = await Promise.all([
    fetchGithubStars(),
    fetchNpmDownloads(),
    fetchFlagshipStars(),
  ]);
  return {
    githubStars: gh.total,
    npmDownloads: npm.total,
    flagshipStars: flagshipStars || gh.byOwner.SylphxAI || 0,
    flagshipDownloads: npm.flagship,
    byOwner: gh.byOwner,
    repos: gh.repos,
    updatedAt: new Date().toISOString(),
  };
}

async function getStats(): Promise<StatsPayload> {
  const now = Date.now();
  if (statsCache && now - statsCache.at < STATS_TTL_MS) return statsCache.data;
  const data = await computeStats();
  statsCache = { at: now, data };
  return data;
}

// ── /chat — Claude via Sylphx's own AI Gateway ────────────────────────────────
import { SYSTEM_PROMPT } from "./persona";

const AI_BASE_URL = process.env.AI_GATEWAY_BASE_URL ?? "https://api.sylphx.ai/v1";
const AI_KEY = process.env.AI_GATEWAY_KEY ?? "";
const AI_MODEL = process.env.AI_MODEL ?? "claude-sonnet-4-6";
const MAX_USER_CHARS = 1500;
const MAX_TURNS = 16;

async function handleChat(req: Request, origin: string | null): Promise<Response> {
  if (!AI_KEY) {
    return json({ error: "chat is warming up — the AI gateway key isn't configured yet." }, origin, 503);
  }
  let payload: { messages?: Array<{ role: string; content: string }> };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid JSON" }, origin, 400);
  }
  const incoming = Array.isArray(payload.messages) ? payload.messages : [];
  const messages = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_USER_CHARS) }));
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "send at least one user message" }, origin, 400);
  }

  const upstream = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { authorization: `Bearer ${AI_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: AI_MODEL,
      stream: true,
      max_tokens: 800,
      temperature: 0.6,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return json({ error: `ai gateway ${upstream.status}`, detail: detail.slice(0, 200) }, origin, 502);
  }
  // Pass the OpenAI-compatible SSE stream straight through to the browser.
  return new Response(upstream.body, {
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
      try {
        return json(await getStats(), origin, 200);
      } catch (err) {
        // Never hard-fail the site's numbers — serve the last good cache if any.
        if (statsCache) return json({ ...statsCache.data, stale: true }, origin, 200);
        return json({ error: String(err).slice(0, 160) }, origin, 502);
      }
    }
    if (url.pathname === "/chat" && req.method === "POST") return handleChat(req, origin);
    return json({ error: "not found" }, origin, 404);
  },
});

console.log(`kylet-api listening on :${PORT}`);
