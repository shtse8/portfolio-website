/**
 * Design Tokens
 * Modern Minimal Design System
 *
 * Use these constants for consistent styling across components.
 * Prefer CSS variables for colors (they support dark mode).
 */

// Spacing scale (in rem, base unit = 4px)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

// Section padding - use this for consistent vertical rhythm
export const sectionPadding = 'py-24'; // 96px top and bottom

// Container width - use this for consistent content width
export const containerWidth = 'max-w-5xl'; // 1024px

// Typography scale
export const fontSize = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl',  // 36px
  '5xl': 'text-5xl',  // 48px
} as const;

// Font weights - only these two
export const fontWeight = {
  normal: 'font-normal',   // 400
  medium: 'font-medium',   // 500
} as const;

// Border radius
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',       // 4px
  DEFAULT: 'rounded',     // 6px
  md: 'rounded-md',       // 8px
  lg: 'rounded-lg',       // 12px
  xl: 'rounded-xl',       // 16px
  full: 'rounded-full',
} as const;

// Transition durations
export const transition = {
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
} as const;

// Animation variants for Framer Motion
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
} as const;

// Common component styles
export const componentStyles = {
  // Section container
  section: 'py-24 px-6',
  container: 'max-w-5xl mx-auto px-4 sm:px-6',

  // Cards
  card: 'bg-surface border border-border rounded-lg hover:shadow-md transition-shadow duration-150',

  // Buttons
  buttonPrimary: 'inline-flex items-center justify-center px-4 py-2 bg-accent text-white font-medium text-sm rounded-md hover:bg-accent-hover transition-colors duration-150',
  buttonSecondary: 'inline-flex items-center justify-center px-4 py-2 bg-surface text-text-primary font-medium text-sm border border-border rounded-md hover:bg-surface-elevated transition-colors duration-150',
  buttonGhost: 'inline-flex items-center justify-center px-4 py-2 text-text-secondary font-medium text-sm rounded-md hover:text-text-primary hover:bg-surface transition-colors duration-150',

  // Links
  link: 'text-accent hover:text-accent-hover underline-offset-4 hover:underline transition-colors duration-150',

  // Form inputs
  input: 'w-full px-3 py-2 text-base bg-surface border border-border rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-150',
} as const;
