"use client";

import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

type ThemeType = 'light' | 'dark' | 'system';

// Export ThemeType and the toggleTheme function to use in the mobile menu
export type { ThemeType };

interface ThemeSwitchProps {
  isMobile?: boolean;
  onThemeChange?: (theme: ThemeType) => void;
}

export default function ThemeSwitch({ isMobile = false, onThemeChange }: ThemeSwitchProps) {
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
    
    // Close dropdown if not mobile
    if (!isMobile) {
      setIsOpen(false);
    }
    
    // Call onThemeChange callback if provided
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
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
    if (!mounted || isMobile) return;
    
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
  }, [isOpen, mounted, isMobile]);
  
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
  
  // For mobile view, just render the theme options inline
  if (isMobile) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 font-medium">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => toggleTheme('light')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
              theme === 'light' 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FaSun className="text-xl mb-1 text-yellow-500" />
            <span className="text-sm">Light</span>
          </button>
          
          <button
            onClick={() => toggleTheme('dark')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
              theme === 'dark' 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FaMoon className="text-xl mb-1 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">Dark</span>
          </button>
          
          <button
            onClick={() => toggleTheme('system')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
              theme === 'system' 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FaDesktop className="text-xl mb-1 text-blue-500" />
            <span className="text-sm">System</span>
          </button>
        </div>
      </div>
    );
  }
  
  // Desktop view with dropdown
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

// Export a function to get the current theme from localStorage
export function getCurrentTheme(): ThemeType {
  if (typeof window === 'undefined') return 'system';
  
  const savedTheme = localStorage.getItem('themePreference') as ThemeType | null;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }
  
  return 'system';
} 