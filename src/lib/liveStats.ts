"use client";

import { useEffect, useState } from "react";
import { API_BASE, HAS_API } from "./api";

/** Shape returned by kylet-api `GET /stats`. */
export interface LiveStats {
  githubStars: number;
  npmDownloads: number;
  flagshipStars: number;
  flagshipDownloads: number;
  byOwner?: Record<string, number>;
  repos?: number;
  updatedAt?: string;
}

/**
 * Fetch the live GitHub + npm numbers once on mount. Returns null until loaded
 * (callers fall back to the baked STATS), so the site always shows a number and
 * upgrades to the live one when it arrives — no rebuild, no manual edit.
 */
export function useLiveStats(): LiveStats | null {
  const [stats, setStats] = useState<LiveStats | null>(null);
  useEffect(() => {
    if (!HAS_API) return;
    let alive = true;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    fetch(`${API_BASE}/stats`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.githubStars === "number") setStats(d as LiveStats);
      })
      .catch(() => {})
      .finally(() => clearTimeout(t));
    return () => {
      alive = false;
      ctrl.abort();
    };
  }, []);
  return stats;
}

/** Compact display: exact (comma-grouped) below 10k, else `N.NK`. */
export function formatCompact(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n < 10_000) return n.toLocaleString("en-US");
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 100_000 ? 1 : 0)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/**
 * Resolve a STATS id to its live display string when we have fresh data,
 * otherwise fall back to the baked `display`. Keeps the single-source-of-truth
 * labels while letting the numbers self-update.
 */
export function liveDisplay(id: string, live: LiveStats | null, fallback: string): string {
  if (!live) return fallback;
  switch (id) {
    case "stars":
      return live.githubStars > 0 ? formatCompact(live.githubStars) : fallback;
    case "npm-downloads":
      return live.npmDownloads > 0 ? `${formatCompact(live.npmDownloads)}` : fallback;
    case "flagship-stars":
      return live.flagshipStars > 0 ? formatCompact(live.flagshipStars) : fallback;
    case "flagship-downloads":
      return live.flagshipDownloads > 0 ? formatCompact(live.flagshipDownloads) : fallback;
    default:
      return fallback;
  }
}
