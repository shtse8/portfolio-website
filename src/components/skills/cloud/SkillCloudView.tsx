"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, TechSkill } from '@/data/portfolioData';
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

  // Filter skills by category - memoized effect
  useEffect(() => {
    if (!SKILLS || SKILLS.length === 0) return;
    
    setFilteredSkills(
      activeFilter 
        ? SKILLS.filter(skill => skill.category === activeFilter)
        : SKILLS
    );
  }, [activeFilter]);

  // Get the icon component for a skill - memoized function
  const getSkillIcon = useCallback((skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return <FaReact className="text-4xl" aria-hidden="true" />;

    return iconComponents[skill.icon as keyof typeof iconComponents] || 
           <FaReact className="text-4xl" aria-hidden="true" />;
  }, [iconComponents]);

  // Handle skill click for modal display - memoized callback
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

  // Mode toggle handlers - memoized callbacks
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
      {/* Background pattern - subtle grid with radial gradient */}
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
        
        {/* Category filter buttons */}
        <div 
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6"
        >
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
        
        {/* Visualization toggle */}
        <div
          className="flex justify-center mb-8 sm:mb-10"
        >
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            <ToggleButton
              isActive={visualizationMode === 'cloud'}
              onClick={setCloudMode}
              label="Word Cloud"
            />
            <ToggleButton
              isActive={visualizationMode === 'grid'}
              onClick={setGridMode}
              label="Grid View"
            />
          </div>
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
              {activeFilter === null ? (
                <SkillGridCategorized 
                  skills={filteredSkills} 
                  handleShowProjects={handleShowProjects}
                  getSkillIcon={getSkillIcon}
                  categories={SKILL_CATEGORIES}
                />
              ) : (
                <SkillGridWithLoadMore 
                  skills={filteredSkills} 
                  handleShowProjects={handleShowProjects}
                  getSkillIcon={getSkillIcon}
                />
              )}
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

// New ToggleButton component for visualization mode
interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onClick, label }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
      isActive 
        ? "bg-blue-600 text-white shadow-sm" 
        : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
    )}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

// Grid view implementation with "Show More" functionality
interface SkillGridWithLoadMoreProps {
  skills: TechSkill[];
  handleShowProjects: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

const SkillGridWithLoadMore: React.FC<SkillGridWithLoadMoreProps> = ({ 
  skills, 
  handleShowProjects, 
  getSkillIcon 
}) => {
  const [visibleCount, setVisibleCount] = useState(8);
  
  const showMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 8, skills.length));
  }, [skills.length]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {skills.slice(0, visibleCount).map((skill) => (
          <div key={skill.id} className="transition-opacity duration-150">
            <SkillCard 
              skill={skill}
              onClick={handleShowProjects}
              getSkillIcon={getSkillIcon}
            />
          </div>
        ))}
      </div>
      
      {visibleCount < skills.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={showMore}
            className="group flex items-center space-x-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow hover:bg-gray-50 dark:hover:bg-gray-750"
            aria-label={`Show ${Math.min(8, skills.length - visibleCount)} more skills`}
          >
            <span>Show More</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-y-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {visibleCount === skills.length && visibleCount > 8 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount(8)}
            className="group flex items-center space-x-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow hover:bg-gray-50 dark:hover:bg-gray-750"
            aria-label="Show fewer skills"
          >
            <span>Show Less</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 transform transition-transform duration-200 group-hover:-translate-y-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Categorized grid view implementation
interface SkillGridCategorizedProps {
  skills: TechSkill[];
  handleShowProjects: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
  categories: SkillCategory[];
}

const SkillGridCategorized: React.FC<SkillGridCategorizedProps> = ({
  skills,
  handleShowProjects,
  getSkillIcon,
  categories
}) => {
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = skills.filter(skill => skill.category === category.id);
      return acc;
    }, {} as Record<string, TechSkill[]>);
  }, [skills, categories]);

  // Toggle category expansion with immediate transition
  const toggleCategory = useCallback((categoryId: string) => {
    // Immediately update state without animations
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  return (
    <div className="space-y-10">
      {categories.map(category => {
        const categorySkills = skillsByCategory[category.id] || [];
        if (categorySkills.length === 0) return null;
        
        const isExpanded = expandedCategories[category.id] || false;
        const displayedSkills = isExpanded ? categorySkills : categorySkills.slice(0, 4);
        
        return (
          <section 
            key={category.id}
            className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {category.name}
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  {categorySkills.length}
                </span>
              </h3>
              
              {categorySkills.length > 4 && (
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`category-${category.id}-skills`}
                >
                  {isExpanded ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>
            
            <div 
              id={`category-${category.id}-skills`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {displayedSkills.map((skill) => (
                <div key={skill.id} className="transition-opacity duration-150">
                  <SkillCard 
                    skill={skill}
                    onClick={handleShowProjects}
                    getSkillIcon={getSkillIcon}
                  />
                </div>
              ))}
            </div>
            
            {categorySkills.length > 4 && !isExpanded && (
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => toggleCategory(category.id)}
                  className="group flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow"
                  aria-expanded={isExpanded}
                  aria-controls={`category-${category.id}-skills`}
                >
                  <span>Show {categorySkills.length - 4} more</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-y-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}; 