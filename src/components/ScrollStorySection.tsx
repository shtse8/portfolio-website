"use client";

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';

interface ScrollStorySectionProps {
  children: React.ReactNode;
  className?: string;
  stickyHeight?: number; // Height in vh units for the sticky section
  progressContent?: (progress: number) => React.ReactNode; // Optional function to render content based on progress
  background?: React.ReactNode; // Optional background content
}

export default function ScrollStorySection({
  children,
  className = "",
  stickyHeight = 300, // Default to 300vh (3x viewport height)
  progressContent,
  background,
}: ScrollStorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  // Get scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Transform scroll progress to opacity for fade effects
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );
  
  // Transform scroll progress to scale for zoom effects
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 1.2]
  );
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ height: `${stickyHeight}vh` }}
    >
      {/* Sticky container that stays fixed during scroll */}
      <div 
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Optional background layer */}
        {background && (
          <div className="absolute inset-0 w-full h-full">
            {background}
          </div>
        )}
        
        {/* Main content with animations */}
        <motion.div 
          className="relative z-10 w-full h-full"
          style={{ opacity, scale }}
        >
          {children}
        </motion.div>
        
        {/* Optional progress-based content */}
        {progressContent && (
          <motion.div 
            className="absolute inset-0 z-20 w-full h-full pointer-events-none"
            style={{ opacity }}
          >
            {typeof progressContent === 'function' && (
              <ProgressContent 
                progress={scrollYProgress} 
                render={progressContent} 
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper component to render content based on scroll progress
function ProgressContent({ 
  progress, 
  render 
}: { 
  progress: MotionValue<number>; 
  render: (progress: number) => React.ReactNode;
}) {
  const [currentProgress, setCurrentProgress] = useState(0);
  
  useMotionValueEvent(progress, "change", (latest: number) => {
    setCurrentProgress(latest);
  });
  
  return <>{render(currentProgress)}</>;
} 