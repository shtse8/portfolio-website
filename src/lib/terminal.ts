/**
 * Terminal data layer — typed fetchers against kylet-api's live endpoints.
 *
 * Every command in <Terminal> reads from here, so the terminal operates on the
 * exact same live GitHub/npm truth the agent uses. Nothing is hard-coded; if a
 * number shows up, it came back from a real fetch in the last few seconds — that
 * is the whole point ("nothing here is a claim").
 */
import { API_BASE } from "./api";

export interface TermRepo {
  repo: string;
  name: string;
  owner: string;
  stars: number;
  forks: number;
  description: string | null;
  language: string | null;
  topics: string[];
  homepage: string | null;
  url: string;
  pushed: string;
  pushedAt: string;
}

export interface TermStats {
  githubStars: number;
  npmDownloads: number;
  flagshipStars: number;
  flagshipDownloads: number;
  byOwner: Record<string, number>;
  repos: number;
  updatedAt: string;
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { accept: "application/json" }, signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const fetchProjects = (limit = 12, signal?: AbortSignal) =>
  get<{ projects: TermRepo[]; updatedAt: string }>(`/projects?limit=${limit}`, signal);
export const fetchRepo = (name: string, signal?: AbortSignal) =>
  get<{ repo: TermRepo; updatedAt: string }>(`/repo?name=${encodeURIComponent(name)}`, signal);
export const fetchRecent = (limit = 6, signal?: AbortSignal) =>
  get<{ recent: TermRepo[]; updatedAt: string }>(`/recent?limit=${limit}`, signal);
export const fetchStats = (signal?: AbortSignal) => get<TermStats>(`/stats`, signal);
export const fetchDownloads = (pkg: string, signal?: AbortSignal) =>
  get<{ pkg: string; series: { day: string; downloads: number }[]; total: number; updatedAt: string }>(
    `/downloads?pkg=${encodeURIComponent(pkg)}`,
    signal,
  );

// ── formatting helpers ──────────────────────────────────────────────────────
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}

const SPARK = "▁▂▃▄▅▆▇█";
/** Render a daily series as a unicode sparkline string. */
export function sparkline(values: number[]): string {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v) => SPARK[Math.min(SPARK.length - 1, Math.round(((v - min) / span) * (SPARK.length - 1)))])
    .join("");
}

/** Honest, terse relative time — the terminal never rounds away latency. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!then) return "—";
  const s = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** A bar bullet sized to a value relative to a max — for the `ls`/`stats` views. */
export function bar(value: number, max: number, width = 8): string {
  const filled = Math.max(value > 0 ? 1 : 0, Math.round((value / (max || 1)) * width));
  return "▓".repeat(Math.min(width, filled)) + "░".repeat(Math.max(0, width - filled));
}
