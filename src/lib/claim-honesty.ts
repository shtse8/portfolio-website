/**
 * WEB-SITE claim honesty — live instruments vs career pedigree.
 *
 * GitHub/npm figures may use freshness=live|stale|unavailable.
 * Career-scale figures are self-attested historical pedigree and must
 * never borrow live-instrument vocabulary.
 */

export type ClaimHonesty = "live-measured" | "self-attested";

export const SELF_ATTESTED_HISTORICAL = "self-attested historical pedigree";

export function careerScaleCaption(label: string): string {
  return `${label} · ${SELF_ATTESTED_HISTORICAL}`;
}

/** Visitor-visible Story headlines that include career-scale figures. */
export const STORY_SCALE_HEADLINES = {
  "minimax-ceo": careerScaleCaption("Facebook games at 10M scale"),
  "cubeage-founder": careerScaleCaption("25+ games, 10M downloads"),
} as const;
