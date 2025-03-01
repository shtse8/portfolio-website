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
    { id: 'hero', label: 'Home', icon: <FaHome className="mr-2" /> },
    { id: 'tech-stack', label: 'Skills', icon: <FaCode className="mr-2" /> },
    { id: 'philosophy', label: 'Philosophy', icon: <FaLightbulb className="mr-2" /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="mr-2" /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase className="mr-2" /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="mr-2" /> },
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
        <div className="fixed bottom-8 inset-x-0 flex justify-center items-center z-40">
          <motion.nav
            className="inline-flex bg-white/60 dark:bg-gray-900/50 backdrop-blur-md py-3.5 px-6 rounded-full"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className={`px-3 py-2 rounded-full transition-all duration-300 flex items-center ${
                  activeSection === section.id
                    ? 'bg-blue-500/70 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/40 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                aria-label={section.label}
                title={section.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  margin: index === 0 ? '0 4px 0 0' : 
                         index === sections.length - 1 ? '0 0 0 4px' : 
                         '0 4px'
                }}
              >
                {section.icon}
                <span className="hidden md:inline text-sm font-light tracking-wide ml-1">{section.label}</span>
              </motion.button>
            ))}
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
} 