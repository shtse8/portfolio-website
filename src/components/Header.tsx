"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaLongArrowAltRight } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import ThemeSwitch from './ThemeSwitch';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import FloatingNavBar from './FloatingNavBar';
import { cn } from '@/lib/utils';

// Types
interface NavLink {
  href: string;
  label: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use scroll progress for visual effects
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 8]);
  
  // Navigation links
  const navLinks: NavLink[] = [
    { href: '#hero', label: 'Home' },
    { href: '#philosophy', label: 'Philosophy' },
    { href: '#tech-stack', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ];
  
  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track active section based on scroll
  useEffect(() => {
    const sections = navLinks.map(link => link.href.replace('#', ''));
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
    
    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, [mounted, navLinks]);
  
  // Function to check if a link is active
  const isActive = useCallback((href: string) => {
    return activeSection === href.replace('#', '');
  }, [activeSection]);
  
  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
      >
        {/* Background elements */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500 z-[-1]",
          isScrolled 
            ? "bg-white/80 dark:bg-gray-900/80 border-b border-gray-100/50 dark:border-gray-800/50 shadow-sm" 
            : "bg-transparent"
        )} />
        
        {/* Subtle pattern - only visible when scrolled */}
        {isScrolled && (
          <div className="absolute inset-0 z-[-1] opacity-[0.015] dark:opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}
        
        {/* Accent decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
          <div className={cn(
            "absolute -right-24 top-0 w-96 h-20 bg-blue-400/5 rounded-full blur-3xl transform rotate-12 transition-opacity duration-500",
            isScrolled ? "opacity-100" : "opacity-0"
          )} />
        </div>
        
        {/* Main header content */}
        <div className={cn(
          "container mx-auto px-4 sm:px-6 max-w-6xl transition-all duration-300",
          isScrolled ? "py-3" : "py-5"
        )}>
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <Link 
                href="#hero" 
                className="group flex items-center transition-transform duration-300 hover:translate-x-0.5"
                aria-label="Go to home section"
              >
                <span className="relative text-lg font-extralight tracking-wider overflow-hidden">
                  <span className="relative z-10 text-blue-500 dark:text-blue-400 mr-0.5">
                    {PERSONAL_INFO.firstName}
                  </span>
                  <span className="relative z-10 text-gray-700 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {PERSONAL_INFO.lastName}
                  </span>
                  
                  {/* Animated underline on hover */}
                  <motion.span 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-200/50 dark:bg-blue-700/30 transform origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex items-center space-x-1 lg:space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                staggerChildren: 0.07,
                delayChildren: 0.1
              }}
              aria-label="Primary navigation"
            >
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + (index * 0.07) }}
                    className="relative"
                  >
                    <Link 
                      href={link.href}
                      className={cn(
                        "relative text-sm font-light tracking-wide py-2 px-3",
                        "transition-all duration-300 rounded-md",
                        active 
                          ? "text-blue-500 dark:text-blue-400" 
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="relative z-10">{link.label}</span>
                      
                      {/* Enhanced active indicator */}
                      <AnimatePresence>
                        {active && (
                          <motion.span 
                            className="absolute inset-0 rounded-md bg-blue-50 dark:bg-blue-900/20"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            aria-hidden="true"
                          />
                        )}
                      </AnimatePresence>
                      
                      {/* Bottom line indicator */}
                      <motion.span 
                        className={cn(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 dark:bg-blue-400",
                          "transition-all duration-300 ease-out rounded-full" 
                        )}
                        initial={{ width: active ? "30%" : "0%" }}
                        animate={{ width: active ? "30%" : "0%" }}
                        exit={{ width: "0%" }}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
            
            <div className="flex items-center">
              {/* Social Links - Desktop Only */}
              <motion.div 
                className="hidden md:flex items-center space-x-2 mr-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {[
                  { href: PERSONAL_INFO.social.github, icon: <FaGithub className="w-3.5 h-3.5" />, label: "GitHub Profile" },
                  { href: PERSONAL_INFO.social.linkedin, icon: <FaLinkedin className="w-3.5 h-3.5" />, label: "LinkedIn Profile" },
                  { href: PERSONAL_INFO.social.stackoverflow, icon: <FaStackOverflow className="w-3.5 h-3.5" />, label: "Stack Overflow Profile" }
                ].map((social, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }} 
                    whileTap={{ scale: 0.92 }}
                  >
                    <Link 
                      href={social.href}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        "text-gray-500 dark:text-gray-400",
                        "hover:text-blue-500 dark:hover:text-blue-400", 
                        "hover:bg-white/70 dark:hover:bg-gray-800/40",
                        "transition-all duration-200 border border-gray-100/30 dark:border-gray-800/30"
                      )}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Theme Switch */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <ThemeSwitch />
              </motion.div>
              
              {/* Mobile Menu Toggle */}
              <motion.button
                className="md:hidden ml-3 p-1.5 rounded-lg bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle mobile menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <span className={cn(
                    "w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 mb-1",
                    mobileMenuOpen && "transform rotate-45 translate-y-1.5"
                  )} />
                  <span className={cn(
                    "w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300",
                    mobileMenuOpen && "opacity-0"
                  )} />
                  <span className={cn(
                    "w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 mt-1",
                    mobileMenuOpen && "transform -rotate-45 -translate-y-1.5"
                  )} />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-30 md:hidden bg-gray-800/20 dark:bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">Navigation</h2>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    aria-label="Close menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <nav className="space-y-1">
                  {navLinks.map((link, index) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (index * 0.05) }}
                      >
                        <Link 
                          href={link.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
                            active 
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400" 
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="text-sm font-light">{link.label}</span>
                          {active && (
                            <FaLongArrowAltRight className="ml-auto text-blue-500 dark:text-blue-400" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
                
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-center space-x-4">
                    {[
                      { href: PERSONAL_INFO.social.github, icon: <FaGithub />, label: "GitHub" },
                      { href: PERSONAL_INFO.social.linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
                      { href: PERSONAL_INFO.social.stackoverflow, icon: <FaStackOverflow />, label: "Stack Overflow" }
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        aria-label={social.label}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Close menu when clicking outside */}
            <motion.div 
              className="absolute inset-0 z-[-1]" 
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Navigation */}
      <FloatingNavBar />
    </>
  );
} 