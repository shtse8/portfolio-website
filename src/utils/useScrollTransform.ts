"use client";

import { useTransform } from 'framer-motion';
import { useScrollAnimation } from '@/components/ScrollAnimationProvider';

/**
 * Custom hook for creating scroll-driven animations
 * 
 * @param inputRange Array of scroll progress values from 0 to 1
 * @param outputRange Array of output values corresponding to the input range
 * @param options Configuration options
 * @returns A motion value that changes based on scroll position
 */
export function useScrollTransform<T>(
  inputRange: number[],
  outputRange: T[],
  options: {
    smooth?: boolean;
    clamp?: boolean;
  } = { smooth: true, clamp: true }
) {
  const { scrollYProgress, smoothScrollYProgress } = useScrollAnimation();
  const scrollSource = options.smooth ? smoothScrollYProgress : scrollYProgress;
  
  return useTransform(scrollSource, inputRange, outputRange, {
    clamp: options.clamp
  });
}

/**
 * Custom hook for creating scroll-driven animations within a specific section
 * 
 * @param sectionRef Reference to the section element
 * @param inputRange Array of scroll progress values from 0 to 1 within the section
 * @param outputRange Array of output values corresponding to the input range
 * @param options Configuration options
 * @returns A motion value that changes based on scroll position within the section
 */
export function useSectionScrollTransform<T>(
  sectionRef: React.RefObject<HTMLElement>,
  inputRange: number[],
  outputRange: T[],
  options: {
    smooth?: boolean;
    clamp?: boolean;
    threshold?: number;
  } = { smooth: true, clamp: true, threshold: 0.1 }
) {
  const { scrollYProgress, smoothScrollYProgress, viewportHeight } = useScrollAnimation();
  const scrollSource = options.smooth ? smoothScrollYProgress : scrollYProgress;
  
  // Create a transformed motion value that only applies when the section is in view
  return useTransform(scrollSource, () => {
    if (!sectionRef.current) return outputRange[0];
    
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    // Calculate how far the section is through the viewport
    const sectionProgress = 1 - (sectionTop / viewportHeight);
    
    // Normalize to 0-1 range for the visible portion of the section
    const visibleHeight = Math.min(viewportHeight, sectionHeight);
    const normalizedProgress = (sectionProgress * viewportHeight) / visibleHeight;
    
    // Apply threshold to create a "sticky" effect
    const thresholdedProgress = Math.max(0, Math.min(1, (normalizedProgress - options.threshold!) / (1 - options.threshold! * 2)));
    
    // Map to output range
    const index = Math.max(0, Math.min(inputRange.length - 1, 
      inputRange.findIndex(val => val >= thresholdedProgress) - 1));
      
    if (index === -1) return outputRange[0];
    
    const startInput = inputRange[index];
    const endInput = inputRange[index + 1] || 1;
    const startOutput = outputRange[index];
    const endOutput = outputRange[index + 1] || outputRange[outputRange.length - 1];
    
    // Linear interpolation between the two nearest points
    const progress = (thresholdedProgress - startInput) / (endInput - startInput);
    
    if (typeof startOutput === 'number' && typeof endOutput === 'number') {
      return startOutput + progress * (endOutput - startOutput);
    }
    
    return progress <= 0.5 ? startOutput : endOutput;
  });
} 