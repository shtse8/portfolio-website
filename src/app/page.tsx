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
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Navigation elements */}
      <Header />
      <ScrollProgressIndicator />
      <FloatingNavBar />
      
      {/* Hero section with full-height display */}
      <div className="min-h-[95vh] w-full flex items-center justify-center">
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
          <Hero />
        </Suspense>
      </div>
      
      {/* Technical skills with Swedish-inspired spacing */}
      <div className="py-40">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <TechStack />
        </Suspense>
      </div>
      
      {/* Projects section with refined spacing and darker background */}
      <div className="py-40 bg-gray-100 dark:bg-gray-800/30">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <FeaturedProjects />
        </Suspense>
      </div>
      
      {/* Experience section with Swedish-inspired styling */}
      <div className="py-40 bg-white dark:bg-gray-900/10">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <Experience />
        </Suspense>
      </div>
      
      {/* Contact section */}
      <div className="py-40 bg-gray-100 dark:bg-gray-800/30">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <Contact />
        </Suspense>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
