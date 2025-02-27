import { Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import FeaturedProjects from '@/components/FeaturedProjects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import FloatingNavBar from '@/components/FloatingNavBar';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased">
      <Header />
      <ScrollProgressIndicator />
      <FloatingNavBar />
      
      <div className="flex flex-col space-y-0">
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <TechStack />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedProjects />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Experience />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Contact />
        </Suspense>
      </div>
      
      <Footer />
    </main>
  );
}
