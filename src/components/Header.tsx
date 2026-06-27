"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { PERSONAL_INFO } from "@/data";
import ThemeSwitch from "./ThemeSwitch";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import DeepLink from "./DeepLink";
import { NAV_SECTIONS } from "@/config/sections";
import { useNavigationStore } from "@/context/NavigationContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useNavigationStore((s) => s.activeSection);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body + close menu on Escape while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = useCallback((id: string) => activeSection === id, [activeSection]);

  if (!mounted) return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          isScrolled
            ? "border-b border-border/70 bg-background/75 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          {/* Wordmark */}
          <DeepLink to="hero" className="group flex items-center gap-2.5" aria-label="Home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-semibold text-accent-contrast">
              KT
            </span>
            <span className="hidden font-medium tracking-tight text-text-primary sm:block">
              {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
            </span>
          </DeepLink>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_SECTIONS.map((s) => (
              <DeepLink
                key={s.id}
                to={s.id}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150",
                  isActive(s.id) ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {isActive(s.id) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-surface-sunken"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {s.label}
              </DeepLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href={PERSONAL_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary sm:flex"
            >
              <FaGithub className="h-[18px] w-[18px]" />
            </Link>
            <ThemeSwitch />
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <div className="flex h-4 w-5 flex-col justify-between">
                <span className={cn("h-0.5 w-5 rounded-full bg-current transition-all duration-200", menuOpen && "translate-y-[7px] rotate-45")} />
                <span className={cn("h-0.5 w-5 rounded-full bg-current transition-all duration-200", menuOpen && "opacity-0")} />
                <span className={cn("h-0.5 w-5 rounded-full bg-current transition-all duration-200", menuOpen && "-translate-y-[7px] -rotate-45")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-x-3 top-20 z-30 rounded-2xl border border-border bg-surface p-3 shadow-lg md:hidden"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              aria-label="Mobile"
            >
              {NAV_SECTIONS.map((s) => (
                <DeepLink
                  key={s.id}
                  to={s.id}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive(s.id) ? "bg-accent-subtle text-accent" : "text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                  )}
                >
                  {s.label}
                </DeepLink>
              ))}
              <Link
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary"
              >
                <FaGithub className="h-5 w-5" /> GitHub
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
