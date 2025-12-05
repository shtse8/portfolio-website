"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/personal';
import { motion, useScroll, useTransform } from 'framer-motion';

// Swedish minimalist aesthetic background with subtle animation
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Clean gradient overlay */}
    <div className="absolute w-full h-full bg-gradient-to-b from-slate-50/20 to-white/10 dark:from-slate-950/20 dark:to-black/10"></div>
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
      <div className="h-full w-full bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_8px)] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </div>
    
    {/* Soft accent shapes */}
    <motion.div 
      className="absolute left-1/3 bottom-1/3 w-[30rem] h-[30rem] rounded-[8px] bg-blue-400/[0.03] dark:bg-blue-500/[0.03] blur-3xl"
      animate={{
        y: [0, -8, 0],
        x: [0, 8, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute right-1/3 top-1/3 w-[25rem] h-[25rem] rounded-[8px] bg-indigo-300/[0.02] dark:bg-indigo-400/[0.02] blur-3xl"
      animate={{
        y: [0, 8, 0],
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

// Modern social button with Swedish minimalist aesthetic
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
    className="flex items-center justify-center w-10 h-10 rounded-[8px] 
               text-gray-600 dark:text-gray-300
               hover:text-blue-500 dark:hover:text-blue-400 
               bg-transparent hover:bg-white/40 dark:hover:bg-gray-800/30 
               transition-all duration-200
               border border-gray-100/50 dark:border-gray-800/50"
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.96 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: 0.3 + delay, 
      duration: 0.3,
      type: "spring" as const,
      stiffness: 300,
      damping: 15
    }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

// CLI-inspired text animation with improved cursor
const CommandLineText = ({ texts }: { texts: string[] }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Blinking cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Standard cursor blink rate
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  useEffect(() => {
    if (!texts.length) return;
    
    const currentText = texts[textIndex];
    
    // If we've fully typed the text, pause before deleting
    if (!isDeleting && charIndex >= currentText.length) {
      setIsPaused(true);
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000); // Wait 2 seconds before starting to delete
      
      return () => clearTimeout(pauseTimer);
    }
    
    // If we've fully deleted the text, move to next text
    if (isDeleting && charIndex === 0) {
      setIsPaused(true);
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(false);
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, 500); // Wait half a second before typing next text
      
      return () => clearTimeout(pauseTimer);
    }
    
    if (isPaused) return; // Don't do anything while paused
    
    const typingSpeed = isDeleting ? 40 : 80; // Delete faster than type
    
    const timer = setTimeout(() => {
      setCharIndex(prev => isDeleting ? prev - 1 : prev + 1);
      setDisplayText(currentText.substring(0, isDeleting ? charIndex - 1 : charIndex + 1));
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, texts, isPaused]);
  
  return (
    <div className="font-mono text-xs sm:text-sm md:text-base bg-gray-900/90 dark:bg-black/80 
                    text-gray-100 p-4 rounded-[8px] shadow-sm w-full max-w-md mx-auto">
      <div className="flex items-center text-xs mb-2 text-gray-400">
        <div className="flex space-x-1.5 mr-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/90"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/90"></div>
        </div>
        <span>terminal • profile.sh</span>
      </div>
      <div className="flex flex-wrap">
        <span className="text-green-500 mr-2">$&gt;</span>
        <span className="text-blue-400">echo</span>
        <span className="text-gray-300 mx-2">&ldquo;I&apos;m a</span>
        <span className="text-yellow-400 relative">
          {displayText}
          {/* Thin terminal cursor */}
          <span 
            className={`inline-block ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              width: '1px',
              height: '1.2em',
              backgroundColor: '#e2e8f0', 
              marginLeft: '1px',
              verticalAlign: 'middle',
              display: 'inline-block',
              position: 'relative',
              top: '1px'
            }}
          />
        </span>
        <span className="text-gray-300">&rdquo;</span>
      </div>
    </div>
  );
};

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Text options for command line display
  const roleTexts = useMemo(() => 
    PERSONAL_INFO.roles || [
      PERSONAL_INFO.title,
      'Full Stack Developer',
      'UI/UX Enthusiast'
    ]
  , []);
  
  // Organize specialties into groups for better visual hierarchy
  const specialtyGroups = useMemo(() => {
    if (!PERSONAL_INFO.specialties) return [];
    
    // Only display a subset of specialties
    const displaySpecialties = PERSONAL_INFO.specialties.slice(0, 6);
    
    // Group specialties by 2 for layout purposes
    return displaySpecialties.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index/2);
      
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      
      resultArray[chunkIndex].push(item);
      
      return resultArray;
    }, [] as string[][]);
  }, []);
  
  // Scroll animations with Swedish minimalist aesthetic
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  
  // Social links
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
  // Smooth scroll function
  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('tech-stack');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  return (
    <section 
      id="hero" 
      ref={heroRef} 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-6"
      aria-label="Introduction"
    >
      {/* Swedish minimalist background */}
      <HeroBackground />
      
      <div className="w-full max-w-5xl mx-auto">
        <motion.div 
          className="flex flex-col items-center text-center"
          style={{ opacity: headerOpacity, y: headerY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Minimalist name presentation with careful typography */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-extralight tracking-wide text-gray-900 dark:text-white mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-normal text-blue-600 dark:text-blue-400">{PERSONAL_INFO.firstName}</span>{' '}
            <span className="font-extralight text-gray-700 dark:text-gray-400">
              {PERSONAL_INFO.lastName}
            </span>
          </motion.h1>
          
          {/* Tagline */}
          {PERSONAL_INFO.tagline && (
            <motion.p
              className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto font-light tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {PERSONAL_INFO.tagline}
            </motion.p>
          )}
          
          {/* CLI-inspired role display */}
          <motion.div 
            className="my-8 w-full max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CommandLineText texts={roleTexts} />
          </motion.div>
          
          {/* Specialties in an elegant layout */}
          {specialtyGroups.length > 0 && (
            <motion.div
              className="flex flex-col gap-4 mb-12 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {specialtyGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex justify-center gap-4">
                  {group.map((specialty, index) => (
                    <motion.span
                      key={specialty}
                      className="px-3 py-1 text-xs rounded-[8px] bg-gray-50 dark:bg-gray-800/50 
                              text-gray-600 dark:text-gray-300 border border-gray-100/50 dark:border-gray-700/50"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (groupIndex * 2 + index) * 0.1, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      {specialty}
                    </motion.span>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Social links with Swedish minimalist aesthetic */}
          <motion.div 
            className="flex gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
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
          
          {/* Scroll indicator with Swedish minimalist aesthetic */}
          <motion.div
            className="relative mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 h-16 w-px bg-gray-200 dark:bg-gray-800"></div>
            <motion.button
              onClick={scrollToNextSection}
              className="relative mt-16 rounded-full flex items-center justify-center 
                       text-gray-500 dark:text-gray-400 
                       hover:text-blue-500 dark:hover:text-blue-400
                       transition-all duration-300"
              whileHover={{ y: 4 }}
              aria-label="Scroll to technical skills section"
            >
              <FaArrowDown className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 