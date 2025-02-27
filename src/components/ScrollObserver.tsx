"use client";

import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    // Only run this code on the client and after hydration
    if (typeof window === 'undefined') return;
    
    // Small delay to ensure hydration is complete before applying animations
    const timer = setTimeout(() => {
      // Function to handle intersection observations
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            
            // Add animation to children with delays if they have the right classes
            const animatedChildren = entry.target.querySelectorAll('.animate-child');
            animatedChildren.forEach((child, index) => {
              const delay = index % 3;
              if (delay === 0) child.classList.add('animation-delay-300');
              if (delay === 1) child.classList.add('animation-delay-600');
              if (delay === 2) child.classList.add('animation-delay-900');
              
              setTimeout(() => {
                child.classList.add('animate-on-scroll');
              }, 100); // Small delay to ensure parent animation starts first
            });
          }
        });
      };

      // Create observer
      const observer = new IntersectionObserver(handleIntersection, {
        root: null, // Use viewport as root
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Adjust trigger area (negative bottom margin to trigger earlier)
      });

      // Observe all sections
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        // First ensure any server-side added classes are removed
        section.classList.remove('animate-on-scroll');
        observer.observe(section);
      });

      // Observe other elements with animation classes
      const animatedElements = document.querySelectorAll('.should-animate:not(section)');
      animatedElements.forEach(element => {
        // First ensure any server-side added classes are removed
        element.classList.remove('animate-on-scroll');
        observer.observe(element);
      });

      return () => {
        // Cleanup
        sections.forEach(section => observer.unobserve(section));
        animatedElements.forEach(element => observer.unobserve(element));
      };
    }, 100); // Short delay to ensure hydration is complete
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This is a utility component with no UI
} 