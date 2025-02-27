"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaTerminal, FaArrowDown, FaGithub, FaLinkedin } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useScrollAnimation } from './ScrollAnimationProvider';

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
  
  // Get scroll animation values
  const { scrollYProgress } = useScrollAnimation();
  
  // Create scroll-driven animations
  const { scrollYProgress: sectionProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Transform values based on scroll
  const headerOpacity = useTransform(sectionProgress, [0, 0.5], [1, 0]);
  const headerY = useTransform(sectionProgress, [0, 0.5], [0, -100]);
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  
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
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated background blobs with scroll-driven animations */}
      <motion.div 
        className="absolute inset-0 overflow-hidden -z-10"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-primary-400/20 dark:bg-primary-600/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="flex flex-col items-center text-center gap-8"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
            <FaTerminal className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
          </h1>
          
          <div className="h-8 md:h-12">
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
              <span>{typewriterText}</span>
              <Cursor cursorStyle="|" />
            </h2>
          </div>
          
          <p className="max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
            {PERSONAL_INFO.shortBio}
          </p>
          
          <div className="flex gap-4 mt-4">
            <a 
              href={PERSONAL_INFO.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <FaGithub className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </a>
            <a 
              href={PERSONAL_INFO.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <FaLinkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
          
          <motion.button
            onClick={scrollToNextSection}
            className="mt-12 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors"
            whileHover={{ y: 5 }}
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FaArrowDown className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 