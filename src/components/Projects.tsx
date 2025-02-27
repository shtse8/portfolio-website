"use client";

import { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
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
    <section id="projects" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-gray-900 dark:text-white">
            Projects
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A showcase of my work across various domains and technologies
          </p>
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mx-auto mt-8"></div>
        </div>
        
        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-sm font-normal transition-colors ${
              activeCategory === null 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            All Projects
          </button>
          
          {categoryButtons.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category === activeCategory ? null : category)}
              className={`px-4 py-2 text-sm font-normal transition-colors ${
                activeCategory === category 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="space-y-16">
          {filteredProjects.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {category.period}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.projects.map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        {project.name}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {project.description}
                      </p>
                      
                      {/* Tags */}
                      {project.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag, tagIdx) => (
                            <span 
                              key={tagIdx} 
                              className="inline-block px-2 py-1 text-xs font-light text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs font-light text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Links */}
                      {(project.github || project.liveUrl) && (
                        <div className="flex items-center space-x-4 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                          {project.github && (
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                            >
                              <FaGithub className="mr-1" /> Source
                            </a>
                          )}
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                            >
                              <FaExternalLinkAlt className="mr-1" /> Live Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 