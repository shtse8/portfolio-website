"use client";

import { useCallback, ReactNode, useRef } from 'react';
import { useNavigationStore } from '@/context/NavigationContext';

interface DeepLinkProps {
  to: string; // section ID
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

/**
 * DeepLink component provides section-specific links for one-page navigation
 * Uses Zustand for state management
 */
export default function DeepLink({
  to,
  children,
  className = '',
  activeClassName = '',
  onClick,
}: DeepLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  // Use Zustand store directly for better performance
  const activeSection = useNavigationStore(state => state.activeSection);
  const navigateToSection = useNavigationStore(state => state.navigateToSection);
  
  // Check if this link is currently active
  const isActive = activeSection === to;
  
  // Handle click event - use Zustand store for navigation
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) onClick();
    
    // Use Zustand store to navigate
    navigateToSection(to);
  }, [to, onClick, navigateToSection]);

  return (
    <a
      ref={linkRef}
      href={to === 'hero' ? '/' : `/${to}`}
      className={`${className} ${isActive ? activeClassName : ''}`}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
} 