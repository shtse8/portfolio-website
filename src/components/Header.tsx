"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaBars, FaTimes } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import ThemeSwitch from './ThemeSwitch';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    { href: '#', label: 'Home' },
    { href: '#tech', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' }
  ];
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            {PERSONAL_INFO.firstName}<span className="text-blue-600">{PERSONAL_INFO.lastName}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Social Links - Desktop Only */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href={PERSONAL_INFO.social.github}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </Link>
              <Link 
                href={PERSONAL_INFO.social.linkedin}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </Link>
              <Link 
                href={PERSONAL_INFO.social.stackoverflow}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Stack Overflow"
              >
                <FaStackOverflow className="text-xl" />
              </Link>
            </div>
            
            {/* Theme Switch - Desktop Only */}
            <div className="hidden md:block">
              <ThemeSwitch />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - Slide In */}
      <div 
        className={`fixed inset-0 bg-white/95 dark:bg-gray-900/95 z-[99] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="text-2xl font-bold text-gray-800 dark:text-white"
              onClick={closeMobileMenu}
            >
              {PERSONAL_INFO.firstName}<span className="text-blue-600">{PERSONAL_INFO.lastName}</span>
            </Link>
            <button 
              onClick={closeMobileMenu}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Close menu"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <nav className="flex-1 flex flex-col p-6">
            <div className="space-y-6 mb-8">
              {navLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block text-xl font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Theme Switch - Mobile */}
            <div className="my-8">
              <ThemeSwitch isMobile={true} />
            </div>
            
            <div className="mt-auto">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Connect with me</p>
                <div className="flex space-x-6">
                  <Link 
                    href={PERSONAL_INFO.social.github}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-2xl" />
                  </Link>
                  <Link 
                    href={PERSONAL_INFO.social.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-2xl" />
                  </Link>
                  <Link 
                    href={PERSONAL_INFO.social.stackoverflow}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Stack Overflow"
                  >
                    <FaStackOverflow className="text-2xl" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 