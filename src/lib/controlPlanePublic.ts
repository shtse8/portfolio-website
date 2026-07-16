/**
 * Browser-direct Control Plane access is retired.
 *
 * Single metric authority cutover (ADR-0006):
 * - Browser → same-origin BFF `/activity` only
 * - BFF → Control Plane authenticated projection (or public expand-contract)
 * - Never embed CP URL/token in the browser (`NEXT_PUBLIC_CP_*` must not be used)
 *
 * Mapping helpers remain for unit tests / offline gates that assert honest
 * d7/d30 windows (no week×4). LiveTicker must not import fetchCpPublicSummary.
 *
 * Intentionally no NEXT_PUBLIC_CP_*, Control Plane host defaults, or personal
 * slug fallbacks — those belong only on the server-side BFF via env.
 */

/** Always empty in browser builds — CP base is server-only. */
export const CP_PUBLIC_BASE = "";

/** No browser slug; BFF requires CP_PUBLIC_PROFILE_SLUG / CP_PROJECTION_ID. */
export const CP_PUBLIC_PROFILE_SLUG = "";

/** Always treat browser CP path as disabled. */
export const HAS_CP_PUBLIC = false;

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

/** Map CP summary → activity view model (test/BFF-parity helper only). */
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

/**
 * Browser must not call Control Plane. Always returns null.
 * Kept so accidental imports fail closed without network.
 */
export async function fetchCpPublicSummary(
  _signal?: AbortSignal,
): Promise<CpPublicSummary | null> {
  return null;
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
    throw new Error("commitsMonth equals commitsWeek×4 — likely dual-authority bug");
  }
}
