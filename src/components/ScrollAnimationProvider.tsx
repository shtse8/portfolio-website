"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent, useSpring, MotionValue } from 'framer-motion';

interface ScrollContextType {
  scrollYProgress: MotionValue<number>;
  smoothScrollYProgress: MotionValue<number>;
  scrollYPercentage: number;
  viewportHeight: number;
  documentHeight: number;
  scrollDirection: 'up' | 'down' | null;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollAnimation = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollAnimation must be used within a ScrollAnimationProvider');
  }
  return context;
};

export default function ScrollAnimationProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [scrollYPercentage, setScrollYPercentage] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Create scroll progress motion value
  const { scrollYProgress } = useScroll();
  
  // Create a smoother version of the scroll progress
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Update scroll values on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollYPercentage(latest * 100);
    
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    }
  });

  // Update viewport and document heights
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateHeights = () => {
      setViewportHeight(window.innerHeight);
      setDocumentHeight(document.documentElement.scrollHeight);
    };
    
    updateHeights();
    window.addEventListener('resize', updateHeights);
    
    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  const value = {
    scrollYProgress,
    smoothScrollYProgress,
    scrollYPercentage,
    viewportHeight,
    documentHeight,
    scrollDirection
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
} 