"use client";

import { useState, useEffect } from 'react';
import { FaTerminal, FaGithub, FaExternalLinkAlt, FaCodeBranch, FaRegCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

type ProjectCategory = {
  title: string;
  period: string;
  projects: {
    name: string;
    description: string;
    github?: string;
    liveUrl?: string;
    tags?: string[];
  }[];
};

export default function Projects() {
  // State for component mounting
  const [mounted, setMounted] = useState(false);
  // State for active category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Set mounted state on component load
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };
  
  const projectVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };
  
  const projectCategories: ProjectCategory[] = [
    {
      title: 'Blockchain Initiatives',
      period: '2016 — 2021',
      projects: [
        {
          name: 'Multi-Chain Mining Pool Platform',
          description: 'Engineered a cross-chain mining pool system supporting EOS, ETH, and BTC with TypeScript backend and Vue.js frontend deployed on Kubernetes. Implemented blockchain-specific smart contracts for transparent profit sharing and automated payouts.',
          tags: ['TypeScript', 'Vue.js', 'Kubernetes', 'Smart Contracts']
        },
        {
          name: 'Decentralized Exchange (DEX)',
          description: 'Designed a hybrid Bancor-Orderbook model for cross-chain asset trading with TypeScript microservices orchestrated with Kubernetes. Implemented atomic swaps and cross-chain liquidity pools with automated market making algorithms.',
          tags: ['Blockchain', 'TypeScript', 'Microservices', 'Trading']
        },
        {
          name: 'Blockchain App Center',
          description: 'Built a platform enabling streamlined deployment of applications across multiple blockchains. Pioneered the industry&apos;s first real-time profit-sharing system for developers, eliminating the typical one-week delay in earnings distribution.',
          tags: ['Multi-chain', 'Profit-sharing', 'Platform']
        }
      ]
    },
    {
      title: 'AI Research & Trading Automation',
      period: '2023 — Present',
      projects: [
        {
          name: 'AI Automation',
          description: 'Engineered AI automation with Python, Node.js, OpenAI, and LangChain, training PPO/A2C models and AlphaGo algorithms, boosting efficiency by 40% in stock analysis tools.',
          tags: ['Python', 'Node.js', 'OpenAI', 'LangChain', 'Reinforcement Learning']
        },
        {
          name: 'Stock Trading Tool',
          description: 'Developed a Go-based stock trading tool with TradingView integration, using reinforcement learning to optimize trades, achieving 30% higher returns in simulations.',
          tags: ['Go', 'TradingView', 'Reinforcement Learning']
        },
        {
          name: 'LLM-powered Customer Service',
          description: 'Built store review and CS email reply systems with LLMs, reducing response time by 50%.',
          tags: ['LLMs', 'Customer Service', 'Automation']
        }
      ]
    },
    {
      title: 'Personal Projects',
      period: '2015 — 2024',
      projects: [
        {
          name: 'Anymud (2023-2024)',
          description: 'Built a Medium-like platform with TypeScript, Vue.js, and Nest.js, featuring an advanced HTML editable element editor (copy/paste images, backspace), slashing content creation time by 50%. Deployed on GCP with Docker, optimizing SEO and structured data for search engine visibility, driving 60% organic traffic growth.',
          github: 'https://github.com/shtse8/anymud',
          liveUrl: 'https://anymud.com',
          tags: ['TypeScript', 'Vue.js', 'Nest.js', 'GCP', 'Docker']
        },
        {
          name: 'NovelFeed (2015-2018)',
          description: 'Developed a publisher-focused article sharing platform with PHP and MySQL, including Facebook and mobile versions, growing engagement by 45%. Optimized webapp with semantic HTML, SEO, and structured data, achieving top search engine rankings for publisher content.',
          tags: ['PHP', 'MySQL', 'SEO', 'Social Media']
        },
        {
          name: 'SotiMediaOrganizer (2024)',
          description: 'Created a media deduplication tool with TypeScript, Python, and Bun, leveraging Simhash, VP Tree, and FFmpeg to process audio/video 60% faster.',
          github: 'https://github.com/shtse8/SotiMediaOrganizer',
          tags: ['TypeScript', 'Python', 'Bun', 'Media Processing']
        }
      ]
    },
    {
      title: 'Open Source Contributions',
      period: 'Various',
      projects: [
        {
          name: 'xserver',
          description: 'Dart-based web server with automated endpoint registration.',
          github: 'https://github.com/shtse8/xserver',
          tags: ['Dart', 'Web Server', 'Open Source']
        },
        {
          name: 'xdash',
          description: 'Modular TypeScript utility library with strong typing.',
          github: 'https://github.com/shtse8/xdash',
          tags: ['TypeScript', 'Utility Library', 'Strong Typing']
        },
        {
          name: 'dart_firebase_admin',
          description: 'Dart SDK for Firebase administration.',
          github: 'https://github.com/shtse8/dart_firebase_admin',
          tags: ['Dart', 'Firebase', 'SDK']
        },
        {
          name: 'Google Photos Delete Tool',
          description: 'Chrome extension with JavaScript for bulk photo management.',
          github: 'https://github.com/shtse8/google-photos-delete-tool',
          tags: ['Chrome Extension', 'JavaScript', 'Google Photos']
        },
        {
          name: 'SotiAds',
          description: 'Automated AdMob unit creation with TypeScript, optimizing revenue with Firebase Remote Config.',
          github: 'https://github.com/shtse8/sotiads',
          tags: ['TypeScript', 'AdMob', 'Firebase']
        }
      ]
    }
  ];

  const categoryButtons = projectCategories.map(cat => cat.title);
  
  const filteredProjects = activeCategory 
    ? [projectCategories.find(cat => cat.title === activeCategory)].filter(Boolean) as ProjectCategory[]
    : projectCategories;

  if (!mounted) return null;

  return (
    <section id="projects" className="py-20 relative overflow-hidden min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-400/10 dark:bg-primary-600/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/5 w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 flex-1 flex flex-col">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="relative inline-block">
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-600"></span>
              <span>Featured Projects</span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A showcase of my work across various domains and technologies
          </p>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div 
          className="mb-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null 
                ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Projects
          </motion.button>
          
          {categoryButtons.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveCategory(category === activeCategory ? null : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        <div className="flex items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center bg-black/5 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <FaTerminal className="text-primary-600 dark:text-primary-400 mr-2" />
            <h3 className="text-base md:text-lg font-mono text-primary-600 dark:text-primary-400 tracking-tight">$ find /projects -name &quot;*.json&quot; | xargs cat</h3>
          </motion.div>
        </div>
        
        <motion.div 
          className="space-y-12 flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map((category, index) => (
            <motion.div 
              key={index}
              variants={categoryVariants}
              className="glass-effect rounded-2xl p-8 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                    <span className="gradient-text">{category.title}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaRegCalendarAlt />
                    <span>{category.period}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <motion.span 
                    className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FaCodeBranch className="mr-1" />
                    {category.projects.length} Projects
                  </motion.span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.projects.map((project, idx) => (
                  <motion.div 
                    key={idx} 
                    className="glass-effect rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-white/20 dark:border-gray-700/30"
                    variants={projectVariants}
                    whileHover="hover"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600/10 to-indigo-600/10 dark:from-primary-900/20 dark:to-indigo-900/20 p-5 border-b border-white/10 dark:border-gray-700/30">
                      <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">{project.name}</h4>
                      
                      {/* Tags */}
                      {project.tags && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.slice(0, 3).map((tag, tagIdx) => (
                            <span key={tagIdx} className="inline-block px-2 py-1 text-xs font-medium bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-md">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-md">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-grow flex flex-col">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{project.description}</p>
                      
                      {(project.github || project.liveUrl) && (
                        <div className="flex mt-auto pt-4 space-x-4 border-t border-gray-100 dark:border-gray-800">
                          {project.github && (
                            <motion.a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaGithub /> View Code
                            </motion.a>
                          )}
                          {project.liveUrl && (
                            <motion.a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaExternalLinkAlt /> Live Demo
                            </motion.a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 