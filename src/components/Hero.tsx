"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaTerminal, FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useScrollAnimation } from './ScrollAnimationProvider';

// Types
type BackgroundBlobProps = {
  className: string;
  x: number[];
  y: number[];
  duration: number;
};

type SocialLink = {
  url: string;
  icon: React.ReactNode;
  label: string;
};

// BackgroundBlob - extracted for clarity and reusability
const BackgroundBlob: React.FC<BackgroundBlobProps> = ({ 
  className, 
  x, 
  y, 
  duration 
}) => (
  <motion.div 
    className={className}
    animate={{ x, y }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  />
);

// Background - separated for better component organization
const Background: React.FC<{ backgroundY: MotionValue<number>; backgroundScale: MotionValue<number> }> = ({ 
  backgroundY, 
  backgroundScale 
}) => (
  <motion.div 
    className="absolute inset-0 overflow-hidden -z-10"
    style={{ y: backgroundY, scale: backgroundScale }}
  >
    {/* Subtle gradient overlay */}
    <div className="absolute w-full h-full bg-gradient-to-b from-blue-50/10 to-white/0 dark:from-blue-950/10 dark:to-gray-950/0"></div>
    
    {/* Background grid with reduced visual weight */}
    <div className="absolute inset-0 opacity-2 dark:opacity-5">
      <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]"></div>
    </div>
    
    {/* Subtle background blobs - declutter by using prop shorthand */}
    <BackgroundBlob 
      className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-blue-400/3 dark:bg-blue-600/3 blur-3xl"
      x={[0, 20, 0]}
      y={[0, -30, 0]}
      duration={25}
    />
    <BackgroundBlob 
      className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-indigo-500/2 dark:bg-indigo-500/2 blur-3xl"
      x={[0, -25, 0]}
      y={[0, 35, 0]}
      duration={30}
    />
    <BackgroundBlob 
      className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-blue-300/3 dark:bg-blue-600/2 blur-3xl"
      x={[0, 30, 0]}
      y={[0, 20, 0]}
      duration={20}
    />
  </motion.div>
);

// Social link component - improves reusability
const SocialLink: React.FC<{ link: SocialLink }> = ({ link }) => (
  <motion.a 
    href={link.url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-12 h-12 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    aria-label={link.label}
  >
    {link.icon}
  </motion.a>
);

// Main component
export default function Hero() {
  // State and refs
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Handle typewriter effect with roles
  const roles = [
    'Full Stack Developer & Founder',
    'Cloud Architecture Specialist',
    'UI/UX Enthusiast',
    PERSONAL_INFO.title || 'Software Engineer'
  ];
  
  const [typewriterText] = useTypewriter({
    words: roles,
    loop: true,
    delaySpeed: 2000,
    deleteSpeed: 50,
    typeSpeed: 100,
  });
  
  // Scroll animations
  const { scrollYProgress } = useScrollAnimation();
  const { scrollYProgress: sectionProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Animation values
  const headerOpacity = useTransform(sectionProgress, [0, 0.5], [1, 0]);
  const headerY = useTransform(sectionProgress, [0, 0.5], [0, -100]);
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  
  // Social links
  const socialLinks: SocialLink[] = [
    {
      url: PERSONAL_INFO.social.github,
      icon: <FaGithub className="w-6 h-6" />,
      label: "GitHub Profile"
    },
    {
      url: PERSONAL_INFO.social.linkedin,
      icon: <FaLinkedin className="w-6 h-6" />,
      label: "LinkedIn Profile"
    }
  ];
  
  if (PERSONAL_INFO.email) {
    socialLinks.push({
      url: `mailto:${PERSONAL_INFO.email}`,
      icon: <FaEnvelope className="w-6 h-6" />,
      label: "Email Contact"
    });
  }
  
  // Scroll handler
  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('tech-stack');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Component initialization
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <section 
      id="hero" 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-6"
      aria-label="Introduction"
    >
      {/* Background */}
      <Background backgroundY={backgroundY} backgroundScale={backgroundScale} />
      
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          className="flex flex-col items-center text-center"
          style={{ opacity: headerOpacity, y: headerY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Profile icon */}
          <motion.div 
            className="w-24 h-24 rounded-full bg-blue-50/50 dark:bg-blue-900/10 mb-12 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <FaTerminal className="w-10 h-10 text-blue-500/80 dark:text-blue-400/80" />
          </motion.div>
          
          {/* Name with subtle gradient accent */}
          <motion.h1 
            className="text-5xl md:text-7xl font-extralight text-gray-800 dark:text-white mb-10 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="font-light">{PERSONAL_INFO.firstName}</span>{' '}
            <span className="font-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              {PERSONAL_INFO.lastName}
            </span>
          </motion.h1>
          
          {/* Role display with typewriter */}
          <motion.div 
            className="h-10 md:h-14 mb-14 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light tracking-wide">
              <span>{typewriterText}</span>
              <Cursor cursorStyle="|" />
            </h2>
          </motion.div>
          
          {/* Concise bio */}
          <motion.p 
            className="max-w-xl text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-16 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {PERSONAL_INFO.shortBio}
          </motion.p>
          
          {/* Social links row */}
          <motion.div 
            className="flex gap-10 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {socialLinks.map((link, index) => (
              <SocialLink key={index} link={link} />
            ))}
          </motion.div>
          
          {/* Subtle scroll indicator */}
          <motion.button
            onClick={scrollToNextSection}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-400/60 text-white hover:bg-blue-500/60 transition-colors"
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