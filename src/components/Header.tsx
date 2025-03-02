"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import ThemeSwitch from './ThemeSwitch';
import { motion } from 'framer-motion';
import FloatingNavBar from './FloatingNavBar';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
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
  }, [mounted]);
  
  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#philosophy', label: 'Philosophy' },
    { href: '#tech-stack', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ];
  
  // Animations
  const logoVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.07
      }
    }
  };
  
  const navLinkVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  const socialVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.07
      }
    }
  };
  
  const iconVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  // Function to check if a link is active
  const isActive = (href: string) => {
    return activeSection === href.replace('#', '');
  };
  
  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'py-3 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-sm' 
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-5 sm:px-8 max-w-6xl">
          <div className="flex justify-between items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              className="flex-shrink-0"
            >
              <Link 
                href="#hero" 
                className="group flex items-center transition-transform duration-300 hover:translate-x-0.5" 
                aria-label="Go to home section"
              >
                <span className="text-lg font-light tracking-wider">
                  <span className="text-blue-500 dark:text-blue-400 mr-0.5">{PERSONAL_INFO.firstName}</span>
                  <span className="text-gray-700 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">{PERSONAL_INFO.lastName}</span>
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex items-center space-x-7 lg:space-x-9"
              initial="hidden"
              animate="visible"
              variants={navContainerVariants}
            >
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div 
                    key={index} 
                    variants={navLinkVariants}
                    className="relative"
                  >
                    <Link 
                      href={link.href}
                      className={`relative text-sm font-light tracking-wide py-1.5 px-2.5
                                transition-all duration-300 rounded-md
                                ${active 
                                  ? 'text-blue-500 dark:text-blue-400' 
                                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'}`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      
                      {/* Animated underline indicator */}
                      <span 
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-500 dark:bg-blue-400
                                  transition-all duration-300 ease-out 
                                  ${active ? 'opacity-100' : 'opacity-0'}`}
                      />
                      
                      {/* Hover background effect */}
                      <span 
                        className={`absolute inset-0 rounded-md bg-blue-50 dark:bg-blue-900/20 transition-all duration-300
                                  ${active ? 'opacity-10' : 'opacity-0 group-hover:opacity-10'}`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
            
            <div className="flex items-center">
              {/* Social Links - Desktop Only */}
              <motion.div 
                className="hidden md:flex items-center space-x-5 mr-6"
                initial="hidden"
                animate="visible"
                variants={socialVariants}
              >
                <motion.div 
                  variants={iconVariants} 
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }} 
                  whileTap={{ scale: 0.92 }}
                  className="relative"
                >
                  <Link 
                    href={PERSONAL_INFO.social.github}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-lg" />
                    <span className="sr-only">GitHub Profile</span>
                  </Link>
                </motion.div>
                <motion.div 
                  variants={iconVariants} 
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }} 
                  whileTap={{ scale: 0.92 }}
                  className="relative"
                >
                  <Link 
                    href={PERSONAL_INFO.social.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-lg" />
                    <span className="sr-only">LinkedIn Profile</span>
                  </Link>
                </motion.div>
                <motion.div 
                  variants={iconVariants} 
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }} 
                  whileTap={{ scale: 0.92 }}
                  className="relative"
                >
                  <Link 
                    href={PERSONAL_INFO.social.stackoverflow}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                    aria-label="Stack Overflow"
                  >
                    <FaStackOverflow className="text-lg" />
                    <span className="sr-only">Stack Overflow Profile</span>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Theme Switch */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <ThemeSwitch />
              </motion.div>
              
              {/* Mobile - Social Media Icons (small screen only) */}
              <motion.div
                className="md:hidden flex items-center ml-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Link 
                  href={PERSONAL_INFO.social.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1.5"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-sm" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Mobile Navigation */}
      <FloatingNavBar />
    </>
  );
} 