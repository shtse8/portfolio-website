"use client";

import { motion } from 'framer-motion';
import { useScrollAnimation } from './ScrollAnimationProvider';

export default function ScrollProgressIndicator() {
  const { smoothScrollYProgress } = useScrollAnimation();
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-primary-600 dark:bg-primary-400 z-[1000] origin-left" 
      style={{ scaleX: smoothScrollYProgress }}
    />
  );
} 