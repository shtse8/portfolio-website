"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, TechSkill, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';
import SkillModal from '../SkillModal';
import SkillCard from '../SkillCard';
import { useModalManager } from '@/hooks/useModalManager';
import SkillCloud from './SkillCloud';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine, 
  FaNetworkWired, FaFileCode, FaSortAmountUp, FaApple, FaAndroid, FaMobileAlt, FaSearch, FaVuejs, FaPhp, FaFacebook, 
  FaCreditCard, FaImages, FaVideo, FaFingerprint, FaBolt, FaMoneyBillWave, FaTelegram } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum, SiSharp, SiNextdotjs, 
  SiNestjs, SiGooglechrome, SiGo, SiPytorch } from 'react-icons/si';
import { cn } from '@/lib/utils';

// Define skill category data with improved typing
interface SkillCategory {
  id: string;
  name: string;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'devops', name: 'DevOps' },
  { id: 'ai', name: 'AI & ML' },
  { id: 'game', name: 'Game Dev' },
  { id: 'blockchain', name: 'Blockchain' },
  { id: 'management', name: 'Leadership & Management' }
];

export default function SkillCloudView() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredSkills, setFilteredSkills] = useState(SKILLS);
  const [mounted, setMounted] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState<'grid' | 'cloud'>('cloud');
  const { open } = useModalManager();

  // Icon mapping as a memoized object
  const iconComponents = useMemo(() => ({
    // Fa icons
    'FaReact': <FaReact className="text-4xl" />,
    'FaNodeJs': <FaNodeJs className="text-4xl" />,
    'FaPython': <FaPython className="text-4xl" />,
    'FaJava': <FaJava className="text-4xl" />,
    'FaDocker': <FaDocker className="text-4xl" />,
    'FaDatabase': <FaDatabase className="text-4xl" />,
    'FaGamepad': <FaGamepad className="text-4xl" />,
    'FaRobot': <FaRobot className="text-4xl" />,
    'FaUsers': <FaUsers className="text-4xl" />,
    'FaChartLine': <FaChartLine className="text-4xl" />,
    'FaNetworkWired': <FaNetworkWired className="text-4xl" />,
    'FaFileCode': <FaFileCode className="text-4xl" />,
    'FaSortAmountUp': <FaSortAmountUp className="text-4xl" />,
    'FaApple': <FaApple className="text-4xl" />,
    'FaAndroid': <FaAndroid className="text-4xl" />,
    'FaMobileAlt': <FaMobileAlt className="text-4xl" />,
    'FaSearch': <FaSearch className="text-4xl" />,
    'FaVuejs': <FaVuejs className="text-4xl" />,
    'FaPhp': <FaPhp className="text-4xl" />,
    'FaFacebook': <FaFacebook className="text-4xl" />,
    'FaCreditCard': <FaCreditCard className="text-4xl" />,
    'FaImages': <FaImages className="text-4xl" />,
    'FaVideo': <FaVideo className="text-4xl" />,
    'FaFingerprint': <FaFingerprint className="text-4xl" />,
    'FaBolt': <FaBolt className="text-4xl" />,
    'FaMoneyBillWave': <FaMoneyBillWave className="text-4xl" />,
    'FaTelegram': <FaTelegram className="text-4xl" />,
    
    // Si icons
    'SiTypescript': <SiTypescript className="text-4xl" />,
    'SiKubernetes': <SiKubernetes className="text-4xl" />,
    'SiGooglecloud': <SiGooglecloud className="text-4xl" />,
    'SiFirebase': <SiFirebase className="text-4xl" />,
    'SiUnity': <SiUnity className="text-4xl" />,
    'SiEthereum': <SiEthereum className="text-4xl" />,
    'SiCsharp': <SiSharp className="text-4xl" />,
    'SiNextdotjs': <SiNextdotjs className="text-4xl" />,
    'SiNestjs': <SiNestjs className="text-4xl" />,
    'SiGooglechrome': <SiGooglechrome className="text-4xl" />,
    'SiGo': <SiGo className="text-4xl" />,
    'SiPytorch': <SiPytorch className="text-4xl" />,
  }), []);

  // Client-side only mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter skills by category
  useEffect(() => {
    if (!SKILLS || SKILLS.length === 0) return;
    
    setFilteredSkills(
      activeFilter 
        ? SKILLS.filter(skill => skill.category === activeFilter)
        : SKILLS
    );
  }, [activeFilter]);

  // Get the icon component for a skill
  const getSkillIcon = useCallback((skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return <FaReact className="text-4xl" aria-hidden="true" />;

    return iconComponents[skill.icon as keyof typeof iconComponents] || 
           <FaReact className="text-4xl" aria-hidden="true" />;
  }, [iconComponents]);

  // Handle skill click for modal display
  const handleShowProjects = useCallback((skillId: string) => {
    const currentIndex = filteredSkills.findIndex(skill => skill.id === skillId);
    
    const goToNext = () => {
      const nextIndex = (currentIndex + 1) % filteredSkills.length;
      handleShowProjects(filteredSkills[nextIndex].id);
    };
    
    const goToPrev = () => {
      const prevIndex = (currentIndex - 1 + filteredSkills.length) % filteredSkills.length;
      handleShowProjects(filteredSkills[prevIndex].id);
    };
    
    open(
      <SkillModal
        skillId={skillId}
        closeModal={() => {}}
        nextSkill={goToNext}
        prevSkill={goToPrev}
      />,
      { 
        modalKey: skillId,
        hasNavigation: true,
        onNext: goToNext,
        onPrevious: goToPrev
      }
    );
  }, [filteredSkills, open]);

  // Mode toggle handlers
  const setCloudMode = useCallback(() => setVisualizationMode('cloud'), []);
  const setGridMode = useCallback(() => setVisualizationMode('grid'), []);
  const clearFilter = useCallback(() => setActiveFilter(null), []);

  // Early return for SSR
  if (!mounted) return null;
  
  return (
    <section 
      className="relative overflow-hidden" 
      aria-labelledby="skills-visualization-heading"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] -z-10"
        aria-hidden="true"
      >
        <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4">
        <h3 
          id="skills-visualization-heading" 
          className="sr-only"
        >
          Skills Visualization
        </h3>
        
        {/* Category filter buttons with compact visualization toggle */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-6">
          <div className="flex mr-1 sm:mr-3">
            <div className="inline-flex h-8 items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-0.5 shadow-sm">
              <button
                type="button"
                onClick={setCloudMode}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7",
                  visualizationMode === 'cloud'
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                )}
                aria-pressed={visualizationMode === 'cloud'}
                aria-label="View as word cloud"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                onClick={setGridMode}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7",
                  visualizationMode === 'grid'
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                )}
                aria-pressed={visualizationMode === 'grid'}
                aria-label="View as grid"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <FilterButton 
            isActive={activeFilter === null}
            onClick={clearFilter}
            label="All Technologies"
          />
          
          {SKILL_CATEGORIES.map(category => (
            <FilterButton 
              key={category.id}
              isActive={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
              label={category.name}
            />
          ))}
        </div>
        
        {/* Visualization content with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {visualizationMode === 'cloud' ? (
            <motion.div
              key="cloud-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SkillCloud 
                onSkillClick={handleShowProjects}
                activeCategory={activeFilter}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <SkillGridByExperience 
                skills={filteredSkills} 
                handleShowProjects={handleShowProjects}
                getSkillIcon={getSkillIcon}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Extracted FilterButton component with improved types
interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ isActive, onClick, label }) => (
  <motion.button 
    onClick={onClick} 
    className={cn(
      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm",
      isActive 
        ? "bg-blue-600 text-white shadow-blue-500/10" 
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
    )}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    aria-pressed={isActive}
  >
    {label}
  </motion.button>
);

// Experience-based grid implementation
interface SkillGridByExperienceProps {
  skills: TechSkill[];
  handleShowProjects: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

// Compact skill card component for more efficient mobile display
interface CompactSkillCardProps {
  skill: TechSkill;
  onClick: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

const CompactSkillCard: React.FC<CompactSkillCardProps> = ({ skill, onClick, getSkillIcon }) => {
  // Determine if card is interactive based on having related projects/experiences
  const relatedProjectCount = useMemo(() => {
    const projects = PROJECTS.filter((project: Project) => project.skills.includes(skill.id));
    const experiences = EXPERIENCES.filter((exp: Experience) => exp.skills.includes(skill.id));
    return projects.length + experiences.length;
  }, [skill.id]);
  
  const isInteractive = relatedProjectCount > 0;
  
  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden",
        "shadow-sm border border-gray-100 dark:border-gray-700",
        "transition-all duration-200 h-full flex flex-col",
        isInteractive && "hover:shadow-md hover:-translate-y-1 cursor-pointer"
      )}
      onClick={() => isInteractive && onClick(skill.id)}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${skill.name}: ${skill.yearsOfExperience} years of experience`}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(skill.id);
        }
      }}
    >
      {/* Colored accent top bar */}
      <div 
        className={cn("h-1 w-full", skill.bgColor || "bg-blue-500")} 
        aria-hidden="true"
      />
      
      <div className="p-3 sm:p-4 flex flex-col h-full">
        {/* Icon and title in a more compact layout */}
        <div className="flex items-center mb-2">
          <div 
            className={cn(
              "flex-shrink-0 p-1.5 rounded-md mr-2 sm:mr-3",
              skill.color || "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
            )} 
            aria-hidden="true"
          >
            {getSkillIcon(skill.id)}
          </div>
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
            {skill.name}
          </h3>
        </div>
        
        {/* Experience level */}
        <div className="mb-1.5">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div 
                className={cn(
                  "h-1 rounded-full",
                  skill.bgColor || "bg-blue-500"
                )}
                style={{ width: `${Math.min(100, skill.yearsOfExperience * 10)}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {skill.yearsOfExperience}yr
            </span>
          </div>
        </div>
        
        {/* Simplified footer for related items */}
        {relatedProjectCount > 0 && (
          <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {relatedProjectCount} item{relatedProjectCount !== 1 && 's'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

const SkillGridByExperience: React.FC<SkillGridByExperienceProps> = ({
  skills,
  handleShowProjects,
  getSkillIcon,
}) => {
  // Define experience tiers with clear labels
  const experienceTiers = [
    { name: "Expert (5+ years)", min: 5, max: 100, className: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30" },
    { name: "Advanced (3-5 years)", min: 3, max: 5, className: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30" },
    { name: "Intermediate (1-3 years)", min: 1, max: 3, className: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30" },
    { name: "Beginner (<1 year)", min: 0, max: 1, className: "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/30" }
  ];
  
  // Group skills by experience tier
  const skillsByExperience = experienceTiers.map(tier => ({
    ...tier,
    skills: skills.filter(skill => 
      skill.yearsOfExperience >= tier.min && 
      skill.yearsOfExperience < tier.max
    ).sort((a, b) => b.yearsOfExperience - a.yearsOfExperience)
  }));
  
  // State for expanded sections
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  
  // Initialize visible counts when skills change
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    experienceTiers.forEach(tier => {
      const tierSkills = skills.filter(skill => 
        skill.yearsOfExperience >= tier.min && 
        skill.yearsOfExperience < tier.max
      );
      initialCounts[tier.name] = Math.min(8, tierSkills.length);
    });
    setVisibleCounts(initialCounts);
  }, [skills]);

  // Show more skills in a tier
  const showMore = useCallback((tierName: string, totalCount: number) => {
    setVisibleCounts(prev => ({
      ...prev,
      [tierName]: Math.min(prev[tierName] + 8, totalCount)
    }));
  }, []);
  
  // Show fewer skills in a tier
  const showLess = useCallback((tierName: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [tierName]: Math.min(8, prev[tierName])
    }));
  }, []);

  return (
    <div className="space-y-12">
      {skillsByExperience.map(tier => {
        // Skip empty tiers
        if (tier.skills.length === 0) return null;
        
        const visibleSkills = tier.skills.slice(0, visibleCounts[tier.name] || 8);
        const hasMore = tier.skills.length > (visibleCounts[tier.name] || 8);
        const showingAll = visibleCounts[tier.name] === tier.skills.length;
        
        return (
          <div key={tier.name} className={`p-6 rounded-xl border ${tier.className}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center">
                {tier.name}
                <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({tier.skills.length} skills)
                </span>
              </h3>
              
              {tier.skills.length > 8 && showingAll && (
                <button
                  onClick={() => showLess(tier.name)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Show Less
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {visibleSkills.map(skill => (
                <div key={skill.id} className="transition-opacity duration-150">
                  {/* Use CompactSkillCard for mobile and SkillCard for larger screens */}
                  <div className="block md:hidden">
                    <CompactSkillCard
                      skill={skill}
                      onClick={handleShowProjects}
                      getSkillIcon={getSkillIcon}
                    />
                  </div>
                  <div className="hidden md:block">
                    <SkillCard
                      skill={skill}
                      onClick={handleShowProjects}
                      getSkillIcon={getSkillIcon}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => showMore(tier.name, tier.skills.length)}
                  className="group flex items-center space-x-2 px-5 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow transition-all duration-200"
                >
                  <span>Show {Math.min(8, tier.skills.length - visibleSkills.length)} more</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-y-1" 
                    fill="none" viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 