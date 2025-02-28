"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaCode, FaCheckCircle, FaProjectDiagram } from 'react-icons/fa';
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

  return (
    <motion.div 
      ref={modalContentRef}
      className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 5 }}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 200
      }}
    >
      {/* Close button */}
      <motion.button 
        onClick={closeModal}
        className="absolute right-4 top-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Close modal"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <FaTimes />
      </motion.button>
      
      {/* Navigation buttons */}
      {experiences.length > 1 && (
        <>
          <motion.button 
            onClick={() => setSelectedExperienceIndex(prev => (prev - 1 + experiences.length) % experiences.length)}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/80 transition-colors"
            aria-label="Previous experience"
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronLeft />
          </motion.button>
          
          <motion.button 
            onClick={() => setSelectedExperienceIndex(prev => (prev + 1) % experiences.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/80 transition-colors"
            aria-label="Next experience"
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronRight />
          </motion.button>
        </>
      )}
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-10">
        <motion.div 
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Experience Type Badge */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-3 py-1.5 bg-blue-500/10 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              Professional Experience
            </span>
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            className="text-3xl font-light text-gray-900 dark:text-white tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {experience.title}
          </motion.h3>
          
          {/* Experience Metadata */}
          <motion.div 
            className="flex flex-wrap items-center gap-5 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 dark:text-blue-400 mr-2" />
              <span>{experience.period}</span>
            </div>
            {experience.location && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400 mr-2" />
                <span>{experience.location}</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="p-10">
        {/* Company Information Card (if applicable) */}
        {experience.company && (
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center p-6 bg-gray-50 dark:bg-gray-800/20 rounded-xl gap-6">
              <motion.div 
                className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenCompany}
              >
                <Image 
                  src={experience.logo}
                  alt={experience.company}
                  fill
                  className="object-cover"
                />
              </motion.div>
              
              <div className="flex flex-col md:flex-1 text-center md:text-left">
                <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-1">
                  {companyData?.name || experience.company}
                </h4>
                
                {companyData?.location && (
                  <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <FaMapMarkerAlt className="text-purple-500 dark:text-purple-400 mr-1.5" />
                    {companyData.location}
                  </div>
                )}
                
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {companyData?.description?.substring(0, 120)}
                  {companyData?.description && companyData.description.length > 120 ? '...' : ''}
                </p>
              </div>
              
              <motion.button 
                onClick={handleOpenCompany}
                className="px-5 py-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 
                          rounded-lg text-sm flex items-center gap-2 hover:bg-purple-100 
                          dark:hover:bg-purple-800/30 transition-colors"
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                View Company
                <FaChevronRight className="text-xs" />
              </motion.button>
            </div>
          </motion.div>
        )}
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Column - Achievements & Projects */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Key Achievements */}
            <motion.div 
              className="mb-10 bg-gray-50 dark:bg-gray-800/20 p-8 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h4 className="font-light text-xl mb-6 text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600/80 dark:bg-blue-600/70 flex items-center justify-center mr-3">
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
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-all group-hover:scale-105">
                      <FaCheckCircle className="text-xs" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{parseMarkdownLinks(detail)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
              <motion.div 
                className="mb-8 bg-gray-50 dark:bg-gray-800/20 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="font-light text-xl mb-5 text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600/80 dark:bg-purple-600/70 flex items-center justify-center mr-3">
                    <FaProjectDiagram className="text-white text-sm" />
                  </div>
                  Related Projects
                </h4>
                <ul className="space-y-3">
                  {relatedProjects.map((project, idx) => (
                    <motion.li 
                      key={project.id} 
                      className="bg-white dark:bg-gray-800/40 p-4 rounded-lg hover:bg-blue-50/50 
                                dark:hover:bg-blue-900/20 transition-all cursor-pointer"
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <Image 
                            src={project.image}
                            alt={project.title}
                            width={48}
                            height={48}
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
            
            {/* External Link - If available */}
            {experience.liveUrl && (
              <motion.div 
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.a 
                  href={experience.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExternalLinkAlt /> Visit Project
                </motion.a>
              </motion.div>
            )}
          </motion.div>
          
          {/* Right Column - Technologies & Education */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Technologies Used */}
            <motion.div 
              className="mb-8 bg-gray-50 dark:bg-gray-800/20 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h4 className="font-light text-xl mb-5 text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600/80 dark:bg-indigo-600/70 flex items-center justify-center mr-3">
                  <FaCode className="text-white text-sm" />
                </div>
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2 mt-5">
                {experience.tags.map((tech: string, idx: number) => (
                  <motion.span 
                    key={idx}
                    className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-sm"
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
            
            {/* Education/Certifications - Conditional rendering */}
            {('education' in experience) && (experience as Experience & { education: string[] }).education.length > 0 && (
              <motion.div 
                className="mb-8 bg-gray-50 dark:bg-gray-800/20 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="font-light text-xl mb-5 text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-600/80 dark:bg-green-600/70 flex items-center justify-center mr-3">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                  Education & Certifications
                </h4>
                <ul className="space-y-3 mt-4">
                  {(experience as Experience & { education: string[] }).education.map((item: string, idx: number) => (
                    <motion.li 
                      key={idx}
                      className="flex items-start"
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                    >
                      <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                        <FaCheckCircle className="text-xs" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 