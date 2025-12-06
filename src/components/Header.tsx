"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import ThemeSwitch from './ThemeSwitch';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import DeepLink from './DeepLink';
import { SECTIONS } from '@/config/sections';
import { useNavigationStore } from '@/context/NavigationContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => SECTIONS.map(s => ({ to: s.id, label: s.label })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const container = document.getElementById('main-content');

    const handleScroll = () => {
      const y = container instanceof HTMLElement ? container.scrollTop : window.scrollY;
      setIsScrolled(y > 50);
    };

    const target = container instanceof HTMLElement ? container : window;
    target.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  const activeSection = useNavigationStore(state => state.activeSection);

  const isActive = useCallback((to: string) => activeSection === to, [activeSection]);

  const handleLinkClick = () => setMobileMenuOpen(false);

  if (!mounted) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-200",
          isScrolled
            ? "bg-surface/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <DeepLink
              to="hero"
              className="text-lg font-medium text-text-primary hover:text-accent transition-colors duration-150"
            >
              {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
            </DeepLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <DeepLink
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                    isActive(link.to)
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {link.label}
                </DeepLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* GitHub link - Desktop */}
              <Link
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150"
                aria-label="GitHub Profile"
              >
                <FaGithub className="w-5 h-5" />
              </Link>

              {/* Theme Switch */}
              <ThemeSwitch />

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={cn(
                    "w-5 h-0.5 bg-current rounded-full transition-all duration-200",
                    mobileMenuOpen && "rotate-45 translate-y-1.5"
                  )} />
                  <span className={cn(
                    "w-5 h-0.5 bg-current rounded-full transition-all duration-200",
                    mobileMenuOpen && "opacity-0"
                  )} />
                  <span className={cn(
                    "w-5 h-0.5 bg-current rounded-full transition-all duration-200",
                    mobileMenuOpen && "-rotate-45 -translate-y-1.5"
                  )} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-30 w-64 bg-surface border-l border-border md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6 pt-20">
                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <DeepLink
                      key={link.to}
                      to={link.to}
                      onClick={handleLinkClick}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150",
                        isActive(link.to)
                          ? "text-accent bg-accent-subtle"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                      )}
                    >
                      {link.label}
                    </DeepLink>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-border">
                  <Link
                    href={PERSONAL_INFO.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                  >
                    <FaGithub className="w-5 h-5" />
                    GitHub
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
