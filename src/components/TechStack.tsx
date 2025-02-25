"use client";

import { useState } from 'react';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum } from 'react-icons/si';

type TechCard = {
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  category: 'frontend' | 'backend' | 'devops' | 'ai' | 'game' | 'blockchain' | 'management';
};

export default function TechStack() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const techStack: TechCard[] = [
    {
      name: 'React',
      icon: <FaReact className="text-4xl" />,
      description: 'Building interactive UIs with React and Next.js',
      color: 'bg-blue-500',
      category: 'frontend'
    },
    {
      name: 'TypeScript',
      icon: <SiTypescript className="text-4xl" />,
      description: 'Type-safe development with advanced patterns',
      color: 'bg-blue-700',
      category: 'frontend'
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs className="text-4xl" />,
      description: 'Scalable backend services with Express and Nest.js',
      color: 'bg-green-600',
      category: 'backend'
    },
    {
      name: 'Python',
      icon: <FaPython className="text-4xl" />,
      description: 'Data processing, ML, and automation',
      color: 'bg-yellow-600',
      category: 'backend'
    },
    {
      name: 'Java',
      icon: <FaJava className="text-4xl" />,
      description: 'Enterprise applications and Android development',
      color: 'bg-red-600',
      category: 'backend'
    },
    {
      name: 'Docker',
      icon: <FaDocker className="text-4xl" />,
      description: 'Containerization for consistent deployments',
      color: 'bg-blue-800',
      category: 'devops'
    },
    {
      name: 'Kubernetes',
      icon: <SiKubernetes className="text-4xl" />,
      description: 'Orchestration for microservices architecture',
      color: 'bg-blue-600',
      category: 'devops'
    },
    {
      name: 'GCP',
      icon: <SiGooglecloud className="text-4xl" />,
      description: 'Cloud infrastructure and serverless solutions',
      color: 'bg-red-500',
      category: 'devops'
    },
    {
      name: 'Firebase',
      icon: <SiFirebase className="text-4xl" />,
      description: 'Real-time databases and authentication',
      color: 'bg-yellow-500',
      category: 'backend'
    },
    {
      name: 'Databases',
      icon: <FaDatabase className="text-4xl" />,
      description: 'PostgreSQL, MySQL, Redis, and NoSQL solutions',
      color: 'bg-gray-700',
      category: 'backend'
    },
    {
      name: 'Unity3D',
      icon: <SiUnity className="text-4xl" />,
      description: '3D game development and simulations',
      color: 'bg-gray-800',
      category: 'game'
    },
    {
      name: 'Game Dev',
      icon: <FaGamepad className="text-4xl" />,
      description: 'Multiplayer systems and game mechanics',
      color: 'bg-purple-600',
      category: 'game'
    },
    {
      name: 'AI & ML',
      icon: <FaRobot className="text-4xl" />,
      description: 'Reinforcement learning and LLM integration',
      color: 'bg-green-700',
      category: 'ai'
    },
    {
      name: 'Blockchain',
      icon: <SiEthereum className="text-4xl" />,
      description: 'Smart contracts and decentralized applications',
      color: 'bg-purple-800',
      category: 'blockchain'
    },
    {
      name: 'Team Leadership',
      icon: <FaUsers className="text-4xl" />,
      description: 'Building and managing high-performing development teams',
      color: 'bg-indigo-600',
      category: 'management'
    },
    {
      name: 'Business Growth',
      icon: <FaChartLine className="text-4xl" />,
      description: 'Marketing, product strategy, and business development',
      color: 'bg-teal-600',
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
  
  return (
    <section id="tech" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Technical Expertise</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-12">
          As a Full Stack Developer and Founder with over 20 years of experience, I've mastered a diverse tech stack and management skills that enable me to build complex, scalable solutions and lead successful teams across multiple domains.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button 
            onClick={() => setActiveFilter(null)} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === null 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTech.map((tech, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className={`${tech.color} h-2`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${tech.color} p-3 rounded-lg text-white mr-4`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold">{tech.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 