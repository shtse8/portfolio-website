"use client";

import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaTimes, FaGooglePlay, FaApple } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  tags: string[];
  github?: string;
  liveUrl?: string;
  androidUrl?: string;
  iosUrl?: string;
  details: string[];
  category: string;
};

// Define project categories
const CATEGORIES = [
  "All",
  "Mobile Games",
  "Web Apps",
  "Blockchain",
  "Tools & Utilities",
  "AI & ML"
];

// Define projects data
const PROJECTS: Project[] = [
  {
    id: 'cubeage',
    title: 'Cubeage Limited',
    description: 'Mobile gaming company specializing in card and casino games with millions of downloads',
    image: '/projects/cubeage.jpg',
    images: [
      '/projects/cubeage.jpg',
    ],
    tags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#', 'MySQL', 'Percona'],
    liveUrl: 'https://cubeage.com',
    category: "Mobile Games",
    details: [
      'Founded and led Cubeage Limited, developing popular card and casino games',
      'Published 10+ games on Google Play and App Store with 100K+ installations',
      'Developed flagship titles including Hong Kong Mahjong Tycoon (4.2★, 3,280+ reviews), Fun Mahjong 16 Tiles (1M+ downloads), Fun Showhand, and Big2 Tycoon',
      'Implemented innovative game mechanics and monetization strategies resulting in 4.2+ average ratings',
      'Built and managed cross-functional teams for game development and operations',
      'Utilized MySQL and Percona for high-performance game data storage and analytics',
      'Related Projects: See [Hong Kong Mahjong Tycoon](#mahjong), [Fun Mahjong 16 Tiles](#fmj), [Fun Showhand](#fun-showhand), and [Big2 Tycoon](#big2-tycoon) in this portfolio'
    ]
  },
  {
    id: 'big2-tycoon',
    title: 'Big2 Tycoon',
    description: 'Multiplayer competitive card game with character progression and arena tournaments',
    image: '/projects/big2_tycoon.jpg',
    images: [
      '/projects/big2_tycoon.jpg',
    ],
    tags: ['Unity3D', 'TypeScript', 'Socket.IO', 'Protobuf', 'Multiplayer', 'ELO Rating', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.gameflask.btthk',
    iosUrl: 'https://apps.apple.com/us/app/%E9%8B%A4%E5%A4%A7d%E5%A4%A7%E4%BA%A8-%E6%9C%80%E5%88%BA%E6%BF%80%E7%9A%84%E7%AD%96%E7%95%A5%E6%A3%8B%E7%89%8C%E9%81%8A%E6%88%B2/id1295634408',
    category: "Mobile Games",
    details: [
      'Led development at Cubeage for this real-time multiplayer card game with Unity3D featuring unique characters and treasure systems',
      'Implemented a sophisticated ELO rating system for fair matchmaking, ensuring players find opponents of similar skill levels',
      'Built a distributed backend architecture using TypeScript, Socket.IO, and Protobuf on Ubuntu servers',
      'Created a PubSub system for efficient real-time communication and game state synchronization',
      'Designed engaging progression systems including character upgrades, treasure collection, and monthly arena tournaments',
      'Part of the Cubeage game portfolio - see [Cubeage Limited](#cubeage) for company overview'
    ]
  },
  {
    id: 'nakuz',
    title: 'Nakuz Website',
    description: 'Professional corporate website for business solutions',
    image: '/projects/nakuz.jpg',
    images: [
      '/projects/nakuz.jpg',
    ],
    tags: ['React', 'Next.js', 'Responsive Design', 'SEO'],
    liveUrl: 'https://nakuz.com',
    category: "Web Apps",
    details: [
      'Designed and developed the corporate website for Nakuz',
      'Built with modern technologies including React and Next.js',
      'Implemented responsive design for optimal viewing on all devices',
      'Integrated SEO best practices to improve visibility and organic traffic',
      'Created an intuitive user interface with streamlined navigation'
    ]
  },
  {
    id: 'mahjong',
    title: 'Hong Kong Mahjong Tycoon',
    description: '3D Mahjong game with multiple game modes and engaging gameplay',
    image: '/projects/hkmj.jpeg',
    images: [
      '/projects/hkmj.jpeg',
    ],
    tags: ['Unity', 'C#', 'Mobile Game', '3D Graphics', 'Multiplayer', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.crazycube.hkmahjongtycoon.app',
    iosUrl: 'https://apps.apple.com/us/app/%E9%A6%99%E6%B8%AF%E9%BA%BB%E5%B0%87%E5%A4%A7%E4%BA%A8-%E9%BA%BB%E9%9B%80%E4%BF%BE%E4%BD%A0%E7%8E%A9/id1478835027',
    category: "Mobile Games",
    details: [
      'Led development at Cubeage for this popular 3D Mahjong game with over 100K downloads',
      'Created authentic Hong Kong Mahjong gameplay with multiple game modes including blood flow mode, classic four-player mode, and two-player mode',
      'Implemented real-time multiplayer functionality with low latency and leaderboard system',
      'Designed engaging UI/UX with unique 3D Mahjong world, pet system, and character customization',
      'Achieved 4.2-star rating with 3,280+ reviews on Google Play and strong user retention',
      'Part of the Cubeage game portfolio - see [Cubeage Limited](#cubeage) for company overview'
    ]
  },
  {
    id: 'fun-showhand',
    title: 'Fun Showhand: Stud Poker',
    description: 'Engaging poker game with multiple game modes and social features',
    image: '/projects/fsh/1.jpg',
    images: [
      '/projects/fsh/1.jpg',
      '/projects/fsh/2.jpg',
    ],
    tags: ['Unity', 'C#', 'Mobile Game', 'IAP', 'Ad Mediation', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.cubeage.showhand.app',
    iosUrl: 'https://apps.apple.com/us/app/fun-showhand-stud-poker/id1238318956',
    category: "Mobile Games",
    details: [
      'Led development at Cubeage for this popular poker game available on both Android and iOS platforms',
      'Implemented in-app purchases and ad mediation with Appodeal, AdMob, and Facebook Ads',
      'Created highly realistic AI opponents using Monte Carlo simulation for authentic gameplay',
      'Designed offline gameplay with online social features including friend system and cloud save',
      'Featured in [Appszoom review videos](https://www.youtube.com/watch?v=Hl-YcZ9Hh8U) with positive feedback',
      'Part of the Cubeage game portfolio - see [Cubeage Limited](#cubeage) for company overview'
    ]
  },
  {
    id: 'fmj',
    title: 'Fun Mahjong 16 Tiles',
    description: 'Popular Taiwanese Mahjong game with over 1 million downloads featuring offline gameplay with online features',
    image: '/projects/fmj.jpeg',
    images: [
      '/projects/fmj.jpeg',
    ],
    tags: ['Unity', 'C#', 'Mobile Game', 'Corona SDK', 'Taiwanese Mahjong', 'AI', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.cubeage.fmj16.app',
    iosUrl: 'https://apps.apple.com/us/app/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5-%E6%89%8B%E6%A9%9F%E5%8F%B0%E5%BC%8F%E9%BA%BB%E5%B0%87%E6%A8%82%E5%9C%92/id1252568150',
    category: "Mobile Games",
    details: [
      'Led development at Cubeage for this popular Taiwanese Mahjong game with over 1 million downloads, featured on [Wikipedia](https://zh.wikipedia.org/wiki/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5)',
      'Created a unique offline gameplay experience with online social features including friend system and cloud save functionality',
      'Implemented highly realistic AI opponents using Monte Carlo simulation, providing an authentic gameplay experience',
      'Designed a simple, intuitive interface focused on gameplay rather than excessive visual effects',
      'Integrated Appodeal for monetization while maintaining a non-intrusive gaming experience',
      'Part of the Cubeage game portfolio - see [Cubeage Limited](#cubeage) for company overview'
    ]
  },
  {
    id: 'anymud',
    title: 'Anymud',
    description: 'Modern Medium-like publishing platform with advanced editor capabilities',
    image: '/projects/anymud.jpeg',
    images: [
      '/projects/anymud.jpeg',
    ],
    tags: ['TypeScript', 'Vue.js', 'Nest.js', 'GCP', 'Docker', 'SEO'],
    github: 'https://github.com/shtse8/anymud',
    liveUrl: 'https://anymud.com',
    category: "Web Apps",
    details: [
      'Built a Medium-like platform with TypeScript, Vue.js, and Nest.js for streamlined content creation',
      'Developed an advanced HTML editable element editor with intuitive copying/pasting of images',
      'Implemented smart backspace behavior and keyboard shortcuts to slash content creation time by 50%',
      'Deployed on GCP with Docker for horizontal scaling and high availability',
      'Optimized SEO with structured data and semantic markup, driving 60% organic traffic growth'
    ]
  },
  {
    id: 'novelfeed',
    title: 'NovelFeed',
    description: 'Publisher-focused article sharing platform with enhanced social integration',
    image: 'https://placehold.co/800x450/D0021B/FFFFFF?text=NovelFeed',
    images: [
      'https://placehold.co/800x450/D0021B/FFFFFF?text=NovelFeed',
    ],
    tags: ['PHP', 'MySQL', 'Percona', 'Facebook Integration', 'Responsive Design', 'SEO'],
    category: "Web Apps",
    details: [
      'Developed a publisher-focused article sharing platform with PHP and MySQL/Percona',
      'Created Facebook and mobile optimized versions to maximize user reach',
      'Increased publisher engagement by 45% through intuitive content management tools',
      'Optimized web application with semantic HTML, structured data, and SEO best practices',
      'Achieved top search engine rankings for publisher content through technical optimization'
    ]
  },
  {
    id: 'dex',
    title: 'Decentralized Exchange',
    description: 'A hybrid DEX platform combining Bancor-Orderbook models for cross-chain trading',
    image: 'https://placehold.co/800x450/50E3C2/FFFFFF?text=DEX+Platform',
    images: [
      'https://placehold.co/800x450/50E3C2/FFFFFF?text=DEX+Platform',
    ],
    tags: ['TypeScript', 'Blockchain', 'Kubernetes', 'Microservices', 'EOS', 'Ethereum'],
    category: "Blockchain",
    details: [
      'Designed a hybrid Bancor-Orderbook model for cross-chain asset trading between EOS, ETH, and BTC',
      'Built with TypeScript microservices orchestrated with Kubernetes for high availability',
      'Implemented atomic swaps, cross-chain liquidity pools, and automated market making algorithms',
      'Created smart contracts for transparent profit sharing and automated settlements',
      'Developed a responsive trading interface with real-time order book updates and transaction tracking'
    ]
  },
  {
    id: 'blockchain-app-center',
    title: 'Blockchain App Center',
    description: 'Multi-chain application deployment platform with real-time profit sharing',
    image: 'https://placehold.co/800x450/4A90E2/FFFFFF?text=Blockchain+App+Center',
    images: [
      'https://placehold.co/800x450/4A90E2/FFFFFF?text=Blockchain+App+Center',
    ],
    tags: ['Blockchain', 'Smart Contracts', 'Multi-Chain', 'EOS', 'Ethereum', 'Bitcoin'],
    category: "Blockchain",
    details: [
      'Built a platform enabling streamlined deployment of applications across multiple blockchains',
      'Pioneered the industry\'s first real-time profit-sharing system for developers',
      'Eliminated the typical one-week delay in earnings distribution through smart contract automation',
      'Created a unified interface for managing applications on different blockchain networks',
      'Implemented secure wallet integration and transaction handling across chains'
    ]
  },
  {
    id: 'mining-pool',
    title: 'Multi-Chain Mining Pool Platform',
    description: 'Cross-chain mining pool system supporting EOS, ETH, and BTC with transparent profit sharing',
    image: 'https://placehold.co/800x450/F5A623/FFFFFF?text=Mining+Pool+Platform',
    images: [
      'https://placehold.co/800x450/F5A623/FFFFFF?text=Mining+Pool+Platform',
    ],
    tags: ['TypeScript', 'Vue.js', 'Blockchain', 'Kubernetes', 'Smart Contracts', 'EOS'],
    category: "Blockchain",
    details: [
      'Engineered a cross-chain mining pool system supporting EOS, ETH, and BTC',
      'Developed with TypeScript backend and Vue.js frontend deployed on Kubernetes',
      'Implemented blockchain-specific smart contracts for transparent profit sharing',
      'Created automated payout systems with full transaction verification',
      'Built real-time dashboards for miners to track earnings and performance metrics'
    ]
  },
  {
    id: 'ai-trading',
    title: 'Quantitative Trading System',
    description: 'Advanced algorithmic trading platform leveraging multiple indicators and real-time execution',
    image: '/projects/quant_trading.jpg',
    images: [
      '/projects/quant_trading.jpg',
      '/projects/quant_trading_ror.jpg',
    ],
    tags: ['Go', 'Python', 'TradingView', 'TigerTrade', 'Firebase', 'PyTorch', 'Telegram'],
    github: 'https://github.com/shtse8/TradingBot',
    category: "AI & ML",
    details: [
      'Developed a serverless quantitative trading system using Golang, Firebase, and Cloud Run',
      'Integrated TradingView for market monitoring and TigerTrade for automated trade execution',
      'Built Python-based backtesting framework with pandas, PyTorch, and backtrader',
      'Implemented machine learning models with PyTorch, AdaBelief optimizer, and Huber Loss function',
      'Created a Telegram bot for real-time trade notifications, signals, and performance reporting'
    ]
  },
  {
    id: 'media-organizer',
    title: 'SotiMediaOrganizer',
    description: 'Advanced media deduplication and organization tool',
    image: '/projects/SotiMediaOrganizer.jpg',
    images: [
      '/projects/SotiMediaOrganizer.jpg',
    ],
    tags: ['TypeScript', 'Python', 'Bun', 'FFmpeg', 'Simhash'],
    github: 'https://github.com/shtse8/SotiMediaOrganizer',
    category: "Tools & Utilities",
    details: [
      'Created a media deduplication tool with TypeScript, Python, and Bun',
      'Leveraged Simhash, VP Tree, and FFmpeg for efficient processing',
      'Improved audio/video processing speed by 60%',
      'Implemented perceptual hashing for similar image detection',
      'Built a user-friendly interface for managing large media collections'
    ]
  },
  {
    id: 'google-photos-delete',
    title: 'Google Photos Delete Tool',
    description: 'Chrome extension for efficient bulk deletion of Google Photos',
    image: '/projects/google_photo_delete_tool.jpg',
    images: [
      '/projects/google_photo_delete_tool.jpg',
    ],
    tags: ['JavaScript', 'Chrome Extension', 'Automation', 'Google Photos API'],
    github: 'https://github.com/shtse8/google-photos-delete-tool',
    liveUrl: 'https://chromewebstore.google.com/detail/google-photos-delete-tool/jiahfbbfpacpolomdjlpdpiljllcdenb',
    category: "Tools & Utilities",
    details: [
      'Developed a Chrome extension with 2,000+ users to efficiently manage and clean up Google Photos libraries',
      'Implemented intelligent batch processing with custom selectors for automated photo deletion',
      'Created smart scrolling logic to handle large photo libraries with 10,000+ images',
      'Built in robust error handling and progress tracking for operation reliability',
      'Earned 4.7/5 star rating on Chrome Web Store and 73+ stars on GitHub'
    ]
  }
];

export default function FeaturedProjects() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  
  // Touch swipe related states
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Function to parse markdown links in text
  const parseMarkdownLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link component
      parts.push(
        <Link 
          key={match.index} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {match[1]}
        </Link>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  // Filter projects
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(PROJECTS);
    } else {
      setFilteredProjects(PROJECTS.filter(project => project.category === activeCategory));
    }
    setSelectedProjectIndex(0);
  }, [activeCategory]);
  
  const nextProject = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  };
  
  const prevProject = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };
  
  const selectedProject = filteredProjects[selectedProjectIndex];

  const handleImageError = (projectId: string) => {
    setImageError(prev => ({ ...prev, [projectId]: true }));
  };

  const getProjectColor = (index: number) => {
    const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];
    return colors[index % colors.length];
  };

  const openProjectModal = (index: number) => {
    setSelectedProjectIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };
  
  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Swipe must exceed this threshold to trigger page turn
    
    if (diff > threshold) {
      // Swipe left, next item
      nextProject();
    } else if (diff < -threshold) {
      // Swipe right, previous item
      prevProject();
    }
    
    // Reset touch state
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  return (
    <section id="projects" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Projects</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-8">
          Showcasing some of my most innovative work across different domains and technologies.
        </p>
        
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                category === activeCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Grid view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-10">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id}
              onClick={() => openProjectModal(idx)}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300"
            >
              <div className="relative h-48">
                {imageError[project.id] ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center" 
                    style={{ backgroundColor: getProjectColor(idx) }}
                  >
                    <span className="text-white text-4xl font-bold">{project.title.charAt(0)}</span>
                  </div>
                ) : (
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(project.id)}
                  />
                )}
                
                {/* Hover effect overlay for project cards */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">+{project.tags.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Project details modal */}
        {isModalOpen && selectedProject && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeProjectModal}
          >
            <div 
              ref={modalContentRef}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button 
                onClick={closeProjectModal}
                className="absolute right-4 top-4 z-20 bg-white dark:bg-gray-700 rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {filteredProjects.length > 1 && (
                <>
                  <button 
                    onClick={prevProject}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Previous project"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button 
                    onClick={nextProject}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Next project"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="order-2 md:order-1 animate-slideInRight">
                    <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedProject.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {selectedProject.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProject.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      {selectedProject.github && (
                        <Link 
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition-colors transform hover:scale-105 duration-300"
                        >
                          <FaGithub /> View Code
                        </Link>
                      )}
                      
                      {selectedProject.liveUrl && (
                        <Link 
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors transform hover:scale-105 duration-300"
                        >
                          <FaExternalLinkAlt /> Live Demo
                        </Link>
                      )}
                      
                      {selectedProject.androidUrl && (
                        <Link 
                          href={selectedProject.androidUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#01875f] hover:bg-[#017352] text-white px-4 py-2 rounded-lg transition-colors transform hover:scale-105 duration-300"
                        >
                          <FaGooglePlay /> Google Play
                        </Link>
                      )}
                      
                      {selectedProject.iosUrl && (
                        <Link 
                          href={selectedProject.iosUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-black hover:bg-[#1a1a1a] text-white px-4 py-2 rounded-lg transition-colors transform hover:scale-105 duration-300"
                        >
                          <FaApple /> App Store
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-1 md:order-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-slideInLeft">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      {imageError[selectedProject.id] ? (
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center" 
                          style={{ backgroundColor: getProjectColor(selectedProjectIndex) }}
                        >
                          <div className="text-white text-6xl font-bold mb-4">
                            {selectedProject.title.charAt(0)}
                          </div>
                          <div className="text-white text-xl font-medium">
                            {selectedProject.title}
                          </div>
                          <div className="flex flex-wrap justify-center mt-4 gap-2 max-w-xs">
                            {selectedProject.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="bg-white/20 text-white px-2 py-1 rounded-md text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <Image 
                            src={selectedProject.image}
                            alt={selectedProject.title}
                            fill
                            className="object-cover relative z-10"
                            onError={() => handleImageError(selectedProject.id)}
                          />
                        </>
                      )}
                    </div>
                    
                    {/* Project multiple image preview - display if there are multiple images */}
                    {selectedProject.images && selectedProject.images.length > 1 && (
                      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                        {selectedProject.images.map((img, idx) => {
                          const isActive = selectedProject.image === img;
                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                const updatedProject = {...selectedProject, image: img};
                                const newFilteredProjects = [...filteredProjects];
                                newFilteredProjects[selectedProjectIndex] = updatedProject;
                                setFilteredProjects(newFilteredProjects);
                              }}
                              className={`cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-300 
                                ${isActive ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                            >
                              <div className="relative w-full h-full">
                                <Image 
                                  src={img}
                                  alt={`${selectedProject.title} - image ${idx+1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Project navigation overview */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 text-center">Browse Projects</h4>
                  <div className="flex overflow-x-auto pb-4 gap-4 justify-center">
                    {filteredProjects.map((project, idx) => (
                      <div 
                        key={project.id}
                        onClick={() => setSelectedProjectIndex(idx)}
                        className={`flex-shrink-0 transition-all duration-300 cursor-pointer flex flex-col items-center ${
                          idx === selectedProjectIndex 
                            ? 'transform scale-110 z-10' 
                            : 'opacity-60 hover:opacity-100 scale-100'
                        }`}
                      >
                        <div className={`relative ${
                          idx === selectedProjectIndex 
                            ? 'w-20 h-20 md:w-24 md:h-24 shadow-lg' 
                            : 'w-16 h-16 md:w-20 md:h-20'
                        } rounded-lg overflow-hidden`}>
                          {/* Selected project decoration effect */}
                          {idx === selectedProjectIndex && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-80 blur-sm -z-10"></div>
                          )}
                          
                          {imageError[project.id] ? (
                            <div 
                              className="absolute inset-0 flex items-center justify-center" 
                              style={{ backgroundColor: getProjectColor(idx) }}
                            >
                              <span className="text-white text-lg font-bold">{project.title.charAt(0)}</span>
                            </div>
                          ) : (
                            <Image 
                              src={project.image}
                              alt={project.title}
                              fill
                              className={`object-cover ${idx === selectedProjectIndex ? 'scale-105' : ''}`}
                              onError={() => handleImageError(project.id)}
                            />
                          )}
                        </div>
                        <div className={`mt-2 text-center max-w-24 ${
                          idx === selectedProjectIndex ? 'block' : 'hidden md:block'
                        }`}>
                          {idx === selectedProjectIndex ? (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs md:text-sm font-medium rounded-full whitespace-nowrap">
                              {project.title}
                            </span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-xs truncate block">
                              {project.title}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Add CSS animation classes
// Add the following to globals.css

// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }

// @keyframes scaleIn {
//   from { transform: scale(0.95); opacity: 0; }
//   to { transform: scale(1); opacity: 1; }
// }

// @keyframes slideInLeft {
//   from { transform: translateX(-30px); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }

// @keyframes slideInRight {
//   from { transform: translateX(30px); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }

// @keyframes pulseLight {
//   0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
//   70% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
//   100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
// }

// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }

// .animate-scaleIn {
//   animation: scaleIn 0.3s ease-out forwards;
// }

// .animate-slideInLeft {
//   animation: slideInLeft 0.5s ease-out forwards;
// }

// .animate-slideInRight {
//   animation: slideInRight 0.5s ease-out forwards;
// }

// .animate-pulseLight {
//   animation: pulseLight 2s infinite;
// } 