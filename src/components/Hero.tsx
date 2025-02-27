"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaTerminal, FaArrowDown, FaGithub, FaLinkedin } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

export default function Hero() {
  // State for component mounting and initialization
  const [mounted, setMounted] = useState(false);
  
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
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
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="flex flex-col items-center text-center gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 70
          }}
        >
          {/* Terminal icon with animation */}
          <motion.div 
            className="bg-gradient-to-br from-primary-400 to-purple-600 p-5 rounded-full shadow-lg dark:shadow-primary-500/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTerminal className="text-white text-3xl" />
          </motion.div>
          
          {/* Name with gradient and animation */}
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="gradient-text">{PERSONAL_INFO.firstName}</span>
            <span className="ml-2">{PERSONAL_INFO.lastName}</span>
          </motion.h1>
          
          {/* Typewriter effect for titles */}
          <motion.div
            className="h-8 text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span>{typewriterText}</span>
            <Cursor cursorStyle="_" cursorColor="rgb(var(--primary-color))" />
          </motion.div>
          
          {/* Brief bio with animation */}
          <motion.p 
            className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {PERSONAL_INFO.shortBio || 'Full-stack developer with expertise in modern web technologies, focused on creating exceptional user experiences with clean, efficient code.'}
          </motion.p>
          
          {/* Social links */}
          <motion.div 
            className="flex gap-4 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.a 
              href={PERSONAL_INFO.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub className="text-xl" />
            </motion.a>
            <motion.a 
              href={PERSONAL_INFO.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin className="text-xl" />
            </motion.a>
          </motion.div>
          
          {/* CTA buttons with hover effects */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.a
              href="#contact"
              className="px-8 py-3 text-white bg-gradient-to-r from-primary-500 to-primary-700 rounded-full font-medium shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="#projects"
              className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll down button */}
      <motion.button
        onClick={scrollToNextSection}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.5,
          type: "spring",
          stiffness: 50
        }}
        whileHover={{ 
          y: [0, -5, 0], 
          transition: { 
            duration: 1.5, 
            repeat: Infinity 
          } 
        }}
      >
        <FaArrowDown className="text-gray-600 dark:text-gray-300" />
      </motion.button>
    </section>
  );
} 