"use client";

import { useState, useRef, useEffect } from 'react';
import { FaLink, FaBuilding, FaExternalLinkAlt, FaChevronRight, FaTimes, FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { PROJECTS, COMPANIES, EXPERIENCES, Project } from '@/data/portfolioData';
import type { Experience } from '@/data/portfolioData';
import ExperienceModal from './ExperienceModal';
import { parseMarkdownLinks } from '../projects/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Experience() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number>(0);
  const [modalType, setModalType] = useState<'experience' | 'company'>('experience');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Touch swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Use the actual experiences from data
  const experiences = EXPERIENCES;
  
  // Sort experiences by start year (descending)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const yearA = parseInt(a.period.split(' - ')[0]);
    const yearB = parseInt(b.period.split(' - ')[0]);
    return yearB - yearA;
  });
  
  // Get unique companies from experiences
  const uniqueCompanies = [...new Set(experiences.map(exp => exp.company))];
  
  // Filter experiences based on activeFilter
  const filteredExperiences = activeFilter 
    ? sortedExperiences.filter(exp => exp.company === activeFilter)
    : sortedExperiences;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };
  
  const filterVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Open experience modal
  const openExperienceModal = (index: number) => {
    setSelectedExperienceIndex(index);
    setIsModalOpen(true);
    setModalType('experience');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  // Open company modal
  const openCompanyModal = (companyId: string) => {
    // Check if the company exists
    const company = COMPANIES[companyId];
    if (company) {
      // Open the company modal directly
      setSelectedCompanyId(companyId);
      setIsModalOpen(true);
      setModalType('company');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      console.error("No company found for ID:", companyId);
      alert(`No company details found for: ${companyId}`);
    }
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };
  
  // Get projects by company
  const getProjectsByCompany = (companyId: string): Project[] => {
    return PROJECTS.filter((project: Project) => project.company === companyId);
  };
  
  // Get experiences by company
  const getExperiencesByCompany = (companyId: string): Experience[] => {
    return experiences.filter(exp => exp.company === companyId);
  };
  
  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Swipe must exceed this threshold to trigger page turn
    
    if (diff > threshold) {
      // Swipe left, next item
      setSelectedExperienceIndex((prev) => (prev + 1) % experiences.length);
    } else if (diff < -threshold) {
      // Swipe right, previous item
      setSelectedExperienceIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
    }
    
    // Reset touch state
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!mounted) return null;

  return (
    <section id="experience" className="py-20 px-4 relative overflow-hidden min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-primary-400/10 dark:bg-primary-600/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="absolute inset-0 opacity-5 dark:opacity-10 -z-10">
          <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        </div>
      </div>
      
      <div className="container mx-auto flex-1 flex flex-col">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative inline-block">
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-600"></span>
              <span>Professional Experience</span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-4">
            Over 20 years of experience building innovative solutions and managing teams. Full stack expertise across multiple industries with strong leadership and marketing skills.
          </p>
        </motion.div>
        
        {/* Company filter */}
        <motion.div 
          className="flex justify-center flex-wrap gap-3 mb-12" 
          variants={filterVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === null
                ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Companies
          </motion.button>
          
          {uniqueCompanies.map((companyId, index) => {
            const company = COMPANIES[companyId];
            return (
              <motion.button
                key={index}
                onClick={() => setActiveFilter(activeFilter === companyId ? null : companyId)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
                  activeFilter === companyId
                    ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-4 h-4 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image 
                    src={company.logo} 
                    alt={company.name} 
                    width={16} 
                    height={16} 
                    className="object-cover"
                  />
                </div>
                {company.name}
              </motion.button>
            );
          })}
        </motion.div>
        
        {/* Timeline View - With responsive layout changes */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16 relative flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Timeline Line - Longer to extend below the last card */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-300 to-indigo-500 dark:from-primary-700 dark:to-indigo-700 h-[calc(100%+50px)]"></div>
          
          {filteredExperiences.map((exp, index) => {
            const startYear = exp.period.split(' - ')[0];
            const isEven = index % 2 === 0;
            const companyName = COMPANIES[exp.company]?.name || exp.company;
            
            return (
              <motion.div 
                key={exp.id} 
                className={`relative ${index === 0 ? 'mt-8' : ''} mb-16
                           flex flex-col items-center
                           md:flex-row md:items-center md:mb-10
                           ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                variants={itemVariants}
              >
                {/* Timeline dot - positioned at top on mobile, centered on desktop */}
                <motion.div 
                  className="mb-8 flex flex-col items-center z-10 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="bg-gradient-to-r from-primary-500 to-indigo-600 text-white text-xs font-bold rounded-full px-3 py-1 mb-2 whitespace-nowrap shadow-md">
                    {startYear}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-4 border-primary-500 dark:border-primary-400 shadow-lg"></div>
                </motion.div>
                
                {/* Content - Mobile: below dot, Desktop: alternating sides */}
                <motion.div 
                  className={`glass-effect p-5 rounded-xl shadow-xl hover:shadow-2xl 
                             transition-all duration-300 cursor-pointer
                             w-11/12 max-w-sm
                             md:w-5/12 md:mx-0
                             ${isEven ? 'md:mr-auto md:pr-6' : 'md:ml-auto md:pl-6'}`}
                  onClick={() => openExperienceModal(sortedExperiences.findIndex(e => e.id === exp.id))}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-gray-200 dark:border-gray-600 shadow-inner">
                      <Image 
                        src={exp.logo} 
                        alt={companyName} 
                        width={48} 
                        height={48} 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{exp.title}</h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{companyName}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="mr-1 text-primary-500 dark:text-primary-400" />
                      <span>{exp.period}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="mr-1 text-primary-500 dark:text-primary-400" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{exp.description}</p>
                  
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {exp.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                      {exp.tags.length > 3 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md">
                          +{exp.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-2">
                    <motion.span 
                      className="text-primary-600 dark:text-primary-400 text-xs font-medium flex items-center bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-full"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      View Details <FaChevronRight className="ml-1 h-2 w-2" />
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Experience details modal - only render on client side */}
        <AnimatePresence>
          {isModalOpen && modalType === 'experience' && experiences[selectedExperienceIndex] && (
            <motion.div 
              className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExperienceModal
                experience={experiences[selectedExperienceIndex]}
                experiences={experiences}
                selectedExperienceIndex={selectedExperienceIndex}
                setSelectedExperienceIndex={setSelectedExperienceIndex}
                closeModal={closeModal}
                openCompanyModal={openCompanyModal}
                parseMarkdownLinks={parseMarkdownLinks}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
                modalContentRef={modalContentRef as React.RefObject<HTMLDivElement>}
              />
            </motion.div>
          )}
          
          {/* Company details modal - only render on client side */}
          {isModalOpen && modalType === 'company' && selectedCompanyId && COMPANIES[selectedCompanyId] && (
            <motion.div 
              className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                ref={modalContentRef}
                className="relative glass-effect rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <motion.button 
                  onClick={closeModal}
                  className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                  aria-label="Close modal"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
                
                {(() => {
                  const company = COMPANIES[selectedCompanyId];
                  const relatedProjects = getProjectsByCompany(selectedCompanyId);
                  const relatedExperiences = getExperiencesByCompany(selectedCompanyId);
                  
                  return (
                    <div className="p-6 md:p-8">
                      <motion.div 
                        className="flex items-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-lg">
                          <Image 
                            src={company.logo}
                            alt={company.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-indigo-100 dark:from-primary-900/40 dark:to-indigo-900/40 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full">
                              <FaBuilding className="inline mr-1" /> Company
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{company.name}</h3>
                          {company.location && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                              <span>{company.location}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      <div className="grid md:grid-cols-2 gap-8 items-start">
                        <motion.div 
                          className="order-2 md:order-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{company.description}</p>
                          
                          {/* Company Website */}
                          {company.website && (
                            <div className="flex gap-4 mb-8">
                              <motion.a 
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaExternalLinkAlt /> Visit Website
                              </motion.a>
                            </div>
                          )}
                          
                          {/* Related Work Experiences */}
                          {relatedExperiences.length > 0 && (
                            <motion.div 
                              className="mb-8 glass-effect p-5 rounded-lg border border-white/20 dark:border-gray-700/30 shadow-md"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                                <FaBriefcase className="mr-2 text-primary-600 dark:text-primary-400" />
                                Work Experiences
                              </h4>
                              <div className="space-y-4">
                                {relatedExperiences.map((exp) => (
                                  <motion.button
                                    key={exp.id}
                                    type="button"
                                    className="w-full text-left glass-effect p-4 rounded-lg border border-white/10 dark:border-gray-700/20 cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => {
                                      setSelectedExperienceIndex(
                                        experiences.findIndex(e => e.id === exp.id)
                                      );
                                      setModalType('experience');
                                    }}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="flex items-center">
                                      <div>
                                        <h5 className="font-medium text-gray-900 dark:text-white">{exp.title}</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</p>
                                      </div>
                                      <div className="ml-auto">
                                        <FaChevronRight className="text-primary-500" />
                                      </div>
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <motion.div 
                          className="order-1 md:order-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {/* Related Projects */}
                          {relatedProjects.length > 0 && (
                            <div className="glass-effect p-5 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30">
                              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                                <FaLink className="mr-2 text-primary-600 dark:text-primary-400" />
                                Related Projects
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                {relatedProjects.map((project: Project) => (
                                  <motion.div 
                                    key={project.id}
                                    className="flex items-center glass-effect p-3 rounded-lg border border-white/10 dark:border-gray-700/20 cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => {
                                      // Navigate to projects section
                                      closeModal();
                                      setTimeout(() => {
                                        const projectsSection = document.getElementById('projects');
                                        if (projectsSection) {
                                          projectsSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }, 300);
                                    }}
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3 shadow-md">
                                      <Image 
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</h5>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 