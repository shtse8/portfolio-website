"use client";

import { useState, useEffect } from 'react';
import { FaHome, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function SectionNavigator() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const sections: Section[] = [
    { id: 'hero', label: 'Home', icon: <FaHome className="text-lg" /> },
    { id: 'tech', label: 'Skills', icon: <FaCode className="text-lg" /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="text-lg" /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase className="text-lg" /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="text-lg" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show navigator after scrolling past hero section
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
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col space-y-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleNavClick(section.id)}
            className={`p-2 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-blue-600 text-white transform scale-110'
                : 'text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-700'
            }`}
            aria-label={section.label}
            title={section.label}
          >
            {section.icon}
          </button>
        ))}
      </div>
    </div>
  );
} 