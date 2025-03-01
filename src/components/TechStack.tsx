"use client";

import { useState, useEffect } from 'react';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine, 
  FaNetworkWired, FaFileCode, FaSortAmountUp, FaApple, FaAndroid, FaMobileAlt, FaSearch, FaVuejs, FaPhp, FaFacebook, 
  FaCreditCard, FaImages, FaVideo, FaFingerprint, FaBolt, FaMoneyBillWave, FaTelegram } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum, SiSharp, SiNextdotjs, 
  SiNestjs, SiGooglechrome, SiGo, SiPytorch } from 'react-icons/si';
import { motion } from 'framer-motion';
import { SKILLS } from '@/data/portfolioData';
import SkillModal from './skills/SkillModal';
import SkillCard from './skills/SkillCard';
import { useModalManager } from '@/hooks/useModalManager';

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
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return <FaReact className="text-4xl" />;

    const iconName = skill.icon;
    const iconComponents: Record<string, React.ReactNode> = {
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
    };

    return iconComponents[iconName] || <FaReact className="text-4xl" />;
  };
  
  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'devops', name: 'DevOps' },
    { id: 'ai', name: 'AI & ML' },
    { id: 'game', name: 'Game Dev' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'management', name: 'Leadership & Management' }
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
      />,
      { 
        modalKey: skillId,
        hasNavigation: true,
        onNext: goToNext,
        onPrevious: goToPrev
      }
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
            <span className="gradient-text">Skills</span> & Expertise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Full-stack developer with expertise across technical domains and professional leadership
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