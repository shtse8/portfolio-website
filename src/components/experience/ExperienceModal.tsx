"use client";

import Image from 'next/image';
import { FaCalendarAlt, FaExternalLinkAlt, FaMapMarkerAlt, FaCode, FaCheckCircle, FaProjectDiagram, FaChevronRight } from 'react-icons/fa';
import { COMPANIES, Experience, PROJECTS, Project } from '@/data/portfolioData';
import { motion } from 'framer-motion';
import Modal from '../shared/Modal';

type ExperienceModalProps = {
  experience: Experience;
  experiences: Experience[];
  selectedExperienceIndex: number;
  setSelectedExperienceIndex: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
};

export default function ExperienceModal({
  experience,
  experiences,
  setSelectedExperienceIndex,
  closeModal,
  openCompanyModal,
  parseMarkdownLinks,
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

  // Handle navigation functions
  const goToNextExperience = () => {
    setSelectedExperienceIndex(prev => (prev + 1) % experiences.length);
  };
  
  const goToPreviousExperience = () => {
    setSelectedExperienceIndex(prev => (prev - 1 + experiences.length) % experiences.length);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + index * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={closeModal}
      hasNavigation={true}
      onNext={goToNextExperience}
      onPrevious={goToPreviousExperience}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl w-full relative shadow-xl overflow-hidden max-h-[80vh] flex flex-col"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-10">
          <motion.div 
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
        <motion.div
          className="relative p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent flex-grow"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              delay: 0.1,
              duration: 0.2
            }
          }}
        >
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
                      variants={fadeIn}
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
                        className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer shadow-sm"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            delay: 0.1 + idx * 0.03,
                            duration: 0.2
                          }
                        }}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
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
                      className="bg-gray-50 dark:bg-gray-800/20 rounded-xl p-3 text-center shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-all duration-200"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: 0.1 + idx * 0.03,
                          duration: 0.2
                        }
                      }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
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
                        variants={fadeIn}
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
        </motion.div>
      </motion.div>
    </Modal>
  );
} 