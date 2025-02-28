"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaTerminal, FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
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
  const backgroundScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  
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
      {/* Simplified background with subtle effects */}
      <motion.div 
        className="absolute inset-0 overflow-hidden -z-10"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <div className="absolute w-full h-full bg-gradient-to-b from-blue-50/20 to-white/0 dark:from-blue-950/20 dark:to-gray-950/0"></div>
        
        {/* Background grid pattern with reduced opacity */}
        <div className="absolute inset-0 opacity-3 dark:opacity-8">
          <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]"></div>
        </div>
        
        {/* Simplified floating elements with more subtle animations */}
        <motion.div 
          className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-blue-400/5 dark:bg-blue-600/5 blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-indigo-500/3 dark:bg-indigo-500/3 blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 35, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-blue-300/5 dark:bg-blue-600/3 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          className="flex flex-col items-center text-center"
          style={{ opacity: headerOpacity, y: headerY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Simplified profile icon with flatter design */}
          <motion.div 
            className="w-28 h-28 rounded-full bg-blue-50/80 dark:bg-blue-900/20 mb-10 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <FaTerminal className="w-12 h-12 text-blue-600/90 dark:text-blue-400/90" />
          </motion.div>
          
          {/* Name with lighter typography */}
          <motion.h1 
            className="text-5xl md:text-7xl font-extralight text-gray-900 dark:text-white mb-8 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="font-light">{PERSONAL_INFO.firstName}</span>{' '}
            <span className="font-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {PERSONAL_INFO.lastName}
            </span>
          </motion.h1>
          
          {/* Typewriter effect with increased spacing */}
          <motion.div 
            className="h-10 md:h-14 mb-12 px-6 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-light tracking-wide">
              <span>{typewriterText}</span>
              <Cursor cursorStyle="|" />
            </h2>
          </motion.div>
          
          {/* Bio with better spacing and typography */}
          <motion.p 
            className="max-w-2xl text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-16 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {PERSONAL_INFO.shortBio}
          </motion.p>
          
          {/* Social links with flatter design */}
          <motion.div 
            className="flex gap-8 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a 
              href={PERSONAL_INFO.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="GitHub Profile"
            >
              <FaGithub className="w-6 h-6" />
            </motion.a>
            <motion.a 
              href={PERSONAL_INFO.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin className="w-6 h-6" />
            </motion.a>
            {PERSONAL_INFO.email && (
              <motion.a 
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center justify-center w-12 h-12 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Email Contact"
              >
                <FaEnvelope className="w-6 h-6" />
              </motion.a>
            )}
          </motion.div>
          
          {/* Scroll button with flatter design */}
          <motion.button
            onClick={scrollToNextSection}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/80 text-white hover:bg-blue-600/80 transition-colors"
            whileHover={{ scale: 1.03 }}
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            aria-label="Scroll to technical skills section"
          >
            <FaArrowDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 