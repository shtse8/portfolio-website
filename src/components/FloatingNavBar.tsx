"use client";

import { useState, useEffect, useMemo } from 'react';
import { FaHome, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope, FaLightbulb } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function FloatingNavBar() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Define navigation sections
  const sections = useMemo<Section[]>(() => [
    { id: 'hero', label: 'Home', icon: <FaHome className="w-3.5 h-3.5" /> },
    { id: 'tech-stack', label: 'Skills', icon: <FaCode className="w-3.5 h-3.5" /> },
    { id: 'philosophy', label: 'Philosophy', icon: <FaLightbulb className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="w-3.5 h-3.5" /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="w-3.5 h-3.5" /> },
  ], []);

  // Initialize and handle scroll events
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      // Show navbar after scrolling past hero section with a small buffer
      if (window.scrollY > window.innerHeight * 0.6) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      // Determine which section is currently in view
      const sectionElements = sections.map(section => {
        const element = document.getElementById(section.id);
        if (!element) return null;
        
        const rect = element.getBoundingClientRect();
        return {
          id: section.id,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height
        };
      }).filter(Boolean);
      
      // The section where most of it is in the viewport is the active one
      let currentSection = '';
      let maxVisibleHeight = 0;
      
      sectionElements.forEach(section => {
        if (!section) return;
        
        const visibleTop = Math.max(0, section.top);
        const visibleBottom = Math.min(window.innerHeight, section.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          currentSection = section.id;
        }
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);
  
  // Handle navigation click
  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Don't render anything on the server to prevent hydration issues
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center items-center z-40 pointer-events-none md:hidden">
          <motion.nav
            className={cn(
              "inline-flex bg-white/90 dark:bg-gray-900/90 backdrop-blur-md",
              "py-2.5 px-3.5 rounded-lg shadow-md",
              "border border-gray-100/50 dark:border-gray-800/50",
              "pointer-events-auto"
            )}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25, 
              mass: 0.8 
            }}
            aria-label="Mobile navigation"
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className={cn(
                    "relative flex items-center justify-center",
                    "transition-all duration-300 rounded-md",
                    isActive 
                      ? "text-white" 
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400",
                    "w-9 h-9 xs:h-9 xs:w-auto xs:px-2.5 mx-0.5"
                  )}
                  aria-label={section.label}
                  aria-current={isActive ? "page" : undefined}
                  whileHover={{ 
                    y: -2,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 12 
                    } 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background for active section */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-blue-500 dark:bg-blue-500 rounded-md"
                      layoutId="activeBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
                      aria-hidden="true"
                    />
                  )}
                  
                  <span className="relative flex items-center justify-center z-10">
                    <span className="flex items-center justify-center">{section.icon}</span>
                    <span className="hidden xs:inline-block ml-1.5 text-xs font-light tracking-wide">{section.label}</span>
                  </span>
                </motion.button>
              );
            })}
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
} 