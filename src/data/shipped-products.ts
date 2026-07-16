/**
 * Complete shipped-products surface for games / web products.
 * Derived from PROJECTS + best local screenshot choices (not a random 6-item sample).
 */
import { getOrganization } from "@/data/organizations";
import { PROJECTS } from "@/data/projects";
import { getRole } from "@/data/roles";
import type { Project } from "@/data/types";

export type ShippedProduct = {
  id: string;
  title: string;
  description: string;
  details: string[];
  category: string;
  era: string;
  image: string;
  /** CSS object-position for awkward screenshots */
  objectPosition?: string;
  skills: string[];
  urls?: Project["urls"];
  role?: string;
};

/** Prefer larger / cleaner shots over the default 1.* when known. */
const IMAGE_OVERRIDE: Record<string, string> = {
  "attack-garbage-man": "/projects/attack-garbage-man/3.png",
  "big2-tycoon-2": "/projects/big2-tycoon-2/2.png",
  "big2-tycoon-taiwan": "/projects/big2-tycoon-taiwan/4.png",
  "blackjack-king": "/projects/blackjack-king/1.png",
  "blackjack-showdown": "/projects/blackjack-showdown/5.png",
  "fun-big2": "/projects/fun-big2/3.jpg",
  "fun-big2-taiwan": "/projects/fun-big2-taiwan/1.png",
  "fun-mahjong-16-tiles": "/projects/fun-mahjong-16-tiles/1.jpg",
  "fun-showhand": "/projects/fun-showhand/1.png",
  "fun-texas-holdem": "/projects/fun-texas-holdem/1.png",
  "hk-mahjong-tycoon": "/projects/hk-mahjong-tycoon/1.jpg",
  ipet: "/projects/ipet/1.jpg",
  landlord: "/projects/landlord/1.png",
  "math-genius": "/projects/math-genius/5.png",
  "math-magus": "/projects/math-magus/2.jpg",
  "q-mahjong": "/projects/q-mahjong/6.png",
  "royal-cube": "/projects/royal-cube/3.jpg",
  "run-garbage-man": "/projects/run-garbage-man/4.png",
  "spot-the-difference": "/projects/spot-the-difference/1.png",
  "taiwan-mahjong-tycoon": "/projects/taiwan-mahjong-tycoon/4.png",
  "taiwan-mahjong-tycoon-2": "/projects/taiwan-mahjong-tycoon-2/2.png",
  fmj: "/projects/fmj/1.jpg",
  "big2-tycoon": "/projects/big2-tycoon/1.jpg",
  nakuz: "/projects/nakuz/1.jpg",
  cubeage: "/projects/cubeage/1.jpg",
  "happy-coin-pusher": "/projects/happy-coin-pusher/1.jpg",
  "google-photos-delete": "/projects/google-photos-delete/1.jpg",
  "media-organizer": "/projects/media-organizer/1.jpg",
};

/** Nudge framing for screenshots that crop poorly at center. */
const OBJECT_POSITION: Record<string, string> = {
  funimax: "center top",
  anymud: "center center",
  "happy-coin-pusher": "center top",
  "fun-mahjong-16-tiles": "center top",
  ipet: "center top",
};

const INCLUDE_CATEGORIES = new Set([
  "Mobile Games",
  "Web Apps",
  "Tools & Utilities",
]);

function firstImage(p: Project): string | null {
  if (IMAGE_OVERRIDE[p.id]) return IMAGE_OVERRIDE[p.id];
  if (p.images && p.images.length > 0) {
    const img = p.images[0];
    // images may be string or object — data uses string paths mostly
    if (typeof img === "string") return img;
  }
  return null;
}

function detailsList(p: Project): string[] {
  if (Array.isArray(p.details)) return p.details.slice(0, 6);
  if (typeof p.details === "string" && p.details.trim()) return [p.details];
  return [];
}

/**
 * Full shipped catalog for the products section.
 * Skips entries with no usable local screenshot (tiny banners etc. stay out
 * unless we have a real asset path).
 */
export function getShippedProducts(): ShippedProduct[] {
  const out: ShippedProduct[] = [];
  for (const p of PROJECTS) {
    if (!INCLUDE_CATEGORIES.has(p.category)) continue;
    // Skip pure OSS-adjacent tools without product screenshots intent
    if (p.category === "Tools & Utilities" && !firstImage(p)) continue;
    const image = firstImage(p);
    if (!image) continue;
    // Skip known unusable tiny banners unless overridden with something better
    if (p.id === "funimax" || p.id === "anymud") continue;

    const role = p.roleId ? getRole(p.roleId) : undefined;
    const org = role
      ? getOrganization(role.organizationId)
      : p.organizationId
        ? getOrganization(p.organizationId)
        : undefined;
    out.push({
      id: p.id,
      title: p.title,
      description: p.description,
      details: detailsList(p),
      category: p.category,
      era: org?.name ?? p.category,
      image,
      objectPosition: OBJECT_POSITION[p.id],
      skills: p.skills?.slice(0, 6) ?? [],
      urls: p.urls,
      role: p.role,
    });
  }
  // Stable order: Mobile Games first (by title), then Web Apps, then tools
  const rank = (c: string) =>
    c === "Mobile Games" ? 0 : c === "Web Apps" ? 1 : 2;
  out.sort((a, b) => rank(a.category) - rank(b.category) || a.title.localeCompare(b.title));
  return out;
}

export const SHIPPED_PRODUCTS = getShippedProducts();
