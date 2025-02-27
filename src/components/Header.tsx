"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaBars, FaTimes } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import ThemeSwitch from './ThemeSwitch';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
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
  
  // Handle body scroll locking
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#tech-stack', label: 'Tech Stack' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' }
  ];
  
  // Animations - simplified for Scandinavian aesthetic
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const navItemVariants = {
    closed: { opacity: 0 },
    open: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo - Simplified */}
          <Link href="#hero" className="group">
            <h1 className="text-xl font-normal tracking-wide">
              <span className="text-gray-900 dark:text-white">{PERSONAL_INFO.firstName}</span>
              <span className="text-primary-500 ml-1">{PERSONAL_INFO.lastName}</span>
            </h1>
          </Link>
          
          {/* Desktop Navigation - Cleaner styling */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-6">
            {/* Social Links - Desktop Only */}
            <div className="hidden md:flex items-center space-x-5">
              <Link 
                href={PERSONAL_INFO.social.github}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </Link>
              <Link 
                href={PERSONAL_INFO.social.linkedin}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
              </Link>
              <Link 
                href={PERSONAL_INFO.social.stackoverflow}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="Stack Overflow"
              >
                <FaStackOverflow className="text-lg" />
              </Link>
            </div>
            
            {/* Theme Switch */}
            <ThemeSwitch />
            
            {/* Mobile Menu Button - Simplified */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-1.5 text-gray-700 dark:text-gray-300"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - Simplified overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white/98 dark:bg-gray-900/98 z-[99] md:hidden flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
              <Link 
                href="#hero" 
                onClick={closeMobileMenu}
                className="text-xl font-normal tracking-wide"
              >
                <span className="text-gray-900 dark:text-white">{PERSONAL_INFO.firstName}</span>
                <span className="text-primary-500 ml-1">{PERSONAL_INFO.lastName}</span>
              </Link>
              <button 
                onClick={closeMobileMenu}
                className="text-gray-700 dark:text-gray-300"
                aria-label="Close menu"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <nav className="flex flex-col p-6 space-y-8">
              {navLinks.map((link, index) => (
                <motion.div 
                  key={index}
                  variants={navItemVariants}
                >
                  <Link 
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block text-lg font-normal text-gray-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Menu - Bottom Section */}
              <motion.div 
                variants={navItemVariants}
                className="pt-8 mt-auto border-t border-gray-100 dark:border-gray-800"
              >
                <div className="flex space-x-8 mb-6">
                  <Link 
                    href={PERSONAL_INFO.social.github}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-xl" />
                  </Link>
                  <Link 
                    href={PERSONAL_INFO.social.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-xl" />
                  </Link>
                  <Link 
                    href={PERSONAL_INFO.social.stackoverflow}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    aria-label="Stack Overflow"
                  >
                    <FaStackOverflow className="text-xl" />
                  </Link>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  © {new Date().getFullYear()} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 