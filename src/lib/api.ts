/**
 * Base URL for kylet-api (the Sylphx-hosted backend that powers live stats +
 * the AI chat). Baked at build time from NEXT_PUBLIC_API_BASE. When unset, the
 * live features degrade gracefully — the site falls back to the build-time
 * STATS numbers and the chat stays hidden.
 */
// Default points at the deployed kylet-api service (the portfolio project's 2nd
// service on Sylphx). Overridable at build time via NEXT_PUBLIC_API_BASE.
const DEFAULT_API_BASE = "https://slim-pal-0k3stq.sylphx.app";
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_API_BASE).replace(/\/$/, "");
export const HAS_API = API_BASE.length > 0;
