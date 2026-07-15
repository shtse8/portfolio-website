"use client";

/**
 * FilmGrain — fixed cinematic atmosphere layer.
 * SVG fractal noise + soft vignette. Pure decoration; never blocks interaction.
 * Hidden under prefers-reduced-motion so the page stays clean for that preference.
 */
export default function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] motion-safe:opacity-100 motion-reduce:opacity-0"
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay dark:opacity-[0.07] dark:mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
      {/* Soft vignette — theater edges */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, oklch(var(--background) / 0.55) 100%)",
        }}
      />
    </div>
  );
}
