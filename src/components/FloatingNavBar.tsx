"use client";

import { useState, useEffect, useMemo } from 'react';
import { FaHome, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope, FaLightbulb } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function FloatingNavBar() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const sections = useMemo<Section[]>(() => [
    { id: 'hero', label: 'Home', icon: <FaHome className="text-sm" /> },
    { id: 'philosophy', label: 'Philosophy', icon: <FaLightbulb className="text-sm" /> },
    { id: 'tech-stack', label: 'Skills', icon: <FaCode className="text-sm" /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase className="text-sm" /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="text-sm" /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="text-sm" /> },
  ], []);

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
        <div className="fixed bottom-8 inset-x-0 flex justify-center items-center z-40 pointer-events-none md:hidden">
          <motion.nav
            className="inline-flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-md 
                      py-3 px-4 rounded-full shadow-md
                      border border-gray-100/50 dark:border-gray-800/50
                      pointer-events-auto"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25, 
              mass: 0.8 
            }}
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className={`relative flex items-center justify-center 
                            transition-all duration-300 rounded-full mx-1
                            ${isActive 
                              ? 'text-white' 
                              : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                            }
                            w-10 h-10 xs:h-10 xs:w-auto xs:px-3`}
                  aria-label={section.label}
                  title={section.label}
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
                      className="absolute inset-0 bg-blue-500 dark:bg-blue-500 rounded-full"
                      layoutId="activeBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
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