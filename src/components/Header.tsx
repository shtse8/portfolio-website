"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaBars, FaTimes } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
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
    { href: '#tech-stack', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#philosophy', label: 'Philosophy' },
    { href: '#contact', label: 'Contact' }
  ];
  
  // Animations
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };
  
  const navItemVariants = {
    closed: { opacity: 0, y: -8 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
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
        staggerChildren: 0.05
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
        staggerChildren: 0.05
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
  
  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
        <div className="flex justify-between items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={logoVariants}
            className="flex-shrink-0"
          >
            <Link href="#hero" className="flex items-center">
              <span className="text-lg font-light tracking-wide">
                <span className="text-blue-500 dark:text-blue-400">{PERSONAL_INFO.firstName}</span>
                <span className="text-gray-700 dark:text-white ml-1">{PERSONAL_INFO.lastName}</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-5 lg:space-x-7"
            initial="hidden"
            animate="visible"
            variants={navContainerVariants}
          >
            {navLinks.map((link, index) => (
              <motion.div key={index} variants={navLinkVariants}>
                <Link 
                  href={link.href}
                  className="relative text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 
                            transition-colors text-sm font-light tracking-wide py-1 px-2
                            after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-blue-500 
                            after:dark:bg-blue-400 after:origin-center after:scale-x-0 after:transition-transform 
                            hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
          
          <div className="flex items-center">
            {/* Social Links - Desktop Only */}
            <motion.div 
              className="hidden md:flex items-center space-x-4 mr-5"
              initial="hidden"
              animate="visible"
              variants={socialVariants}
            >
              <motion.div variants={iconVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href={PERSONAL_INFO.social.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-lg" />
                </Link>
              </motion.div>
              <motion.div variants={iconVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-lg" />
                </Link>
              </motion.div>
              <motion.div variants={iconVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href={PERSONAL_INFO.social.stackoverflow}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label="Stack Overflow"
                >
                  <FaStackOverflow className="text-lg" />
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Theme Switch */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mr-3 md:mr-0"
            >
              <ThemeSwitch />
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.button 
              onClick={toggleMobileMenu}
              className="md:hidden ml-2 p-1.5 rounded-full text-gray-600 dark:text-gray-300 
                        hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - Fade In */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 z-45 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center p-5">
                <Link 
                  href="#hero" 
                  className="text-lg font-light tracking-wide"
                  onClick={closeMobileMenu}
                >
                  <span className="text-blue-500 dark:text-blue-400">{PERSONAL_INFO.firstName}</span>
                  <span className="text-gray-700 dark:text-white ml-1">{PERSONAL_INFO.lastName}</span>
                </Link>
                <button 
                  onClick={closeMobileMenu}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 
                            hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all"
                  aria-label="Close menu"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              
              <nav className="flex-1 flex flex-col p-5">
                <div className="space-y-5 mb-10">
                  {navLinks.map((link, index) => (
                    <motion.div 
                      key={index}
                      variants={navItemVariants}
                    >
                      <Link 
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="block text-lg font-light tracking-wide
                                 text-gray-600 dark:text-gray-200 
                                 hover:text-blue-500 dark:hover:text-blue-400 
                                 transition-colors py-2"
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
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-4 font-light text-sm">Connect with me</p>
                    <div className="flex space-x-5">
                      <Link 
                        href={PERSONAL_INFO.social.github}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
                        aria-label="GitHub"
                      >
                        <FaGithub className="text-xl" />
                      </Link>
                      <Link 
                        href={PERSONAL_INFO.social.linkedin}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin className="text-xl" />
                      </Link>
                      <Link 
                        href={PERSONAL_INFO.social.stackoverflow}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
                        aria-label="Stack Overflow"
                      >
                        <FaStackOverflow className="text-xl" />
                      </Link>
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