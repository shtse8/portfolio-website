"use client";

import { useState, useEffect } from 'react';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine, FaChevronRight } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum } from 'react-icons/si';
import { motion } from 'framer-motion';
import { SKILLS, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';
import SkillModal from './skills/SkillModal';
import { useModalManager } from '@/hooks/useModalManager';

// Get projects related to the selected skill
const getRelatedProjects = (skillId: string): Project[] => {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return [];

  // PRIMARY CONNECTION: Get projects that explicitly list this skill in their relatedSkills array
  const explicitlyRelatedProjects = PROJECTS.filter(project => 
    project.relatedSkills?.includes(skillId)
  );
  
  // If we have explicit connections, prefer those
  if (explicitlyRelatedProjects.length > 0) {
    return explicitlyRelatedProjects;
  }
  
  // SECONDARY CONNECTION (FALLBACK): Find projects by matching skill keywords against project tags
  const keywordMatchedProjects = PROJECTS.filter(project => 
    project.tags.some(tag => 
      skill.keywords.some(keyword => 
        tag.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  );
  
  return keywordMatchedProjects;
};

// Get experiences related to the selected skill
const getRelatedExperiences = (skillId: string): Experience[] => {
  return EXPERIENCES.filter(experience => 
    experience.relatedSkills?.includes(skillId)
  );
};

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      mass: 1.2,
      duration: 0.7
    }
  }
};

// SkillCard component for individual skill display
interface SkillCardProps {
  skill: typeof SKILLS[0];
  onClick: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, getSkillIcon }) => {
  const relatedProjects = getRelatedProjects(skill.id);
  const relatedExperiences = getRelatedExperiences(skill.id);
  const relationshipCount = relatedProjects.length + relatedExperiences.length;
  
  return (
    <motion.div 
      variants={itemVariants}
      className={`group relative bg-gray-50 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden 
                transition-all duration-300 ${relationshipCount > 0 ? 'cursor-pointer' : ''}`}
      whileHover={relationshipCount > 0 ? { 
        y: -3,
        backgroundColor: relationshipCount > 0 ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)"
      } : {}}
      onClick={() => relationshipCount > 0 && onClick(skill.id)}
    >
      {/* Colored accent in a minimal way */}
      <div className={`h-0.5 w-full ${skill.bgColor}`}></div>
      
      <div className="p-8">
        {/* Icon and title with more spacing and flatter design */}
        <div className="flex items-center mb-6">
          <div className={`${skill.color} p-3 rounded-lg mr-5`}>
            {getSkillIcon(skill.id)}
          </div>
          <h3 className="text-xl font-light tracking-wide">{skill.name}</h3>
        </div>
        
        {/* Description with better spacing */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">{skill.description}</p>
        
        {/* Expertise level with simplified flat design */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400 font-light">Expertise</span>
            <span className="text-gray-500 dark:text-gray-400 font-light">Expert</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${skill.bgColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${80 + Math.random() * 20}%` }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
        
        {/* Simplified related items info */}
        {relationshipCount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                {relationshipCount} related {relationshipCount === 1 ? 'item' : 'items'}
              </span>
              {relationshipCount > 0 && (
                <div className="text-blue-500 dark:text-blue-400">
                  <FaChevronRight size={12} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function TechStack() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredSkills, setFilteredSkills] = useState(SKILLS);
  const [mounted, setMounted] = useState(false);
  const { open } = useModalManager();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter skills by category
  useEffect(() => {
    if (activeFilter) {
      const filtered = SKILLS.filter(skill => skill.category === activeFilter);
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(SKILLS);
    }
  }, [activeFilter]);

  // Get the icon component for a skill
  const getSkillIcon = (skillId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'react': <FaReact className="text-4xl" />,
      'typescript': <SiTypescript className="text-4xl" />,
      'nodejs': <FaNodeJs className="text-4xl" />,
      'python': <FaPython className="text-4xl" />,
      'java': <FaJava className="text-4xl" />,
      'docker': <FaDocker className="text-4xl" />,
      'kubernetes': <SiKubernetes className="text-4xl" />,
      'gcp': <SiGooglecloud className="text-4xl" />,
      'firebase': <SiFirebase className="text-4xl" />,
      'databases': <FaDatabase className="text-4xl" />,
      'unity3d': <SiUnity className="text-4xl" />,
      'gamedev': <FaGamepad className="text-4xl" />,
      'ai-ml': <FaRobot className="text-4xl" />,
      'blockchain': <SiEthereum className="text-4xl" />,
      'team-leadership': <FaUsers className="text-4xl" />,
      'business-growth': <FaChartLine className="text-4xl" />
    };
    return iconMap[skillId] || <FaReact className="text-4xl" />;
  };
  
  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'devops', name: 'DevOps' },
    { id: 'ai', name: 'AI & ML' },
    { id: 'game', name: 'Game Dev' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'management', name: 'Management' }
  ];

  // Animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleShowProjects = (skillId: string) => {
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
        getSkillIcon={getSkillIcon}
      />,
      { modalKey: skillId }
    );
  };

  if (!mounted) return null;
  
  return (
    <section id="tech-stack" className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 -z-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 -z-10">
        <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headingVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Technical</span> Expertise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Full-stack developer with extensive experience across multiple domains and technologies
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            onClick={() => setActiveFilter(null)} 
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilter === null 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/20' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Technologies
          </motion.button>
          
          {categories.map(category => (
            <motion.button 
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                activeFilter === category.id 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
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
      </div>
    </section>
  );
} 