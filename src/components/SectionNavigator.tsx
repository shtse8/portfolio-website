"use client";

import { useState, useEffect, useMemo } from 'react';
import { FaHome, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';
import { useNavigationStore } from '@/context/NavigationContext';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function SectionNavigator() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Use Zustand store directly for better performance
  const activeSection = useNavigationStore(state => state.activeSection);
  const navigateToSection = useNavigationStore(state => state.navigateToSection);

  const sections = useMemo<Section[]>(() => [
    { id: 'hero', label: 'Home', icon: <FaHome className="text-lg" /> },
    { id: 'tech-stack', label: 'Skills', icon: <FaCode className="text-lg" /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="text-lg" /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase className="text-lg" /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="text-lg" /> },
  ], []);

  // Initialize component with visibility check
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      // Show navigator after scrolling past hero section
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle navigation click using Zustand store
  const handleNavClick = (sectionId: string) => {
    navigateToSection(sectionId);
  };

  if (!isVisible || !mounted) return null;

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