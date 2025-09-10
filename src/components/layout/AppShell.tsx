"use client";

import React, { useCallback, useRef } from "react";

/**
 * AppShell
 * - Provides no-scroll body with an internal scrollable main content area
 * - Sticky Sidebar on md+ viewports
 * - Accessible "Skip to content" link for keyboard users
 *
 * Layout:
 *  - Body (overflow-hidden)
 *    - AppShell (h-dvh overflow-hidden)
 *      - Sidebar (sticky)
 *      - Main content (h-dvh overflow-y-auto)
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement | null>(null);

  // Optional: allow Escape to move focus to main content quickly
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  return (
    <div
      className="h-dvh w-full overflow-hidden bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200"
      onKeyDown={handleKeyDown}
    >
      {/* Content area (full-width, no sidebar to keep hero centered and impactful) */}
      <div className="h-full relative">
        {/* Skip to content (visible on focus) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-3 focus:py-2 focus:rounded-md focus:bg-white focus:text-blue-600 focus:shadow focus:outline-none dark:focus:bg-gray-900"
        >
          Skip to content
        </a>

        <main
          id="main-content"
          ref={mainRef}
          role="main"
          tabIndex={-1}
          className="h-dvh overflow-y-auto scroll-pt-20 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}