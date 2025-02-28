"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaMapMarkerAlt, FaBuilding, FaUsers, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { Company, Project, Experience, PROJECTS, EXPERIENCES } from '@/data/portfolioData';
import { motion } from 'framer-motion';

type CompanyModalProps = {
  company: Company;
  closeModal?: () => void;
  openProjectModal?: (index: number) => void;
  openExperienceModal?: (index: number) => void;
};

export default function CompanyModal({
  company,
  closeModal,
  openProjectModal,
  openExperienceModal
}: CompanyModalProps) {
  // Get related projects and experiences
  const relatedProjects: Project[] = PROJECTS.filter(project => project.company === company.id);
  const relatedExperiences: Experience[] = EXPERIENCES.filter(exp => exp.company === company.id);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeModal) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 rounded-2xl w-full overflow-hidden shadow-xl max-h-[80vh] flex flex-col"
    >
      {/* Company Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 relative overflow-hidden rounded-lg shadow-sm">
              <Image
                src={company.logo}
                alt={company.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-white mb-2">
                {company.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm">
                {company.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaMapMarkerAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.industry && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaBuilding className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{company.industry}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaUsers className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{company.size}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
      >
        {/* Company Description */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-light">
            {company.description}
          </p>
          
          {company.website && (
            <motion.div 
              className="mt-6"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt className="mr-2 text-sm" />
                <span>Visit Website</span>
              </Link>
            </motion.div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Experience at Company */}
          <div>
            {relatedExperiences.length > 0 && (
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                <h3 className="text-xl font-light mb-6 text-gray-900 dark:text-white">
                  Experience at {company.name}
                </h3>
                <div className="space-y-4">
                  {relatedExperiences.map((exp, index) => (
                    <motion.div 
                      key={exp.id} 
                      className="p-6 bg-gray-50 dark:bg-gray-800/20 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-all shadow-sm"
                      onClick={() => {
                        if (openExperienceModal) {
                          const expIndex = EXPERIENCES.findIndex(e => e.id === exp.id);
                          if (expIndex !== -1) {
                            openExperienceModal(expIndex);
                          }
                        }
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-1">{exp.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{exp.period}</p>
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2 font-light">{exp.description}</p>
                        </div>
                        <motion.div 
                          className="text-blue-500 dark:text-blue-400 self-center"
                          whileHover={{ x: 3 }}
                        >
                          <FaChevronRight />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Projects by Company */}
          <div>
            {relatedProjects.length > 0 && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                <h3 className="text-xl font-light mb-6 text-gray-900 dark:text-white">
                  Projects for {company.name}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {relatedProjects.map((project, index) => (
                    <motion.div 
                      key={project.id} 
                      className="flex bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-all shadow-sm"
                      onClick={() => {
                        if (openProjectModal) {
                          const projectIndex = PROJECTS.findIndex(p => p.id === project.id);
                          if (projectIndex !== -1) {
                            openProjectModal(projectIndex);
                          }
                        }
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-1 p-5">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{project.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 font-light mb-2">{project.description}</p>
                        <span className="inline-block px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 