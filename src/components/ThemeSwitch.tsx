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
    if (theme === 'dark') return <FaMoon className="text-accent-contrast" />;
    if (theme === 'light') return <FaSun className="text-positive" />;
    return <FaDesktop className="text-accent" />;
  };
  
  // Prevent hydration mismatch by returning a placeholder during SSR
  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center">
        <span className="sr-only">Theme toggle</span>
      </div>
    );
  }
  
  // For mobile view, just render the theme options inline
  if (isMobile) {
    return (
      <div className="space-y-4">
        <p className="text-text-secondary font-medium">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => toggleTheme('light')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
              theme === 'light' 
                ? 'bg-accent-subtle text-accent' 
                : 'border border-border bg-surface hover:bg-surface-sunken'
            }`}
          >
            <FaSun className="text-xl mb-1 text-positive" />
            <span className="text-sm">Light</span>
          </button>
          
          <button
            onClick={() => toggleTheme('dark')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
              theme === 'dark' 
                ? 'bg-accent-subtle text-accent' 
                : 'border border-border bg-surface hover:bg-surface-sunken'
            }`}
          >
            <FaMoon className="text-xl mb-1 text-text-secondary" />
            <span className="text-sm">Dark</span>
          </button>
          
          <button
            onClick={() => toggleTheme('system')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
              theme === 'system' 
                ? 'bg-accent-subtle text-accent' 
                : 'border border-border bg-surface hover:bg-surface-sunken'
            }`}
          >
            <FaDesktop className="text-xl mb-1 text-accent" />
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
        className="p-2 rounded-full border border-border bg-surface text-text-secondary hover:border-text-tertiary hover:bg-surface-sunken transition-colors"
      >
        {getActiveIcon()}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-surface rounded-xl border border-border shadow-md z-50 min-w-[120px] animate-fade-in">
          <button
            onClick={() => toggleTheme('light')}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              theme === 'light' ? 'bg-accent-subtle text-accent' : 'hover:bg-surface-sunken'
            }`}
          >
            <FaSun className="mr-2 text-positive" />
            Light
          </button>
          
          <button
            onClick={() => toggleTheme('dark')}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              theme === 'dark' ? 'bg-accent-subtle text-accent' : 'hover:bg-surface-sunken'
            }`}
          >
            <FaMoon className="mr-2 text-text-secondary" />
            Dark
          </button>
          
          <button
            onClick={() => toggleTheme('system')}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              theme === 'system' ? 'bg-accent-subtle text-accent' : 'hover:bg-surface-sunken'
            }`}
          >
            <FaDesktop className="mr-2 text-accent" />
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