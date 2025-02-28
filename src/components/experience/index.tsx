"use client";

import { useEffect, useState } from 'react';
import { FaChevronRight, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ExperienceModal from './ExperienceModal';
import CompanyModal from '../shared/CompanyModal';
import { EXPERIENCES, COMPANIES } from '@/data/portfolioData';
import { parseMarkdownLinks } from '../projects/utils';
import { useModalManager } from '@/hooks/useModalManager';

export default function ExperienceSection() {
  const [mounted, setMounted] = useState(false);
  const { open } = useModalManager();
  
  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Adapter function for experience modal
  const handleOpenExperience = (index: number) => {
    const experience = EXPERIENCES[index];
    
    const handleNext = () => {
      const nextIndex = (index + 1) % EXPERIENCES.length;
      handleOpenExperience(nextIndex);
    };
    
    const handlePrev = () => {
      const prevIndex = (index - 1 + EXPERIENCES.length) % EXPERIENCES.length;
      handleOpenExperience(prevIndex);
    };
    
    open(
      <ExperienceModal
        experience={experience}
        openCompanyModal={handleOpenCompany}
        parseMarkdownLinks={parseMarkdownLinks}
        nextExperience={handleNext}
        prevExperience={handlePrev}
        closeModal={() => {}}
      />,
      { 
        modalKey: experience.id,
        hasNavigation: true,
        onNext: handleNext,
        onPrevious: handlePrev
      }
    );
  };
  
  // Adapter function for company modal
  const handleOpenCompany = (companyId: string) => {
    open(
      <CompanyModal
        company={COMPANIES[companyId]}
        openProjectModal={() => {}}
        openExperienceModal={handleOpenExperience}
      />,
      { modalKey: companyId }
    );
  };
  
  // Helper function to handle company click with null check
  const handleCompanyClick = (e: React.MouseEvent, companyId: string | null) => {
    e.stopPropagation();
    if (companyId) {
      handleOpenCompany(companyId);
    }
  };

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
          
          {EXPERIENCES.map((exp, index) => {
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
                  onClick={() => handleOpenExperience(index)}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-1">{exp.title}</h3>
                    
                    {exp.company && (
                      <button 
                        onClick={(e) => handleCompanyClick(e, exp.company)}
                        className={`flex items-center text-gray-600 dark:text-gray-400 mb-4 hover:text-blue-500 dark:hover:text-blue-400 transition-colors
                                  ${isEven ? 'md:ml-auto md:justify-end' : ''}`}
                      >
                        <FaBuilding className="mr-2 text-blue-500 dark:text-blue-400" />
                        <span className="underline-offset-2 hover:underline">
                          {COMPANIES[exp.company].name}
                        </span>
                      </button>
                    )}
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">{exp.description}</p>
                    
                    <div className={`flex flex-wrap gap-2 mt-4 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                      {exp.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md">
                          {tag}
                        </span>
                      ))}
                      {exp.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md">
                          +{exp.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <motion.div 
                      className={`flex items-center text-blue-500 dark:text-blue-400 mt-4 
                                ${isEven ? 'md:justify-end' : ''}`}
                      whileHover={{ x: isEven ? -3 : 3 }}
                    >
                      {isEven && <FaChevronRight className="ml-2 text-xs" />}
                      <span className="text-sm font-medium">View Details</span>
                      {!isEven && <FaChevronRight className="ml-2 text-xs" />}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}