"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

export default function Hero() {
  // State for component mounting and initialization
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Multiple texts to display in sequence - memoized to prevent recreating on each render
  const texts = useMemo(() => [
    'Full Stack Developer & Founder',
    'Cloud Architecture Specialist',
    'UI/UX Enthusiast',
    PERSONAL_INFO.title || 'Software Engineer'
  ], []);
  
  // Using react-simple-typewriter for more efficient typing animation
  const [typewriterText] = useTypewriter({
    words: texts,
    loop: true,
    delaySpeed: 2000,
    deleteSpeed: 50,
    typeSpeed: 100,
  });
  
  // Create scroll-driven animations
  const { scrollYProgress: sectionProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Transform values based on scroll - more subtle for Scandinavian aesthetic
  const headerOpacity = useTransform(sectionProgress, [0, 0.6], [1, 0]);
  const headerY = useTransform(sectionProgress, [0, 0.6], [0, -50]);
  
  // Set mounted state on component load
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Scroll down handler - memoized to prevent recreation on each render
  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('tech-stack');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  if (!mounted) return null;
  
  return (
    <section 
      id="hero" 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 bg-gray-50 dark:bg-gray-900"
    >
      {/* Minimalist background with subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]"></div>
      
      {/* Simple accent element - thin horizontal line */}
      <div className="absolute left-0 top-1/2 w-16 md:w-24 h-px bg-primary-400 dark:bg-primary-500"></div>
      <div className="absolute right-0 top-1/2 w-16 md:w-24 h-px bg-primary-400 dark:bg-primary-500"></div>
      
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          className="flex flex-col items-center text-center"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          {/* Clean, minimalist name presentation */}
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 dark:text-white mb-4">
            {PERSONAL_INFO.firstName} <span className="text-primary-500">{PERSONAL_INFO.lastName}</span>
          </h1>
          
          {/* Typewriter with refined styling */}
          <div className="h-8 md:h-12 mb-8">
            <h2 className="text-xl md:text-2xl font-normal text-gray-700 dark:text-gray-300">
              <span>{typewriterText}</span>
              <Cursor cursorStyle="｜" />
            </h2>
          </div>
          
          {/* Clean divider - Scandinavian design often uses simple lines to create structure */}
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 my-8"></div>
          
          {/* Bio text with clean typography */}
          <p className="max-w-xl text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light mb-12">
            {PERSONAL_INFO.shortBio}
          </p>
          
          {/* Social links with minimal styling */}
          <div className="flex space-x-6 mb-16">
            <a 
              href={PERSONAL_INFO.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
              aria-label="GitHub Profile"
            >
              <FaGithub className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300" />
            </a>
            <a 
              href={PERSONAL_INFO.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300" />
            </a>
          </div>
          
          {/* Minimalist scroll indicator */}
          <motion.button
            onClick={scrollToNextSection}
            className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            whileHover={{ y: 5 }}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest mb-2 font-light">Explore</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.29289 23.7071C7.68342 24.0976 8.31658 24.0976 8.70711 23.7071L15.0711 17.3431C15.4616 16.9526 15.4616 16.3195 15.0711 15.9289C14.6805 15.5384 14.0474 15.5384 13.6569 15.9289L8 21.5858L2.34315 15.9289C1.95262 15.5384 1.31946 15.5384 0.928932 15.9289C0.538408 16.3195 0.538408 16.9526 0.928932 17.3431L7.29289 23.7071ZM7 0V23H9V0H7Z" fill="currentColor"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 