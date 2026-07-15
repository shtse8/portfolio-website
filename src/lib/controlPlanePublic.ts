/**
 * Control Plane Public Profile client (anonymous).
 *
 * Development activity authority is the CP public projection — not the
 * website-owned GitHub `/activity` dual authority. No CP credentials ever
 * embed in the browser; this surface is public GET only.
 */

export const CP_PUBLIC_BASE = (
  process.env.NEXT_PUBLIC_CP_PUBLIC_BASE ??
  process.env.NEXT_PUBLIC_CONTROL_PLANE_PUBLIC_BASE ??
  ""
).replace(/\/$/, "");

export const CP_PUBLIC_PROFILE_SLUG =
  process.env.NEXT_PUBLIC_CP_PUBLIC_PROFILE_SLUG ?? "kyle";

export const HAS_CP_PUBLIC = CP_PUBLIC_BASE.length > 0;

export type CpPublicSummary = {
  schema_version?: string;
  projection_revision?: string;
  as_of?: string;
  generated_at?: string;
  freshness?: { state?: string };
  summary?: {
    commits_landed?: {
      today?: number;
      d7?: number;
      d30?: number;
      prior_day_matched_elapsed?: number;
      d30_is_not_week_times_four?: boolean;
    };
    work_done?: { count?: number };
    projects_active?: { count?: number };
    delivery?: {
      merged?: number;
      deployed?: number;
      production_proven?: number;
    };
    label?: string;
  };
  error?: { message?: string };
};

/** Map CP public summary → LiveTicker-compatible activity view model. */
export function mapCpSummaryToActivity(s: CpPublicSummary): {
  commitsToday: number;
  commitsWeek: number;
  commitsMonth: number;
  reposActiveToday: number;
  lastPush: { repo: string; ago: string } | null;
  source: "control-plane-public";
  freshness?: string;
  asOf?: string;
  revision?: string;
  /** Never week×4 — true 30d series count from CP. */
  d30IsNotWeekTimesFour: boolean;
} {
  const c = s.summary?.commits_landed ?? {};
  const today = Number(c.today ?? 0);
  const d7 = Number(c.d7 ?? 0);
  const d30 = Number(c.d30 ?? 0);
  return {
    commitsToday: today,
    commitsWeek: d7,
    commitsMonth: d30,
    reposActiveToday: Number(s.summary?.projects_active?.count ?? 0),
    lastPush: null,
    source: "control-plane-public",
    freshness: s.freshness?.state,
    asOf: s.as_of,
    revision: s.projection_revision,
    d30IsNotWeekTimesFour: c.d30_is_not_week_times_four !== false,
  };
}

export async function fetchCpPublicSummary(
  signal?: AbortSignal,
): Promise<CpPublicSummary | null> {
  if (!HAS_CP_PUBLIC) return null;
  const url = `${CP_PUBLIC_BASE}/api/public/v1/profiles/${encodeURIComponent(CP_PUBLIC_PROFILE_SLUG)}/summary`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal,
    // Public projection is CDN-cacheable; browser respects ETag via fetch defaults on revalidation.
    cache: "no-cache",
  });
  if (!res.ok) return null;
  return (await res.json()) as CpPublicSummary;
}

/** Regression guards used by unit tests. */
export function assertHonestWindows(activity: {
  commitsWeek: number;
  commitsMonth: number;
  d30IsNotWeekTimesFour: boolean;
}): void {
  if (!activity.d30IsNotWeekTimesFour) {
    throw new Error("d30 must not be derived as week×4");
  }
  if (activity.commitsMonth === activity.commitsWeek * 4 && activity.commitsWeek > 0) {
    // Statistically possible but treat equality with week×4 as a red flag in tests with fixtures.
    throw new Error("commitsMonth equals commitsWeek×4 — likely dual-authority bug");
  }
}
