"use client";

import { useState, useEffect } from 'react';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum } from 'react-icons/si';
import { motion } from 'framer-motion';

type TechCard = {
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  category: 'frontend' | 'backend' | 'devops' | 'ai' | 'game' | 'blockchain' | 'management';
};

export default function TechStack() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const techStack: TechCard[] = [
    {
      name: 'React',
      icon: <FaReact className="text-4xl" />,
      description: 'Building interactive UIs with React and Next.js',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
      category: 'frontend'
    },
    {
      name: 'TypeScript',
      icon: <SiTypescript className="text-4xl" />,
      description: 'Type-safe development with advanced patterns',
      color: 'text-blue-700',
      bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
      category: 'frontend'
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs className="text-4xl" />,
      description: 'Scalable backend services with Express and Nest.js',
      color: 'text-green-600',
      bgColor: 'bg-green-600/90 dark:bg-green-600/80',
      category: 'backend'
    },
    {
      name: 'Python',
      icon: <FaPython className="text-4xl" />,
      description: 'Data processing, ML, and automation',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-600/90 dark:bg-yellow-500/80',
      category: 'backend'
    },
    {
      name: 'Java',
      icon: <FaJava className="text-4xl" />,
      description: 'Enterprise applications and Android development',
      color: 'text-red-600',
      bgColor: 'bg-red-600/90 dark:bg-red-600/80',
      category: 'backend'
    },
    {
      name: 'Docker',
      icon: <FaDocker className="text-4xl" />,
      description: 'Containerization for consistent deployments',
      color: 'text-blue-800',
      bgColor: 'bg-blue-800/90 dark:bg-blue-800/80',
      category: 'devops'
    },
    {
      name: 'Kubernetes',
      icon: <SiKubernetes className="text-4xl" />,
      description: 'Orchestration for microservices architecture',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
      category: 'devops'
    },
    {
      name: 'GCP',
      icon: <SiGooglecloud className="text-4xl" />,
      description: 'Cloud infrastructure and serverless solutions',
      color: 'text-red-500',
      bgColor: 'bg-red-500/90 dark:bg-red-500/80',
      category: 'devops'
    },
    {
      name: 'Firebase',
      icon: <SiFirebase className="text-4xl" />,
      description: 'Real-time databases and authentication',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/90 dark:bg-yellow-500/80',
      category: 'backend'
    },
    {
      name: 'Databases',
      icon: <FaDatabase className="text-4xl" />,
      description: 'PostgreSQL, MySQL, Redis, and NoSQL solutions',
      color: 'text-gray-700',
      bgColor: 'bg-gray-700/90 dark:bg-gray-700/80',
      category: 'backend'
    },
    {
      name: 'Unity3D',
      icon: <SiUnity className="text-4xl" />,
      description: '3D game development and simulations',
      color: 'text-gray-800',
      bgColor: 'bg-gray-800/90 dark:bg-gray-800/80',
      category: 'game'
    },
    {
      name: 'Game Dev',
      icon: <FaGamepad className="text-4xl" />,
      description: 'Multiplayer systems and game mechanics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
      category: 'game'
    },
    {
      name: 'AI & ML',
      icon: <FaRobot className="text-4xl" />,
      description: 'Reinforcement learning and LLM integration',
      color: 'text-green-700',
      bgColor: 'bg-green-700/90 dark:bg-green-700/80',
      category: 'ai'
    },
    {
      name: 'Blockchain',
      icon: <SiEthereum className="text-4xl" />,
      description: 'Smart contracts and decentralized applications',
      color: 'text-purple-800',
      bgColor: 'bg-purple-800/90 dark:bg-purple-800/80',
      category: 'blockchain'
    },
    {
      name: 'Team Leadership',
      icon: <FaUsers className="text-4xl" />,
      description: 'Building and managing high-performing development teams',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
      category: 'management'
    },
    {
      name: 'Business Growth',
      icon: <FaChartLine className="text-4xl" />,
      description: 'Marketing, product strategy, and business development',
      color: 'text-teal-600',
      bgColor: 'bg-teal-600/90 dark:bg-teal-600/80',
      category: 'management'
    }
  ];
  
  const filteredTech = activeFilter 
    ? techStack.filter(tech => tech.category === activeFilter)
    : techStack;
    
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
          {filteredTech.map((tech, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${tech.bgColor} text-white p-3 rounded-xl mr-4`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold">{tech.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{tech.description}</p>
                
                {/* Skill meter visualization */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Expertise</span>
                    <span className={`${tech.color} font-medium`}>Advanced</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${tech.bgColor} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${80 + Math.random() * 20}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 