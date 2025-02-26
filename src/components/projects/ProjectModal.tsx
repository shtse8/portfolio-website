"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaGooglePlay, FaApple, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { Project, Experience, COMPANIES, EXPERIENCES } from '../../data/portfolioData';

type ProjectModalProps = {
  project: Project;
  closeModal: () => void;
  nextProject: () => void;
  prevProject: () => void;
  openExperienceModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  modalContentRef: React.RefObject<HTMLDivElement>;
};

export default function ProjectModal({
  project,
  closeModal,
  nextProject,
  prevProject,
  openExperienceModal,
  openCompanyModal,
  parseMarkdownLinks,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  modalContentRef
}: ProjectModalProps) {
  const getExperienceForProject = (): Experience | null => {
    if (project.company) {
      const relatedExperiences = EXPERIENCES.filter(exp => exp.company === project.company);
      return relatedExperiences.length > 0 ? relatedExperiences[0] : null;
    }
    return null;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        nextProject();
      } else if (e.key === 'ArrowLeft') {
        prevProject();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, nextProject, prevProject]);

  const relatedExperience = getExperienceForProject();
  
  return (
    <div 
      ref={modalContentRef}
      className="bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
        <button 
          onClick={closeModal}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={24} />
        </button>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center space-x-1">
            {project.company && COMPANIES[project.company] && (
              <button
                onClick={() => openCompanyModal(project.company as string)}
                className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full mr-2 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
              >
                <span className="w-4 h-4 mr-1 relative">
                  <Image
                    src={COMPANIES[project.company].logo}
                    alt={COMPANIES[project.company].name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  />
                </span>
                {COMPANIES[project.company].name}
              </button>
            )}
            {relatedExperience && (
              <button
                onClick={() => {
                  const index = EXPERIENCES.findIndex(exp => exp.id === relatedExperience.id);
                  if (index !== -1) {
                    openExperienceModal(index);
                  }
                }}
                className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center"
                title={COMPANIES[relatedExperience.company]?.name || ""}
              >
                {relatedExperience.period}
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            {project.github && (
              <Link 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub size={20} />
              </Link>
            )}
            {project.liveUrl && (
              <Link 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={18} />
              </Link>
            )}
            {project.androidUrl && (
              <Link 
                href={project.androidUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGooglePlay size={20} />
              </Link>
            )}
            {project.iosUrl && (
              <Link 
                href={project.iosUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <FaApple size={20} />
              </Link>
            )}
          </div>
        </div>
        
        {/* Project Image */}
        <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        
        {/* Project Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">{project.description}</p>
        
        {/* Project Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Project Details</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            {project.details.map((detail, index) => (
              <li key={index}>{parseMarkdownLinks(detail)}</li>
            ))}
          </ul>
        </div>
        
        {/* Technologies */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            prevProject();
          }}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <FaChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            nextProject();
          }}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <FaChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
} 