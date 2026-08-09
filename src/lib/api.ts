/**
 * Base URL for the portfolio BFF (Rust `api-rust`).
 *
 * Empty string = same-origin relative paths (`/activity`, `/chat`, `/stats`, …)
 * when nginx (or the platform gateway) proxies those routes to the API service.
 *
 * Default is always same-origin. `NEXT_PUBLIC_API_BASE` may override for local
 * dev against a remote API host, but must **never** point at Control Plane —
 * the browser talks only to this BFF (or a BFF proxy).
 */
const DEFAULT_API_BASE = "";
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_API_BASE
).replace(/\/$/, "");

/**
 * Same-origin (empty base) still has a BFF. Set NEXT_PUBLIC_DISABLE_API=1 to
 * force live features off (local static preview without API).
 */
export const HAS_API = process.env.NEXT_PUBLIC_DISABLE_API !== "1";
