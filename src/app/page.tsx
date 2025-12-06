"use client";

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useNavigationStore } from '@/context/NavigationContext';

const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>
});
const TechStack = dynamic(() => import('@/components/TechStack'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});
const OpenSource = dynamic(() => import('@/components/OpenSource'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});
const Philosophy = dynamic(() => import('@/components/Philosophy'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});
const FeaturedProjects = dynamic(() => import('@/components/FeaturedProjects'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});
const Experience = dynamic(() => import('@/components/Experience'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});
const Credentials = dynamic(() => import('@/components/Credentials'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>
});

interface HomeProps {
  initialSection?: string;
}

export default function Home({ initialSection }: HomeProps) {
  // Reference to track if we've completed initial navigation
  const hasNavigated = useRef(false);
  
  // Access navigation store for section navigation
  
  // Navigate to initial section if provided (for direct section URLs)
  useEffect(() => {
    if (!initialSection || typeof window === 'undefined' || hasNavigated.current) {
      return;
    }
    
    
    const navigateStore = useNavigationStore.getState();
    
    // Set a flag to indicate we're scrolling programmatically
    navigateStore.setIsScrolling(true);
    
    // Force scroll to top first to ensure consistent starting position
    const container = document.getElementById('main-content');
    if (container) {
      (container as HTMLElement).scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
    
    // Scroll to the section with a delay to ensure DOM is loaded
    const timer = setTimeout(() => {
      const section = document.getElementById(initialSection);
      
      if (section) {
        
        // First update URL to match the section
        const targetPath = initialSection === 'hero' ? '/' : `/${initialSection}`;
        window.history.replaceState({ path: targetPath }, '', targetPath);
        
        // Then scroll to the section
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Reset scrolling flag with delay
        setTimeout(() => {
          navigateStore.setIsScrolling(false);
          navigateStore.setActiveSection(initialSection);
          
          // Mark that we've completed navigation
          hasNavigated.current = true;
          
          // Re-setup intersection observer
          navigateStore.setupIntersectionObserver();
        }, 800);
      } else {
        navigateStore.setIsScrolling(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [initialSection]);

  return (
    <>
      {/* Navigation elements */}
      <Header />
      
      {/* Hero section */}
      <div id="hero" className="min-h-[95vh] w-full flex items-center justify-center scroll-mt-20">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
      </div>

      {/* Technical skills section */}
      <div id="tech-stack" className="py-40 scroll-mt-20">
        <ErrorBoundary>
          <TechStack />
        </ErrorBoundary>
      </div>

      {/* Open Source section */}
      <div id="open-source" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/30 scroll-mt-20">
        <ErrorBoundary>
          <OpenSource />
        </ErrorBoundary>
      </div>

      {/* Philosophy section */}
      <div id="philosophy" className="py-40 bg-gray-50 dark:bg-gray-900/20 scroll-mt-20">
        <ErrorBoundary>
          <Philosophy />
        </ErrorBoundary>
      </div>

      {/* Projects section */}
      <div id="projects" className="py-40 bg-gray-100 dark:bg-gray-800/30 scroll-mt-20">
        <ErrorBoundary>
          <FeaturedProjects />
        </ErrorBoundary>
      </div>

      {/* Experience section */}
      <div id="experience" className="py-40 bg-white dark:bg-gray-900/10 scroll-mt-20">
        <ErrorBoundary>
          <Experience />
        </ErrorBoundary>
      </div>

      {/* Credentials section */}
      <div id="credentials" className="py-40 bg-gray-50 dark:bg-gray-900/20 scroll-mt-20">
        <ErrorBoundary>
          <Credentials />
        </ErrorBoundary>
      </div>

      {/* Contact section */}
      <div id="contact" className="py-40 bg-gray-100 dark:bg-gray-800/30 scroll-mt-20">
        <ErrorBoundary>
          <Contact />
        </ErrorBoundary>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
