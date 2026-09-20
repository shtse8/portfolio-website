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
  /** GitHub archived flag (synced snapshot; live API may omit). */
  archived?: boolean;
}

export interface TermStats {
  /** null when the API reports `absent` — no verified measurement exists. */
  githubStars: number | null;
  npmDownloads: number | null;
  flagshipStars: number | null;
  flagshipDownloads: number | null;
  byOwner: Record<string, number>;
  repos: number | null;
  updatedAt: string;
  /**
   * Observation time for the live/stale ladder (same instant as updatedAt on
   * live). null once the API admits it never observed a value.
   */
  verifiedAt?: string | null;
  /** True when the API served a previously verified snapshot. */
  stale?: boolean;
  /** `live` | `stale` | `absent` | `unavailable` | `not_observed` when the API reports it. */
  freshness?: string;
  /** `github-public` | `github-public-stale` | `github-public-absent` | … */
  source?: string;
}

/** Freshness values that must never be rendered as a live measurement. */
const NON_LIVE_FRESHNESS = new Set([
  "stale",
  "absent",
  "unavailable",
  "not_observed",
]);

/**
 * True only when a `/stats` payload is a real live measurement. A fail-soft
 * payload (stale/absent) is still worth rendering as an instrument, but it must
 * never be counted as a live fetch.
 */
export function statsAreLive(stats: TermStats | null): boolean {
  if (!stats) return false;
  if (stats.stale === true) return false;
  if (stats.freshness && NON_LIVE_FRESHNESS.has(stats.freshness)) return false;
  return typeof stats.githubStars === "number";
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const fetchProjects = (limit = 12, signal?: AbortSignal) =>
  get<{ projects: TermRepo[]; updatedAt: string }>(
    `/projects?limit=${limit}`,
    signal,
  );
export const fetchRepo = (name: string, signal?: AbortSignal) =>
  get<{ repo: TermRepo; updatedAt: string }>(
    `/repo?name=${encodeURIComponent(name)}`,
    signal,
  );
export const fetchRecent = (limit = 6, signal?: AbortSignal) =>
  get<{ recent: TermRepo[]; updatedAt: string }>(
    `/recent?limit=${limit}`,
    signal,
  );
export const fetchStats = (signal?: AbortSignal) =>
  get<TermStats>(`/stats`, signal);
export const fetchDownloads = (pkg: string, signal?: AbortSignal) =>
  get<{
    pkg: string;
    series: { day: string; downloads: number }[];
    total: number;
    updatedAt: string;
  }>(`/downloads?pkg=${encodeURIComponent(pkg)}`, signal);

// ── formatting helpers ──────────────────────────────────────────────────────
const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
/** "27038" → "27K" via the built-in Intl compact notation (no hand-rolled math). */
export const compact = (n: number): string => compactFmt.format(n);

/** Compact figure, or an em dash when the API never verified a number. */
export const compactOrDash = (n: number | null | undefined): string =>
  typeof n === "number" ? compactFmt.format(n) : "—";

const SPARK = "▁▂▃▄▅▆▇█";
/** Render a daily series as a unicode sparkline string. */
export function sparkline(values: number[]): string {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map(
      (v) =>
        SPARK[
          Math.min(
            SPARK.length - 1,
            Math.round(((v - min) / span) * (SPARK.length - 1)),
          )
        ],
    )
    .join("");
}

/** Human relative time, e.g. "3 hours ago" — date-fns, not hand-rolled date math. */
export function timeAgo(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : formatDistanceToNowStrict(d, { addSuffix: true });
}
