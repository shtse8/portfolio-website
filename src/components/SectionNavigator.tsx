"use client";

import { useState, useEffect, useMemo } from 'react';
import { FaHome, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope, FaLightbulb } from 'react-icons/fa';
import { useNavigationStore } from '@/context/NavigationContext';
import { SECTIONS } from '@/config/sections';

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

  // Define icons mapping and build sections from central config
  function getIconForSection(id: string) {
    switch (id) {
      case 'hero': return <FaHome className="text-lg" />;
      case 'tech-stack': return <FaCode className="text-lg" />;
      case 'philosophy': return <FaLightbulb className="text-lg" />;
      case 'projects': return <FaProjectDiagram className="text-lg" />;
      case 'experience': return <FaBriefcase className="text-lg" />;
      case 'contact': return <FaEnvelope className="text-lg" />;
      default: return null;
    }
  }
  const sections = useMemo<Section[]>(() => SECTIONS.map(s => ({
    id: s.id,
    label: s.label,
    icon: getIconForSection(s.id),
  })), []);

  // Initialize component with visibility check (container-aware)
  useEffect(() => {
    setMounted(true);

    const container = document.getElementById('main-content');

    const getScrollTop = () =>
      container instanceof HTMLElement ? container.scrollTop : window.scrollY;

    const getViewportHeight = () =>
      container instanceof HTMLElement ? container.clientHeight : window.innerHeight;

    const handleScroll = () => {
      // Show navigator after scrolling past ~50% of the viewport
      const scrollTop = getScrollTop();
      const viewport = getViewportHeight();
      if (scrollTop > viewport * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const target: HTMLElement | Window =
      container instanceof HTMLElement ? container : window;

    target.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      target.removeEventListener('scroll', handleScroll);
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