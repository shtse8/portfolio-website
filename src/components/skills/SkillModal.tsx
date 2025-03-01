"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { FaProjectDiagram, FaBriefcase, FaExternalLinkAlt, FaGithub, FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, 
  FaGamepad, FaRobot, FaUsers, FaChartLine, FaNetworkWired, FaFileCode, FaSortAmountUp, FaApple, FaAndroid, 
  FaMobileAlt, FaSearch, FaVuejs, FaPhp, FaFacebook, FaCreditCard, FaImages, FaVideo, FaFingerprint, FaBolt, 
  FaMoneyBillWave, FaTelegram } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum, SiSharp, SiNextdotjs, 
  SiNestjs, SiGooglechrome, SiGo, SiPytorch } from 'react-icons/si';
import { motion } from 'framer-motion';
import { SKILLS, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';
import { getSkillNames } from '@/utils/skillHelpers';

type SkillModalProps = {
  skillId: string;
  closeModal?: () => void;
  nextSkill?: () => void;
  prevSkill?: () => void;
};

// Get projects related to the selected skill
const getRelatedProjects = (skillId: string): Project[] => {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return [];

  // Get projects that explicitly list this skill in their skills array
  return PROJECTS.filter(project => 
    project.skills.includes(skillId)
  );
};

// Get experiences related to the selected skill
const getRelatedExperiences = (skillId: string): Experience[] => {
  return EXPERIENCES.filter(experience => 
    experience.skills.includes(skillId)
  );
};

// Get the appropriate icon component for a skill
const getSkillIcon = (iconName: string) => {
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

export default function SkillModal({
  skillId,
  closeModal,
  nextSkill,
  prevSkill,
}: SkillModalProps) {
  const skill = SKILLS.find(s => s.id === skillId);
  
  // Move these variables up before the useEffect
  const relatedProjects = skill ? getRelatedProjects(skillId) : [];
  const relatedExperiences = skill ? getRelatedExperiences(skillId) : [];

  // Add keyboard navigation - placed before the return statement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeModal) {
        closeModal();
      } else if (e.key === 'ArrowRight' && nextSkill) {
        nextSkill();
      } else if (e.key === 'ArrowLeft' && prevSkill) {
        prevSkill();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, nextSkill, prevSkill]);

  // Early return moved after the useEffect hook
  if (!skill) return null;

  // Enhanced animation variants for smoother transitions with directional support
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 10 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.98,
      transition: { 
        duration: 0.15,
        ease: "easeInOut" 
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.25,
        delay: 0.1 // Slight delay to ensure parent container appears first
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full relative shadow-xl overflow-hidden">
      {/* Header with gradient background */}
      <motion.div 
        className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-8 rounded-t-2xl"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={`skill-header-${skillId}`}
      >
        <div className="flex items-center">
          <motion.div 
            className={`${skill.bgColor} text-white p-4 rounded-xl mr-5`}
            variants={itemVariants}
          >
            {getSkillIcon(skill.icon)}
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-light tracking-wide text-gray-900 dark:text-white">
              {skill.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 font-light">
              {skill.description}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="p-8"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={`skill-content-${skillId}`}
      >
        {/* Related Experiences Section */}
        {relatedExperiences.length > 0 && (
          <motion.div 
            className="mb-10"
            variants={itemVariants}
          >
            <h4 className="text-xl font-light tracking-wide mb-6 flex items-center text-gray-900 dark:text-white">
              <FaBriefcase className="mr-3 text-indigo-500 dark:text-indigo-400" />
              Related Experiences
            </h4>
            
            <div className="grid grid-cols-1 gap-5">
              {relatedExperiences.map((experience) => (
                <motion.div
                  key={experience.id}
                  className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer shadow-sm"
                  variants={itemVariants}
                  whileHover={{ x: 2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 mr-5">
                      <Image
                        src={experience.logo}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-light text-lg mb-2 text-gray-900 dark:text-white tracking-wide">{experience.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{experience.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">{experience.period}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                        {experience.description || experience.details?.[0] || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <motion.div
            variants={itemVariants}
          >
            <h4 className="text-xl font-light tracking-wide mb-6 flex items-center text-gray-900 dark:text-white">
              <FaProjectDiagram className="mr-3 text-blue-500 dark:text-blue-400" />
              Related Projects
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer shadow-sm"
                  variants={itemVariants}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="relative h-44">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h5 className="font-light text-lg mb-3 text-gray-900 dark:text-white tracking-wide">{project.title}</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-light line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.skills && getSkillNames(project.skills).slice(0, 3).map((skillName, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {skillName}
                        </span>
                      ))}
                      {project.skills && project.skills.length > 3 && (
                        <span className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full">
                          +{project.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-full transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt size={10} /> Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaGithub size={10} /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {relatedProjects.length === 0 && relatedExperiences.length === 0 && (
          <motion.div 
            className="text-center py-12 text-gray-500 dark:text-gray-400 font-light"
            variants={itemVariants}
          >
            No related items found for this skill.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 