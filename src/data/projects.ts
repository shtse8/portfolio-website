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
        images: [
          '/projects/cubeage.jpg',
        ],
        skills: ['unity3d', 'gamedev', 'databases', 'ios', 'android', 'csharp', 'mobile-games'],
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
        images: [
          '/projects/big2_tycoon.jpg'
        ],
        skills: ['unity3d', 'typescript', 'gamedev', 'databases', 'java', 'socket-io', 'protobuf', 'elo-rating', 'multiplayer'],
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
        title: 'Nakuz.com Gaming Portal',
        description: 'Hong Kong\'s #1 gaming information website with over 500,000 registered users and 3,000+ concurrent online users, achieving top 10 Alexa ranking in Hong Kong',
        images: [
          '/projects/nakuz.jpg'
        ],
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'react', 'typescript', 'nextjs', 'responsive-design', 'discuz', 'ubuntu', 'mobile-web', 'ajax', 'rss', 'google-adsense'],
        category: "Web Apps",
        related_experience_id: "nakuz",
        start_date: "2005-01-01",
        end_date: undefined,
        urls: {
          web: "https://nakuz.com/"
        },
        details: [
          'Developed and maintained Hong Kong\'s #1 gaming information website since 2005',
          'Built a thriving online community with over 500,000 registered users and 3,000+ concurrent online users',
          'Achieved top 10 Alexa ranking among all Hong Kong websites',
          'Optimized server infrastructure for high-traffic and concurrent user load',
          'Redesigned in 2020 with modern technologies including React and Next.js',
          'Implemented responsive design for optimal viewing on all devices',
          'Integrated advertising systems including Google AdSense',
          'Applied advanced SEO techniques to achieve high search engine visibility'
        ]
      },
      {
        id: 'mahjong-tycoon',
        title: 'Hong Kong Mahjong Tycoon',
        description: 'Multiplayer Hong Kong-style Mahjong game with character progression',
        images: ['/projects/mahjong_tycoon.jpg'],
        skills: ['unity3d', 'typescript', 'gamedev', 'databases', 'java', 'socket-io', 'protobuf', 'multiplayer', 'ubuntu'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2018-05-01",
        end_date: "2019-11-15",
        details: [
          'Led development for this multiplayer Mahjong game at Cubeage using Unity3D',
          'Built a distributed backend infrastructure with TypeScript, Socket.IO, and Protobuf',
          'Implemented Hong Kong-style Mahjong rules and gameplay mechanics',
          'Created AI opponents with multiple difficulty levels using behavior trees',
          'Developed a character progression system with unlockable items and achievements'
        ]
      },
      {
        id: 'fun-showhand',
        title: 'Fun Showhand: Stud Poker',
        description: 'Engaging poker game with multiple game modes and social features',
        images: [
          '/projects/fsh/1.jpg',
          '/projects/fsh/2.jpg',
        ],
        skills: ['unity3d', 'gamedev', 'java', 'csharp', 'ios', 'android', 'iap', 'ad-mediation', 'mobile-games'],
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
        images: [
          '/projects/fmj.jpeg',
        ],
        skills: ['unity3d', 'gamedev', 'java', 'databases', 'csharp', 'ios', 'android', 'ai-ml', 'corona-sdk', 'mobile-games'],
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
        images: [
          '/projects/anymud.jpeg',
        ],
        skills: ['typescript', 'nodejs', 'docker', 'gcp', 'vuejs', 'nestjs', 'seo'],
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
        images: null,
        skills: ['databases', 'php', 'responsive-design', 'seo', 'facebook-integration', 'mysql', 'percona'],
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
        images: [
          '/projects/funimax.jpg',
        ],
        skills: ['databases', 'php', 'nodejs', 'payment-integration', 'javascript', 'mysql', 'ubuntu', 'game-distribution'],
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
        images: null,
        skills: ['typescript', 'kubernetes', 'blockchain', 'nodejs', 'docker', 'microservices', 'eos', 'ethereum'],
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
        images: null,
        skills: ['blockchain', 'nodejs', 'typescript', 'smart-contracts', 'multi-chain', 'eos', 'ethereum', 'bitcoin'],
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
        images: null,
        skills: ['blockchain', 'nodejs', 'typescript', 'databases', 'mysql', 'redis', 'bitcoin', 'ethereum'],
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
        images: [
          '/projects/quant_trading.jpg',
          '/projects/quant_trading_ror.jpg',
        ],
        skills: ['python', 'ai-ml', 'firebase', 'gcp', 'typescript', 'go', 'tradingview', 'tigertrade', 'pytorch', 'telegram'],
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
        images: [
          '/projects/SotiMediaOrganizer.jpg',
        ],
        skills: ['typescript', 'python', 'nodejs', 'ffmpeg', 'simhash', 'bun'],
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
        images: [
          '/projects/google_photo_delete_tool.jpg',
        ],
        skills: ['nodejs', 'chrome-extension', 'google-photos-api', 'javascript', 'automation'],
        category: "Tools & Utilities",
        related_experience_id: null,
        github: 'https://github.com/shtse8/google-photos-delete-tool',
        liveUrl: 'https://chromewebstore.google.com/detail/google-photos-delete-tool/jiahfbbfpacpolomdjlpdpiljllcdenb',
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
        images: [
          '/projects/portfolio.jpg',
        ],
        skills: ['typescript', 'react', 'nextjs', 'tailwindcss', 'responsive-design'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2023-01-15",
        end_date: "2023-03-10",
        github: 'https://github.com/shtse8/portfolio',
        liveUrl: 'https://shawntseng.com',
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
        images: null,
        skills: ['typescript', 'react', 'chrome-extension', 'css', 'browser-api'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2021-08-05",
        end_date: "2021-10-20",
        github: 'https://github.com/shtse8/chrome-extension',
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
        images: null,
        skills: ['ai-ml', 'python', 'typescript', 'react', 'nextjs', 'gpt', 'nlp'],
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
        images: null,
        skills: ['ai-ml', 'python', 'typescript', 'react', 'data-visualization', 'nlp'],
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
      },
      // Historical projects
      {
        id: 'sky-c',
        title: 'Sky-C Gaming Community',
        description: 'Hong Kong\'s #1 gaming IP exchange network and discussion forum with over 200,000 registered users and 1,000+ concurrent online users',
        images: null,
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'discuz', 'ubuntu', 'ajax', 'rss'],
        category: "Web Development",
        related_experience_id: null,
        start_date: "2001-01-01",
        end_date: "2005-12-31",
        urls: {
          web: "http://sky-c.com/",
          timemachine: "https://web.archive.org/web/20241211084528/http://sky-c.com/"
        },
        details: [
          'Created Hong Kong\'s #1 gaming IP exchange network and discussion forum platform',
          'Built and managed a community with over 200,000 registered users and 1,000+ concurrent online users',
          'Implemented forum functionality using Discuz! with custom modifications',
          'Optimized server infrastructure on Ubuntu for high concurrent user load',
          'Developed custom themes and UI components with HTML, CSS, and JavaScript',
          'Integrated RSS feeds and implemented AJAX for improved user experience',
          'Applied SEO techniques to achieve high visibility in search engines'
        ]
      },
      {
        id: 'a-graders',
        title: 'A-Graders',
        description: 'Hong Kong private tutoring matching platform connecting tutors and students',
        images: null,
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'ubuntu', 'google-adsense'],
        category: "Web Development",
        related_experience_id: null,
        start_date: "2008-01-01",
        end_date: "2009-12-31",
        urls: {
          web: "http://www.agraders.com/",
          timemachine: "https://web.archive.org/web/20241211084528/https://agraders.com/"
        },
        details: [
          'Designed and developed a private tutoring matching platform for the Hong Kong market',
          'Created a user-friendly interface for tutors and students to find compatible matches',
          'Implemented secure profile creation and matching algorithms',
          'Developed search functionality with filtering by subject, level, and location',
          'Integrated messaging system for direct communication between parties',
          'Optimized for search engines to increase organic traffic',
          'Implemented monetization through Google AdSense'
        ]
      },
      {
        id: 'hyperfds',
        title: 'Hyperfds',
        description: 'Hong Kong blogger and social media portal platform for networking and community building',
        images: null,
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'ubuntu', 'mobile-web', 'google-adsense'],
        category: "Web Development",
        related_experience_id: null,
        start_date: "2008-01-01",
        end_date: "2009-12-31",
        urls: {
          web: "http://hyperfds.com/",
          timemachine: "https://web.archive.org/web/20080813211308/http://hyperfds.com/"
        },
        details: [
          'Created a social networking and blogging platform for Hong Kong users',
          'Designed and implemented user profiles, friendship connections, and content sharing features',
          'Built custom blogging functionality with rich text editing',
          'Developed mobile-responsive design for cross-device compatibility',
          'Implemented social features including comments, likes, and sharing',
          'Optimized for search engines to increase organic traffic',
          'Integrated monetization through Google AdSense'
        ]
      },
      {
        id: 'ipet',
        title: 'iPet',
        description: 'Facebook virtual pet game with raising and fighting mechanics',
        images: null,
        skills: ['flash', 'php', 'mysql', 'facebook-api', 'ubuntu', 'google-adsense'],
        category: "Game Development",
        related_experience_id: "minimax",
        start_date: "2010-01-01",
        end_date: "2011-12-31",
        urls: {
          media: [
            {
              name: "Gamezebo Review",
              url: "https://www.gamezebo.com/reviews/ipet-review/",
              description: "Review of iPet on Gamezebo"
            }
          ]
        },
        details: [
          'Developed a virtual pet game for the Facebook platform',
          'Implemented pet raising and fighting mechanics',
          'Created pet customization and decoration options',
          'Integrated with Facebook API for social features and virality',
          'Designed game economy and monetization systems',
          'Developed backend systems on Ubuntu with PHP and MySQL',
          'Featured in game review publications including Gamezebo'
        ]
      }
] as const; 