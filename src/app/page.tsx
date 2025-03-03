import { Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import FeaturedProjects from '@/components/FeaturedProjects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import Philosophy from '@/components/Philosophy';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Navigation elements */}
      <Header />
      
      {/* Hero section with full-height display */}
      <div id="hero" className="min-h-[95vh] w-full flex items-center justify-center">
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
          <Hero />
        </Suspense>
      </div>
      
      {/* Technical skills with Swedish-inspired spacing */}
      <div id="tech-stack" className="py-40">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <TechStack />
        </Suspense>
      </div>
      
      {/* Philosophy section with elegant design */}
      <div id="philosophy" className="py-40 bg-gray-50 dark:bg-gray-900/20">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <Philosophy />
        </Suspense>
      </div>
      
      {/* Projects section with refined spacing and darker background */}
      <div id="projects" className="py-40 bg-gray-100 dark:bg-gray-800/30">
        <Suspense fallback={<div className="w-full py-24 flex items-center justify-center"><LoadingSpinner /></div>}>
          <FeaturedProjects />
        </Suspense>
      </div>
      
      {/* Experience section with Swedish-inspired styling */}
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
