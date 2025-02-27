"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Negative values scroll slower, positive values scroll faster
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number; // Initial offset in pixels
}

export default function ParallaxSection({
  children,
  className = "",
  speed = 0.2,
  direction = 'up',
  offset = 0,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Get scroll progress relative to the section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Calculate transform values based on direction and speed
  let xRange: [number, number] = [0, 0];
  let yRange: [number, number] = [0, 0];
  
  switch (direction) {
    case 'down':
      yRange = [speed * -100, 0];
      break;
    case 'left':
      xRange = [speed * 100, 0];
      break;
    case 'right':
      xRange = [speed * -100, 0];
      break;
    case 'up':
    default:
      yRange = [speed * 100, 0];
      break;
  }
  
  // Create transform values based on scroll position - always call hooks
  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ 
          x, 
          y,
          translateX: offset,
          translateY: offset,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
} 