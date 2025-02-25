"use client";

import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaTimes, FaGooglePlay, FaApple, FaBuilding } from 'react-icons/fa';
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
  company?: string | null;
};

// 新增Experience類型來表示專業經驗
type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  image: string;
  logo: string;
  tags: string[];
  liveUrl?: string;
  details: string[];
  relatedProjects?: string[]; // 關聯項目ID列表
};

// Define project categories
const CATEGORIES = [
  "All",
  "Mobile Games",
  "Web Apps",
  "Blockchain",
  "Tools & Utilities",
  "AI & ML",
  "Professional Experience" // 添加專業經驗類別
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
    company: "cubeage",
    details: [
      'Founded and led Cubeage Limited, developing popular card and casino games',
      'Published 10+ games on Google Play and App Store with 100K+ installations',
      'Developed flagship titles including Hong Kong Mahjong Tycoon (4.2★, 3,280+ reviews), Fun Mahjong 16 Tiles (1M+ downloads), Fun Showhand, and Big2 Tycoon',
      'Implemented innovative game mechanics and monetization strategies resulting in 4.2+ average ratings',
      'Built and managed cross-functional teams for game development and operations',
      'Utilized MySQL and Percona for high-performance game data storage and analytics'
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
    company: "cubeage",
    details: [
      'Led development at Cubeage for this real-time multiplayer card game with Unity3D featuring unique characters and treasure systems',
      'Implemented a sophisticated ELO rating system for fair matchmaking, ensuring players find opponents of similar skill levels',
      'Built a distributed backend architecture using TypeScript, Socket.IO, and Protobuf on Ubuntu servers',
      'Created a PubSub system for efficient real-time communication and game state synchronization',
      'Designed engaging progression systems including character upgrades, treasure collection, and monthly arena tournaments'
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
    tags: ['React', 'Next.js', 'Responsive Design', 'SEO', 'Nakuz'],
    liveUrl: 'https://nakuz.com',
    category: "Web Apps",
    company: "nakuz",
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
    company: "cubeage",
    details: [
      'Led development at Cubeage for this popular 3D Mahjong game with over 100K downloads',
      'Created authentic Hong Kong Mahjong gameplay with multiple game modes including blood flow mode, classic four-player mode, and two-player mode',
      'Implemented real-time multiplayer functionality with low latency and leaderboard system',
      'Designed engaging UI/UX with unique 3D Mahjong world, pet system, and character customization',
      'Achieved 4.2-star rating with 3,280+ reviews on Google Play and strong user retention'
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
    company: "cubeage",
    details: [
      'Led development at Cubeage for this popular poker game available on both Android and iOS platforms',
      'Implemented in-app purchases and ad mediation with Appodeal, AdMob, and Facebook Ads',
      'Created highly realistic AI opponents using Monte Carlo simulation for authentic gameplay',
      'Designed offline gameplay with online social features including friend system and cloud save',
      'Featured in [Appszoom review videos](https://www.youtube.com/watch?v=Hl-YcZ9Hh8U) with positive feedback'
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
    company: "cubeage",
    details: [
      'Led development at Cubeage for this popular Taiwanese Mahjong game with over 1 million downloads, featured on [Wikipedia](https://zh.wikipedia.org/wiki/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5)',
      'Created a unique offline gameplay experience with online social features including friend system and cloud save functionality',
      'Implemented highly realistic AI opponents using Monte Carlo simulation, providing an authentic gameplay experience',
      'Designed a simple, intuitive interface focused on gameplay rather than excessive visual effects',
      'Integrated Appodeal for monetization while maintaining a non-intrusive gaming experience'
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
    company: null,
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
    company: null,
    details: [
      'Developed a publisher-focused article sharing platform with PHP and MySQL/Percona',
      'Created Facebook and mobile optimized versions to maximize user reach',
      'Increased publisher engagement by 45% through intuitive content management tools',
      'Optimized web application with semantic HTML, structured data, and SEO best practices',
      'Achieved top search engine rankings for publisher content through technical optimization'
    ]
  },
  {
    id: 'funimax',
    title: 'Funimax Gaming Platform',
    description: 'Popular gaming platform with physical game cards and digital distribution in Hong Kong',
    image: '/projects/funimax.jpg',
    images: [
      '/projects/funimax.jpg',
    ],
    tags: ['PHP', 'JavaScript', 'MySQL', 'Ubuntu', 'Game Distribution', 'Payment Integration'],
    category: "Web Apps",
    company: "minimax",
    details: [
      'Led development of Funimax, a well-known gaming platform with significant presence in Hong Kong',
      'Built with pure PHP and JavaScript, developing a custom template system for rapid game website deployment',
      'Created a platform that simultaneously operated 30+ games at its peak',
      'Implemented physical game card system with secure validation and redemption',
      'Designed and developed the platform\'s agency and distribution system',
      'Built robust payment and member management systems',
      'Deployed on Ubuntu servers with MySQL databases for high reliability and performance'
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
    company: null,
    details: [
      'Designed and developed a hybrid Bancor-Orderbook model for cross-chain asset trading',
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
    company: null,
    details: [
      'Built a platform enabling streamlined deployment of applications across multiple blockchains',
      'Pioneered real-time profit-sharing system for developers through smart contract automation',
      'Eliminated the typical one-week delay in earnings distribution through automated processes',
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
    company: null,
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
    company: null,
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
    company: null,
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
    company: null,
    details: [
      'Developed a Chrome extension with 2,000+ users to efficiently manage and clean up Google Photos libraries',
      'Implemented intelligent batch processing with custom selectors for automated photo deletion',
      'Created smart scrolling logic to handle large photo libraries with 10,000+ images',
      'Built in robust error handling and progress tracking for operation reliability',
      'Earned 4.7/5 star rating on Chrome Web Store and 73+ stars on GitHub'
    ]
  }
];

// 定義公司數據
const COMPANIES: {[key: string]: {id: string; name: string; logo: string; color: string; url: string}} = {
  'cubeage': {
    id: 'cubeage',
    name: 'Cubeage Limited',
    logo: '/companys/cubeage.jpeg',
    color: '#4A90E2',
    url: 'https://cubeage.com'
  },
  'nakuz': {
    id: 'nakuz',
    name: 'Nakuz',
    logo: '/companys/nakuz.jpeg',
    color: '#F5A623',
    url: 'https://nakuz.com'
  },
  'minimax': {
    id: 'minimax',
    name: 'MiniMax',
    logo: '/companys/minimax.jpeg',
    color: '#D0021B',
    url: '#'
  }
  // 可以添加更多公司
};

// 定義專業經驗數據
const EXPERIENCES: Experience[] = [
  {
    id: 'cubeage',
    title: 'Founder & Lead Developer',
    company: 'Cubeage Limited',
    period: '2014 - 2019',
    description: 'Founded and led a mobile gaming company specializing in card and casino games with millions of downloads',
    image: '/projects/cubeage.jpg',
    logo: '/companys/cubeage.jpeg',
    tags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#', 'MySQL', 'Percona'],
    liveUrl: 'https://cubeage.com',
    details: [
      'Founded and led Cubeage Limited, developing popular card and casino games',
      'Published 10+ games on Google Play and App Store with 100K+ installations',
      'Developed flagship titles including Hong Kong Mahjong Tycoon (4.2★, 3,280+ reviews), Fun Mahjong 16 Tiles (1M+ downloads), Fun Showhand, and Big2 Tycoon',
      'Implemented innovative game mechanics and monetization strategies resulting in 4.2+ average ratings',
      'Built and managed cross-functional teams for game development and operations',
      'Utilized MySQL and Percona for high-performance game data storage and analytics',
      'Related Projects: See [Hong Kong Mahjong Tycoon](#mahjong), [Fun Mahjong 16 Tiles](#fmj), [Fun Showhand](#fun-showhand), and [Big2 Tycoon](#big2-tycoon) in this portfolio'
    ],
    relatedProjects: ['mahjong', 'fun-showhand', 'fmj', 'big2-tycoon']
  },
  {
    id: 'minimax',
    title: 'Founder & Lead Developer',
    company: 'MiniMax Technology',
    period: '2010 - 2014',
    description: 'Led development at a gaming platform company focusing on game operations and agency distribution in Hong Kong',
    image: '/companys/minimax.jpeg',
    logo: '/companys/minimax.jpeg',
    tags: ['Gaming Platform', 'Game Distribution', 'Physical Game Cards', 'Game Operations'],
    details: [
      'Led development at MiniMax Technology, a gaming platform company in Hong Kong',
      'Managed Funimax platform, a well-known game distribution service with physical game cards',
      'Oversaw game operations, distribution, and agency relationships',
      'Implemented payment systems integration for physical and digital purchases',
      'Designed systems to manage game inventory, distribution, and analytics',
      'Built user management and loyalty systems to improve customer retention',
      'Related Projects: See [Funimax Gaming Platform](#funimax) in this portfolio'
    ],
    relatedProjects: ['funimax']
  },
  {
    id: 'nakuz',
    title: 'Frontend Developer',
    company: 'Nakuz',
    period: '2020 - 2021',
    description: 'Designed and developed professional corporate website and business solutions',
    image: '/companys/nakuz.jpeg',
    logo: '/companys/nakuz.jpeg',
    tags: ['React', 'Next.js', 'Responsive Design', 'SEO'],
    liveUrl: 'https://nakuz.com',
    details: [
      'Designed and developed the corporate website for Nakuz',
      'Built with modern technologies including React and Next.js',
      'Implemented responsive design for optimal viewing on all devices',
      'Integrated SEO best practices to improve visibility and organic traffic',
      'Created an intuitive user interface with streamlined navigation'
    ],
    relatedProjects: ['nakuz-website']
  }
];

export default function FeaturedProjects() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExperienceModal, setIsExperienceModal] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  
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
      
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Check if this is an internal anchor link (starts with #)
      if (linkUrl.startsWith('#')) {
        const projectId = linkUrl.substring(1); // Remove the # character
        // Check if this is a company ID
        if (Object.keys(COMPANIES).includes(projectId)) {
          // Add a button that looks like a link but opens the company modal
          parts.push(
            <button 
              key={match.index} 
              onClick={(e) => {
                e.stopPropagation();
                openCompanyModal(projectId);
              }}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              {linkText}
            </button>
          );
        } else {
          // Otherwise, treat as a project ID
          parts.push(
            <button 
              key={match.index} 
              onClick={(e) => {
                e.stopPropagation();
                // Find the project index
                const projectIndex = filteredProjects.findIndex(p => p.id === projectId);
                if (projectIndex !== -1) {
                  setSelectedProjectIndex(projectIndex);
                  if (!isModalOpen) {
                    setIsModalOpen(true);
                    setIsExperienceModal(false);
                    document.body.style.overflow = 'hidden';
                  }
                }
              }}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              {linkText}
            </button>
          );
        }
      } else {
        // Regular external link
        parts.push(
          <Link 
            key={match.index} 
            href={linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {linkText}
          </Link>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  // Filter projects and experiences
  useEffect(() => {
    if (activeCategory === "Professional Experience") {
      setFilteredProjects([]);
      setFilteredExperiences(EXPERIENCES);
      setIsExperienceModal(true);
    } else {
      setIsExperienceModal(false);
      if (activeCategory === "All") {
        setFilteredProjects(PROJECTS);
      } else {
        setFilteredProjects(PROJECTS.filter(project => project.category === activeCategory));
      }
      setFilteredExperiences([]);
    }
    setSelectedProjectIndex(0);
    setSelectedExperienceIndex(0);
  }, [activeCategory]);
  
  const nextProject = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  };
  
  const prevProject = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };
  
  const selectedProject = filteredProjects[selectedProjectIndex];
  const selectedExperience = filteredExperiences[selectedExperienceIndex];

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
    setIsExperienceModal(false);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const openExperienceModal = (index: number) => {
    setSelectedExperienceIndex(index);
    setIsModalOpen(true);
    setIsExperienceModal(true);
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
  
  // 打開公司詳情模態窗口
  const openCompanyModal = (companyId: string) => {
    const companyExperienceIndex = EXPERIENCES.findIndex(exp => exp.id === companyId);
    if (companyExperienceIndex !== -1) {
      setSelectedExperienceIndex(companyExperienceIndex);
      setIsModalOpen(true);
      setIsExperienceModal(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">Featured Projects & Experience</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Showcasing my professional experience and innovative projects across different domains and technologies.
          </p>
        </div>
        
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                category === activeCategory
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Grid view for projects */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project, idx) => {
              const relatedCompany = project.company ? COMPANIES[project.company] : null;
              return (
                <div 
                  key={project.id}
                  onClick={() => openProjectModal(idx)}
                  className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-52 overflow-hidden">
                    {imageError[project.id] ? (
                      <div 
                        className="absolute inset-0 flex items-center justify-center" 
                        style={{ backgroundColor: getProjectColor(idx) }}
                      >
                        <span className="text-white text-5xl font-bold">{project.title.charAt(0)}</span>
                      </div>
                    ) : (
                      <>
                        <Image 
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={() => handleImageError(project.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                      {project.category}
                    </div>
                    
                    {/* 公司關聯標識 */}
                    {relatedCompany && (
                      <div 
                        className="absolute top-3 left-3 flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full py-1 px-2 shadow-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCompanyModal(relatedCompany.id);
                        }}
                      >
                        <div className="relative w-5 h-5 rounded-full overflow-hidden">
                          <Image
                            src={relatedCompany.logo}
                            alt={relatedCompany.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="ml-1 text-xs font-medium text-gray-800 dark:text-gray-200">{relatedCompany.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">+{project.tags.length - 3} more</span>
                      )}
                    </div>
                    
                    {/* View details button */}
                    <div className="flex justify-end mt-2">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        View Details <FaChevronRight className="ml-1 text-xs" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grid view for experiences */}
        {filteredExperiences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredExperiences.map((experience, idx) => (
              <div 
                key={experience.id}
                onClick={() => openExperienceModal(idx)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                    <Image 
                      src={experience.logo}
                      alt={experience.company}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(experience.id)}
                    />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{experience.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{experience.company}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">{experience.period}</p>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {experience.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {experience.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {experience.tags.length > 3 && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">+{experience.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  {/* View details button */}
                  <div className="flex justify-end mt-2">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      View Details <FaChevronRight className="ml-1 text-xs" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Project details modal */}
        {isModalOpen && !isExperienceModal && selectedProject && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
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
                className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {filteredProjects.length > 1 && (
                <>
                  <button 
                    onClick={prevProject}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Previous project"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button 
                    onClick={nextProject}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Next project"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="order-2 md:order-1 animate-slideInRight">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                        {selectedProject.category}
                      </span>
                      
                      {/* 相關公司標籤 */}
                      {selectedProject.company && (
                        <button 
                          className="flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-medium rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedProject.company && typeof selectedProject.company === 'string') {
                              openCompanyModal(selectedProject.company);
                            }
                          }}
                        >
                          <FaBuilding className="text-xs" /> 
                          {selectedProject.company && COMPANIES[selectedProject.company]?.name}
                        </button>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{selectedProject.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{selectedProject.description}</p>
                    
                    <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Key Features
                      </h4>
                      <ul className="space-y-3">
                        {selectedProject.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
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
                          className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaGithub /> View Code
                        </Link>
                      )}
                      
                      {selectedProject.liveUrl && (
                        <Link 
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaExternalLinkAlt /> Live Demo
                        </Link>
                      )}
                      
                      {selectedProject.androidUrl && (
                        <Link 
                          href={selectedProject.androidUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#01875f] hover:bg-[#017352] text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaGooglePlay /> Google Play
                        </Link>
                      )}
                      
                      {selectedProject.iosUrl && (
                        <Link 
                          href={selectedProject.iosUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-black hover:bg-[#1a1a1a] text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaApple /> App Store
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-1 md:order-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg animate-slideInLeft">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
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
                      
                      {/* 公司標記 - 在圖片右下角 */}
                      {selectedProject.company && (
                        <div 
                          className="absolute bottom-2 right-2 z-20 flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full py-1 px-2 shadow-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedProject.company && typeof selectedProject.company === 'string') {
                              openCompanyModal(selectedProject.company);
                            }
                          }}
                        >
                          <div className="relative w-5 h-5 rounded-full overflow-hidden">
                            <Image
                              src={selectedProject.company && COMPANIES[selectedProject.company]?.logo || ''}
                              alt={selectedProject.company && COMPANIES[selectedProject.company]?.name || ''}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="ml-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                            {selectedProject.company && COMPANIES[selectedProject.company]?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
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
                            ${isActive ? 'ring-2 ring-blue-500 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'}`}
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
          </div>
        )}
        
        {/* Experience details modal */}
        {isModalOpen && isExperienceModal && selectedExperience && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
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
                className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {filteredExperiences.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedExperienceIndex((prev) => (prev - 1 + filteredExperiences.length) % filteredExperiences.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Previous experience"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button 
                    onClick={() => setSelectedExperienceIndex((prev) => (prev + 1) % filteredExperiences.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Next experience"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-8">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                    <Image 
                      src={selectedExperience.logo}
                      alt={selectedExperience.company}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(selectedExperience.id)}
                    />
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-medium rounded-full">
                        Professional Experience
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{selectedExperience.title}</h3>
                    <div className="flex items-center">
                      <p className="text-gray-600 dark:text-gray-400 text-lg">{selectedExperience.company}</p>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-gray-500 dark:text-gray-500">{selectedExperience.period}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="order-2 md:order-1 animate-slideInRight">
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{selectedExperience.description}</p>
                    
                    <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Responsibilities & Achievements
                      </h4>
                      <ul className="space-y-3">
                        {selectedExperience.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* 添加相關項目部分 */}
                    {selectedExperience.relatedProjects && selectedExperience.relatedProjects.length > 0 && (
                      <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                          <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                          </span>
                          Related Projects
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedExperience.relatedProjects.map((projectId) => {
                            const project = PROJECTS.find(p => p.id === projectId);
                            if (!project) return null;
                            
                            return (
                              <div 
                                key={project.id}
                                onClick={() => {
                                  const projectIndex = filteredProjects.findIndex(p => p.id === project.id);
                                  if (projectIndex !== -1) {
                                    setSelectedProjectIndex(projectIndex);
                                    setIsExperienceModal(false);
                                    // Keep modal open, just switch content
                                  } else {
                                    // If project not in current filtered list, add it temporarily
                                    setFilteredProjects([...filteredProjects, project]);
                                    setSelectedProjectIndex(filteredProjects.length);
                                    setIsExperienceModal(false);
                                  }
                                }}
                                className="flex items-start p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-600"
                              >
                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                  <Image 
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white">{project.title}</h5>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{project.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.tags.slice(0, 2).map((tag, idx) => (
                                      <span 
                                        key={idx}
                                        className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {project.tags.length > 2 && (
                                      <span className="text-gray-500 dark:text-gray-400 text-xs">+{project.tags.length - 2} more</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="order-1 md:order-2 animate-slideInLeft">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg">
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                        <Image 
                          src={selectedExperience.image}
                          alt={selectedExperience.company}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(selectedExperience.id)}
                        />
                      </div>
                    </div>
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