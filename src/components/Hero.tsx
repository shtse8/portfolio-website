"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaTerminal, FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { motion, useAnimation } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

export default function Hero() {
  // State for component mounting and initialization
  const [mounted, setMounted] = useState(false);
  
  // Framer Motion controls
  const controls = useAnimation();
  
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
    
    if (mounted) {
      controls.start("visible");
    }
  }, [mounted, controls]);
  
  // Scroll down handler - memoized to prevent recreation on each render
  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('tech-stack');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Animation variants - memoized
  const animations = useMemo(() => ({
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3
        }
      }
    },
    
    itemVariants: {
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
          type: "spring", 
          stiffness: 100,
          damping: 10
        }
      }
    },
    
    floatingVariants: {
      idle: {
        y: [0, -10, 0],
        transition: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          duration: 2
        }
      }
    },
    
    backgroundBlobVariants: {
      animate: (i: number) => ({
        scale: [1, 1.1, 1],
        x: [0, i * 10, 0],
        y: [0, i * -5, 0],
        opacity: [0.2, 0.25, 0.2],
        transition: {
          duration: 8 + i,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      })
    },
    
    gradientVariants: {
      animate: {
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }
      }
    },

    particleVariants: (i: number) => ({
      animate: {
        y: [0, -(20 + i * 10), 0],
        x: [0, (i % 2 === 0 ? 10 : -10), 0],
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.5],
        transition: {
          duration: 3 + i,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    })
  }), []);
  
  // Generate random particles for background effect - memoized
  const particles = useMemo(() => {
    if (!mounted) return [];
    
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: [
        "rgba(59, 130, 246, 0.5)",
        "rgba(139, 92, 246, 0.5)",
        "rgba(236, 72, 153, 0.5)"
      ][Math.floor(Math.random() * 3)]
    }));
  }, [mounted]);
  
  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <motion.div 
        className="max-w-4xl mx-auto z-10"
        initial="hidden"
        animate="visible"
        variants={animations.containerVariants}
      >
        <motion.div 
          className="mb-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-full"
          variants={animations.itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <span className="font-mono">Hello, World!</span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          variants={animations.itemVariants}
          animate="animate"
          style={{ backgroundSize: "200% auto" }}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.3 }
          }}
        >
          {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
        </motion.h1>
        
        <motion.div 
          className="h-12 mb-8" 
          variants={animations.itemVariants}
        >
          <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-mono min-h-[2rem]">
            {typewriterText}
            <Cursor cursorStyle="|" />
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
          variants={animations.itemVariants}
        >
          {PERSONAL_INFO.shortBio}
        </motion.p>
        
        <motion.div 
          className="flex flex-row justify-center gap-4 mb-12"
          variants={animations.itemVariants}
        >
          <motion.div 
            className="md:w-auto"
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              href="#projects" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              View Projects <FaTerminal className="ml-2" />
            </Link>
          </motion.div>
          
          <motion.div 
            className="md:w-auto"
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              href="#contact" 
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.button 
          onClick={scrollToNextSection}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors"
          aria-label="Scroll down"
          variants={animations.floatingVariants}
          animate="idle"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowDown className="text-blue-600 dark:text-blue-400 text-2xl" />
        </motion.button>
      </motion.div>
      
      {/* Background blobs with more dynamic motion */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200 dark:bg-blue-900/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        variants={animations.backgroundBlobVariants}
        animate="animate"
        initial={{ opacity: 0.2 }}
        custom={1}
      />
      
      <motion.div 
        className="absolute top-40 right-10 w-80 h-80 bg-purple-200 dark:bg-purple-900/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        variants={animations.backgroundBlobVariants}
        animate="animate"
        initial={{ opacity: 0.2 }}
        custom={2}
      />
      
      <motion.div 
        className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-200 dark:bg-pink-900/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        variants={animations.backgroundBlobVariants}
        animate="animate"
        initial={{ opacity: 0.2 }}
        custom={3}
      />
      
      {/* Floating particle effects */}
      {mounted && particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`, 
            width: `${particle.size}px`, 
            height: `${particle.size}px`, 
            background: particle.color 
          }}
          variants={animations.particleVariants(particle.id % 5)}
          animate="animate"
        />
      ))}
    </section>
  );
} 