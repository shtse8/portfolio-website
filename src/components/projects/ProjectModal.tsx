"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaBuilding, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Project, Experience, COMPANIES, EXPERIENCES } from '../../data/portfolioData';
import { motion } from 'framer-motion';

type ProjectModalProps = {
  project: Project;
  openExperienceModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  closeModal?: () => void;
  nextProject?: () => void;
  prevProject?: () => void;
};

export default function ProjectModal({
  project,
  openExperienceModal,
  openCompanyModal,
  parseMarkdownLinks,
}: ProjectModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Get images from project (handle both legacy and new data structures)
  const projectGallery = project.gallery || project.images || (Array.isArray(project.image) ? project.image : [project.image]);
  
  const getExperienceForProject = (): Experience | null => {
    // First check if there's an experience that lists this project
    const relatedExperience = EXPERIENCES.find(exp => 
      exp.projects?.includes(project.id)
    );
    
    // If not found, fall back to company match
    if (!relatedExperience && project.company) {
      const companyExperiences = EXPERIENCES.filter(exp => exp.company === project.company);
      return companyExperiences.length > 0 ? companyExperiences[0] : null;
    }
    
    return relatedExperience || null;
  };

  const nextImage = () => {
    if (projectGallery.length > 0) {
      setActiveImageIndex((activeImageIndex + 1) % projectGallery.length);
    }
  };

  const prevImage = () => {
    if (projectGallery.length > 0) {
      setActiveImageIndex((activeImageIndex - 1 + projectGallery.length) % projectGallery.length);
    }
  };
  
  // Image gallery section
  const renderImageGallery = () => {
    return (
      <div className="relative aspect-video bg-gray-50 dark:bg-gray-800/30 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div className="relative w-full h-full">
          <Image
            src={projectGallery[activeImageIndex]}
            alt={`${project.title} - Image ${activeImageIndex + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full"
          />
        </div>
        
        {/* Image navigation controls */}
        {projectGallery.length > 1 && (
          <>
            <motion.button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-gray-800/70 p-3 rounded-full text-gray-800 dark:text-white z-10"
              onClick={prevImage}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronLeft size={16} />
            </motion.button>
            
            <motion.button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-gray-800/70 p-3 rounded-full text-gray-800 dark:text-white z-10"
              onClick={nextImage}
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronRight size={16} />
            </motion.button>
            
            {/* Image dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {projectGallery.map((_, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeImageIndex 
                      ? 'bg-white/90 w-4' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
      {/* Project Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="w-full md:w-28 h-28 relative overflow-hidden rounded-xl shadow-sm">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-white mb-3">
                {project.title}
              </h2>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                {project.year && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{project.year}</span>
                  </div>
                )}
                
                {project.company && (
                  <button
                    onClick={() => openCompanyModal(project.company as string)}
                    className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <FaBuilding className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span className="underline-offset-4 hover:underline">
                      {COMPANIES[project.company]?.name || project.company}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Project Content */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <h3 className="text-2xl font-light mb-6 text-gray-900 dark:text-white">Overview</h3>
              
              <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                {parseMarkdownLinks(project.description)}
              </div>
              
              {project.details && (
                <>
                  <h3 className="text-2xl font-light mt-10 mb-6 text-gray-900 dark:text-white">Key Features</h3>
                  <ul className="space-y-4">
                    {Array.isArray(project.details) ? (
                      project.details.map((detail: string, index: number) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 font-light">
                          {parseMarkdownLinks(detail)}
                        </li>
                      ))
                    ) : (
                      <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                        {parseMarkdownLinks(project.details as string)}
                      </div>
                    )}
                  </ul>
                </>
              )}
              
              {project.challenges && project.challenges.length > 0 && (
                <>
                  <h3 className="text-2xl font-light mt-10 mb-6 text-gray-900 dark:text-white">Challenges & Solutions</h3>
                  <div className="space-y-8">
                    {project.challenges.map((challenge, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl">
                        <h4 className="font-medium text-lg mb-3 text-gray-900 dark:text-white">{challenge.title}</h4>
                        <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                          {parseMarkdownLinks(challenge.description)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Related Experience Section */}
              {getExperienceForProject() && (
                <>
                  <h3 className="text-2xl font-light mt-10 mb-6 text-gray-900 dark:text-white">Related Experience</h3>
                  
                  <div 
                    className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                    onClick={() => {
                      const exp = getExperienceForProject();
                      if (exp) {
                        const expIndex = EXPERIENCES.findIndex(e => e.id === exp.id);
                        if (expIndex !== -1) {
                          openExperienceModal(expIndex);
                        }
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {getExperienceForProject()?.logo && (
                          <Image
                            src={getExperienceForProject()?.logo || ''}
                            alt={getExperienceForProject()?.title || ''}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{getExperienceForProject()?.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {getExperienceForProject()?.company} • {getExperienceForProject()?.period}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 font-light">
                          {getExperienceForProject()?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Project Gallery */}
            {projectGallery.length > 0 && (
              <div className="mb-10">
                {renderImageGallery()}
              </div>
            )}
            
            {/* Project Links */}
            {(project.liveUrl || project.github) && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Project Links</h3>
                <div className="flex flex-col gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaExternalLinkAlt />
                      <span>View Live Project</span>
                    </a>
                  )}
                  
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FaGithub />
                      <span>View on GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Technologies Used */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Additional Metadata */}
            {(project.teamSize || project.duration || project.role) && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Project Details</h3>
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 space-y-4">
                  {project.role && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">My Role</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.role}</span>
                    </div>
                  )}
                  
                  {project.teamSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Team Size</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.teamSize}</span>
                    </div>
                  )}
                  
                  {project.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 