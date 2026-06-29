/**
 * Terminal data layer — typed fetchers against kylet-api's live endpoints.
 *
 * Every command in <Terminal> reads from here, so the terminal operates on the
 * exact same live GitHub/npm truth the agent uses. Nothing is hard-coded; if a
 * number shows up, it came back from a real fetch in the last few seconds — that
 * is the whole point ("nothing here is a claim").
 */
import { formatDistanceToNowStrict } from "date-fns";
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
const compactFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
/** "27038" → "27K" via the built-in Intl compact notation (no hand-rolled math). */
export const compact = (n: number): string => compactFmt.format(n);

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

/** Human relative time, e.g. "3 hours ago" — date-fns, not hand-rolled date math. */
export function timeAgo(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : formatDistanceToNowStrict(d, { addSuffix: true });
}

