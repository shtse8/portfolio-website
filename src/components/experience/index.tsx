"use client";

import { useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EXPERIENCES } from '@/data/experiences';
import { COMPANIES } from '@/data/companies';
import { parseMarkdownLinks } from '../projects/utils';
import { useModalManager } from '@/hooks/useModalManager';
import { getSkillNames } from '@/utils/skillHelpers';
import Image from 'next/image';
import ExperienceModal from './ExperienceModal';
import CompanyModal from '../shared/CompanyModal';

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

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const timelineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [0, 0.5, 1]);
  const timelineScale = useTransform(scrollYProgress, [0, 0.2], [0.98, 1]);

  // Separate experiences by decade
  const timelineGroups = EXPERIENCES.reduce((groups, experience) => {
    const startYear = parseInt(experience.period.split(' - ')[0]);
    const decade = Math.floor(startYear / 10) * 10;
    const decadeKey = `${decade}s`;
    
    if (!groups[decadeKey]) {
      groups[decadeKey] = [];
    }
    
    groups[decadeKey].push(experience);
    return groups;
  }, {} as Record<string, typeof EXPERIENCES>);

  // Sort decades in descending order
  const sortedDecades = Object.keys(timelineGroups).sort((a, b) => {
    return parseInt(b) - parseInt(a);
  });

  if (!mounted) return null;

  return (
    <section id="experience" className="py-32 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neutral-50 to-transparent dark:from-gray-950 dark:to-transparent opacity-60"></div>
        
        <motion.div 
          className="absolute top-1/3 left-1/4 w-[30vw] h-[30vw] rounded-full bg-gradient-to-br from-blue-50/40 to-violet-50/40 dark:from-blue-900/10 dark:to-violet-900/10 blur-[80px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-[25vw] h-[25vw] rounded-full bg-gradient-to-tr from-blue-50/30 to-emerald-50/30 dark:from-blue-900/10 dark:to-emerald-900/10 blur-[70px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto flex-1 flex flex-col max-w-6xl px-4">
        <motion.div 
          className="text-center mb-24"
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
          className="w-full px-4 mb-20 relative"
          style={{ 
            opacity: timelineOpacity, 
            scale: timelineScale 
          }}
        >
          {/* Vertical Timeline Stem */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/20 dark:via-blue-800/30 dark:to-blue-900/20 md:left-1/2 md:-translate-x-[1px]"></div>
          
          {sortedDecades.map((decade, decadeIndex) => (
            <div key={decade} className="mb-16">
              {/* Decade Marker */}
              <motion.div 
                className="relative mb-16 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: decadeIndex * 0.2, duration: 0.5 }}
              >
                <div className="absolute left-6 md:left-1/2 w-0 h-0">
                  <div className="absolute w-7 h-7 rounded-full bg-blue-500 dark:bg-blue-600 -ml-[14px] -mt-[14px] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-900"></div>
                  </div>
                </div>
                
                <div className="w-full pl-16 md:text-center md:pl-0">
                  <h3 className="text-4xl font-light text-blue-500 dark:text-blue-400 tracking-wide">
                    {decade}
                  </h3>
                </div>
              </motion.div>
              
              {/* Decade's Experiences */}
              <div className="space-y-20 md:space-y-32">
                {timelineGroups[decade].map((experience, index) => {
                  const isEven = index % 2 === 0;
                  const startYear = experience.period.split(' - ')[0];
                  const endYear = experience.period.split(' - ')[1] || 'Present';
                  const companyName = experience.company ? COMPANIES[experience.company]?.name : null;
                  
                  return (
                    <motion.div 
                      key={experience.id}
                      className="relative flex flex-col md:flex-row md:items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Timeline Node */}
                      <div className="absolute left-6 top-8 w-3 h-3 bg-white dark:bg-gray-900 rounded-full border-2 border-blue-500 dark:border-blue-600 z-10 md:left-1/2 md:-translate-x-[6px]"></div>
                      
                      {/* Date Label and Role for mobile */}
                      <div className="pl-16 pb-4 md:hidden">
                        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
                          {startYear} - {endYear}
                        </span>
                        <h3 className="text-xl font-medium mt-1 text-gray-900 dark:text-white">
                          {experience.title}
                        </h3>
                      </div>
                      
                      {/* Left Column */}
                      <div 
                        className={`hidden md:block md:w-1/2 ${isEven ? 'md:pr-16 text-right' : 'md:pl-16'}`}
                      >
                        {isEven ? (
                          <>
                            <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
                              {startYear} - {endYear}
                            </span>
                            <h3 className="text-xl font-medium mt-1 text-gray-900 dark:text-white">
                              {experience.title}
                            </h3>
                            {companyName && (
                              <button 
                                onClick={() => handleOpenCompany(experience.company!)}
                                className="mt-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center justify-end gap-1"
                              >
                                at <span className="font-medium">{companyName}</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <motion.div 
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                          >
                            <Image 
                              src={experience.image} 
                              alt={experience.title}
                              fill
                              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                              <div className="text-white space-y-1">
                                <h4 className="text-xl font-medium">{experience.title}</h4>
                                {companyName && (
                                  <p className="text-white/90">{companyName}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Right Column */}
                      <div 
                        className={`pl-16 md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}
                      >
                        {!isEven ? (
                          <>
                            <span className="hidden md:inline-block text-sm font-medium text-blue-500 dark:text-blue-400">
                              {startYear} - {endYear}
                            </span>
                            <h3 className="hidden md:block text-xl font-medium mt-1 text-gray-900 dark:text-white">
                              {experience.title}
                            </h3>
                            {companyName && (
                              <button 
                                onClick={() => handleOpenCompany(experience.company!)}
                                className="hidden md:inline-flex mt-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors items-center justify-start gap-1"
                              >
                                at <span className="font-medium">{companyName}</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <motion.div 
                            className="hidden md:block bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                          >
                            <Image 
                              src={experience.image} 
                              alt={experience.title}
                              fill
                              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                              <div className="text-white space-y-1">
                                <h4 className="text-xl font-medium">{experience.title}</h4>
                                {companyName && (
                                  <p className="text-white/90">{companyName}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Experience Card for mobile */}
                        <motion.div 
                          className="md:hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer mt-2"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                        >
                          <Image 
                            src={experience.image} 
                            alt={experience.title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <div className="text-white space-y-1">
                              {companyName && (
                                <p className="text-white/90">{companyName}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Description & Skills */}
                        <div className={`mt-6 ${!isEven ? 'md:text-right' : ''}`}>
                          <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                            {experience.description}
                          </p>
                          
                          <div className={`flex flex-wrap gap-2 mt-4 mb-6 ${!isEven ? 'md:justify-end' : ''}`}>
                            {experience.skills && getSkillNames(experience.skills).slice(0, 3).map((skillName, i) => (
                              <span
                                key={i}
                                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 rounded-full"
                              >
                                {skillName}
                              </span>
                            ))}
                            {experience.skills && experience.skills.length > 3 && (
                              <span className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 rounded-full">
                                +{experience.skills.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <motion.button
                            onClick={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                            className={`group inline-flex items-center space-x-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 ${!isEven ? 'md:flex-row-reverse' : ''}`}
                            whileHover={{ x: isEven ? 5 : -5 }}
                          >
                            <span className="font-medium">View Details</span>
                            <FaAngleRight className={`transition-transform group-hover:translate-x-1 ${!isEven ? 'md:rotate-180 md:group-hover:-translate-x-1 md:group-hover:translate-x-0' : ''}`} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}