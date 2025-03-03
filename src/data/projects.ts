import { Project } from './types';

export const PROJECT_CATEGORIES = [
  "All",
  "Professional Experience",
  "Mobile Games",
  "Web Apps",
  "Blockchain",
  "AI & ML"
] as const;

export const PROJECTS: Project[] = [
    {
        id: 'cubeage',
        title: 'Cubeage Limited',
        description: 'Mobile gaming company specializing in card and casino games with millions of downloads',
        image: '/projects/cubeage.jpg',
        images: [
          '/projects/cubeage.jpg',
        ],
        skills: ['unity3d', 'gamedev', 'databases', 'ios', 'android', 'csharp'],
        skillTags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#', 'MySQL', 'Percona'],
        liveUrl: 'https://cubeage.com',
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-03-15",
        end_date: undefined, // Still ongoing
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
        skills: ['unity3d', 'typescript', 'gamedev', 'databases', 'java', 'socket-io', 'protobuf', 'elo-rating'],
        skillTags: ['Unity3D', 'TypeScript', 'Socket.IO', 'Protobuf', 'Multiplayer', 'ELO Rating', 'Cubeage'],
        androidUrl: 'https://play.google.com/store/apps/details?id=com.gameflask.btthk',
        iosUrl: 'https://apps.apple.com/us/app/%E9%8B%A4%E5%A4%A7d%E5%A4%A7%E4%BA%A8-%E6%9C%80%E5%88%BA%E6%BF%80%E7%9A%84%E7%AD%96%E7%95%A5%E6%A3%8B%E7%89%8C%E9%81%8A%E6%88%B2/id1295634408',
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2017-06-10",
        end_date: "2020-09-22",
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
        skills: ['react', 'typescript', 'nextjs', 'responsive-design', 'seo'],
        skillTags: ['React', 'Next.js', 'Responsive Design', 'SEO', 'Nakuz'],
        liveUrl: 'https://nakuz.com',
        category: "Web Apps",
        related_experience_id: "nakuz",
        start_date: "2020-02-15",
        end_date: "2020-05-30",
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
        skills: ['unity3d', 'gamedev', 'team-leadership', 'csharp', 'ios', 'android'],
        skillTags: ['Unity', 'C#', 'Mobile Game', '3D Graphics', 'Multiplayer', 'Cubeage'],
        androidUrl: 'https://play.google.com/store/apps/details?id=com.crazycube.hkmahjongtycoon.app',
        iosUrl: 'https://apps.apple.com/us/app/%E9%A6%99%E6%B8%AF%E9%BA%BB%E5%B0%87%E5%A4%A7%E4%BA%A8-%E9%BA%BB%E9%9B%80%E4%BF%BE%E4%BD%A0%E7%8E%A9/id1478835027',
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2018-11-05",
        end_date: "2019-08-20",
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
        skills: ['unity3d', 'gamedev', 'java', 'csharp', 'ios', 'android'],
        skillTags: ['Unity', 'C#', 'Mobile Game', 'IAP', 'Ad Mediation', 'Cubeage'],
        androidUrl: 'https://play.google.com/store/apps/details?id=com.cubeage.showhand.app',
        iosUrl: 'https://apps.apple.com/us/app/fun-showhand-stud-poker/id1238318956',
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2016-09-12",
        end_date: "2017-05-18",
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
        skills: ['unity3d', 'gamedev', 'java', 'databases', 'csharp', 'ios', 'android', 'ai-ml'],
        skillTags: ['Unity', 'C#', 'Mobile Game', 'Corona SDK', 'Taiwanese Mahjong', 'AI', 'Cubeage'],
        androidUrl: 'https://play.google.com/store/apps/details?id=com.cubeage.fmj16.app',
        iosUrl: 'https://apps.apple.com/us/app/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5-%E6%89%8B%E6%A9%9F%E5%8F%B0%E5%BC%8F%E9%BA%BB%E5%B0%87%E6%A8%82%E5%9C%92/id1252568150',
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2015-07-25",
        end_date: "2016-04-10",
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
        skills: ['typescript', 'nodejs', 'docker', 'gcp', 'vuejs', 'nestjs', 'seo'],
        skillTags: ['TypeScript', 'Vue.js', 'Nest.js', 'GCP', 'Docker', 'SEO'],
        github: 'https://github.com/shtse8/anymud',
        liveUrl: 'https://anymud.com',
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2019-03-08",
        end_date: "2020-01-15",
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
        skills: ['databases', 'php', 'responsive-design', 'seo', 'facebook-integration'],
        skillTags: ['PHP', 'MySQL', 'Percona', 'Facebook Integration', 'Responsive Design', 'SEO'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2012-05-20",
        end_date: "2013-11-30",
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
        skills: ['databases', 'php', 'nodejs', 'payment-integration'],
        skillTags: ['PHP', 'JavaScript', 'MySQL', 'Ubuntu', 'Game Distribution', 'Payment Integration'],
        category: "Web Apps",
        related_experience_id: "minimax",
        start_date: "2010-02-10",
        end_date: "2014-08-15",
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
        skills: ['typescript', 'kubernetes', 'blockchain', 'nodejs', 'docker'],
        skillTags: ['TypeScript', 'Blockchain', 'Kubernetes', 'Microservices', 'EOS', 'Ethereum'],
        category: "Blockchain",
        related_experience_id: null,
        start_date: "2018-04-15",
        end_date: "2019-10-30",
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
        skills: ['blockchain', 'nodejs', 'typescript'],
        skillTags: ['Blockchain', 'Smart Contracts', 'Multi-Chain', 'EOS', 'Ethereum', 'Bitcoin'],
        category: "Blockchain",
        related_experience_id: null,
        start_date: "2017-11-10",
        end_date: "2018-09-25",
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
        title: 'Mining Pool Management System',
        description: 'Comprehensive mining pool management system with advanced analytics',
        image: 'https://placehold.co/800x450/F5A623/FFFFFF?text=Mining+Pool',
        images: [
          'https://placehold.co/800x450/F5A623/FFFFFF?text=Mining+Pool',
        ],
        skills: ['blockchain', 'nodejs', 'typescript', 'databases'],
        skillTags: ['Blockchain', 'Node.js', 'TypeScript', 'MySQL', 'Redis', 'Bitcoin', 'Ethereum'],
        category: "Blockchain",
        related_experience_id: null,
        start_date: "2016-12-05",
        end_date: "2017-08-20",
        details: [
          'Developed a comprehensive mining pool management system for Bitcoin and Ethereum',
          'Created real-time analytics dashboard for monitoring hashrate, worker status, and earnings',
          'Implemented PPLNS (Pay Per Last N Shares) and PPS (Pay Per Share) payment systems',
          'Built automated payout system with configurable thresholds and schedules',
          'Designed worker management interface with email/SMS alerts for downtime'
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
        skills: ['python', 'ai-ml', 'firebase', 'gcp', 'typescript', 'go', 'tradingview', 'tigertrade', 'pytorch', 'telegram'],
        skillTags: ['Go', 'Python', 'TradingView', 'TigerTrade', 'Firebase', 'PyTorch', 'Telegram'],
        github: 'https://github.com/shtse8/TradingBot',
        category: "AI & ML",
        related_experience_id: null,
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
        skills: ['typescript', 'python', 'nodejs', 'ffmpeg', 'simhash', 'bun'],
        skillTags: ['TypeScript', 'Python', 'Bun', 'FFmpeg', 'Simhash'],
        github: 'https://github.com/shtse8/SotiMediaOrganizer',
        category: "Tools & Utilities",
        related_experience_id: null,
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
        skills: ['nodejs', 'chrome-extension', 'google-photos-api'],
        skillTags: ['JavaScript', 'Chrome Extension', 'Automation', 'Google Photos API'],
        github: 'https://github.com/shtse8/google-photos-delete-tool',
        liveUrl: 'https://chromewebstore.google.com/detail/google-photos-delete-tool/jiahfbbfpacpolomdjlpdpiljllcdenb',
        category: "Tools & Utilities",
        related_experience_id: null,
        details: [
          'Developed a Chrome extension with 2,000+ users to efficiently manage and clean up Google Photos libraries',
          'Implemented intelligent batch processing with custom selectors for automated photo deletion',
          'Created smart scrolling logic to handle large photo libraries with 10,000+ images',
          'Built in robust error handling and progress tracking for operation reliability',
          'Earned 4.7/5 star rating on Chrome Web Store and 73+ stars on GitHub'
        ]
      },
      {
        id: 'portfolio-website',
        title: 'Portfolio Website',
        description: 'Modern portfolio website built with Next.js, TypeScript, and Tailwind CSS',
        image: '/projects/portfolio.jpg',
        images: [
          '/projects/portfolio.jpg',
        ],
        skills: ['typescript', 'react', 'nextjs', 'tailwindcss', 'responsive-design'],
        skillTags: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Responsive Design'],
        github: 'https://github.com/shtse8/portfolio',
        liveUrl: 'https://shawntseng.com',
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2023-01-15",
        end_date: "2023-03-10",
        details: [
          'Designed and developed a modern portfolio website using Next.js, TypeScript, and Tailwind CSS',
          'Implemented responsive design for optimal viewing on all devices',
          'Created custom animations and transitions for enhanced user experience',
          'Optimized for performance, accessibility, and SEO',
          'Integrated with GitHub API for automatic project updates'
        ]
      },
      {
        id: 'chrome-extension',
        title: 'Productivity Chrome Extension',
        description: 'Chrome extension for enhancing productivity with custom tools and integrations',
        image: 'https://placehold.co/800x450/7ED321/FFFFFF?text=Chrome+Extension',
        images: [
          'https://placehold.co/800x450/7ED321/FFFFFF?text=Chrome+Extension',
        ],
        skills: ['typescript', 'react', 'chrome-extension', 'css'],
        skillTags: ['TypeScript', 'React', 'Chrome Extension', 'CSS', 'Browser API'],
        github: 'https://github.com/shtse8/chrome-extension',
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2021-08-05",
        end_date: "2021-10-20",
        details: [
          'Developed a Chrome extension for enhancing productivity with custom tools and integrations',
          'Built with TypeScript and React for a responsive and intuitive user interface',
          'Implemented features including website blocker, pomodoro timer, and note-taking functionality',
          'Created custom themes and styling options for personalization',
          'Earned 4.7/5 star rating on Chrome Web Store and 73+ stars on GitHub'
        ]
      },
      {
        id: 'ai-content-generator',
        title: 'AI Content Generator',
        description: 'Advanced AI-powered content generation platform for marketers and publishers',
        image: 'https://placehold.co/800x450/BD10E0/FFFFFF?text=AI+Content+Generator',
        images: [
          'https://placehold.co/800x450/BD10E0/FFFFFF?text=AI+Content+Generator',
        ],
        skills: ['ai-ml', 'python', 'typescript', 'react', 'nextjs'],
        skillTags: ['AI/ML', 'Python', 'TypeScript', 'React', 'Next.js', 'GPT-3', 'NLP'],
        category: "AI & ML",
        related_experience_id: null,
        start_date: "2021-03-10",
        end_date: "2022-01-25",
        details: [
          'Built an AI-powered content generation platform using GPT-3 and custom fine-tuned models',
          'Developed specialized content templates for different industries and content types',
          'Created a user-friendly interface for content generation, editing, and management',
          'Implemented content quality scoring system to ensure high-quality outputs',
          'Integrated with popular CMS platforms for seamless content publishing'
        ]
      },
      {
        id: 'sentiment-analysis',
        title: 'Social Media Sentiment Analysis',
        description: 'Real-time sentiment analysis platform for social media monitoring',
        image: 'https://placehold.co/800x450/9013FE/FFFFFF?text=Sentiment+Analysis',
        images: [
          'https://placehold.co/800x450/9013FE/FFFFFF?text=Sentiment+Analysis',
        ],
        skills: ['ai-ml', 'python', 'typescript', 'react', 'data-visualization'],
        skillTags: ['AI/ML', 'Python', 'TypeScript', 'React', 'Data Visualization', 'NLP'],
        category: "AI & ML",
        related_experience_id: null,
        start_date: "2020-06-15",
        end_date: "2021-02-28",
        details: [
          'Developed a real-time sentiment analysis platform for monitoring social media mentions',
          'Built custom NLP models for industry-specific sentiment analysis with 85%+ accuracy',
          'Created interactive dashboards for tracking sentiment trends and brand perception',
          'Implemented alert system for detecting sudden sentiment shifts or potential PR crises',
          'Designed comprehensive reporting system with actionable insights and recommendations'
        ]
      }
] as const; 