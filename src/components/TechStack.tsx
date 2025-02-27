"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine, FaProjectDiagram, FaTimes, FaGithub, FaExternalLinkAlt, FaBriefcase } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';

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
      staggerChildren: 0.05
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
      stiffness: 80,
      damping: 12
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
      onClick={() => onClick(skill.id)}
      className="group cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 
        bg-white dark:bg-gray-800/90 
        border-[1.5px] border-gray-100 dark:border-gray-700 hover:border-primary-300/50 dark:hover:border-primary-700/30
        shadow-sm hover:shadow-md h-full flex flex-col"
      whileHover={{ 
        y: -6, 
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Clean accent stripe at top */}
      <div className={`h-1 w-full ${skill.bgColor} opacity-80 dark:opacity-70`}></div>
      
      {/* Card content container */}
      <div className="relative flex-1 flex flex-col z-10 p-6">
        {/* Icon and name with clean styling */}
        <div className="flex items-center mb-5 z-10">
          <div className={`flex items-center justify-center w-14 h-14 rounded-lg 
            bg-gray-50 dark:bg-gray-800
            border border-gray-100 dark:border-gray-700
            mr-4 ${skill.color} group-hover:scale-105 transition-all duration-300`}>
            {getSkillIcon(skill.id)}
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{skill.name}</h3>
            {/* Clean relationship count badge */}
            {relationshipCount > 0 && (
              <div className="mt-1 inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                {skill.category === 'management' ? (
                  <FaBriefcase className="mr-1.5" size={12} />
                ) : (
                  <FaProjectDiagram className="mr-1.5" size={12} />
                )}
                <span>
                  {skill.category === 'management' ? (
                    `${relatedExperiences.length} experience${relatedExperiences.length !== 1 ? 's' : ''}`
                  ) : (
                    `${relationshipCount} project${relationshipCount !== 1 ? 's' : ''}`
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Description with clean typography */}
        <div className="mb-6 flex-grow">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {skill.description}
          </p>
        </div>
        
        {/* Minimal expertise meter */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-medium">EXPERTISE</span>
            <span className="text-gray-700 dark:text-gray-200 font-medium">Advanced</span>
          </div>
          <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${skill.bgColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${80 + Math.random() * 20}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Minimal details indicator */}
        <div className="mt-5 flex justify-end items-center text-xs font-medium text-primary-600 dark:text-primary-400 opacity-70 group-hover:opacity-100 transition-all duration-300">
          <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">View details</span>
          <svg className="w-3.5 h-3.5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default function TechStack() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

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
  
  const filteredSkills = activeFilter 
    ? SKILLS.filter(skill => skill.category === activeFilter)
    : SKILLS;
    
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleShowProjects = (skillId: string) => {
    setSelectedSkill(skillId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSkill(null);
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
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredSkills.map((skill, index) => (
            <SkillCard 
              key={index}
              skill={skill}
              onClick={handleShowProjects}
              getSkillIcon={getSkillIcon}
            />
          ))}
        </motion.div>
      </div>

      {/* Projects and Experiences Modal */}
      <AnimatePresence>
        {showModal && selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedSkill && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className={`${SKILLS.find(s => s.id === selectedSkill)?.bgColor} text-white p-3 rounded-xl mr-4`}>
                        {getSkillIcon(selectedSkill)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{SKILLS.find(s => s.id === selectedSkill)?.name}</h3>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-full transition-colors"
                    >
                      <FaTimes className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Related Experiences Section (shown for management skills) */}
                  {getRelatedExperiences(selectedSkill).length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold mb-4 flex items-center">
                        <FaBriefcase className="mr-2 text-indigo-600 dark:text-indigo-400" />
                        Related Experiences
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {getRelatedExperiences(selectedSkill).map((experience) => (
                          <div
                            key={experience.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-600/30 p-4"
                          >
                            <div className="flex items-start">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-4 border border-gray-200 dark:border-gray-700">
                                <Image
                                  src={experience.logo}
                                  alt={experience.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold text-lg mb-1">{experience.title}</h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{experience.company}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{experience.period}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                  {experience.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Projects Section */}
                  {getRelatedProjects(selectedSkill).length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold mb-4 flex items-center">
                        <FaProjectDiagram className="mr-2 text-primary-600 dark:text-primary-400" />
                        Related Projects
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getRelatedProjects(selectedSkill).map((project) => (
                          <div
                            key={project.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-600/30"
                          >
                            <div className="relative h-40">
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h5 className="font-bold text-lg mb-2">{project.title}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {project.tags.length > 3 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                    +{project.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs flex items-center gap-1 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                                  >
                                    <FaExternalLinkAlt size={10} /> Live Demo
                                  </a>
                                )}
                                {project.github && (
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs flex items-center gap-1 px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                                  >
                                    <FaGithub size={10} /> GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {getRelatedProjects(selectedSkill).length === 0 && getRelatedExperiences(selectedSkill).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No related items found for this skill.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 