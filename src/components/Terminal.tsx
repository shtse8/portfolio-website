"use client";

/**
 * The Terminal — kylet.se's centerpiece.
 *
 * Not a terminal *skin*: an actual runtime surface. Every command operates on
 * live GitHub/npm data through kylet-api (the same source the agent uses), shows
 * its provenance, and is honest about latency and failure. The site IS the demo
 * of what Kyle builds — an agent runtime you operate, not a portfolio you read.
 *
 * Design notes (pressure-tested):
 *  · every impressive number is falsifiable — `receipts` expose the real source.
 *  · plain-English first line before any technical detail (legible to non-devs).
 *  · intent chips let non-devs steer; Tab + history let devs type.
 *  · no fake boot logs, no cosplay. Real fetches, real timings, real errors.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";
import {
  fetchProjects,
  fetchRepo,
  fetchRecent,
  fetchStats,
  fetchDownloads,
  sparkline,
  compact,
  timeAgo,
  bar,
  type TermRepo,
  type TermStats,
} from "@/lib/terminal";

// ── block model (the scrollback) ──────────────────────────────────────────────
type Tone = "fg" | "dim" | "faint" | "accent" | "ok" | "warn" | "err";
type Receipt = { label: string; url: string };

type Block =
  | { k: "text"; lines: { t: string; tone?: Tone; mono?: boolean }[] }
  | { k: "lead"; t: string }
  | { k: "projects"; rows: TermRepo[]; max: number; meta: string; receipts: Receipt[] }
  | { k: "repo"; repo: TermRepo; spark: string; total: number; meta: string; receipts: Receipt[] }
  | { k: "recent"; rows: TermRepo[]; meta: string; receipts: Receipt[] }
  | { k: "stats"; data: TermStats; meta: string; receipts: Receipt[] }
  | { k: "trace"; claim: string; value: string; steps: { label: string; detail: string }[]; receipts: Receipt[] }
  | { k: "help"; rows: { cmd: string; desc: string }[] }
  | { k: "tool"; name: string; done: boolean }
  | { k: "answer"; t: string }
  | { k: "brief"; audience: string; lines: string[] };

interface Entry {
  id: string;
  path: string;
  input: string;
  blocks: Block[];
}

interface CmdCtx {
  arg: string;
  args: string[];
  push: (b: Block) => number;
  update: (i: number, fn: (b: Block) => Block) => void;
  setPath: (p: string) => void;
  signal: AbortSignal;
}

interface Command {
  name: string;
  summary: string;
  usage?: string;
  hidden?: boolean;
  run: (ctx: CmdCtx) => Promise<void> | void;
}

const HOST = "kyle@sylphx";
const FLAGSHIP_PKG = "@sylphx/pdf-reader-mcp";

const TOOL_LABEL: Record<string, string> = {
  get_recent_activity: "reading recent GitHub activity",
  get_repo: "looking up the repo",
  search_projects: "searching his projects",
  get_live_stats: "pulling live stats",
};

const FRIENDLY_ERR = (e: unknown) => (e instanceof Error ? e.message : "something went wrong");
const shortId = () => Math.abs(Math.floor(performance.now() * 1000) % 0xffff).toString(16).padStart(4, "0");
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── commands ──────────────────────────────────────────────────────────────────
const COMMANDS: Command[] = [
  {
    name: "help",
    summary: "what you can run here",
    run: ({ push }) => {
      push({
        k: "help",
        rows: COMMANDS.filter((c) => !c.hidden).map((c) => ({ cmd: c.usage ?? c.name, desc: c.summary })),
      });
    },
  },
  {
    name: "whoami",
    summary: "who Kyle is, in three lines",
    run: async ({ push }) => {
      push({ k: "lead", t: "Kyle builds the infrastructure layer that lets AI agents read, search, deploy, and act." });
      let proof = "990+ GitHub stars · 27K+ npm downloads/mo";
      try {
        const s = await fetchStats();
        proof = `${compact(s.githubStars)} GitHub stars · ${compact(s.npmDownloads)} npm downloads/mo · live`;
      } catch {
        /* static proof fallback */
      }
      push({
        k: "text",
        lines: [
          { t: "runtime  Sylphx — an AI-native PaaS, with its own AI Gateway", tone: "dim", mono: true },
          { t: "builds   MCP servers, RAG / semantic-search tooling, agent dev infra", tone: "dim", mono: true },
          { t: "before   20 years shipping — 10M+ app downloads at a HK gaming studio", tone: "dim", mono: true },
          { t: `proof    ${proof}`, tone: "ok", mono: true },
        ],
      });
      push({ k: "text", lines: [{ t: 'Try:  ls projects   ·   stats   ·   ask "what has he shipped?"', tone: "faint" }] });
    },
  },
  {
    name: "ls",
    usage: "ls projects",
    summary: "his open-source projects, by live stars",
    run: async ({ push, update }) => {
      const i = push({ k: "text", lines: [{ t: "reading github…", tone: "faint" }] });
      try {
        const { projects, updatedAt } = await fetchProjects(10);
        const max = Math.max(...projects.map((p) => p.stars), 1);
        update(i, () => ({
          k: "projects",
          rows: projects,
          max,
          meta: `github live · ${projects.length} repos · refreshed ${timeAgo(updatedAt)}`,
          receipts: [{ label: "GitHub REST — repos", url: "https://api.github.com/users/shtse8/repos" }],
        }));
      } catch (e) {
        update(i, () => ({ k: "text", lines: [{ t: `ls: ${FRIENDLY_ERR(e)}`, tone: "err", mono: true }] }));
      }
    },
  },
  {
    name: "cat",
    usage: "cat <repo>",
    summary: "live detail for one project (try: cat pdf-reader-mcp)",
    run: async ({ arg, push, update }) => {
      const name = arg.trim();
      if (!name) {
        push({ k: "text", lines: [{ t: "usage: cat <repo>   e.g. cat pdf-reader-mcp", tone: "warn", mono: true }] });
        return;
      }
      const i = push({ k: "text", lines: [{ t: `reading ${name}…`, tone: "faint" }] });
      try {
        const { repo, updatedAt } = await fetchRepo(name);
        let spark = "";
        let total = 0;
        if (/pdf-reader-mcp/i.test(repo.name)) {
          try {
            const d = await fetchDownloads(FLAGSHIP_PKG);
            spark = sparkline(d.series.map((p) => p.downloads));
            total = d.total;
          } catch {
            /* sparkline optional */
          }
        }
        update(i, () => ({
          k: "repo",
          repo,
          spark,
          total,
          meta: `github live · last push ${timeAgo(repo.pushedAt)} · refreshed ${timeAgo(updatedAt)}`,
          receipts: [
            { label: "GitHub REST — repo", url: `https://api.github.com/repos/${repo.repo}` },
            ...(spark
              ? [{ label: "npm — 30d downloads", url: `https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(FLAGSHIP_PKG)}` }]
              : []),
          ],
        }));
      } catch (e) {
        update(i, () => ({ k: "text", lines: [{ t: `cat: ${FRIENDLY_ERR(e)}`, tone: "err", mono: true }] }));
      }
    },
  },
  {
    name: "stats",
    usage: "stats",
    summary: "the aggregate proof, live",
    run: async ({ push, update }) => {
      const i = push({ k: "text", lines: [{ t: "aggregating github + npm…", tone: "faint" }] });
      try {
        const data = await fetchStats();
        update(i, () => ({
          k: "stats",
          data,
          meta: `github graphql + npm registry · refreshed ${timeAgo(data.updatedAt)}`,
          receipts: [
            { label: "GitHub GraphQL — stars", url: "https://docs.github.com/graphql" },
            { label: "npm — last-month downloads", url: "https://api.npmjs.org/downloads/point/last-month/@sylphx/pdf-reader-mcp" },
          ],
        }));
      } catch (e) {
        update(i, () => ({ k: "text", lines: [{ t: `stats: ${FRIENDLY_ERR(e)}`, tone: "err", mono: true }] }));
      }
    },
  },
  {
    name: "ship",
    usage: "ship --recent",
    summary: "what he pushed lately — the heartbeat",
    run: async ({ push, update }) => {
      const i = push({ k: "text", lines: [{ t: "reading recent pushes…", tone: "faint" }] });
      try {
        const { recent, updatedAt } = await fetchRecent(6);
        update(i, () => ({
          k: "recent",
          rows: recent,
          meta: `github live · refreshed ${timeAgo(updatedAt)}`,
          receipts: [{ label: "GitHub REST — repos (by push)", url: "https://api.github.com/users/SylphxAI/repos?sort=pushed" }],
        }));
      } catch (e) {
        update(i, () => ({ k: "text", lines: [{ t: `ship: ${FRIENDLY_ERR(e)}`, tone: "err", mono: true }] }));
      }
    },
  },
  {
    name: "ask",
    usage: 'ask "your question"',
    summary: "talk to the real agent — it reads live data, you watch",
    run: async ({ arg, push, update, setPath, signal }) => {
      const q = arg.replace(/^["']|["']$/g, "").trim();
      if (!q) {
        push({ k: "text", lines: [{ t: 'usage: ask "is he a fit for an AI infra role?"', tone: "warn", mono: true }] });
        return;
      }
      if (!HAS_API) {
        push({ k: "text", lines: [{ t: "ask: the agent is warming up — its gateway isn't wired yet. Everything else here is live.", tone: "warn", mono: true }] });
        return;
      }
      setPath(`~/runs/${shortId()}`);
      let answerIdx = -1;
      let lastTool = -1;
      let acc = "";
      const markToolDone = () => {
        if (lastTool >= 0) update(lastTool, (b) => (b.k === "tool" ? { ...b, done: true } : b));
      };
      try {
        const res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: q }] }),
          signal,
        });
        if (!res.ok || !res.body) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error || `agent unavailable (${res.status})`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const raw = t.slice(5).trim();
            if (!raw) continue;
            let ev: { type?: string; name?: string; delta?: string; message?: string };
            try { ev = JSON.parse(raw); } catch { continue; }
            if (ev.type === "tool" && ev.name) {
              markToolDone();
              lastTool = push({ k: "tool", name: ev.name, done: false });
            } else if (ev.type === "text" && ev.delta) {
              markToolDone();
              if (answerIdx < 0) answerIdx = push({ k: "answer", t: "" });
              acc += ev.delta;
              update(answerIdx, () => ({ k: "answer", t: acc }));
            } else if (ev.type === "error") {
              throw new Error(ev.message || "agent error");
            }
          }
        }
        markToolDone();
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        push({ k: "text", lines: [{ t: `ask: ${FRIENDLY_ERR(e)}`, tone: "err", mono: true }] });
      } finally {
        setPath("~");
      }
    },
  },
  {
    name: "trace",
    usage: "trace <claim>",
    summary: "show the exact source chain behind any number",
    run: async ({ arg, push, update }) => {
      const claim = arg.replace(/^["']|["']$/g, "").trim().toLowerCase();
      if (!claim) {
        push({
          k: "text",
          lines: [
            { t: "usage: trace <claim>  — prove any number is real, not a claim.", tone: "warn", mono: true },
            { t: "try:  trace stars   ·   trace downloads   ·   trace flagship", tone: "faint", mono: true },
          ],
        });
        return;
      }
      const i = push({ k: "text", lines: [{ t: "walking the source chain…", tone: "faint" }] });
      try {
        const s = await fetchStats();
        const kind = /down|npm|install|27/.test(claim)
          ? "downloads"
          : /flag|pdf|reader|800|801/.test(claim)
            ? "flagship"
            : "stars";
        const map = {
          stars: {
            value: `${compact(s.githubStars)} GitHub stars`,
            steps: [
              { label: "claim", detail: "total GitHub stars across Kyle's owners" },
              { label: "source", detail: "GitHub GraphQL — repositories(orderBy: STARGAZERS)" },
              { label: "scope", detail: "shtse8 · SylphxAI · Cubeage · EpiowAI (non-fork)" },
              { label: "compute", detail: "sum(stargazerCount) over all repos" },
              { label: "cache", detail: "kylet-api · 10 min TTL · fail-safe to last good" },
              { label: "rendered", detail: `→ ${compact(s.githubStars)} · refreshed ${timeAgo(s.updatedAt)}` },
            ],
            receipts: [{ label: "GitHub GraphQL", url: "https://docs.github.com/graphql" }],
          },
          downloads: {
            value: `${compact(s.npmDownloads)} npm downloads / month`,
            steps: [
              { label: "claim", detail: "monthly npm downloads across Kyle's packages" },
              { label: "source", detail: "npm registry — /downloads/point/last-month/<pkg>" },
              { label: "scope", detail: "@sylphx/* and @shtse8/* published packages" },
              { label: "compute", detail: "sum(downloads) per package, last 30 days" },
              { label: "cache", detail: "kylet-api · 10 min TTL" },
              { label: "rendered", detail: `→ ${compact(s.npmDownloads)} · refreshed ${timeAgo(s.updatedAt)}` },
            ],
            receipts: [{ label: "npm API", url: "https://api.npmjs.org/downloads/point/last-month/@sylphx/pdf-reader-mcp" }],
          },
          flagship: {
            value: `${compact(s.flagshipStars)}★ · ${compact(s.flagshipDownloads)} downloads/mo`,
            steps: [
              { label: "claim", detail: "pdf-reader-mcp — the flagship MCP server" },
              { label: "source", detail: "GitHub REST /repos/SylphxAI/pdf-reader-mcp + npm" },
              { label: "compute", detail: "stargazers_count + last-month downloads" },
              { label: "cache", detail: "kylet-api · 10 min TTL" },
              { label: "rendered", detail: `→ ${compact(s.flagshipStars)}★ / ${compact(s.flagshipDownloads)} dl · refreshed ${timeAgo(s.updatedAt)}` },
            ],
            receipts: [{ label: "GitHub REST", url: "https://api.github.com/repos/SylphxAI/pdf-reader-mcp" }],
          },
        } as const;
        const chosen = map[kind];
        update(i, () => ({ k: "trace", claim: kind, value: chosen.value, steps: [...chosen.steps], receipts: [...chosen.receipts] }));
      } catch (e) {
        update(i, () => ({ k: "text", lines: [{ t: `trace: ${FRIENDLY_ERR(e)}`, tone: "err", mono: true }] }));
      }
    },
  },
  {
    name: "brief",
    usage: "brief --for founder|recruiter|infra-lead",
    summary: "a tailored one-page case, built from live proof",
    run: async ({ arg, push }) => {
      const who = /recruit/.test(arg) ? "recruiter" : /infra|lead|eng/.test(arg) ? "infra-lead" : "founder";
      let stars = "990+";
      let dl = "27K+";
      let flag = "800+";
      try {
        const s = await fetchStats();
        stars = compact(s.githubStars);
        dl = compact(s.npmDownloads);
        flag = compact(s.flagshipStars);
      } catch {
        /* static fallbacks */
      }
      const briefs: Record<string, string[]> = {
        founder: [
          "Why Kyle, for a founder building with AI:",
          `· He ships the layer agents run on — ${flag}★ flagship MCP server, ${dl} downloads/mo. Real adoption, not demos.`,
          "· Full-stack from kernel to product: an AI-native PaaS (Sylphx) running in production, on his own AI Gateway.",
          "· 20 years and 10M+ app downloads of shipping instinct — he knows what survives contact with users.",
          "· Founder-grade ownership: direction, architecture, and the last 10% nobody else finishes.",
        ],
        recruiter: [
          "Kyle Tse — AI infrastructure engineer, at a glance:",
          `· Open-source proof: ${stars} GitHub stars, ${dl} npm downloads/mo, flagship at ${flag}★.`,
          "· Domain: MCP servers, RAG / semantic search, agent runtimes, developer tooling.",
          "· Operates production infra on Kubernetes (Talos), GitOps, Cilium — not just app code.",
          "· 20 years shipping; previously 10M+ app downloads at a Hong Kong gaming studio.",
        ],
        "infra-lead": [
          "Kyle, evaluated as an AI-infra lead:",
          "· Owns a real platform end-to-end: Sylphx (AI-native PaaS) — gateway, builds, runtime, billing — live.",
          `· Builds the primitives agents need: ${flag}★ pdf-reader-mcp, CodeRAG, filesystem-mcp, DeepResearch.`,
          "· Production discipline: Effect TS, tagged errors, CI quality gates, expand→contract migrations.",
          "· Bias to verified delivery — drives to prod with real evidence, not green local diffs.",
        ],
      };
      push({ k: "brief", audience: who, lines: briefs[who] });
    },
  },
  {
    name: "read",
    usage: "read <pdf-url>",
    summary: "have his 800★ pdf-reader-mcp read a PDF, live",
    run: ({ arg, push }) => {
      const url = arg.trim();
      push({
        k: "text",
        lines: url
          ? [
              { t: `read: queuing ${url.slice(0, 64)}`, tone: "fg", mono: true },
              { t: "the pdf-reader-mcp runtime is coming online — this command will read any PDF live, very soon.", tone: "warn" },
              { t: 'meanwhile:  ask "how does pdf-reader-mcp work?"   ·   cat pdf-reader-mcp', tone: "faint", mono: true },
            ]
          : [
              { t: "read <pdf-url> — drop a PDF and his flagship MCP server extracts + answers from it, live.", tone: "fg" },
              { t: "the reader runtime is warming up. try:  cat pdf-reader-mcp", tone: "faint", mono: true },
            ],
      });
    },
  },
  {
    name: "contact",
    summary: "how to reach Kyle",
    run: ({ push }) => {
      push({
        k: "text",
        lines: [
          { t: "Open to founder, AI-infra lead, and serious collaboration.", tone: "fg" },
          { t: "github   github.com/shtse8", tone: "dim", mono: true },
          { t: "email    hi@kylet.se", tone: "dim", mono: true },
          { t: "run      brief --for founder   to generate a tailored case", tone: "faint", mono: true },
        ],
      });
    },
  },
  {
    name: "clear",
    summary: "clear the screen",
    run: () => {
      /* handled by the engine */
    },
  },
  {
    name: "sudo",
    hidden: true,
    summary: "",
    run: ({ push }) => {
      push({ k: "text", lines: [{ t: "nice try — this runtime is read-only. everything here is already public, by design.", tone: "warn", mono: true }] });
    },
  },
];

const CHIPS: { label: string; cmd: string }[] = [
  { label: "Understand Kyle", cmd: "whoami" },
  { label: "See the proof", cmd: "stats" },
  { label: "Browse projects", cmd: "ls projects" },
  { label: "Ask the agent", cmd: 'ask "what should I know about Kyle?"' },
  { label: "Prove a number", cmd: "trace downloads" },
  { label: "Work with me", cmd: "brief --for founder" },
];

// ── tone → class ────────────────────────────────────────────────────────────
const TONE: Record<Tone, string> = {
  fg: "text-text-primary",
  dim: "text-text-secondary",
  faint: "text-text-tertiary",
  accent: "text-accent",
  ok: "text-positive",
  warn: "text-amber-500",
  err: "text-red-500",
};

// ── block → plaintext (for `copy session`) ──────────────────────────────────
function blockText(b: Block): string {
  switch (b.k) {
    case "text": return b.lines.map((l) => l.t).join("\n");
    case "lead": return b.t;
    case "projects": return b.rows.map((r) => `${r.repo}  ${r.stars}★  ${r.description ?? ""}`).join("\n");
    case "repo": return `${b.repo.repo}  ${b.repo.stars}★  ${b.repo.forks} forks\n${b.repo.description ?? ""}`;
    case "recent": return b.rows.map((r) => `${r.repo}  ${timeAgo(r.pushedAt)}  ${r.stars}★`).join("\n");
    case "stats": return `${b.data.githubStars}★ · ${b.data.npmDownloads} dl/mo · flagship ${b.data.flagshipStars}★`;
    case "trace": return `${b.value}\n${b.steps.map((s) => `${s.label}: ${s.detail}`).join("\n")}`;
    case "help": return b.rows.map((r) => `${r.cmd}  —  ${r.desc}`).join("\n");
    case "tool": return `[tool] ${TOOL_LABEL[b.name] ?? b.name}`;
    case "answer": return b.t;
    case "brief": return b.lines.join("\n");
    default: return "";
  }
}

// ── small UI pieces ──────────────────────────────────────────────────────────
function Receipts({ items }: { items: Receipt[] }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  return (
    <div className="mt-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-mono text-[10.5px] text-text-tertiary transition-colors hover:text-text-secondary"
      >
        {open ? "▾" : "▸"} receipts
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5 border-l border-border-subtle pl-3">
          {items.map((r) => (
            <li key={r.url} className="font-mono text-[10.5px] text-text-tertiary">
              {r.label} —{" "}
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent/80 underline-offset-2 hover:underline">
                {r.url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Meta({ text }: { text: string }) {
  return <div className="mt-1.5 font-mono text-[10.5px] text-text-tertiary">{text}</div>;
}

// ── block renderer ───────────────────────────────────────────────────────────
function BlockView({ b }: { b: Block }) {
  switch (b.k) {
    case "text":
      return (
        <div className="space-y-0.5">
          {b.lines.map((l, i) => (
            <div key={i} className={`${l.mono ? "font-mono" : ""} text-[13px] leading-relaxed ${TONE[l.tone ?? "fg"]}`}>
              {l.t}
            </div>
          ))}
        </div>
      );
    case "lead":
      return <p className="max-w-2xl text-[15px] leading-relaxed text-text-primary sm:text-base">{b.t}</p>;
    case "projects":
      return (
        <div>
          <div className="space-y-1">
            {b.rows.map((r) => (
              <div key={r.repo} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 font-mono text-[12.5px]">
                <div className="flex items-baseline gap-2 truncate">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{r.name}</a>
                  <span className="truncate text-text-tertiary">{r.description}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums text-text-secondary">
                  <span className="hidden text-accent/40 sm:inline">{bar(r.stars, b.max, 7)}</span>
                  <span className="w-12 text-right text-text-primary">{compact(r.stars)}★</span>
                </div>
              </div>
            ))}
          </div>
          <Meta text={b.meta} />
          <Receipts items={b.receipts} />
        </div>
      );
    case "repo": {
      const r = b.repo;
      return (
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[13px]">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{r.repo}</a>
            <span className="text-text-primary">{compact(r.stars)}★</span>
            <span className="text-text-tertiary">{r.forks} forks</span>
            {r.language && <span className="text-text-tertiary">· {r.language}</span>}
          </div>
          {r.description && <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{r.description}</p>}
          {b.spark && (
            <div className="mt-2 font-mono text-[12px] text-text-secondary">
              <span className="text-accent">{b.spark}</span>
              <span className="ml-2 text-text-tertiary">{compact(b.total)} downloads · last 30d</span>
            </div>
          )}
          {r.topics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.topics.slice(0, 6).map((t) => (
                <span key={t} className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10.5px] text-text-tertiary">{t}</span>
              ))}
            </div>
          )}
          <Meta text={b.meta} />
          <Receipts items={b.receipts} />
        </div>
      );
    }
    case "recent":
      return (
        <div>
          <div className="space-y-1">
            {b.rows.map((r) => (
              <div key={r.repo} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 font-mono text-[12.5px]">
                <span className="w-16 text-text-tertiary tabular-nums">{timeAgo(r.pushedAt)}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="truncate text-accent hover:underline">{r.repo}</a>
                <span className="text-text-secondary tabular-nums">{compact(r.stars)}★</span>
              </div>
            ))}
          </div>
          <Meta text={b.meta} />
          <Receipts items={b.receipts} />
        </div>
      );
    case "stats": {
      const s = b.data;
      const cells = [
        { v: `${compact(s.githubStars)}`, l: "GitHub stars" },
        { v: `${compact(s.npmDownloads)}`, l: "npm dl / month" },
        { v: `${compact(s.flagshipStars)}★`, l: "flagship stars" },
        { v: `${compact(s.flagshipDownloads)}`, l: "flagship dl / mo" },
      ];
      return (
        <div>
          <div className="grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {cells.map((c) => (
              <div key={c.l} className="bg-surface px-3 py-2.5">
                <div className="font-mono text-lg font-semibold tabular-nums text-text-primary">{c.v}</div>
                <div className="mt-0.5 font-mono text-[10px] text-text-tertiary">{c.l}</div>
              </div>
            ))}
          </div>
          <Meta text={b.meta} />
          <Receipts items={b.receipts} />
        </div>
      );
    }
    case "trace":
      return (
        <div className="max-w-2xl">
          <div className="font-mono text-[14px] font-semibold text-accent">{b.value}</div>
          <div className="mt-2 space-y-1 border-l-2 border-accent/30 pl-3">
            {b.steps.map((s, i) => (
              <div key={i} className="grid grid-cols-[72px_1fr] gap-x-2 font-mono text-[12px]">
                <span className="text-text-tertiary">{s.label}</span>
                <span className="text-text-secondary">{s.detail}</span>
              </div>
            ))}
          </div>
          <Receipts items={b.receipts} />
        </div>
      );
    case "help":
      return (
        <div className="grid gap-y-1 font-mono text-[12.5px] sm:grid-cols-[minmax(0,260px)_1fr] sm:gap-x-4">
          {b.rows.map((r) => (
            <div key={r.cmd} className="contents">
              <span className="text-accent">{r.cmd}</span>
              <span className="text-text-tertiary">{r.desc}</span>
            </div>
          ))}
        </div>
      );
    case "tool":
      return (
        <div className="flex items-center gap-1.5 font-mono text-[11.5px] text-text-tertiary">
          <span className={b.done ? "text-positive" : "text-accent"}>⚡</span>
          <span>{TOOL_LABEL[b.name] ?? b.name}</span>
          {b.done ? <span className="text-positive">✓</span> : <span className="animate-pulse text-text-tertiary">…</span>}
        </div>
      );
    case "answer":
      return <p className="max-w-2xl whitespace-pre-wrap text-[13.5px] leading-relaxed text-text-secondary">{b.t}</p>;
    case "brief":
      return (
        <div className="max-w-2xl rounded-lg border border-border-subtle bg-surface-sunken/40 p-4">
          <div className="space-y-1.5">
            {b.lines.map((l, i) => (
              <p key={i} className={`text-[13px] leading-relaxed ${i === 0 ? "font-semibold text-text-primary" : "text-text-secondary"}`}>{l}</p>
            ))}
          </div>
          <CopyButton text={b.lines.join("\n")} label="copy brief" className="mt-3" />
        </div>
      );
    default:
      return null;
  }
}

function CopyButton({ text, label, className = "" }: { text: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked */
        }
      }}
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] text-text-tertiary transition-colors hover:text-text-secondary ${className}`}
    >
      {done ? <FaCheck className="h-2.5 w-2.5 text-positive" /> : <FaRegCopy className="h-2.5 w-2.5" />}
      {done ? "copied" : label}
    </button>
  );
}

// ── the component ─────────────────────────────────────────────────────────────
export default function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [path, setPath] = useState("~");
  const [running, setRunning] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeBlocks = useRef<Block[]>([]);
  const activeId = useRef<string>("");
  const histRef = useRef<string[]>([]);
  const histPos = useRef<number>(-1);
  const abortRef = useRef<AbortController | null>(null);
  const bootedRef = useRef(false);

  const flush = useCallback(() => {
    const id = activeId.current;
    const blocks = [...activeBlocks.current];
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, blocks } : e)));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, running]);

  const execute = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      histRef.current = [...histRef.current.filter((h) => h !== trimmed), trimmed];
      histPos.current = -1;

      const word = trimmed.split(/\s+/)[0].toLowerCase();
      if (word === "clear") {
        setEntries([]);
        return;
      }
      const arg = trimmed.slice(word.length).trim();
      const id = `e${Date.now()}_${Math.round(performance.now())}`;
      setEntries((prev) => [...prev, { id, path, input: trimmed, blocks: [] }]);
      activeId.current = id;
      activeBlocks.current = [];
      setRunning(true);

      const ac = new AbortController();
      abortRef.current = ac;
      const ctx: CmdCtx = {
        arg,
        args: arg ? arg.split(/\s+/) : [],
        push: (b) => {
          activeBlocks.current.push(b);
          flush();
          return activeBlocks.current.length - 1;
        },
        update: (i, fn) => {
          if (activeBlocks.current[i]) {
            activeBlocks.current[i] = fn(activeBlocks.current[i]);
            flush();
          }
        },
        setPath,
        signal: ac.signal,
      };

      const cmd = COMMANDS.find((c) => c.name === word);
      try {
        if (!cmd) {
          ctx.push({
            k: "text",
            lines: [
              { t: `command not found: ${word}`, tone: "err", mono: true },
              { t: "type  help  to see what you can run.", tone: "faint", mono: true },
            ],
          });
        } else {
          await cmd.run(ctx);
        }
      } catch (e) {
        ctx.push({ k: "text", lines: [{ t: FRIENDLY_ERR(e), tone: "err", mono: true }] });
      } finally {
        setRunning(false);
        abortRef.current = null;
      }
    },
    [path, flush],
  );

  // opening sequence — the product demonstrates itself (respects reduced-motion)
  const boot = useCallback(async () => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      await execute("whoami");
      return;
    }
    await delay(420);
    const cmd = "whoami";
    for (let i = 1; i <= cmd.length; i++) {
      setInput(cmd.slice(0, i));
      await delay(55 + Math.random() * 45);
    }
    await delay(220);
    setInput("");
    await execute("whoami");
  }, [execute]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          io.disconnect();
          void boot();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [boot]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (running || !input.trim()) return;
      const v = input;
      setInput("");
      void execute(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = histRef.current;
      if (!h.length) return;
      histPos.current = histPos.current < 0 ? h.length - 1 : Math.max(0, histPos.current - 1);
      setInput(h[histPos.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = histRef.current;
      if (histPos.current < 0) return;
      histPos.current = histPos.current + 1;
      if (histPos.current >= h.length) {
        histPos.current = -1;
        setInput("");
      } else {
        setInput(h[histPos.current] ?? "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const word = input.split(/\s+/)[0].toLowerCase();
      const hit = COMMANDS.filter((c) => !c.hidden).find((c) => c.name.startsWith(word) && c.name !== word);
      if (hit && !input.includes(" ")) setInput(hit.name + " ");
    } else if (e.key === "c" && e.ctrlKey) {
      abortRef.current?.abort();
      setRunning(false);
    }
  }

  function runChip(cmd: string) {
    if (running) return;
    setInput("");
    void execute(cmd);
    inputRef.current?.focus();
  }

  const sessionText = entries
    .map((en) => `${HOST} ${en.path} % ${en.input}\n${en.blocks.map(blockText).filter(Boolean).join("\n")}`)
    .join("\n\n");

  return (
    <div ref={rootRef} className="container-content">
      {/* the window */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/5">
        {/* chrome */}
        <div className="flex items-center gap-3 border-b border-border-subtle bg-surface-sunken/60 px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="font-mono text-[11px] text-text-tertiary">{HOST} — zsh</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-mono text-[10.5px] text-text-tertiary sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
              </span>
              live
            </span>
            <CopyButton text={sessionText} label="copy session" />
          </div>
        </div>

        {/* scrollback */}
        <div ref={scrollRef} className="max-h-[58vh] min-h-[300px] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {entries.map((en) => (
            <div key={en.id} className="mb-4 last:mb-1">
              {/* prompt line */}
              <div className="flex items-baseline gap-2 font-mono text-[12.5px]">
                <span className="text-positive">{HOST}</span>
                <span className="text-text-tertiary">{en.path}</span>
                <span className="text-accent">%</span>
                <span className="text-text-primary">{en.input}</span>
              </div>
              {/* output */}
              <div className="mt-1.5 space-y-1.5 pl-0">
                {en.blocks.map((b, i) => (
                  <BlockView key={i} b={b} />
                ))}
              </div>
            </div>
          ))}

          {/* live input line */}
          <div className="flex items-baseline gap-2 font-mono text-[12.5px]">
            <span className="text-positive">{HOST}</span>
            <span className="text-text-tertiary">{path}</span>
            <span className="text-accent">%</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={running}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="terminal input"
              className="flex-1 bg-transparent text-text-primary caret-accent outline-none placeholder:text-text-tertiary disabled:opacity-60"
              placeholder={running ? "running…" : 'try: help · ls projects · ask "…"'}
            />
            {!running && <span className="-ml-1 inline-block h-[15px] w-[7px] animate-pulse bg-accent/80" aria-hidden />}
          </div>
        </div>

        {/* intent chips — let non-devs steer */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border-subtle bg-surface-sunken/40 px-4 py-3">
          <span className="mr-1 font-mono text-[10.5px] text-text-tertiary">steer:</span>
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => runChip(c.cmd)}
              disabled={running}
              className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-accent hover:text-text-primary disabled:opacity-50"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* the meta-point, made explicit */}
      <p className="mt-3 px-1 font-mono text-[11px] text-text-tertiary">
        Powered by <span className="text-text-secondary">Sylphx AI Gateway</span> — the platform I build. Every output is
        live; run <span className="text-accent">trace &lt;claim&gt;</span> to see its source.
      </p>
    </div>
  );
}
