"use client";

import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

type ThemeType = 'light' | 'dark' | 'system';

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Only run client-side code after mounting
  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('themePreference') as ThemeType | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);
  
  const toggleTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('themePreference', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsOpen(false);
  };
  
  useEffect(() => {
    if (!mounted) return;
    
    // Setup system theme listener if system theme is selected
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      // Apply initial system preference
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, mounted]);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest('.theme-switch-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, mounted]);
  
  // Get the appropriate icon
  const getActiveIcon = () => {
    if (theme === 'dark') return <FaMoon className="text-white" />;
    if (theme === 'light') return <FaSun className="text-yellow-500" />;
    return <FaDesktop className="text-blue-500" />;
  };
  
  // Prevent hydration mismatch by returning a placeholder during SSR
  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <span className="sr-only">Theme toggle</span>
      </div>
    );
  }
  
  return (
    <div className="theme-switch-container relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme options"
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
      >
        {getActiveIcon()}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 min-w-[120px] animate-fadeIn">
          <button
            onClick={() => toggleTheme('light')}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              theme === 'light' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FaSun className="mr-2 text-yellow-500" />
            Light
          </button>
          
          <button
            onClick={() => toggleTheme('dark')}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              theme === 'dark' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FaMoon className="mr-2 text-gray-600 dark:text-gray-400" />
            Dark
          </button>
          
          <button
            onClick={() => toggleTheme('system')}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              theme === 'system' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FaDesktop className="mr-2 text-blue-500" />
            System
          </button>
        </div>
      )}
    </div>
  );
} 