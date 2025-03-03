"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaTerminal, FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

// Animated shape component for visual interest
const AnimatedShape = ({ 
  className, 
  delay = 0, 
  duration = 20,
  size = "md"
}: { 
  className: string; 
  delay?: number; 
  duration?: number;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: "w-32 h-32 md:w-48 md:h-48",
    md: "w-48 h-48 md:w-72 md:h-72",
    lg: "w-72 h-72 md:w-96 md:h-96"
  };

  return (
    <motion.div
      className={`absolute rounded-full ${sizes[size]} blur-3xl opacity-20 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: [0.15, 0.2, 0.15],
        y: [0, -15, 0],
        x: [0, 10, 0],
      }}
      transition={{
        scale: { duration: 1, delay },
        opacity: { 
          duration: duration, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut",
          delay 
        },
        y: { 
          duration: duration, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut",
          delay 
        },
        x: { 
          duration: duration * 0.8, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut", 
          delay: delay + 1
        }
      }}
    />
  );
};

// Interactive grid background
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
    <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="relative h-full">
          <div className="absolute top-0 bottom-0 w-px left-0 bg-blue-500/10"></div>
          <div className="absolute top-0 bottom-0 w-px right-0 bg-blue-500/10"></div>
        </div>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i + 'row'} className="absolute left-0 right-0 h-px" style={{ top: `${i * 8}%` }}>
          <div className="absolute left-0 right-0 h-px bg-blue-500/10"></div>
        </div>
      ))}
    </div>
    
    {/* We'll reduce the number of shapes on mobile for better performance */}
    <AnimatedShape 
      className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl" 
      size="md"
      duration={25}
    />
    <AnimatedShape 
      className="border border-blue-500/20 rounded-full" 
      delay={2} 
      duration={18}
      size="sm"
    />

    {/* Only show these additional shapes on larger screens */}
    <div className="hidden md:block">
      <AnimatedShape 
        className="bg-gradient-to-tr from-blue-400/10 to-blue-300/10 rounded-lg" 
        delay={3} 
        duration={28}
        size="lg"
      />
      <AnimatedShape 
        className="border-2 border-blue-400/10 rounded-lg" 
        delay={1} 
        duration={22}
        size="md"
      />
    </div>
  </div>
);

// Interactive navigation dot
const NavigationDot = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="group absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 0.8 }}
    aria-label="Scroll to explore"
  >
    <span className="text-xs text-gray-500 dark:text-gray-400 font-light tracking-wider opacity-70 group-hover:opacity-100 transition-opacity duration-300">
      EXPLORE
    </span>
    <div className="relative">
      <motion.div
        className="w-6 h-6 rounded-full border border-blue-200 dark:border-blue-700 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <motion.div
          className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
      </motion.div>
      <motion.div
        className="absolute -top-1 -left-1 -right-1 -bottom-1 border border-blue-200 dark:border-blue-700 rounded-full opacity-80"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
    </div>
  </motion.button>
);

// Enhanced social link with animation and tooltip
const SocialLink = ({ 
  url, 
  icon, 
  label,
  delay = 0 
}: { 
  url: string; 
  icon: React.ReactNode; 
  label: string;
  delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative">
      <motion.a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full 
                text-gray-600 dark:text-gray-300
                hover:text-blue-600 dark:hover:text-blue-400 
                bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm
                transition-all duration-300
                shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.8 + delay, 
          duration: 0.5,
          y: { type: "spring", stiffness: 400, damping: 17 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={label}
      >
        {icon}
      </motion.a>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 
                      bg-white dark:bg-gray-800 rounded-md shadow-lg 
                      text-xs text-gray-800 dark:text-gray-200
                      border border-gray-100 dark:border-gray-700 whitespace-nowrap"
          >
            {label}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-100 dark:border-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Animated badge states
  const [badgeHovered, setBadgeHovered] = useState(false);
  
  // Initialize typewriter
  const [typewriterText] = useTypewriter({
    words: [
      PERSONAL_INFO.title,
      'Full Stack Developer',
      'Problem Solver',
      'UI/UX Enthusiast'
    ],
    loop: true,
    delaySpeed: 2500,
    deleteSpeed: 40,
    typeSpeed: 80,
  });
  
  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  
  // Social links structure
  const socialLinks = [
    {
      url: PERSONAL_INFO.social.github,
      icon: <FaGithub className="w-5 h-5" />,
      label: "GitHub"
    },
    {
      url: PERSONAL_INFO.social.linkedin,
      icon: <FaLinkedin className="w-5 h-5" />,
      label: "LinkedIn"
    },
    {
      url: `mailto:${PERSONAL_INFO.email}`,
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "Email"
    },
    {
      url: `https://maps.google.com/?q=${PERSONAL_INFO.location.base}`,
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      label: PERSONAL_INFO.location.base
    }
  ];
  
  // Initialization
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Smooth scroll function
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('tech-stack');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (!mounted) return null;
  
  return (
    <section 
      id="hero" 
      ref={heroRef} 
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Interactive background */}
      <GridBackground />
      
      {/* Main content container */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20 md:py-0 relative z-10">
        <motion.div 
          className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          style={{ opacity: headerOpacity, y: headerY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Left column - Text content */}
          <div className="flex flex-col order-2 md:order-1">
            {/* Interactive badge */}
            <motion.div
              className="mb-8 self-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <motion.div
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                          dark:from-blue-900/20 dark:to-indigo-900/20
                          rounded-full border border-blue-100 dark:border-blue-800/30
                          text-blue-600 dark:text-blue-300 text-sm font-light
                          flex items-center space-x-2 backdrop-blur-sm"
                onMouseEnter={() => setBadgeHovered(true)}
                onMouseLeave={() => setBadgeHovered(false)}
                whileHover={{ scale: 1.05 }}
              >
                <span className={`w-2 h-2 rounded-full bg-blue-500 ${badgeHovered ? 'animate-pulse' : ''}`}></span>
                <span>Available for new projects</span>
              </motion.div>
            </motion.div>
            
            {/* Name with refined typography */}
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="font-extralight block">{PERSONAL_INFO.firstName}</span>
              <span className="font-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {PERSONAL_INFO.lastName}
              </span>
            </motion.h1>
            
            {/* Typewriter with refined design */}
            <motion.div 
              className="h-8 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-lg text-gray-600 dark:text-gray-300 font-light tracking-wide">
                <span>{typewriterText}</span>
                <Cursor cursorStyle="|" />
              </h2>
            </motion.div>
            
            {/* Bio with enhanced typography */}
            <motion.p
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light mb-10 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {PERSONAL_INFO.shortBio}
            </motion.p>
            
            {/* Social links with refined layout */}
            <motion.div 
              className="flex gap-5 my-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {socialLinks.map((link, index) => (
                <SocialLink 
                  key={index} 
                  url={link.url} 
                  icon={link.icon} 
                  label={link.label} 
                  delay={index * 0.1}
                />
              ))}
            </motion.div>
            
            {/* Location with subtle animation */}
            <motion.div
              className="mt-8 flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="w-6 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <span>{PERSONAL_INFO.location.remote}</span>
            </motion.div>
          </div>
          
          {/* Right column - Visual element */}
          <div className="order-1 md:order-2">
            <motion.div
              className="relative aspect-square max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              {/* Abstract 3D shape or illustration could go here */}
              <div className="w-full h-full rounded-2xl relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border border-gray-100 dark:border-gray-700">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-20 dark:opacity-20">
                  <div className="h-full w-full 
                    bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] 
                    bg-[size:20px_20px]">
                  </div>
                </div>
                
                {/* Abstract geometric elements */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rotate-45"
                  animate={{ 
                    rotate: [45, 135, 225, 315, 405], 
                  }}
                  transition={{ 
                    duration: 60, 
                    ease: "linear", 
                    repeat: Infinity,
                  }}
                >
                  <div className="absolute inset-0 border-8 md:border-[12px] border-blue-300/30 dark:border-blue-500/30 rounded-3xl"></div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72"
                  animate={{ 
                    rotate: [0, -90, -180, -270, -360], 
                  }}
                  transition={{ 
                    duration: 40, 
                    ease: "linear", 
                    repeat: Infinity,
                  }}
                >
                  <div className="absolute inset-0 border-8 md:border-[12px] border-indigo-300/20 dark:border-indigo-500/20 rounded-full"></div>
                </motion.div>
                
                <motion.div
                  className="absolute h-32 w-32 md:h-40 md:w-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-400/80 to-indigo-500/80 dark:from-blue-500/80 dark:to-indigo-600/80 shadow-lg"></div>
                </motion.div>
                
                {/* Terminal icon in center */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <FaTerminal className="w-10 h-10 md:w-14 md:h-14" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Navigation element */}
      <NavigationDot onClick={scrollToNextSection} />
    </section>
  );
} 