/**
 * Performance utilities for React components
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to log component render performance in development
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(0);

  if (process.env.NODE_ENV === 'development') {
    renderCount.current += 1;
    startTime.current = performance.now();
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;

      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(
          `⚠️ ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        );
      }
    }
  });
}

/**
 * Debounce function for event handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
