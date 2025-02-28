"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaGooglePlay, FaApple, FaCalendarAlt, FaTag, FaBuilding, FaCode, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { Project, Experience, COMPANIES, EXPERIENCES } from '../../data/portfolioData';
import { motion } from 'framer-motion';
import Modal from '../shared/Modal';

type ProjectModalProps = {
  project: Project;
  openExperienceModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  closeModal: () => void;
  nextProject?: () => void;
  prevProject?: () => void;
};

export default function ProjectModal({
  project,
  openExperienceModal,
  openCompanyModal,
  parseMarkdownLinks,
  closeModal,
  nextProject,
  prevProject,
}: ProjectModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Convert single image to array for consistent handling
  const projectImages = Array.isArray(project.image) ? project.image : [project.image];
  
  const getExperienceForProject = (): Experience | null => {
    if (project.company) {
      const relatedExperiences = EXPERIENCES.filter(exp => exp.company === project.company);
      return relatedExperiences.length > 0 ? relatedExperiences[0] : null;
    }
    return null;
  };

  // Get related experience
  const relatedExperience = getExperienceForProject();
  
  // Handle image navigation
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % projectImages.length);
  };
  
  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };
  
  // Image gallery section
  const renderImageGallery = () => {
    return (
      <div className="relative aspect-video bg-gray-50 dark:bg-gray-800/30 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div className="relative w-full h-full">
          <Image
            src={projectImages[activeImageIndex]}
            alt={`${project.title} - Image ${activeImageIndex + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full"
          />
        </div>
        
        {/* Image navigation controls */}
        {projectImages.length > 1 && (
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
              {projectImages.map((_, idx) => (
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
    <Modal 
      isOpen={true} 
      onClose={closeModal}
      hasNavigation={!!(nextProject && prevProject)}
      onNext={nextProject}
      onPrevious={prevProject}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full relative flex flex-col shadow-xl">
        <div className="flex-1">
          {/* Hero section with image and title overlay */}
          <div className="relative">
            {renderImageGallery()}
            
            {/* Content overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
              <motion.h2 
                className="text-2xl md:text-3xl font-light text-white"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {project.title}
              </motion.h2>
              
              <motion.div 
                className="flex flex-wrap items-center gap-3 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs backdrop-blur-sm">
                  {project.category}
                </span>
                
                {project.company && (
                  <button
                    onClick={() => openCompanyModal(project.company as string)}
                    className="flex items-center px-2 py-1 rounded-full bg-purple-500/20 text-purple-100 text-xs backdrop-blur-sm hover:bg-purple-500/30 transition-colors"
                  >
                    <span className="w-3 h-3 mr-1 relative overflow-hidden rounded-full">
                      <Image 
                        src={COMPANIES[project.company]?.logo || ''}
                        alt={COMPANIES[project.company]?.name || project.company}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </span>
                    {COMPANIES[project.company]?.name || project.company}
                  </button>
                )}
              </motion.div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left column - Project details */}
              <div className="lg:col-span-2">
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed text-lg">
                    {project.description}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <FaCode className="mr-2 text-blue-500 dark:text-blue-400 text-sm" />
                    Project Details
                  </h3>
                  <div className="prose dark:prose-invert max-w-none font-light prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed">
                    {typeof project.details === 'string' 
                      ? parseMarkdownLinks(project.details) 
                      : project.details.map((detail, i) => (
                          <p key={i} className="mb-5">{parseMarkdownLinks(detail)}</p>
                        ))
                    }
                  </div>
                </motion.div>
              </div>
              
              {/* Right column - Metadata */}
              <div>
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6 mb-8"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-5 flex items-center">
                    <FaTag className="mr-2 text-blue-500 dark:text-blue-400 text-sm" />
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm font-light py-1 px-3 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    {project.github && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                          aria-label="GitHub Repository"
                          title="GitHub Repository"
                        >
                          <FaGithub size={18} />
                        </Link>
                      </motion.div>
                    )}
                    {project.liveUrl && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                          aria-label="Live Preview"
                          title="Live Preview"
                        >
                          <FaExternalLinkAlt size={14} />
                        </Link>
                      </motion.div>
                    )}
                    {project.androidUrl && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={project.androidUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                          aria-label="Android App"
                          title="Android App"
                        >
                          <FaGooglePlay size={16} />
                        </Link>
                      </motion.div>
                    )}
                    {project.iosUrl && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={project.iosUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                          aria-label="iOS App"
                          title="iOS App"
                        >
                          <FaApple size={18} />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                {relatedExperience && (
                  <motion.div 
                    className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-5 flex items-center">
                      <FaBuilding className="mr-2 text-blue-500 dark:text-blue-400 text-sm" />
                      Related Experience
                    </h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 relative flex-shrink-0 rounded-md overflow-hidden mt-1">
                        <Image
                          src={relatedExperience.logo}
                          alt={relatedExperience.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{relatedExperience.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <FaCalendarAlt className="inline-block mr-1 text-xs" />
                          {relatedExperience.period}
                        </p>
                        <motion.button
                          onClick={() => {
                            const index = EXPERIENCES.findIndex(exp => exp.id === relatedExperience.id);
                            if (index !== -1) {
                              openExperienceModal(index);
                            }
                          }}
                          className="text-blue-600 dark:text-blue-400 text-sm font-light inline-flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          View experience <FaChevronRight className="ml-1.5 text-xs" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
} 