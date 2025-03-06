/**
 * Application-wide constants
 * This file can be imported by both client and server components
 */

// List of all valid sections in the application
export const VALID_SECTIONS = ['hero', 'tech-stack', 'philosophy', 'projects', 'experience', 'contact'];

// List of valid sections for URLs (excluding hero, which is the home page)
export const VALID_URL_SECTIONS = VALID_SECTIONS.filter(section => section !== 'hero'); 