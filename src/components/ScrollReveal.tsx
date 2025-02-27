"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  threshold?: number;
  staggerChildren?: number;
  staggerDirection?: 'forward' | 'reverse';
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 50,
  once = true,
  threshold = 0.1,
  staggerChildren = 0.1,
  staggerDirection = 'forward',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold 
  });
  
  // Create variants based on direction
  const getVariants = (): Variants => {
    let initial = {};
    
    switch (direction) {
      case 'up':
        initial = { y: distance, opacity: 0 };
        break;
      case 'down':
        initial = { y: -distance, opacity: 0 };
        break;
      case 'left':
        initial = { x: distance, opacity: 0 };
        break;
      case 'right':
        initial = { x: -distance, opacity: 0 };
        break;
      case 'none':
        initial = { opacity: 0 };
        break;
    }
    
    return {
      hidden: initial,
      visible: { 
        x: 0, 
        y: 0, 
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for a smooth easing
          staggerChildren,
          staggerDirection: staggerDirection === 'reverse' ? -1 : 1,
        }
      }
    };
  };
  
  const containerVariants = getVariants();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div className={className}>{children}</div>;
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
} 