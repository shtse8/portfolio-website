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
import ScrollObserver from '@/components/ScrollObserver';
import ProgressBar from '@/components/ProgressBar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ProgressBar />
      <Header />
      <FloatingNavBar />
      <ScrollObserver />
      
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
      
      <Footer />
    </main>
  );
}
