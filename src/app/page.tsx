"use client";

import { Suspense, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import FeaturedProjects from '@/components/FeaturedProjects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import Philosophy from '@/components/Philosophy';
import { useNavigationStore } from '@/context/NavigationContext';

interface HomeProps {
  initialSection?: string;
}

export default function Home({ initialSection }: HomeProps) {
  // Reference to track if we've completed initial navigation
  const hasNavigated = useRef(false);
  
  // Access navigation store for section navigation
  const navigateToSection = useNavigationStore(state => state.navigateToSection);
  
  // Navigate to initial section if provided (for direct section URLs)
  useEffect(() => {
    if (!initialSection || typeof window === 'undefined' || hasNavigated.current) {
      return;
    }
    
    console.log(`Home component: Directly navigating to section "${initialSection}"`);
    
    const navigateStore = useNavigationStore.getState();
    
    // Set a flag to indicate we're scrolling programmatically
    navigateStore.setIsScrolling(true);
    
    // Force scroll to top first to ensure consistent starting position
    window.scrollTo(0, 0);
    
    // Scroll to the section with a delay to ensure DOM is loaded
    const timer = setTimeout(() => {
      const section = document.getElementById(initialSection);
      
      if (section) {
        console.log(`Found section element, scrolling to ${initialSection}`);
        
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
        console.error(`Section element "${initialSection}" not found in the DOM`);
        navigateStore.setIsScrolling(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [initialSection, navigateToSection]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Navigation elements */}
      <Header />
      
      {/* Hero section */}
      <div id="hero" className="min-h-[95vh] w-full flex items-center justify-center">
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
          <Hero />
        </Suspense>
      </div>
      
      {/* Technical skills section */}
      <div id="tech-stack" className="py-40">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <TechStack />
        </Suspense>
      </div>
      
      {/* Philosophy section */}
      <div id="philosophy" className="py-40 bg-gray-50 dark:bg-gray-900/20">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <Philosophy />
        </Suspense>
      </div>
      
      {/* Projects section */}
      <div id="projects" className="py-40 bg-gray-100 dark:bg-gray-800/30">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <FeaturedProjects />
        </Suspense>
      </div>
      
      {/* Experience section */}
      <div id="experience" className="py-40 bg-white dark:bg-gray-900/10">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <Experience />
        </Suspense>
      </div>
      
      {/* Contact section */}
      <div id="contact" className="py-40 bg-gray-100 dark:bg-gray-800/30">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <Contact />
        </Suspense>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
