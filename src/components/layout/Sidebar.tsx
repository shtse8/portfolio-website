"use client";

import { useCallback, useRef } from "react";
import DeepLink from "@/components/DeepLink";
import ThemeSwitch from "@/components/ThemeSwitch";
import { SECTIONS } from "@/config/sections";
import { FaHome, FaCode, FaLightbulb, FaProjectDiagram, FaBriefcase, FaEnvelope } from "react-icons/fa";
import { cn } from "@/lib/utils";

function getIconForSection(id: string) {
  switch (id) {
    case "hero":
      return <FaHome className="w-4 h-4" />;
    case "tech-stack":
      return <FaCode className="w-4 h-4" />;
    case "philosophy":
      return <FaLightbulb className="w-4 h-4" />;
    case "projects":
      return <FaProjectDiagram className="w-4 h-4" />;
    case "experience":
      return <FaBriefcase className="w-4 h-4" />;
    case "contact":
      return <FaEnvelope className="w-4 h-4" />;
    default:
      return null;
  }
}

export default function Sidebar() {
  const navRef = useRef<HTMLDivElement | null>(null);

  // Keyboard navigation (ArrowUp/ArrowDown) for links inside the nav
  const handleKeyNav = useCallback((e: React.KeyboardEvent) => {
    if (!navRef.current) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

    const focusables = Array.from(
      navRef.current.querySelectorAll('a[data-sidebar-link="true"]')
    ) as HTMLAnchorElement[];

    if (focusables.length === 0) return;

    const currentIndex = focusables.findIndex((el) => el === document.activeElement);
    let nextIndex = currentIndex;

    if (e.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, focusables.length - 1);
    } else if (e.key === "ArrowUp") {
      nextIndex = currentIndex < 0 ? focusables.length - 1 : Math.max(currentIndex - 1, 0);
    }

    const nextEl = focusables[nextIndex];
    if (nextEl) {
      e.preventDefault();
      nextEl.focus();
    }
  }, []);

  return (
    <aside
      className="hidden md:flex h-dvh sticky top-0 border-r border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-950/60"
      aria-label="Sidebar"
    >
      <div className="flex flex-col w-[240px] xl:w-[260px] p-4 gap-4">
        {/* Skip branding for minimalism; can add later if needed */}

        <div
          ref={navRef}
          onKeyDown={handleKeyNav}
          className="mt-2"
          role="navigation"
          aria-label="Primary"
        >
          <ul className="flex flex-col gap-1">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <DeepLink
                  to={item.id}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-light",
                    "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
                    "hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors"
                  )}
                  activeClassName="text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/20"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {getIconForSection(item.id)}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </DeepLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </aside>
  );
}