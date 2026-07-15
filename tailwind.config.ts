import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        surface: "oklch(var(--surface) / <alpha-value>)",
        "surface-elevated": "oklch(var(--surface-elevated) / <alpha-value>)",
        "surface-sunken": "oklch(var(--surface-sunken) / <alpha-value>)",
        border: "oklch(var(--border) / <alpha-value>)",
        "border-subtle": "oklch(var(--border-subtle) / <alpha-value>)",

        "text-primary": "oklch(var(--text-primary) / <alpha-value>)",
        "text-secondary": "oklch(var(--text-secondary) / <alpha-value>)",
        "text-tertiary": "oklch(var(--text-tertiary) / <alpha-value>)",

        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          hover: "oklch(var(--accent-hover) / <alpha-value>)",
          subtle: "oklch(var(--accent-subtle) / <alpha-value>)",
          contrast: "oklch(var(--accent-contrast) / <alpha-value>)",
        },
        positive: {
          DEFAULT: "oklch(var(--positive) / <alpha-value>)",
          subtle: "oklch(var(--positive-subtle) / <alpha-value>)",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },

      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        DEFAULT: "0 2px 8px -2px rgb(0 0 0 / 0.08)",
        md: "0 8px 24px -8px rgb(0 0 0 / 0.14)",
        lg: "0 24px 48px -16px rgb(0 0 0 / 0.20)",
        cinema:
          "0 32px 64px -24px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(255 255 255 / 0.04)",
        glow: "0 0 48px -12px oklch(var(--accent) / 0.4)",
      },

      maxWidth: {
        content: "1024px",
        cinema: "72rem",
      },

      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "cinema-rise": {
          "0%": {
            transform: "translateY(28px)",
            opacity: "0",
            filter: "blur(4px)",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
            filter: "blur(0)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s var(--ease-out)",
        "slide-up": "slide-up 0.55s var(--ease-out)",
        "cinema-rise": "cinema-rise 0.9s var(--ease-cinematic)",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
        film: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
