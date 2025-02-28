"use client";

import { motion } from 'framer-motion';
import { useScrollAnimation } from './ScrollAnimationProvider';

export default function ScrollProgressIndicator() {
  const { smoothScrollYProgress } = useScrollAnimation();
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-0.5 bg-blue-500/70 dark:bg-blue-400/60 z-[1000] backdrop-blur-[1px] origin-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ scaleX: smoothScrollYProgress }}
    />
  );
} 