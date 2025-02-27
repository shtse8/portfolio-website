"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight, FaBuilding, FaMapMarkerAlt, FaCode, FaCheckCircle, FaProjectDiagram } from 'react-icons/fa';
import { COMPANIES, Experience, PROJECTS, Project } from '@/data/portfolioData';
import { motion } from 'framer-motion';

type ExperienceModalProps = {
  experience: Experience;
  experiences: Experience[];
  selectedExperienceIndex: number;
  setSelectedExperienceIndex: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  modalContentRef: React.RefObject<HTMLDivElement>;
};

export default function ExperienceModal({
  experience,
  experiences,
  setSelectedExperienceIndex,
  closeModal,
  openCompanyModal,
  parseMarkdownLinks,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  modalContentRef
}: ExperienceModalProps) {
  // Get related projects from PROJECTS data
  const getRelatedProjects = (): Project[] => {
    // Find projects by company
    const companyProjects = experience.company 
      ? PROJECTS.filter(project => project.company === experience.company)
      : [];
    
    // We no longer use relatedProjects array as we've changed the data structure
    // to have projects reference skills/experiences rather than the other way around
    
    return companyProjects;
  };

  const relatedProjects = getRelatedProjects();
  const companyData = experience.company ? COMPANIES[experience.company] : null;

  // Helper function to safely open company modal
  const handleOpenCompany = () => {
    if (experience.company) {
      openCompanyModal(experience.company);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        setSelectedExperienceIndex(prev => (prev + 1) % experiences.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedExperienceIndex(prev => (prev - 1 + experiences.length) % experiences.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, setSelectedExperienceIndex, experiences.length]);

  // Animation variants
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2 + index * 0.1,
        type: "spring",
        stiffness: 70,
        damping: 10
      }
    })
  };
  
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + index * 0.05,
        type: "spring",
        stiffness: 100
      }
    })
  };

  // Code to render company-related elements only when company exists
  const renderCompanyElements = () => {
    if (!experience.company) return null;
    
    return (
      <>
        {/* Company button in the header */}
        <motion.button 
          type="button"
          className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors"
          onClick={handleOpenCompany}
          title={`View company details`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FaBuilding className="text-xs mr-1" /> 
          {companyData?.name || experience.company}
        </motion.button>
        
        {/* Company link in the details */}
        <div className="flex items-center">
          <FaBuilding className="text-primary-500 dark:text-primary-400 mr-2" />
          <button 
            className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
            onClick={handleOpenCompany}
          >
            {companyData?.name || experience.company}
          </button>
        </div>
      </>
    );
  };

  // Company info summary component - only rendered when company exists
  const renderCompanySummary = () => {
    if (!experience.company) return null;
    
    return (
      <motion.div 
        className="mb-6 glass-effect p-6 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200 dark:border-gray-700 shadow-md">
            <Image 
              src={companyData?.logo || experience.logo}
              alt={companyData?.name || experience.company}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {companyData?.name || experience.company}
            </h4>
            {companyData?.location && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {companyData.location}
              </p>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
          {companyData?.description || 'No company description available.'}
        </p>
        
        <motion.button 
          className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center"
          onClick={handleOpenCompany}
          whileHover={{ x: 5 }}
        >
          View Company Details <FaChevronRight className="ml-1" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <motion.div 
      ref={modalContentRef}
      className="relative glass-effect rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 150
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden rounded-xl -z-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-400/5 dark:bg-primary-600/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-600/5 blur-3xl"></div>
      </div>
      
      <motion.button 
        onClick={closeModal}
        className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
        aria-label="Close modal"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimes />
      </motion.button>
      
      {experiences.length > 1 && (
        <>
          <motion.button 
            onClick={() => setSelectedExperienceIndex(prev => (prev - 1 + experiences.length) % experiences.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous experience"
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronLeft />
          </motion.button>
          
          <motion.button 
            onClick={() => setSelectedExperienceIndex(prev => (prev + 1) % experiences.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next experience"
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronRight />
          </motion.button>
        </>
      )}
      
      <div className="p-6 md:p-8">
        <motion.div 
          className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-700/30 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {experience.company && (
            <motion.div 
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 cursor-pointer shadow-xl"
              onClick={handleOpenCompany}
              title={`View company details`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image 
                src={experience.logo}
                alt={experience.company}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <motion.span 
                className="px-3 py-1 bg-gradient-to-r from-primary-100 to-indigo-100 dark:from-primary-900/40 dark:to-indigo-900/40 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Professional Experience
              </motion.span>
              
              {renderCompanyElements()}
            </div>
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {experience.title}
            </motion.h3>
            <motion.div 
              className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center">
                <FaCalendarAlt className="text-primary-500 dark:text-primary-400 mr-2" />
                <span>{experience.period}</span>
              </div>
              {experience.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-primary-500 dark:text-primary-400 mr-2" />
                  <span>{experience.location}</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div 
              className="mb-8 glass-effect p-6 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold mb-5 text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
                Key Achievements
              </h4>
              <ul className="space-y-4">
                {experience.details.map((detail: string, idx: number) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-start group"
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={idx}
                  >
                    <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-110">
                      <FaCheckCircle className="text-xs" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
              <motion.div 
                className="mb-8 glass-effect p-6 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="font-semibold mb-5 text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
                    <FaProjectDiagram className="text-white text-sm" />
                  </div>
                  Related Projects
                </h4>
                <ul className="space-y-3">
                  {relatedProjects.map((project, idx) => (
                    <motion.li 
                      key={project.id} 
                      className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3 border border-gray-200 dark:border-gray-700 shadow-md flex-shrink-0">
                          <Image 
                            src={project.image}
                            alt={project.title}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{project.title}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {experience.liveUrl && (
              <motion.div 
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.a 
                  href={experience.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExternalLinkAlt /> Visit Project
                </motion.a>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div 
              className="mb-6 glass-effect p-6 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-md">
                  <FaCode className="text-white text-sm" />
                </div>
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2 mt-4">
                {experience.tags.map((tech: string, idx: number) => (
                  <motion.span 
                    key={idx}
                    className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    custom={idx}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            
            {renderCompanySummary()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 