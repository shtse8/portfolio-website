/**
 * Hero proof-board freshness — KYLE-INSTRUMENTS.
 *
 * Changing GitHub/npm figures on the hero board are instruments, not vanity.
 * Baked or cached numbers may stay on screen, but they cannot be labelled live.
 * Vocabulary is live | stale | unavailable, always with an observation time
 * when a verified value is shown.
 */
export type ProofFreshness = "live" | "stale" | "unavailable";

export interface ProofBoardStats {
  updatedAt?: string;
  stale?: boolean;
  freshness?: string;
}

export interface ProofBoardInput {
  /** WorkGraph `live`: true once at least one live fetch landed. */
  live: boolean;
  stats: ProofBoardStats | null;
  bakedVerifiedAt?: string | null;
}

export interface ProofBoardObservation {
  freshness: ProofFreshness;
  observedAt: string | null;
}

const NON_LIVE_FRESHNESS = new Set(["stale", "unavailable", "not_observed"]);

/** RFC3339 UTC without fractional seconds, or null if unparseable. */
export function normalizeObservationTime(
  iso: string | null | undefined,
): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function statsMayClaimLive(stats: ProofBoardStats): boolean {
  if (stats.stale === true) return false;
  if (stats.freshness && NON_LIVE_FRESHNESS.has(stats.freshness)) return false;
  return Boolean(normalizeObservationTime(stats.updatedAt));
}

/**
 * Derive the hero proof-board freshness label and observation time.
 *
 * Oracle: when WorkGraph `live` is false the board never claims live.
 * The baked path is stale and surfaces `verifiedAt`.
 */
export function proofBoardObservation(
  input: ProofBoardInput,
): ProofBoardObservation {
  const bakedAt = normalizeObservationTime(input.bakedVerifiedAt);
  const statsAt = input.stats
    ? normalizeObservationTime(input.stats.updatedAt)
    : null;
  const observedFallback = statsAt ?? bakedAt;

  if (input.live && input.stats && statsMayClaimLive(input.stats)) {
    return { freshness: "live", observedAt: statsAt };
  }

  if (observedFallback) {
    return { freshness: "stale", observedAt: observedFallback };
  }

  return { freshness: "unavailable", observedAt: null };
}

export function proofBoardDotClass(freshness: ProofFreshness): string {
  if (freshness === "live") return "bg-positive";
  if (freshness === "stale") return "bg-amber-400";
  return "bg-text-tertiary";
}
