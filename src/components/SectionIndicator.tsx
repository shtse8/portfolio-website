"use client";

import { useState, useEffect } from 'react';

export default function SectionIndicator() {
  const [currentSection, setCurrentSection] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      // Find the section that occupies most of the viewport
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        
        // When section is 25% into the viewport or less distance to top
        if (sectionTop <= window.innerHeight * 0.25) {
          current = section.id;
        }
      });
      
      setCurrentSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Map section IDs to readable names
  const sectionNames: { [key: string]: string } = {
    'hero': 'Home',
    'tech': 'Technical Skills',
    'projects': 'Projects',
    'experience': 'Experience',
    'contact': 'Contact',
  };

  // Don't render during SSR
  if (!mounted || !currentSection) return null;

  return (
    <div className="fixed top-20 left-4 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-md hidden md:block">
      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        Currently viewing: <span className="font-bold">{sectionNames[currentSection] || currentSection}</span>
      </div>
    </div>
  );
} 