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
  
  // Animations
  const mobileMenuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 150,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };
  
  const navItemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };
  
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.1,
        duration: 0.6
      }
    }
  };
  
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const navLinkVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const socialVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: 0.7,
        staggerChildren: 0.1
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <Link href="#hero" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">
                <span className="gradient-text">{PERSONAL_INFO.firstName}</span>
                <span className="text-gray-900 dark:text-white">{PERSONAL_INFO.lastName}</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial="hidden"
            animate="visible"
            variants={navContainerVariants}
          >
            {navLinks.map((link, index) => (
              <motion.div key={index} variants={navLinkVariants}>
                <Link 
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
          
          <div className="flex items-center space-x-5">
            {/* Social Links - Desktop Only */}
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial="hidden"
              animate="visible"
              variants={socialVariants}
            >
              <motion.div variants={iconVariants}>
                <Link 
                  href={PERSONAL_INFO.social.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-xl" />
                </Link>
              </motion.div>
              <motion.div variants={iconVariants}>
                <Link 
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </Link>
              </motion.div>
              <motion.div variants={iconVariants}>
                <Link 
                  href={PERSONAL_INFO.social.stackoverflow}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="Stack Overflow"
                >
                  <FaStackOverflow className="text-xl" />
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Theme Switch */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <ThemeSwitch />
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - Slide In */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white/98 dark:bg-gray-900/98 z-[99] md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <Link 
                  href="#hero" 
                  className="text-2xl font-bold"
                  onClick={closeMobileMenu}
                >
                  <span className="gradient-text">{PERSONAL_INFO.firstName}</span>
                  <span className="text-gray-900 dark:text-white">{PERSONAL_INFO.lastName}</span>
                </Link>
                <motion.button 
                  onClick={closeMobileMenu}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  aria-label="Close menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </div>
              
              <nav className="flex-1 flex flex-col p-6">
                <div className="space-y-6 mb-8">
                  {navLinks.map((link, index) => (
                    <motion.div 
                      key={index}
                      variants={navItemVariants}
                      className="overflow-hidden"
                    >
                      <Link 
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="block text-xl font-medium text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Theme Switch - Mobile */}
                <motion.div 
                  className="my-8"
                  variants={navItemVariants}
                >
                  <ThemeSwitch isMobile={true} />
                </motion.div>
                
                <motion.div 
                  className="mt-auto"
                  variants={navItemVariants}
                >
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Connect with me</p>
                    <div className="flex space-x-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link 
                          href={PERSONAL_INFO.social.github}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          aria-label="GitHub"
                        >
                          <FaGithub className="text-2xl" />
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link 
                          href={PERSONAL_INFO.social.linkedin}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedin className="text-2xl" />
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link 
                          href={PERSONAL_INFO.social.stackoverflow}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          aria-label="Stack Overflow"
                        >
                          <FaStackOverflow className="text-2xl" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 