"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS } from '@/data/portfolioData';
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

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
        <motion.div 
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
        </motion.div>
        
        {/* Visualization toggle */}
        <motion.div 
          className="flex justify-center mb-8 sm:mb-10"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
        </motion.div>
        
        {/* Visualization content with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {visualizationMode === 'cloud' ? (
            <motion.div
              key="cloud-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SkillCloud 
                onSkillClick={handleShowProjects}
                activeCategory={activeFilter}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="grid-view"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {filteredSkills.map((skill) => (
                <SkillCard 
                  key={skill.id}
                  skill={skill}
                  onClick={handleShowProjects}
                  getSkillIcon={getSkillIcon}
                />
              ))}
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