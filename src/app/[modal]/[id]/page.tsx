import { redirect } from 'next/navigation';
import { getSkills } from '@/data/skills';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experiences';
import { COMPANIES } from '@/data/companies';
import { PHILOSOPHY_PRINCIPLES } from '@/data/philosophy';
import ModalClient from '@/components/modal-client/ModalClient';

// Generate all possible modal paths for static site generation
export async function generateStaticParams() {
  const skills = getSkills();
  
  const paths = [
    // Skills paths
    ...skills.map(skill => ({
      modal: 'skills',
      id: skill.id
    })),
    
    // Projects paths
    ...PROJECTS.map(project => ({
      modal: 'projects',
      id: project.id
    })),
    
    // Experiences paths
    ...EXPERIENCES.map(experience => ({
      modal: 'experiences',
      id: experience.id
    })),
    
    // Companies paths
    ...Object.keys(COMPANIES).map(companyId => ({
      modal: 'companies',
      id: companyId
    })),
    
    // Philosophy paths
    ...PHILOSOPHY_PRINCIPLES.map(principle => ({
      modal: 'philosophy',
      id: principle.id
    }))
  ];
  
  return paths;
}

/**
 * Dynamic route handler for modal content
 * This is a server component that passes the modal information to a client component
 */
export default function ModalPage({
  params
}: {
  params: { modal: string; id: string }
}) {
  const { modal, id } = params;
  const skills = getSkills();
  
  // Get the appropriate section ID for scrolling
  const sectionMap: Record<string, string> = {
    'skills': 'tech-stack',
    'projects': 'projects',
    'experiences': 'experience',
    'companies': 'experience',
    'philosophy': 'philosophy',
  };
  
  const sectionId = sectionMap[modal] || 'hero';
  
  // Verify that the requested item exists
  let itemExists = false;
  
  if (modal === 'skills') {
    itemExists = skills.some(item => item.id === id);
  } else if (modal === 'projects') {
    itemExists = PROJECTS.some(item => item.id === id);
  } else if (modal === 'experiences') {
    itemExists = EXPERIENCES.some(item => item.id === id);
  } else if (modal === 'companies') {
    itemExists = !!COMPANIES[id];
  } else if (modal === 'philosophy') {
    itemExists = PHILOSOPHY_PRINCIPLES.some(item => item.id === id);
  }
  
  // If the item doesn't exist, redirect to the homepage
  if (!itemExists) {
    redirect('/');
  }
  
  // Render the client-side modal handler
  return (
    <ModalClient 
      modalType={modal}
      modalId={id}
      sectionId={sectionId}
    />
  );
} 