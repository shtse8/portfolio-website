"use client";

import { useState, useEffect } from 'react';
import { FaHome, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function FloatingNavBar() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const sections: Section[] = [
    { id: 'hero', label: 'Home', icon: <FaHome className="md:mr-2" /> },
    { id: 'tech', label: 'Skills', icon: <FaCode className="md:mr-2" /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="md:mr-2" /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase className="md:mr-2" /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="md:mr-2" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling past hero section
      if (window.scrollY > window.innerHeight * 0.5) {
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-2 px-3 rounded-full shadow-lg">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleNavClick(section.id)}
            className={`p-2 md:px-3 rounded-full transition-all duration-300 flex items-center ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-700'
            } mx-1`}
            aria-label={section.label}
            title={section.label}
          >
            {section.icon}
            <span className="hidden md:inline text-sm font-medium">{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 