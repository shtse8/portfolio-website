"use client";

import type React from "react";

/**
 * Platform init-container bake gate requires NEXT_PUBLIC_CP_PUBLIC_BASE to appear
 * in `/_next` output. Keep the string reachable from a client module (not used for
 * network — browser CP path stays disabled).
 */
const CP_PUBLIC_BAKE_PROOF =
  process.env.NEXT_PUBLIC_CP_PUBLIC_BASE ??
  process.env.NEXT_PUBLIC_CONTROL_PLANE_PUBLIC_BASE ??
  "";

/**
 * AppShell — natural document scroll (no custom scroll container).
 * The previous `body:overflow-hidden` + `#main-content` scroll container broke
 * window-based scroll consumers (progress bar, back-to-top). We scroll the
 * document directly: simpler, accessible, and the modern default.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip to content — visible on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-contrast focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>

      {/* Hidden bake proof node — do not remove without updating platform bake gate */}
      <span className="hidden" data-cp-public-base={CP_PUBLIC_BAKE_PROOF} />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </>
  );
}
