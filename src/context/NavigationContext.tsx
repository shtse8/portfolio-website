"use client";

import { create } from 'zustand';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { VALID_SECTIONS } from '@/lib/constants';

// Add these type declarations at the top of the file
interface WindowWithNavigationHandlers extends Window {
  __navigationObserver?: IntersectionObserver;
  __navigationPopStateHandler?: (event: Event) => void;
}

// Navigation state type definition
interface NavigationState {
  // State
  activeSection: string;
  sections: string[];
  isScrolling: boolean;
  
  // Actions
  setActiveSection: (section: string) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  navigateToSection: (sectionId: string) => void;
  
  // Setup functions
  setupIntersectionObserver: () => void;
  setupPopStateListener: () => void;
  cleanup: () => void;
}

// Create store with Zustand
export const useNavigationStore = create<NavigationState>((set, get) => ({
  // Initial state
  activeSection: 'hero',
  sections: VALID_SECTIONS,
  isScrolling: false,
  
  // Actions
  setActiveSection: (section) => set({ activeSection: section }),
  
  setIsScrolling: (isScrolling) => set({ isScrolling }),
  
  navigateToSection: (sectionId) => {
    const { isScrolling, setIsScrolling, setActiveSection } = get();
    
    if (isScrolling) return;
    
    setIsScrolling(true);
    setActiveSection(sectionId);
    
    
    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      // Update URL with pushState to create a history entry
      const targetPath = sectionId === 'hero' ? '/' : `/${sectionId}`;
      if (window.location.pathname !== targetPath) {
        // Use pushState instead of replaceState to create a history entry
        // This enables back/forward navigation
        window.history.pushState({ path: targetPath, section: sectionId }, '', targetPath);
      }
      
      // Scroll behavior options
      const scrollOptions: ScrollIntoViewOptions = { 
        behavior: 'smooth' as ScrollBehavior,
        block: 'start' as ScrollLogicalPosition
      };
      
      // Scroll into view
      element.scrollIntoView(scrollOptions);
      
      // Make a focus outline briefly appear to indicate the section (for accessibility)
      element.classList.add('section-focus');
      setTimeout(() => {
        element.classList.remove('section-focus');
      }, 1000);
    } else {
    }
    
    // Reset scrolling state after animation completes
    setTimeout(() => setIsScrolling(false), 800);
  },
  
  // Setup intersection observer
  setupIntersectionObserver: () => {
    const { sections, isScrolling, setActiveSection } = get();
    
    if (typeof window === 'undefined') return;
    
    // Skip setup if already scrolling
    if (isScrolling) return;
    
    
    const rootEl = document.getElementById('main-content');
    const observerOptions = {
      root: rootEl || null,
      rootMargin: '0px',
      threshold: 0.5
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isScrolling) return; // Don't change URL while programmatically scrolling
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          
          // Update URL without causing page refresh
          // Only if we're not already in the middle of a programmatic scroll
          const targetPath = sectionId === 'hero' ? '/' : `/${sectionId}`;
          
          // Only update URL if it's different from current path
          if (window.location.pathname !== targetPath) {
            
            // Use pushState to create a history entry
            window.history.pushState(
              { path: targetPath, section: sectionId, scrollTriggered: true }, 
              '', 
              targetPath
            );
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all sections
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      } else {
      }
    });
    
    // If some sections weren't found, try again after a short delay
    // This handles cases where the DOM hasn't fully loaded yet
    const missingElements = sections.filter(sectionId => !document.getElementById(sectionId));
    if (missingElements.length > 0) {
      setTimeout(() => {
        missingElements.forEach(sectionId => {
          const element = document.getElementById(sectionId);
          if (element) {
            observer.observe(element);
          }
        });
      }, 500);
    }
    
    // Store observer for cleanup
    (window as WindowWithNavigationHandlers).__navigationObserver = observer;
  },
  
  // Setup popstate listener for browser back/forward buttons
  setupPopStateListener: () => {
    const { sections, isScrolling, setIsScrolling, setActiveSection } = get();
    
    const handlePopState = () => {
      if (isScrolling) return; // Avoid interference during programmatic scrolling
      
      const path = window.location.pathname;
      
      // Determine section ID from path
      const sectionId = path === '/' ? 'hero' : path.substring(1);
      
      // Validate section ID
      if (sections.includes(sectionId)) {
        
        // Set the active section right away
        setActiveSection(sectionId);
        
        // Scroll to the correct section
        setIsScrolling(true);
        
        // Find the target section element
        const element = document.getElementById(sectionId);
        if (element) {
          // Scroll to the element
          element.scrollIntoView({ 
            behavior: 'smooth' as ScrollBehavior,
            block: 'start' as ScrollLogicalPosition
          });
          
          // Add visual focus
          element.classList.add('section-focus');
          setTimeout(() => {
            element.classList.remove('section-focus');
          }, 1000);
          
          // Reset scrolling flag after animation completes
          setTimeout(() => {
            setIsScrolling(false);
          }, 800);
        } else {
          setIsScrolling(false);
        }
      }
    };
    
    // Add the event listener
    window.addEventListener('popstate', handlePopState);
    
    // Store reference for cleanup
    (window as WindowWithNavigationHandlers).__navigationPopStateHandler = handlePopState;
    
  },
  
  // Cleanup function
  cleanup: () => {
    // Clean up intersection observer
    if ((window as WindowWithNavigationHandlers).__navigationObserver) {
      const observer = (window as WindowWithNavigationHandlers).__navigationObserver;
      const { sections } = get();
      
      if (observer) {
        sections.forEach(sectionId => {
          const element = document.getElementById(sectionId);
          if (element) {
            observer.unobserve(element);
          }
        });
      }
      
      delete (window as WindowWithNavigationHandlers).__navigationObserver;
    }
    
    // Clean up popstate listener
    if ((window as WindowWithNavigationHandlers).__navigationPopStateHandler) {
      const handler = (window as WindowWithNavigationHandlers).__navigationPopStateHandler;
      if (handler) {
        window.removeEventListener('popstate', handler);
      }
      delete (window as WindowWithNavigationHandlers).__navigationPopStateHandler;
    }
  }
}));

/**
 * NavigationProvider component
 * Sets up navigation functionality but doesn't provide context
 * (using Zustand store instead)
 */
export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sections, setActiveSection, setupIntersectionObserver, setupPopStateListener, cleanup } = useNavigationStore();
  
  // Initialize - set active section based on current URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const path = window.location.pathname;
    
    if (path === '/') {
      setActiveSection('hero');
    } else {
      const sectionId = path.substring(1);
      if (sections.includes(sectionId)) {
        setActiveSection(sectionId);
      }
    }
    
    // Setup observers and event listeners
    setupPopStateListener();
    
    // Setup intersection observer with a slight delay to ensure DOM is loaded
    setTimeout(() => {
      setupIntersectionObserver();
    }, 200);
    
    // Cleanup on unmount
    return cleanup;
  }, [pathname, sections, setActiveSection, setupIntersectionObserver, setupPopStateListener, cleanup]);
  
  return <>{children}</>;
}

/**
 * useNavigation hook
 * For compatibility with existing components using the Context API
 */
export function useNavigation() {
  const store = useNavigationStore();
  
  return {
    activeSection: store.activeSection,
    navigateToSection: store.navigateToSection,
    sections: store.sections
  };
} 