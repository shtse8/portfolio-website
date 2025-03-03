"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaTerminal, FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

// Background component with purposeful subtle animations
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Soft gradient overlay */}
    <div className="absolute w-full h-full bg-gradient-to-b from-blue-50/30 to-slate-50/20 dark:from-blue-950/30 dark:to-slate-950/10"></div>
    
    {/* Subtle grid pattern with reduced opacity */}
    <div className="absolute inset-0 opacity-5 dark:opacity-7">
      <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_45%,transparent_100%)]"></div>
    </div>
    
    {/* Accent elements with purposeful animation */}
    <motion.div 
      className="absolute left-1/4 bottom-1/4 w-[45rem] h-[45rem] rounded-full bg-blue-400/5 dark:bg-blue-500/5 blur-3xl"
      animate={{
        y: [0, -15, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute right-1/4 top-1/3 w-[30rem] h-[30rem] rounded-full bg-indigo-300/4 dark:bg-indigo-400/4 blur-3xl"
      animate={{
        y: [0, 10, 0],
        x: [0, -5, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  </div>
);

// Social link button component with micro-interactions
const SocialButton = ({ 
  url, 
  icon, 
  label,
  delay = 0 
}: { 
  url: string; 
  icon: React.ReactNode; 
  label: string;
  delay?: number;
}) => (
  <motion.a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-11 h-11 rounded-full 
               text-gray-600 dark:text-gray-300
               hover:text-blue-600 dark:hover:text-blue-400 
               hover:bg-white/70 dark:hover:bg-gray-800/50 
               transition-all duration-200
               shadow-sm hover:shadow-md"
    whileHover={{ y: -3, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: 0.5 + delay, 
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 15
    }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Text options for typewriter - purposeful and focused
  const texts = useMemo(() => [
    PERSONAL_INFO.title,
    'Full Stack Developer',
    'UI/UX Enthusiast'
  ], []);
  
  const [typewriterText] = useTypewriter({
    words: texts,
    loop: true,
    delaySpeed: 2500,
    deleteSpeed: 40,
    typeSpeed: 80,
  });
  
  // Purposeful scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  
  // Social links with optimized structure
  const socialLinks = useMemo(() => [
    {
      url: PERSONAL_INFO.social.github,
      icon: <FaGithub className="w-5 h-5" />,
      label: "GitHub Profile"
    },
    {
      url: PERSONAL_INFO.social.linkedin,
      icon: <FaLinkedin className="w-5 h-5" />,
      label: "LinkedIn Profile"
    },
    ...(PERSONAL_INFO.email ? [{
      url: `mailto:${PERSONAL_INFO.email}`,
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "Email Contact"
    }] : [])
  ], []);
  
  // Initialization
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Smooth scroll function
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-6"
      aria-label="Introduction"
    >
      {/* Purposeful background */}
      <HeroBackground />
      
      <div className="w-full max-w-4xl mx-auto">
        <motion.div 
          className="flex flex-col items-center text-center"
          style={{ opacity: headerOpacity, y: headerY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Terminal icon with soft shadow */}
          <motion.div 
            className="mb-10 text-blue-600/90 dark:text-blue-400/90 
                     p-4 rounded-full bg-white/30 dark:bg-gray-900/30 
                     shadow-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.05 }}
          >
            <FaTerminal className="w-8 h-8" />
          </motion.div>
          
          {/* Name with purposeful gradient */}
          <motion.h1 
            className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white mb-6 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="font-extralight">{PERSONAL_INFO.firstName}</span>{' '}
            <span className="font-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {PERSONAL_INFO.lastName}
            </span>
          </motion.h1>
          
          {/* Typewriter with balanced spacing */}
          <motion.div 
            className="h-8 md:h-10 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light">
              <span>{typewriterText}</span>
              <Cursor cursorStyle="|" />
            </h2>
          </motion.div>
          
          {/* Bio with optimal content presentation */}
          <motion.div
            className="mb-14 p-5 rounded-xl bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="max-w-xl text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
              {PERSONAL_INFO.shortBio}
            </p>
          </motion.div>
          
          {/* Social links with refined aesthetic */}
          <motion.div 
            className="flex gap-6 mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {socialLinks.map((link, index) => (
              <SocialButton 
                key={index} 
                url={link.url} 
                icon={link.icon} 
                label={link.label} 
                delay={index * 0.1}
              />
            ))}
          </motion.div>
          
          {/* Scroll button with purposeful animation */}
          <motion.button
            onClick={scrollToNextSection}
            className="w-10 h-10 rounded-full flex items-center justify-center 
                     text-gray-500 dark:text-gray-400 
                     hover:text-blue-600 dark:hover:text-blue-400
                     transition-all duration-200 
                     bg-white/70 dark:bg-gray-800/50
                     shadow-sm hover:shadow-md
                     border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            aria-label="Scroll to technical skills section"
          >
            <FaArrowDown className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 