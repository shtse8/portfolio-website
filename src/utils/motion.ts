/**
 * Motion utilities for accessibility-aware animations
 */

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation variants that respect user's motion preferences
 */
export const getAccessibleVariants = <T extends Record<string, any>>(
  variants: T,
  reducedVariants?: Partial<T>
): T => {
  if (prefersReducedMotion() && reducedVariants) {
    return { ...variants, ...reducedVariants } as T;
  }
  return variants;
};

/**
 * Get transition duration that respects user's motion preferences
 */
export const getAccessibleDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0.01 : duration;
};

/**
 * Common animation variants
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: getAccessibleDuration(0.3)
    }
  }
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAccessibleDuration(0.4)
    }
  }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : 0.1,
      delayChildren: prefersReducedMotion() ? 0 : 0.1
    }
  }
};
