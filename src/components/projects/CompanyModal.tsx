"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaTimes, FaMapMarkerAlt, FaBuilding, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { Company, Project, Experience, PROJECTS, EXPERIENCES } from '../../data/portfolioData';

type CompanyModalProps = {
  company: Company;
  closeModal: () => void;
  openProjectModal: (index: number) => void;
  openExperienceModal: (index: number) => void;
  modalContentRef: React.RefObject<HTMLDivElement>;
};

export default function CompanyModal({
  company,
  closeModal,
  openProjectModal,
  openExperienceModal,
  modalContentRef
}: CompanyModalProps) {
  // Get related projects and experiences
  const relatedProjects: Project[] = PROJECTS.filter(project => project.company === company.id);
  const relatedExperiences: Experience[] = EXPERIENCES.filter(exp => exp.company === company.id);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);
  
  return (
    <div 
      ref={modalContentRef}
      className="bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="w-8 h-8 mr-3 relative">
            <Image
              src={company.logo}
              alt={company.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-sm"
            />
          </span>
          {company.name}
        </h2>
        <button 
          onClick={closeModal}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={24} />
        </button>
      </div>
      
      <div className="px-6 py-4">
        {/* Company Information */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {company.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="mr-2" />
                <span>{company.location}</span>
              </div>
            )}
            {company.industry && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaBuilding className="mr-2" />
                <span>{company.industry}</span>
              </div>
            )}
            {company.size && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaUsers className="mr-2" />
                <span>{company.size}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <Link 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaExternalLinkAlt className="mr-2" />
                  <span>Website</span>
                </Link>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300">{company.description}</p>
        </div>
        
        {/* Experience at Company */}
        {relatedExperiences.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Experience</h3>
            <div className="space-y-4">
              {relatedExperiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                  onClick={() => {
                    const expIndex = EXPERIENCES.findIndex(e => e.id === exp.id);
                    if (expIndex !== -1) {
                      openExperienceModal(expIndex);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Founder & Lead Developer</h4>
                      <p className="text-gray-600 dark:text-gray-400">{exp.period}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects by Company */}
        {relatedProjects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer flex"
                  onClick={() => {
                    const projectIndex = PROJECTS.findIndex(p => p.id === project.id);
                    if (projectIndex !== -1) {
                      openProjectModal(projectIndex);
                    }
                  }}
                >
                  <div className="relative w-16 h-16 flex-shrink-0 mr-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 