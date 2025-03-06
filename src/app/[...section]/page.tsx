import { VALID_URL_SECTIONS } from '@/lib/constants';
import Home from '../page';
import { notFound } from 'next/navigation';

// This function is required for static site generation with dynamic routes
// It tells Next.js which static paths to generate at build time
export function generateStaticParams() {
  return VALID_URL_SECTIONS.map(section => ({
    section: [section],
  }));
}

// This is a special Next.js metadata function for static exports
export function generateMetadata({ params }: { params: { section: string[] } }) {
  const section = params.section[0];
  
  // Validate the section
  if (!VALID_URL_SECTIONS.includes(section)) {
    return {
      title: 'Page Not Found',
      description: 'The requested section does not exist',
    };
  }

  // Format the section name for display (capitalize, replace hyphens with spaces)
  const formattedSection = section
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedSection} | Portfolio`,
    description: `View information about ${formattedSection}`,
  };
}

export default function SectionPage({ params }: { params: { section: string[] } }) {
  // Get section from URL
  const section = params.section[0];
  
  // Validate if this is a known section
  if (!VALID_URL_SECTIONS.includes(section)) {
    notFound();
  }
  
  // Pass the section to the Home component for client-side navigation
  // Also pass a key based on the section to force a re-render when changing sections directly
  return (
    <Home 
      initialSection={section}
      key={`section-page-${section}`} // Add key to force re-render when visiting different sections directly
    />
  );
} 