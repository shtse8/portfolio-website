"use client";

import { useEffect, useState } from 'react';
import { FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ExperienceModal from './ExperienceModal';
import CompanyModal from '../shared/CompanyModal';
import Modal from '../shared/Modal';
import { EXPERIENCES, COMPANIES } from '@/data/portfolioData';
import { parseMarkdownLinks } from '../projects/utils';

export default function ExperienceSection() {
  // State for component mounting
  const [mounted, setMounted] = useState(false);
  
  // State for filtering
  const [activeFilter] = useState<string | null>(null);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'experience' | 'company'>('experience');
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
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
  };
  
  // Open company modal
  const openCompanyModal = (companyId: string) => {
    const company = COMPANIES[companyId];
    
    if (company) {
      // Open the company modal directly
      setSelectedCompanyId(companyId);
      setIsModalOpen(true);
      setModalType('company');
    } else {
      console.error("No company found for ID:", companyId);
      alert(`No company details found for: ${companyId}`);
    }
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Open project modal
  const openProjectModal = (index: number) => {
    // This function will be implemented in the Projects section
    // Here we just provide a stub for the CompanyModal
    console.log("Project modal would open for index:", index);
  };

  // Render the appropriate modal based on type
  const renderModal = () => {
    return (
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
      >
        {modalType === 'experience' && (
          <ExperienceModal
            experience={EXPERIENCES[selectedExperienceIndex]}
            experiences={EXPERIENCES}
            selectedExperienceIndex={selectedExperienceIndex}
            setSelectedExperienceIndex={setSelectedExperienceIndex}
            closeModal={closeModal}
            openCompanyModal={openCompanyModal}
            parseMarkdownLinks={parseMarkdownLinks}
          />
        )}
        
        {modalType === 'company' && selectedCompanyId && (
          <CompanyModal
            company={COMPANIES[selectedCompanyId]}
            closeModal={closeModal}
            openProjectModal={openProjectModal}
            openExperienceModal={openExperienceModal}
          />
        )}
      </Modal>
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
                {/* Timeline Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-4 border-blue-500 dark:border-blue-600 shadow-md z-10"></div>
                
                {/* Year Label */}
                <div className={`absolute left-1/2 top-8 text-sm font-medium text-gray-500 dark:text-gray-400
                                ${isEven ? 'md:left-[calc(50%+2rem)] md:translate-x-0' : 'md:right-[calc(50%+2rem)] md:translate-x-0 md:left-auto'}`}>
                  {startYear} - {endYear}
                </div>
                
                {/* Experience Card */}
                <motion.div 
                  className={`w-full mt-16 md:mt-0 md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800/70 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 overflow-hidden cursor-pointer hover:shadow-md transform transition-all
                             ${isEven ? 'md:text-right' : ''}`}
                  onClick={() => openExperienceModal(filteredExperiences.indexOf(exp))}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-1">{exp.title}</h3>
                    <div className="flex items-center gap-1 mb-4 text-gray-600 dark:text-gray-400 text-sm">
                      {exp.company && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openCompanyModal(exp.company as string);
                          }}
                          className={`flex items-center hover:text-blue-500 dark:hover:text-blue-300 transition-colors
                                     ${isEven ? 'md:flex-row-reverse' : ''}`}
                        >
                          <div className="relative w-4 h-4 rounded overflow-hidden mr-1">
                            {exp.logo && (
                              <Image 
                                src={exp.logo} 
                                alt={exp.company}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span>{exp.company}</span>
                        </button>
                      )}
                      {exp.location && (
                        <div className={`flex items-center ml-4 ${isEven ? 'md:flex-row-reverse md:ml-0 md:mr-4' : ''}`}>
                          <FaMapMarkerAlt className={`text-blue-500 dark:text-blue-400 text-xs ${isEven ? 'md:ml-1' : 'mr-1'}`} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-2 font-light">
                      {exp.description || exp.details?.[0]}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {exp.tags.length > 3 && (
                        <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                          +{exp.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center text-blue-500 dark:text-blue-400 text-sm
                                    ${isEven ? 'md:justify-end' : ''}`}>
                      <span>View details</span>
                      <FaChevronRight className="ml-1 text-xs" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Render modals */}
        {renderModal()}
      </div>
    </section>
  );
}