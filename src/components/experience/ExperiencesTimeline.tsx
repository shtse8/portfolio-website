"use client";

import { useState, useRef, useEffect } from 'react';
import { EXPERIENCES } from '@/data/experiences';
import { COMPANIES } from '@/data/companies';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import Image from 'next/image';
import { parseMarkdownLinks } from '../projects/utils';
import { getSkillNames } from '@/utils/skillHelpers';
import { useModalManager } from '@/hooks/useModalManager';
import ExperienceModal from './ExperienceModal';
import CompanyModal from '../shared/CompanyModal';

export default function ExperiencesTimeline() {
  const [mounted, setMounted] = useState(false);
  const [activeExperience, setActiveExperience] = useState<number | null>(null);
  const experienceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { open } = useModalManager();
  
  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort experiences by start year (newest first)
  const sortedExperiences = [...EXPERIENCES].sort((a, b) => {
    const aStartYear = parseInt(a.period.split(' - ')[0]);
    const bStartYear = parseInt(b.period.split(' - ')[0]);
    return bStartYear - aStartYear;
  });
  
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

  // Handle scroll-based active experience
  useEffect(() => {
    const handleScroll = () => {
      if (experienceRefs.current.length === 0) return;
      
      const viewportHeight = window.innerHeight;
      const midPoint = viewportHeight * 0.4; // 40% from the top
      
      let closestExperience = null;
      let closestDistance = Infinity;
      
      experienceRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const distanceToMidpoint = Math.abs(rect.top + rect.height / 2 - midPoint);
        
        if (distanceToMidpoint < closestDistance) {
          closestDistance = distanceToMidpoint;
          closestExperience = index;
        }
      });
      
      setActiveExperience(closestExperience);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Progress indicator animation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!mounted) return null;

  return (
    <section id="experience" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background elements - subtle gradient orbs that add depth without being distracting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neutral-50 to-transparent dark:from-gray-950 dark:to-transparent opacity-60"></div>
        
        <motion.div 
          className="absolute top-1/4 -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-blue-50/10 to-violet-50/10 dark:from-blue-900/5 dark:to-violet-900/5 blur-[120px]"
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 -right-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-blue-50/10 to-emerald-50/10 dark:from-blue-900/5 dark:to-emerald-900/5 blur-[100px]"
          animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      
      {/* Progress indicator - thin line that tracks scroll progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-500/20 dark:bg-blue-400/20 origin-left z-[100]"
        style={{ scaleX }}
      />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-white tracking-tight">
              Professional <span className="text-blue-500 dark:text-blue-400 font-normal">Experience</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl leading-relaxed">
              Over 20 years of experience building innovative solutions and leading development teams.
              Expertise across multiple technologies and industries with a focus on creating impactful digital experiences.
            </p>
          </motion.div>
          
          {/* Main timeline experience section */}
          <div className="relative">
            {/* Timeline connector - a subtle line connecting experiences */}
            <div className="absolute left-[15px] md:left-[50%] top-0 bottom-0 md:-translate-x-[0.5px] z-10">
              {/* Use a gradient with dashed elements for a more modern look */}
              <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-blue-200/50 dark:via-blue-800/30 to-transparent"></div>
              
              {/* Dashed overlay for subtle texture */}
              <div className="absolute inset-0 h-full w-[1px] opacity-40" 
                style={{ 
                  backgroundImage: 'linear-gradient(to bottom, transparent, transparent 4px, rgba(59, 130, 246, 0.2) 4px, rgba(59, 130, 246, 0.2) 8px)',
                  backgroundSize: '1px 12px'
                }}>
              </div>
            </div>
            
            {/* Experience blocks */}
            <div className="space-y-32 md:space-y-48">
              {sortedExperiences.map((experience, index) => {
                const companyName = experience.company ? COMPANIES[experience.company]?.name : null;
                const isEven = index % 2 === 0;
                const startYear = experience.period.split(' - ')[0];
                const endYear = experience.period.split(' - ')[1] || 'Present';
                
                return (
                  <motion.div 
                    key={experience.id} 
                    ref={(el) => {
                      experienceRefs.current[index] = el;
                    }}
                    className={`relative ${activeExperience === index ? 'z-10' : 'z-0'}`}
                    initial={{ opacity: 0.4, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-30%" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    {/* Year indicator - subtle but visible date marker */}
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-6 md:-top-8">
                      <motion.div 
                        className={`inline-flex items-center justify-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 
                            ${activeExperience === index ? 
                            'bg-blue-50 dark:bg-blue-900/20' : 
                            'bg-gray-50 dark:bg-gray-800/20'} 
                            rounded-full transition-colors duration-500`}
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        {startYear} — {endYear}
                      </motion.div>
                    </div>
                    
                    {/* Timeline node - subtle connection point */}
                    <div className="absolute left-[15px] md:left-1/2 top-0 md:-translate-x-[7px] z-20">
                      <motion.div 
                        className={`w-[15px] h-[15px] rounded-full border-2 
                            ${activeExperience === index ? 
                            'bg-blue-100 dark:bg-blue-900/50 border-blue-500 dark:border-blue-400' : 
                            'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'} 
                            transition-colors duration-500`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <div className={`absolute inset-[3px] rounded-full 
                            ${activeExperience === index ? 
                            'bg-blue-500 dark:bg-blue-400' : 
                            'bg-gray-400 dark:bg-gray-600'} 
                            transition-colors duration-500`}></div>
                      </motion.div>
                    </div>
                    
                    {/* Content container - the main experience block */}
                    <div className="flex flex-col md:flex-row md:items-start">
                      {/* Left column (hidden on mobile) */}
                      <div className="hidden md:block md:w-1/2 md:pr-12 md:text-right">
                        {isEven && (
                          <ExperienceContent 
                            experience={experience}
                            companyName={companyName}
                            index={index}
                            activeIndex={activeExperience}
                            handleOpenExperience={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                            handleOpenCompany={() => experience.company && handleOpenCompany(experience.company)}
                            position="left"
                          />
                        )}
                      </div>
                      
                      {/* Right column (or full width on mobile) */}
                      <div className={`md:w-1/2 pl-10 md:pl-12 ${isEven ? '' : 'md:pt-24'}`}>
                        {!isEven && (
                          <ExperienceContent 
                            experience={experience}
                            companyName={companyName}
                            index={index}
                            activeIndex={activeExperience}
                            handleOpenExperience={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                            handleOpenCompany={() => experience.company && handleOpenCompany(experience.company)}
                            position="right"
                          />
                        )}
                        
                        {/* Mobile version (always visible on mobile) */}
                        <div className="md:hidden">
                          {isEven && (
                            <ExperienceContent 
                              experience={experience}
                              companyName={companyName}
                              index={index}
                              activeIndex={activeExperience}
                              handleOpenExperience={() => handleOpenExperience(EXPERIENCES.findIndex(e => e.id === experience.id))}
                              handleOpenCompany={() => experience.company && handleOpenCompany(experience.company)}
                              position="mobile"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Separate component for Experience content to avoid repetition
function ExperienceContent({ 
  experience,
  companyName,
  index,
  activeIndex,
  handleOpenExperience,
  handleOpenCompany,
  position
}: { 
  experience: typeof EXPERIENCES[number];
  companyName: string | null;
  index: number;
  activeIndex: number | null;
  handleOpenExperience: () => void;
  handleOpenCompany: () => void;
  position: 'left' | 'right' | 'mobile';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const isActive = index === activeIndex;
  
  // Dynamic animations based on position
  const getInitialAnimation = () => {
    if (position === 'left') return { opacity: 0, x: -20 };
    if (position === 'right') return { opacity: 0, x: 20 };
    return { opacity: 0, y: 20 };
  };
  
  return (
    <motion.div
      ref={containerRef}
      initial={getInitialAnimation()}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group ${isActive ? 'scale-100' : 'scale-[0.98]'} transition-all duration-300`}
    >
      {/* Visual block with image background */}
      <div 
        onClick={handleOpenExperience}
        className={`relative overflow-hidden cursor-pointer mb-6 
            ${position === 'mobile' ? 'h-40' : 'aspect-[16/9]'}
            ${isActive ? 
            'rounded-2xl shadow-md dark:shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10' : 
            'rounded-xl'} 
            transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-40"></div>
        
        <Image 
          src={experience.logo} 
          alt={experience.title}
          fill
          className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          style={{ objectPosition: 'center' }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        
        {/* Title and company overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-light tracking-wide mb-2 group-hover:translate-x-1 transition-transform duration-300">
            {experience.title}
          </h3>
          {companyName && (
            <p 
              onClick={(e) => { e.stopPropagation(); handleOpenCompany(); }}
              className="font-light opacity-90 hover:opacity-100 hover:underline transition-all duration-200 cursor-pointer"
            >
              {companyName}
            </p>
          )}
        </div>
        
        {/* Skill tags container - appears on hover */}
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-wrap gap-2 justify-end">
            {experience.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white"
              >
                {getSkillNames([skill])[0]}
              </span>
            ))}
            {experience.skills.length > 3 && (
              <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white">
                +{experience.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Description and statistics - visible information */}
      <div className="pl-2">
        {/* Description with expanding behavior */}
        <p className={`text-gray-600 dark:text-gray-400 font-light mb-6 max-w-md leading-relaxed
            ${isActive ? 'line-clamp-none' : 'line-clamp-3'}
            transition-all duration-300`}>
          {experience.description}
        </p>
        
        {/* Impact statistics - bold visual metrics */}
        {experience.impactStatements && (
          <div className="flex flex-wrap gap-4 mb-6">
            {experience.impactStatements.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + (i * 0.1), duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl font-normal text-blue-500 dark:text-blue-400 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider font-light mt-1">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Create a wrapper div with fixed height to prevent layout shift */}
        <div className="min-h-[120px]">
          {/* Key achievements - using better animation approach */}
          {experience.keyAchievements && (
            <div 
              className={`mt-4 space-y-2 overflow-hidden transition-opacity duration-300`} 
              style={{ 
                opacity: isActive ? 1 : 0,
                maxHeight: isActive ? '1000px' : '0',
                transition: 'opacity 0.3s ease, max-height 0.5s ease',
              }}
            >
              <h4 className="text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 font-light mb-3">
                Key Achievements
              </h4>
              <ul className="space-y-2">
                {experience.keyAchievements.map((achievement, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -5 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    className="flex items-start text-gray-700 dark:text-gray-300 font-light"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-2 mr-2 flex-shrink-0"></span>
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* View details button in fixed position to prevent layout shift */}
        <div className="h-10 flex items-center">
          <button 
            onClick={handleOpenExperience}
            className={`text-sm font-light 
                ${isActive ? 
                'text-blue-500 dark:text-blue-400' : 
                'text-gray-500 dark:text-gray-400'} 
                hover:text-blue-600 dark:hover:text-blue-300 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
          >
            View Details
            <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 