import { SECTION_IDS, URL_SECTION_IDS } from '@/config/sections';

/**
 * Application-wide constants (derived from centralized config)
 * This file can be imported by both client and server components
 */

// Keep backwards-compatible named exports derived from centralized config (widened to string[] for TS compatibility)
export const VALID_SECTIONS: string[] = [...SECTION_IDS];
export const VALID_URL_SECTIONS: string[] = [...URL_SECTION_IDS];