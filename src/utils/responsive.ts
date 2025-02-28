// Responsive utility functions
import { RefObject } from 'react';

/**
 * Check if the current viewport is mobile or narrow width
 * @param maxWidth Maximum width in pixels to consider as mobile (default: 768px)
 * @returns boolean indicating if the device is mobile/narrow
 */
export const isMobileViewport = (maxWidth = 768): boolean => {
  if (typeof window === 'undefined') return false; // Server-side rendering check
  return window.innerWidth <= maxWidth;
};

/**
 * Tailwind CSS class helper for responsive styling
 * @param mobileClasses Classes to apply on mobile
 * @param desktopClasses Classes to apply on desktop
 * @returns Combined responsive class string
 */
export const responsiveClasses = (mobileClasses: string, desktopClasses: string): string => {
  return `${mobileClasses} md:${desktopClasses}`;
};

/**
 * TypeScript helper for handling potentially null refs in components
 */
export type OptionalRef<T> = RefObject<T> | RefObject<T | null>; 