"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SkillModal from '@/components/skills/SkillModal';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experiences';
import { COMPANIES } from '@/data/companies';
import dynamic from 'next/dynamic';

// Dynamically import the modal components to avoid circular dependencies
const ProjectModal = dynamic(() => import('@/components/projects/ProjectModal'));
const ExperienceModal = dynamic(() => import('@/components/experience/ExperienceModal'));
const CompanyModal = dynamic(() => import('@/components/shared/CompanyModal'));

/**
 * Client-side modal handler component that renders the appropriate modal type
 * and handles navigation and close functionality
 */
interface ModalClientProps {
  modalType: string;
  modalId: string;
  sectionId: string;
}

export default function ModalClient({ modalType, modalId, sectionId }: ModalClientProps) {
  const router = useRouter();
  
  // Handle modal close - navigate back to the main page with section scroll
  const handleClose = () => {
    router.push(`/#${sectionId}`);
  };
  
  // Add keyboard event listeners to handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, sectionId]);

  // Prevent scrolling of the main content when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Handle philosophy redirect
  useEffect(() => {
    if (modalType === 'philosophy') {
      router.push(`/#philosophy`);
    }
  }, [modalType, router]);
  
  // Find item data for the requested modal
  const project = modalType === 'projects' ? PROJECTS.find(p => p.id === modalId) : null;
  const experience = modalType === 'experiences' ? EXPERIENCES.find(e => e.id === modalId) : null;
  const company = modalType === 'companies' ? COMPANIES[modalId] : null;
  
  // Helper functions for modals
  const parseMarkdownLinks = (text: string) => text; // Simple placeholder
  
  // Dummy functions that won't be used in this context but are needed for props
  const openExperienceModal = () => {};
  const openProjectModal = () => {};
  const openCompanyModal = () => {};
  
  // If it's a philosophy modal, don't render anything as we're redirecting
  if (modalType === 'philosophy') {
    return null;
  }
  
  // Render appropriate modal based on type
  switch (modalType) {
    case 'skills':
      return <SkillModal skillId={modalId} closeModal={handleClose} />;
      
    case 'projects':
      return project ? (
        <ProjectModal 
          project={project} 
          closeModal={handleClose} 
          openExperienceModal={openExperienceModal}
          openCompanyModal={openCompanyModal}
          parseMarkdownLinks={parseMarkdownLinks}
        />
      ) : null;
      
    case 'experiences':
      return experience ? (
        <ExperienceModal 
          experience={experience} 
          closeModal={handleClose}
          openCompanyModal={openCompanyModal}
          parseMarkdownLinks={parseMarkdownLinks}
        />
      ) : null;
      
    case 'companies':
      return company ? (
        <CompanyModal 
          company={company} 
          closeModal={handleClose}
          openProjectModal={openProjectModal}
          openExperienceModal={openExperienceModal}
        />
      ) : null;
      
    default:
      return null;
  }
} 