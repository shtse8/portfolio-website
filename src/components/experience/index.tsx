"use client";

import { useEffect, useRef, useState } from 'react';
import { FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceModal from './ExperienceModal';
import CompanyModal from '../shared/CompanyModal';
import { EXPERIENCES, COMPANIES } from '@/data/portfolioData';
import type { Experience } from '@/data/portfolioData';
import { parseMarkdownLinks } from '../projects/utils';

export default function Experience() {
  // State for component mounting
  const [mounted, setMounted] = useState(false);
  
  // State for filtering
  const [activeFilter] = useState<string | null>(null);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'experience' | 'company'>('experience');
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
  // Refs for modal content
  const modalContentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Use the actual experiences from data
  const sortedExperiences = [...EXPERIENCES].sort((a, b) => {
    const yearA = parseInt(a.period.split(' - ')[0]);
    const yearB = parseInt(b.period.split(' - ')[0]);
    return yearB - yearA;
  });
  
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
      setSelectedExperienceIndex((prev) => (prev + 1) % EXPERIENCES.length);
    } else if (diff < -threshold) {
      // Swipe right, previous item
      setSelectedExperienceIndex((prev) => (prev - 1 + EXPERIENCES.length) % EXPERIENCES.length);
    }
    
    // Reset touch state
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Open project modal
  const openProjectModal = (index: number) => {
    // This function will be implemented in the Projects section
    // Here we just provide a stub for the CompanyModal
    console.log("Project modal would open for index:", index);
  };

  // Render the appropriate modal based on type
  const renderModal = () => {
    if (!isModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
        <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            {modalType === 'experience' && (
              <ExperienceModal
                experience={EXPERIENCES[selectedExperienceIndex]}
                experiences={EXPERIENCES}
                selectedExperienceIndex={selectedExperienceIndex}
                setSelectedExperienceIndex={setSelectedExperienceIndex}
                closeModal={closeModal}
                openCompanyModal={openCompanyModal}
                parseMarkdownLinks={parseMarkdownLinks}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
                modalContentRef={modalContentRef}
              />
            )}
            
            {modalType === 'company' && selectedCompanyId && (
              <CompanyModal
                company={COMPANIES[selectedCompanyId]}
                closeModal={closeModal}
                openProjectModal={openProjectModal}
                openExperienceModal={openExperienceModal}
                modalContentRef={modalContentRef}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <section id="experience" className="py-32 px-4 relative overflow-hidden min-h-screen flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neutral-50 to-transparent dark:from-gray-950 dark:to-transparent opacity-60"></div>
        
        <motion.div 
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-50/40 dark:bg-blue-900/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full bg-blue-50/30 dark:bg-blue-900/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto flex-1 flex flex-col max-w-6xl">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-light text-5xl mb-6 tracking-wide text-gray-800 dark:text-gray-100">
            Professional <span className="font-medium text-blue-500 dark:text-blue-400">Experience</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Over 20 years of experience building innovative solutions and managing teams. Full stack expertise across multiple industries with strong leadership and marketing skills.
          </p>
        </motion.div>
        
        {/* Timeline View */}
        <motion.div 
          className="w-full mx-auto mb-16 relative flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Timeline Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 dark:from-blue-900/30 dark:via-blue-800/40 dark:to-blue-900/30 h-[calc(100%+2rem)]"></div>
          
          {filteredExperiences.map((exp, index) => {
            const startYear = exp.period.split(' - ')[0];
            const endYear = exp.period.split(' - ')[1] || 'Present';
            const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={exp.id} 
                className={`relative ${index === 0 ? 'mt-8' : ''} mb-20
                           flex flex-col items-center
                           md:flex-row md:items-center md:mb-24 md:gap-20
                           ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                variants={itemVariants}
              >
                {/* Timeline dot and year */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                  <div className="bg-white dark:bg-gray-800/80 border border-blue-200 dark:border-blue-800/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full px-3 py-1.5 mb-3 whitespace-nowrap shadow-sm backdrop-blur-sm">
                    {startYear} — {endYear}
                  </div>
                  <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-500 shadow-sm"></div>
                </div>
                
                {/* Content card */}
                <motion.div 
                  className={`bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm z-10
                             rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50
                             shadow-sm hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/30
                             transition-all duration-300 cursor-pointer
                             w-full 
                             md:w-[40%] md:mx-0
                             ${isEven ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}`}
                  onClick={() => openExperienceModal(sortedExperiences.findIndex(e => e.id === exp.id))}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6">
                    <div className="flex flex-col mb-5">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white tracking-wide mb-2">{exp.title}</h3>
                      
                      {exp.company && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (exp.company) {
                              openCompanyModal(exp.company);
                            }
                          }}
                          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm group transition-colors self-start"
                        >
                          <div className="w-5 h-5 mr-2 relative overflow-hidden rounded">
                            <Image 
                              src={COMPANIES[exp.company].logo} 
                              alt={COMPANIES[exp.company].name}
                              width={20}
                              height={20}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <span className="underline-offset-4 group-hover:underline">
                            {COMPANIES[exp.company].name}
                          </span>
                        </button>
                      )}
                      
                      <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500 mr-1" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 
                                   rounded-md text-xs font-light"
                        >
                          {tag}
                        </span>
                      ))}
                      {exp.tags.length > 3 && (
                        <span className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 
                                       rounded-md text-xs font-light">
                          +{exp.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <motion.button 
                      className="mt-4 w-full flex items-center justify-center text-sm text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 rounded-md py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      View Details <FaChevronRight className="ml-1 text-xs" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Modal */}
      {renderModal()}
    </section>
  );
} 