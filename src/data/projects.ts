import { Project } from './types';

export const PROJECT_CATEGORIES = [
  'All',
  'Professional Experience',
  'Mobile Games',
  'Web Apps',
  'Blockchain',
  'AI & ML',
  'Tools & Utilities'
] as const;

export const PROJECTS: Project[] = [
    {
        id: 'cubeage',
        title: 'Cubeage.com',
        description: 'Official website and game portal for Cubeage Limited with user management and payment systems',
        images: [
          '/projects/cubeage/1.jpg',
        ],
        skills: ['vue', 'mysql', 'ubuntu', 'responsive-design', 'seo', 'typescript', 'payment-integration', 'user-management', 'frontend-development', 'mobile-web'],
        category: "Web Apps",
        related_experience_id: "cubeage", 
        start_date: "2014-03-15",
        end_date: undefined, // Still ongoing
        details: [
          'Developed official game portal using Vue.js and TypeScript',
          'Implemented comprehensive user management system with authentication and profiles',
          'Integrated multiple payment gateways for in-game purchases',
          'Built responsive mobile-first design for optimal cross-device experience',
          'Optimized SEO to improve visibility and organic traffic',
          'Deployed and maintained on Ubuntu servers with MySQL database'
        ]
      },
      {
        id: 'big2-tycoon',
        title: 'Big 2 Tycoon',
        description: 'Multiplayer competitive card game with character progression and arena tournaments',
        images: [
          '/projects/big2-tycoon/1.jpg'
        ],
        skills: ['unity3d', 'typescript', 'game-development', 'database-design', 'database-optimization', 'java', 'socket-io', 'protobuf', 'elo-rating', 'multiplayer', 'javascript', 'nodejs', 'ubuntu', 'google-admob', 'appodeal', 'game-ai', 'game-networking', 'offline-first', 'push-notifications'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2016-01-01",
        end_date: "2023-12-31",
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.gameflask.btthk",
          appStore: "https://apps.apple.com/az/app/%E9%8B%A4%E5%A4%A7d%E5%A4%A7%E4%BA%A8-%E6%9C%80%E5%88%BA%E6%BF%80%E7%9A%84%E7%AD%96%E7%95%A5%E6%A3%8B%E7%89%8C%E9%81%8A%E6%88%B2/id1295634408"
        },
        details: [
          'Led development at Cubeage for this real-time multiplayer card game with Unity3D featuring unique characters and treasure systems',
          'Implemented a sophisticated ELO rating system for fair matchmaking, ensuring players find opponents of similar skill levels',
          'Built a distributed backend architecture using TypeScript, Socket.IO, and Protobuf on Ubuntu servers',
          'Created arena cups offering prestige, exclusive skins, coins, and gems as rewards',
          'Designed engaging progression systems including character upgrades, treasure collection, and monthly arena tournaments',
          'Integrated monetization through Google AdMob and Appodeal'
        ]
      },
      {
        id: 'nakuz',
        title: 'Nakuz.com Gaming Portal',
        description: 'Hong Kong\'s #1 gaming information website with over 500,000 registered users and 3,000+ concurrent online users, achieving top 10 Alexa ranking in Hong Kong',
        images: [
          '/projects/nakuz/1.jpg'
        ],
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'react', 'typescript', 'nextjs', 'responsive-design', 'responsive-web-design', 'discuz', 'ubuntu', 'mobile-web', 'ajax', 'rss', 'google-adsense', 'digital-marketing', 'frontend-development', 'sql'],
        category: "Web Apps",
        related_experience_id: "nakuz",
        start_date: "2005-01-01",
        end_date: undefined,
        urls: {
          website: "https://nakuz.com/"
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
        id: 'fun-showhand',
        title: 'Fun Showhand: Stud Poker',
        description: 'Engaging poker game with multiple game modes and social features',
        images: [
          '/projects/fun-showhand/1.png',
          '/projects/fun-showhand/2.png',
          '/projects/fun-showhand/3.png',
          '/projects/fun-showhand/4.png',
          '/projects/fun-showhand/5.png',
          '/projects/fun-showhand/6.png',
          '/projects/fun-showhand/7.png',
          '/projects/fun-showhand/8.png',
          '/projects/fun-showhand/9.png',
        ],
        skills: [
          'ad-mediation',
          'android',
          'artificial-intelligence',
          'csharp',
          'game-ai',
          'game-analytics',
          'game-development',
          'game-monetization',
          'game-physics',
          'google-admob',
          'google-cloud-service',
          'iap',
          'ios',
          'java',
          'javascript',
          'machine-learning', 
          'mobile-games',
          'monte-carlo-simulation',
          'php',
          'typescript',
          'ubuntu',
          'unity3d'
        ],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2016-09-12",
        end_date: undefined, // 保持为 undefined 表示项目仍在进行中
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.cubeage.showhand.app",
          appStore: "https://apps.apple.com/az/app/fun-showhand-stud-poker/id1238318956",
          other: [
            {
              name: "Appszoom Review Video",
              url: "https://www.youtube.com/watch?v=Hl-YcZ9Hh8U",
              description: "Video review of Fun Showhand on Appszoom",
              type: "review"
            }
          ]
        },
        details: [
          'Led development at Cubeage for this popular poker game available on both Android and iOS platforms',
          'Implemented in-app purchases and ad mediation with Appodeal, AdMob, and Facebook Ads',
          'Created highly realistic AI opponents using Monte Carlo simulation for authentic gameplay',
          'Designed offline gameplay with online social features including friend system and cloud save',
          'Featured in Appszoom review videos with positive feedback',
          'Developed authentic Stud Poker game popular in Taiwan, Hong Kong, and Macau',
          'Created instant play mechanics with no registration required',
          'Implemented daily rewards and mission system',
          'Designed high-quality graphics and dynamic performance',
          'Built offline play capability for gaming anywhere',
          'Created global leaderboard for competitive play',
          'Implemented progressive difficulty system with game partitions'
        ]
      },
      {
        id: 'fmj',
        title: 'Fun Mahjong 16 Tiles',
        description: 'Popular Taiwanese Mahjong game with over 1 million downloads featuring a unique offline gameplay experience with 16-tile Mahjong rules',
        images: [
          '/projects/fmj/1.jpg',
          '/projects/fmj/2.jpg',
          '/projects/fmj/3.jpg',
        ],
        skills: ['corona-sdk', 'game-development', 'mysql', 'php', 'ubuntu', 'google-admob', 'appodeal', 'onesignal', 'android', 'ios', 'artificial-intelligence', 'machine-learning', 'mobile-games', 'game-ai', 'monte-carlo-simulation', 'offline-first', 'push-notifications'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2013-01-01",
        end_date: undefined, // Still being maintained
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.cubeage.fmj16.app",
          appStore: "https://apps.apple.com/us/app/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5-%E6%89%8B%E6%A9%9F%E5%8F%B0%E5%BC%8F%E9%BA%BB%E5%B0%87%E6%A8%82%E5%9C%92/id1252568150",
          wikipedia: "https://zh.wikipedia.org/wiki/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5",
          other: [
            {
              name: "Featured in Book",
              url: "https://books.google.com.tw/books?id=7klBCgAAQBAJ&pg=SA9-PA7&lpg=SA9-PA7&dq=%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5&source=bl&ots=LGOh5j3AZH&sig=ieX2Zvp2Wac8F2EvcZaAw5snZUA&hl=zh-TW&sa=X&ved=0ahUKEwib4qryvfTKAhXDGpQKHZFABmo4KBDoAQgfMAE#v=onepage&q=%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5&f=false",
              description: "Recommended app in published book",
              type: "resource"
            }
          ]
        },
        details: [
          'Led development at Cubeage for this popular Taiwanese Mahjong game with over 1 million downloads',
          'Created a unique offline gameplay experience with 144-tile Mahjong ruleset and distinctive gameplay where only discarded tiles are visible',
          'Implemented a level-based and wind-based (4-round) system with automatic dice rolling and the flexibility to exit anytime',
          'Developed highly realistic AI opponents using Monte Carlo simulation, providing an authentic gameplay experience',
          'Designed a simple, clean interface focused on gameplay rather than excessive visual effects',
          'Implemented online features including leaderboards, friend system, and cloud save functionality',
          'Integrated Appodeal and Google AdMob for monetization while maintaining a non-intrusive gaming experience',
          'Game received critical acclaim for offering single-player offline experience that eliminates common pain points of online Mahjong games',
          'Featured in recommended apps publications and recognized in Wikipedia'
        ]
      },
      {
        id: 'anymud',
        title: 'Anymud',
        description: 'Modern Medium-like publishing platform with advanced editor capabilities',
        images: [
          '/projects/anymud/1.jpg',
        ],
        skills: [
          'api-development',
          'digital-marketing',
          'docker',
          'firebase',
          'frontend-development',
          'gcp',
          'google-adsense',
          'graphql',
          'javascript',
          'mongodb',
          'nestjs',
          'nodejs',
          'postgresql',
          'prisma',
          'responsive-web-design',
          'seo',
          'serverless',
          'styled-components',
          'tailwindcss',
          'typescript',
          'ubuntu',
          'vuejs'
        ],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2022-01-01", // 使用第二个条目的日期（更新）
        end_date: "2024-12-31", // 使用第二个条目的日期（更新）
        details: [
          'Built a Medium-like platform with TypeScript, Vue.js, and Node.js',
          'Implemented GraphQL API with Prisma ORM for efficient data access',
          'Created hybrid database architecture using PostgreSQL and MongoDB',
          'Developed advanced editor with intuitive image handling',
          'Optimized SEO with structured data and semantic markup',
          'Integrated Google AdSense for monetization',
          'Implemented Firebase Cloud Messaging for notifications',
          'Deployed on Ubuntu servers for reliability and performance'
        ]
      },
      {
        id: 'novelfeed',
        title: 'NovelFeed',
        description: 'Publisher-focused article sharing platform with enhanced social integration',
        images: [],
        skills: ['database-design', 'database-optimization', 'php', 'responsive-design', 'responsive-web-design', 'seo', 'facebook-integration', 'mysql', 'percona', 'api-testing', 'digital-marketing'],
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
          '/projects/funimax/1.jpg',
        ],
        skills: ['database-design', 'database-optimization', 'php', 'nodejs', 'payment-integration', 'javascript', 'mysql', 'ubuntu', 'game-distribution', 'api-development', 'api-testing', 'sass', 'styled-components', 'sql'],
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
        images: [],
        skills: ['typescript', 'kubernetes', 'blockchain', 'nodejs', 'docker', 'microservices', 'eos', 'ethereum', 'solidity', 'web3', 'defi', 'dapps', 'smart-contracts', 'cicd'],
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
        images: [],
        skills: ['blockchain', 'nodejs', 'typescript', 'smart-contracts', 'multi-chain', 'eos', 'ethereum', 'bitcoin', 'web3', 'solidity', 'defi', 'nft', 'dapps'],
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
        images: [],
        skills: ['blockchain', 'nodejs', 'typescript', 'database-design', 'database-optimization', 'mysql', 'redis', 'bitcoin', 'ethereum', 'cryptocurrency', 'solidity', 'smart-contracts', 'web3', 'defi', 'nft'],
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
          '/projects/ai-trading/1.jpg',
        ],
        skills: ['python', 'artificial-intelligence', 'machine-learning', 'firebase', 'gcp', 'typescript', 'go', 'tradingview', 'tigertrade', 'pytorch', 'telegram', 'data-analysis', 'financial-analysis', 'time-series', 'reinforcement-learning', 'llm', 'serverless'],
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
        images: [],
        skills: ['typescript', 'python', 'nodejs', 'ffmpeg', 'simhash', 'bun', 'automation', 'performance-testing'],
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
          '/projects/google-photos-delete/1.jpg',
        ],
        skills: ['nodejs', 'chrome-extension', 'google-photos-api', 'javascript', 'automation', 'api-development', 'frontend-development'],
        category: "Tools & Utilities",
        related_experience_id: null,
        urls: {
          repository: 'https://github.com/shtse8/google-photos-delete-tool',
          demo: 'https://chromewebstore.google.com/detail/google-photos-delete-tool/jiahfbbfpacpolomdjlpdpiljllcdenb'
        },
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
          '/projects/portfolio-website/1.png',
        ],
        skills: ['typescript', 'react', 'nextjs', 'tailwindcss', 'responsive-design', 'responsive-web-design', 'frontend-development', 'api-testing', 'sass', 'framer-motion', 'animation', 'serverless', 'github-actions', 'ci-cd', 'cloudflare-pages', 'bun'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2024-03-01",
        end_date: undefined,
        urls: {
          repository: 'https://github.com/shtse8/portfolio',
          website: 'https://kylet.se'
        },
        details: [
          'Designed and developed a modern portfolio website using Next.js, TypeScript, and Tailwind CSS',
          'Implemented responsive design for optimal viewing on all devices',
          'Created custom animations and transitions using Framer Motion for enhanced user experience',
          'Built serverless architecture and deployed on Cloudflare Pages for optimal performance',
          'Set up automated CI/CD pipeline using GitHub Actions and Bun for efficient deployment',
          'Optimized for performance, accessibility, and SEO',
          'Integrated with GitHub API for automatic project updates',
          'Built custom interactive components and smooth page transitions'
        ]
      },
      {
        id: 'sky-c',
        title: 'Sky-C Gaming Community',
        description: 'Hong Kong\'s #1 gaming IP exchange network and discussion forum with over 200,000 registered users and 1,000+ concurrent online users',
        images: [],
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'discuz', 'ubuntu', 'ajax', 'rss', 'digital-marketing', 'sql'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2001-01-01",
        end_date: "2005-12-31",
        urls: {
          website: 'http://sky-c.com/',
          timemachine: 'https://web.archive.org/web/20241211084528/http://sky-c.com/'
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
        images: [],
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'ubuntu', 'google-adsense', 'digital-marketing', 'sql'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2008-01-01",
        end_date: "2009-12-31",
        urls: {
          website: 'http://www.agraders.com/',
          timemachine: 'https://web.archive.org/web/20241211084528/https://agraders.com/'
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
        images: [],
        skills: ['php', 'mysql', 'html', 'css', 'javascript', 'seo', 'ubuntu', 'mobile-web', 'google-adsense', 'digital-marketing', 'sql'],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2008-01-01",
        end_date: "2009-12-31",
        urls: {
          website: 'http://hyperfds.com/',
          timemachine: 'https://web.archive.org/web/20080813211308/http://hyperfds.com/'
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
        images: [
          '/projects/ipet/1.jpg',
          '/projects/ipet/2.jpg',
          '/projects/ipet/3.jpg'
        ],
        skills: ['flash', 'php', 'mysql', 'facebook-api', 'ubuntu', 'google-admob', 'game-ai', 'game-development'],
        category: "Mobile Games",
        related_experience_id: "minimax",
        start_date: "2010-01-01",
        end_date: "2011-12-31",
        urls: {
          other: [
            {
              name: "Gamezebo Review",
              url: "https://www.gamezebo.com/reviews/ipet-review/",
              description: "Review of iPet on Gamezebo",
              type: "review"
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
      },
      {
        id: 'math-genius',
        title: 'Are you a Math Genius??',
        description: 'Fast-paced math quiz game with addictive gameplay that challenges your mental calculation speed',
        images: [
          '/projects/math-genius/1.png',
          '/projects/math-genius/2.png',
          '/projects/math-genius/3.png',
          '/projects/math-genius/4.png',
          '/projects/math-genius/5.png',
        ],
        skills: ['corona-sdk', 'lua', 'mysql', 'php', 'google-admob', 'google-cloud-service', 'game-analytics', 'game-development', 'game-monetization'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: "2019-12-31",
        urls: {
          other: [
            {
              name: "Data.ai (Google Play)",
              url: "https://www.data.ai/apps/google-play/app/20600003248730/details",
              description: "App intelligence data on Google Play Store",
              type: "resource"
            }
          ]
        },
        details: [
          'Developed a time-based math quiz game with over 1M downloads',
          'Featured by Google Play editors in the Trivia category',
          'Reached #1 rank in Trivia leaderboard in several countries',
          'Implemented \'Right or Wrong\' touch mechanics for quick mental math challenges',
          'Created a combo system to reward consecutive correct answers',
          'Built using Corona SDK with Lua for cross-platform deployment',
          'Integrated with Google AdMob for monetization and Google Cloud Services for backend'
        ]
      },
      {
        id: 'royal-cube',
        title: 'Royal Cube',
        description: 'Space shooting game with numerous warplanes and elaborate map designs',
        images: [
          '/projects/royal-cube/1.jpg',
          '/projects/royal-cube/2.jpg',
          '/projects/royal-cube/3.jpg',
          '/projects/royal-cube/4.jpg',
          '/projects/royal-cube/5.jpg',
          '/projects/royal-cube/6.jpg',
        ],
        skills: ['typescript', 'javascript', 'nodejs', 'socket-io', 'protobuf', 'mysql', 'cocos2d', 'ubuntu', 'google-admob', 'google-cloud-service', 'database-optimization', 'game-analytics', 'game-development', 'game-physics'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2019-01-01",
        end_date: "2022-12-31",
        details: [
          'Developed a space shooting game with Cocos2d featuring 30+ types of warplanes',
          'Created 100 unique levels with diverse environments including desert, glacier, and ocean scenes',
          'Implemented global ladder competition system for player rankings',
          'Designed warplane upgrade and optimization systems with skills and power-ups',
          'Built friend assistance and room mode features for cooperative and competitive play',
          'Developed backend infrastructure with Node.js, Socket.io, Protobuf, and MySQL',
          'Deployed on Ubuntu servers with Google Cloud Service'
        ]
      },
      {
        id: 'taiwan-mahjong-tycoon',
        title: 'Taiwan Mahjong Tycoon',
        description: 'The first MMO Mahjong RPG featuring story-driven gameplay and business simulation',
        images: [
          '/projects/taiwan-mahjong-tycoon/1.png',
          '/projects/taiwan-mahjong-tycoon/2.png',
          '/projects/taiwan-mahjong-tycoon/3.png',
          '/projects/taiwan-mahjong-tycoon/4.png',
          '/projects/taiwan-mahjong-tycoon/5.png',
          '/projects/taiwan-mahjong-tycoon/6.png',
          '/projects/taiwan-mahjong-tycoon/7.png',
          
        ],
        skills: ['unity3d', 'csharp', 'nodejs', 'protobuf', 'socket-io', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'game-development', 'game-analytics', 'offline-first', 'api-development'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2019-01-01",
        end_date: "2023-12-31",
        urls: {
          appStore: "https://apps.apple.com/us/app/taiwan-mahjong-tycoon/id1515252812",
          other: [
            {
              name: "Data.ai (App Store)",
              url: "https://www.data.ai/apps/ios/app/1515252812/details",
              description: "App intelligence data on App Store",
              type: "resource"
            }
          ]
        },
        details: [
          'Created the first MMO Mahjong RPG with narrative-driven gameplay set in a fantasy world',
          'Developed a rich storyline featuring conflicts between racial forces and the quest to become a successor',
          'Implemented companion recruitment system with five different races',
          'Built a business simulation system with studios, shops, and sponsorships',
          'Created competitive mahjong championship mechanics with unique rules',
          'Featured on App Store category pages',
          'Developed with Unity3D, C#, with Node.js backend using Protobuf and Socket.io',
          'Implemented advanced AI opponents using Monte Carlo simulation for realistic gameplay behavior'
        ]
      },
      {
        id: 'taiwan-mahjong-tycoon-2',
        title: '台灣麻將大亨2',
        description: 'Taiwanese Mahjong game with character progression, pets, and multiple game modes',
        images: [
          '/projects/taiwan-mahjong-tycoon-2/1.png',
          '/projects/taiwan-mahjong-tycoon-2/2.png',
          '/projects/taiwan-mahjong-tycoon-2/3.jpg',
          '/projects/taiwan-mahjong-tycoon-2/4.jpg',
          '/projects/taiwan-mahjong-tycoon-2/5.jpg',
          '/projects/taiwan-mahjong-tycoon-2/6.jpg',
          '/projects/taiwan-mahjong-tycoon-2/7.jpg',
          '/projects/taiwan-mahjong-tycoon-2/8.jpg',
        ],
        skills: ['unity3d', 'csharp', 'nodejs', 'protobuf', 'socket-io', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'neural-networks', 'reinforcement-learning', 'game-development', 'shader-programming'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2020-01-01",
        end_date: "2023-12-31",
        urls: {
          appStore: "https://apps.apple.com/az/app/%E5%8F%B0%E7%81%A3%E9%BA%BB%E5%B0%87%E5%A4%A7%E4%BA%A82/id1589759836",
          other: [
            {
              name: "Data.ai (Google Play)",
              url: "https://www.data.ai/apps/google-play/app/20600015810991/details?",
              description: "App intelligence data on Google Play Store",
              type: "resource"
            },
            {
              name: "Data.ai (App Store)",
              url: "https://www.data.ai/apps/ios/app/1589759836/details",
              description: "App intelligence data on App Store",
              type: "resource"
            }
          ]
        },
        details: [
          'Developed an authentic Taiwanese Mahjong game with 16-tile gameplay',
          'Created a character system with unique abilities and pet companions',
          'Implemented multiple game modes for varied player experiences',
          'Designed an extensive costume and customization system',
          'Built guild and social features including emotes and quick messages',
          'Featured on App Store category pages',
          'Developed with Unity3D, C#, with Node.js backend using Protobuf and Socket.io',
          'Implemented sophisticated AI using neural networks and reinforcement learning for adaptive opponent behavior'
        ]
      },
      {
        id: 'hk-mahjong-tycoon',
        title: '香港麻將大亨 Hong Kong Mahjong Tycoon',
        description: 'Unique 3D Mahjong world with multiple game modes and character progression',
        images: [
          '/projects/hk-mahjong-tycoon/1.jpg',
          '/projects/hk-mahjong-tycoon/1.png',
          '/projects/hk-mahjong-tycoon/2.png',
          '/projects/hk-mahjong-tycoon/3.jpg',
          '/projects/hk-mahjong-tycoon/4.jpg',
          '/projects/hk-mahjong-tycoon/5.jpg',
          '/projects/hk-mahjong-tycoon/6.jpg',
          '/projects/hk-mahjong-tycoon/7.jpg',
          '/projects/hk-mahjong-tycoon/8.jpg',
        ],
        skills: ['unity3d', 'csharp', 'nodejs', 'protobuf', 'socket-io', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'neural-networks', 'reinforcement-learning', 'tensorflow', 'shader-programming', 'api-development'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2018-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.crazycube.hkmahjongtycoon.app",
          appStore: "https://apps.apple.com/az/app/%E9%A6%99%E6%B8%AF%E9%BA%BB%E5%B0%87%E5%A4%A7%E4%BA%A8-%E9%BA%BB%E9%9B%80%E4%BF%BE%E4%BD%A0%E7%8E%A9/id1478835027",
          other: [
            {
              name: "Data.ai (Google Play)",
              url: "https://www.data.ai/apps/google-play/app/20600012644622/details?",
              description: "App intelligence data on Google Play Store",
              type: "resource"
            },
            {
              name: "Data.ai (App Store)",
              url: "https://www.data.ai/apps/ios/app/1478835027/details?",
              description: "App intelligence data on App Store",
              type: "resource"
            }
          ]
        },
        details: [
          'Developed a unique 3D Mahjong world with multiple game modes including blood flow, classic four-player, two-player, and variable modes',
          'Implemented daily activities and rewards to enhance player engagement',
          'Created pet system, equipment progression, and character customization',
          'Built boss challenges, tournaments, and slot machine mini-games',
          'Designed guild system for social interaction and cooperative play',
          'Implemented skill and ranking systems for competitive progression',
          'Developed with Unity3D, C#, with Node.js backend using Protobuf and Socket.io',
          'Implemented advanced AI opponents using Monte Carlo simulation for realistic gameplay behavior'
        ]
      },
      {
        id: 'big2-tycoon-taiwan',
        title: 'Big 2 Tycoon Taiwan',
        description: 'Authentic Taiwanese Big 2 card game with rich features and competitive gameplay',
        images: [
          '/projects/big2-tycoon-taiwan/1.jpg',
          '/projects/big2-tycoon-taiwan/2.png',
          '/projects/big2-tycoon-taiwan/3.png',
          '/projects/big2-tycoon-taiwan/4.png',
          '/projects/big2-tycoon-taiwan/5.png',
        ],
        skills: ['unity3d', 'csharp', 'nodejs', 'protobuf', 'socket-io', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'game-development', 'game-analytics', 'game-monetization', 'api-development'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2015-01-01",
        end_date: "2023-12-31",
        details: [
          'Developed an authentic Taiwanese Big 2 card game with easy to learn mechanics',
          'Implemented global server for worldwide competitive play',
          'Created quick player matching system for instant gameplay',
          'Built comprehensive daily mission system with varied rewards',
          'Designed peak PK ranking system to showcase player skills',
          'Created Japanese anime-style art with expressive animations',
          'Implemented diverse emoticon system to enhance social interaction',
          'Developed assistance features to help players recover from losing streaks',
          'Implemented sophisticated AI using Monte Carlo simulation and machine learning for challenging opponents'
        ]
      },
      {
        id: 'big2-tycoon-2',
        title: 'Big 2 Tycoon 2',
        description: 'Enhanced Big 2 card game with character skills and multiple game modes',
        images: [
          '/projects/big2-tycoon-2/1.png',
          '/projects/big2-tycoon-2/2.png',
          '/projects/big2-tycoon-2/3.jpg',
          '/projects/big2-tycoon-2/4.jpg',
          '/projects/big2-tycoon-2/5.jpg',
          '/projects/big2-tycoon-2/6.jpg',
          '/projects/big2-tycoon-2/7.jpg',
          
        ],
        skills: ['unity3d', 'csharp', 'nodejs', 'protobuf', 'socket-io', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'game-development', 'offline-first'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2020-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          appStore: "https://apps.apple.com/az/app/%E9%8B%A4%E5%A4%A7d%E5%A4%A7%E4%BA%A82-%E6%89%93%E5%90%8C%E8%8A%B1%E9%A0%86/id1593378088"
        },
        details: [
          'Created next-generation Big 2 poker card game with multiple game modes',
          'Implemented classic, 1v1, friends mode, joker mode, and battle modes',
          'Designed unique character-specific skills and aura abilities to enhance gameplay',
          'Created spectacular visual effects for dramatic card plays',
          'Built friend invitation and guild systems for social play',
          'Developed with Unity3D, C#, with Node.js backend using Protobuf and Socket.io',
          'Integrated Google AdMob for monetization',
          'Created adaptive AI that learns from player behavior and adjusts difficulty accordingly'
        ]
      },
      {
        id: 'cube-quest',
        title: 'Cube Quest: 2248 Saga',
        description: 'Puzzle adventure game inspired by 2248 gameplay with character progression and social features',
        images: [],
        skills: ['cocos2d', 'javascript', 'typescript', 'nodejs', 'ubuntu', 'google-admob', 'appodeal', 'game-development', 'offline-first'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2022-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.cubeage.ttfe.app"
        },
        details: [
          'Developed a captivating puzzle adventure game inspired by 2248 gameplay',
          'Created dynamic character system with equipable items to boost scores during fever time',
          'Implemented social features including chatrooms, friend system, and guilds',
          'Designed treasure and exploration system to enhance progression',
          'Built global leaderboards for competitive play',
          'Created with Cocos2D, Javascript/Typescript, with Node.js backend',
          'Integrated Google AdMob and Appodeal for monetization'
        ]
      },
      {
        id: 'fun-big2-taiwan',
        title: 'Fun Big 2 Taiwan',
        description: 'Taiwanese-style Big 2 card game with offline play and achievement system',
        images: [
          '/projects/fun-big2-taiwan/1.png',
          '/projects/fun-big2-taiwan/2.jpg',
          '/projects/fun-big2-taiwan/3.jpg',
          '/projects/fun-big2-taiwan/4.jpg',
          '/projects/fun-big2-taiwan/5.jpg',
          '/projects/fun-big2-taiwan/6.jpg',
          '/projects/fun-big2-taiwan/7.jpg',
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'game-physics'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2013-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.luckystargame.funbig2_tw",
          appStore: "https://apps.apple.com/az/app/fun-big-2-taiwan-card-craze/id1251326780"
        },
        details: [
          'Developed a Taiwanese-style Big 2 card game with free-to-play, no-account-required mechanics',
          'Created intuitive controls and offline gameplay for on-the-go gaming',
          'Implemented achievements, missions, and reward systems',
          'Designed starter bonus of 30,000 coins for new players',
          'Built exclusive betting system for added excitement',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers',
          'Integrated Google AdMob for monetization',
          'Created intelligent AI opponents that adapt to player skill level using machine learning techniques'
        ]
      },
      {
        id: 'fun-big2',
        title: 'Fun Big 2',
        description: 'Global version of Big 2 card game with authentic gameplay and offline capabilities',
        images: [
          '/projects/fun-big2/1.jpg',
          '/projects/fun-big2/2.jpg',
          '/projects/fun-big2/3.jpg',
          '/projects/fun-big2/4.jpg',
          '/projects/fun-big2/5.jpg',
          '/projects/fun-big2/6.jpg',
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'game-analytics', 'push-notifications', 'shader-programming'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.luckystargame.funbigtwo",
          appStore: "https://apps.apple.com/az/app/fun-big-2-card-battle-royale/id1247782302"
        },
        details: [
          'Created a global version of Big 2 card game with beautiful design and fluid gameplay',
          'Implemented free-to-play model with 30,000 starting coins',
          'Built offline gameplay capability requiring no account or internet',
          'Designed intuitive controls with in-game tips for easy learning',
          'Created engaging missions, achievements, and challenges with rewards',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers',
          'Integrated Google AdMob for monetization',
          'Developed sophisticated AI using machine learning for different difficulty levels of opponents'
        ]
      },
      {
        id: 'fun-texas-holdem',
        title: 'Fun Texas Hold\'em Poker',
        description: 'Fast-paced 3D poker experience with global competition and no forced ads',
        images: [
          '/projects/fun-texas-holdem/1.png',
          '/projects/fun-texas-holdem/2.png',
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'reinforcement-learning', 'tensorflow', 'game-development', 'game-monetization', 'game-physics'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.luckystargame.texaspoker",
          appStore: "https://apps.apple.com/az/app/fun-texas-hold-em/id1251843403",
          other: [
            {
              name: "Data.ai (Google Play)",
              url: "https://www.data.ai/apps/google-play/app/20600001939343/details",
              description: "App intelligence data on Google Play Store",
              type: "resource"
            }
          ]
        },
        details: [
          'Created immersive 3D Texas Hold\'em Poker game with global competition',
          'Designed stunning 3D graphics with easy-to-navigate interface',
          'Implemented quick and easy gameplay optimized for mobile devices',
          'Built with no forced ads for uninterrupted gaming experience',
          'Created global leaderboards to represent your country in competition',
          'Implemented offline player cloning for practice when offline',
          'Designed daily rewards system with free gems and coins',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers',
          'Implemented advanced AI opponents using Monte Carlo simulation for realistic gameplay behavior',
          'Used reinforcement learning to create AI that adapts to different poker playing styles'
        ]
      },
      {
        id: 'blackjack-showdown',
        title: 'Blackjack Showdown: 21 Duel',
        description: 'Fast-paced Blackjack game with dealer challenges and global competition',
        images: [],
        skills: ['cocos2d', 'javascript', 'typescript', 'nodejs', 'ubuntu', 'google-admob', 'appodeal', 'artificial-intelligence', 'machine-learning', 'game-ai', 'neural-networks', 'tensorflow', 'api-development', 'game-analytics', 'game-monetization', 'push-notifications'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2021-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.cubeage.blackjack.app",
          other: [
            {
              name: "Data.ai (Google Play)",
              url: "https://www.data.ai/apps/google-play/app/20600017273229/details?",
              description: "App intelligence data on Google Play Store",
              type: "resource"
            }
          ]
        },
        details: [
          'Developed fast-paced Blackjack game with challenge against virtual dealer',
          'Created global competition system to represent your country',
          'Designed simple, intuitive interface for on-the-go gaming',
          'Implemented bankruptcy assistance system to keep players in the game',
          'Built vertical design for one-handed play anywhere',
          'Optimized for battery efficiency with power-saving features',
          'Created customizable sound effects and background music',
          'Developed with Cocos2D, JavaScript/TypeScript, Node.js backend',
          'Implemented advanced AI opponents using Monte Carlo simulation for realistic gameplay behavior',
          'Used neural networks to analyze player patterns and create personalized experiences'
        ]
      },
      {
        id: 'fun-mahjong-16-tiles',
        title: 'Fun Mahjong 16 Tiles',
        description: 'Popular Taiwanese Mahjong game with over 1 million downloads featuring a unique offline gameplay experience with 16-tile Mahjong rules',
        images: [
          '/projects/fun-mahjong-16-tiles/1.jpg',
          '/projects/fun-mahjong-16-tiles/2.jpg',
          '/projects/fun-mahjong-16-tiles/3.jpg',
        ],
        skills: ['corona-sdk', 'lua', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'neural-networks', 'offline-first', 'push-notifications'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2013-01-01",
        end_date: undefined, // Still ongoing
        urls: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.cubeage.fmj16.app",
          appStore: "https://apps.apple.com/us/app/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5-%E6%89%8B%E6%A9%9F%E5%8F%B0%E5%BC%8F%E9%BA%BB%E5%B0%87%E6%A8%82%E5%9C%92/id1252568150"
        },
        details: [
          'Led development at Cubeage for this popular Taiwanese Mahjong game with over 1 million downloads',
          'Created a unique offline gameplay experience with 16-tile Mahjong ruleset',
          'Implemented intuitive operation and responsive controls',
          'Designed achievement and mission systems to track progress',
          'Created daily free coin rewards to eliminate paywalls',
          'Built smart tile selection guidance for new players',
          'Implemented game acceleration features for faster gameplay',
          'Reached top 3 in card games in Taiwan, Hong Kong, Malaysia, and Singapore',
          'Developed with Corona SDK, Lua, PHP backend on Ubuntu servers',
          'Implemented advanced AI opponents using Monte Carlo simulation for realistic gameplay behavior',
          'Used neural networks to model player preferences and adapt AI difficulty accordingly'
        ]
      },
      {
        id: 'attack-garbage-man',
        title: 'Attack! Garbage Man!',
        description: 'Unique game combining combat mechanics with slot machine gameplay',
        images: [
          '/projects/attack-garbage-man/1.png',
          '/projects/attack-garbage-man/2.png',
          '/projects/attack-garbage-man/3.png',
          '/projects/attack-garbage-man/4.png',
          '/projects/attack-garbage-man/5.jpg'
          
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'game-development', 'game-analytics', 'shader-programming'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2015-01-01",
        end_date: "2023-12-31",
        details: [
          'Created innovative game combining slot machine mechanics with combat gameplay',
          'Designed unique betting system using \'cans\' instead of coins',
          'Implemented fallback system using gems when cans are depleted',
          'Created global competition leaderboard for highest level and most cans',
          'Designed humorous characters and environments',
          'Implemented special \'dirty attacks\' with spectacular animations',
          'Built simple betting and reward mechanics for accessible gameplay',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers'
        ]
      },
      {
        id: 'blackjack-king',
        title: 'Blackjack King',
        description: 'Classic blackjack card game with competitive gameplay and streamlined interface',
        images: [
          '/projects/blackjack-king/1.png',
          '/projects/blackjack-king/2.png',
          '/projects/blackjack-king/3.png',
          '/projects/blackjack-king/4.png',
          '/projects/blackjack-king/5.png',
          '/projects/blackjack-king/6.png',
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'neural-networks', 'reinforcement-learning', 'tensorflow', 'game-development', 'game-physics', 'shader-programming'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2015-01-01",
        end_date: "2023-12-31",
        details: [
          'Developed classic blackjack card game with competitive gameplay',
          'Designed streamlined interface for quick, intuitive play',
          'Implemented realistic dealer AI for authentic casino experience',
          'Created progression system with increasing stakes and challenges',
          'Built achievement system to track player milestones',
          'Integrated leaderboards for competitive play',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers',
          'Integrated Google AdMob for monetization',
          'Implemented advanced AI opponents using Monte Carlo simulation for realistic gameplay behavior',
          'Used neural networks and reinforcement learning to create a dealer AI that adapts to player strategy'
        ]
      },
      {
        id: 'math-magus',
        title: 'Math Magus',
        description: 'Innovative math puzzle game with unique gameplay and kawaii artwork',
        images: [
          '/projects/math-magus/1.jpg',
          '/projects/math-magus/2.jpg',
          '/projects/math-magus/3.jpg',
          '/projects/math-magus/4.jpg',
          '/projects/math-magus/5.jpg',
          '/projects/math-magus/6.jpg'
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'game-ai', 'game-monetization', 'shader-programming'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: "2023-12-31",
        details: [
          'Created innovative math puzzle game with unique algebra challenges',
          'Designed dynamic background feature that responds to device rotation',
          'Commissioned hand-drawn kawaii artwork from rising Japanese artist',
          'Implemented fast-paced gameplay with brain-challenging math puzzles',
          'Built global ranked leaderboards for competitive play',
          'Created comprehensive in-game activities including quests, achievements, and mini-games',
          'Designed diverse item system to assist players during gameplay',
          'Implemented character progression system with Math Magus raising mechanics',
          'Integrated reward systems including roulette and wishing fountain'
        ]
      },
      {
        id: 'run-garbage-man',
        title: 'Run! Garbage Man!',
        description: 'Endless runner game with humorous garbage theme and obstacle avoidance',
        images: [
          '/projects/run-garbage-man/1.png',
          '/projects/run-garbage-man/2.png',
          '/projects/run-garbage-man/3.png',
          '/projects/run-garbage-man/4.png',
          '/projects/run-garbage-man/5.png',
          '/projects/run-garbage-man/6.jpg',
          
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'game-development', 'game-monetization', 'offline-first', 'push-notifications', 'shader-programming'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: "2017-12-31",
        details: [
          'Developed endless runner game with humorous garbage bag character',
          'Created engaging storyline about garbage bags mysteriously running away',
          'Implemented varied obstacles requiring quick reaction times',
          'Designed power-up and item system to help players progress further',
          'Built global leaderboard for distance competition',
          'Created intuitive tap controls for jumping and sliding',
          'Implemented double-jump mechanics for larger obstacles',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers'
        ]
      },
      {
        id: 'landlord',
        title: '小農尬土豪 (The Landlord)',
        description: 'Popular Chinese card game based on the Fight the Landlord (斗地主) gameplay',
        images: [
          '/projects/landlord/1.png',
          '/projects/landlord/2.png',
          '/projects/landlord/3.png',
          '/projects/landlord/4.png',
          '/projects/landlord/5.png',
          '/projects/landlord/6.png',
          '/projects/landlord/7.png',
          '/projects/landlord/8.png',
          '/projects/landlord/9.png',
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'game-development', 'offline-first'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: "2017-12-31",
        details: [
          'Created popular Chinese card game based on Fight the Landlord (斗地主) mechanics',
          'Designed authentic Chinese aesthetic to complement the gameplay theme',
          'Implemented strategic gameplay featuring farmers versus wealthy landlord',
          'Created humorous equipment and item systems',
          'Designed spectacular card play effects with animations',
          'Built achievement, ranking, and title systems for progression',
          'Created instant matching system for quick gameplay sessions',
          'Implemented streamlined login system requiring no registration',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers',
          'Created adaptive AI that analyzes player strategies and counters accordingly'
        ]
      },
      {
        id: 'spot-the-difference',
        title: '老二來找碴 (Looking For Fault)',
        description: 'Spot the difference game set in an art museum with mystery storyline',
        images: [
          '/projects/spot-the-difference/1.png',
          '/projects/spot-the-difference/2.jpg',
          '/projects/spot-the-difference/3.jpg',
          '/projects/spot-the-difference/4.jpg',
          '/projects/spot-the-difference/5.jpg',
          '/projects/spot-the-difference/6.jpg',
        ],
        skills: ['unity3d', 'csharp', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'push-notifications', 'shader-programming', 'game-development'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: "2021-12-31",
        details: [
          'Developed spot the difference game set in a museum with mysterious art theft storyline',
          'Created engaging narrative about museum artworks being altered overnight',
          'Designed charming characters and immersive museum environments',
          'Incorporated famous artworks for educational value while gaming',
          'Implemented timed challenges testing observation skills',
          'Created special items to assist players with difficult levels',
          'Designed special equipment to provide advantages in gameplay',
          'Developed with Unity3D, C#, PHP backend on Ubuntu servers'
        ]
      },
      {
        id: 'q-mahjong',
        title: 'Ｑ麻將16張',
        description: 'Q-style Mahjong game featuring cat-themed visuals and fast gameplay',
        images: [
          '/projects/q-mahjong/1.png',
          '/projects/q-mahjong/2.jpg',
          '/projects/q-mahjong/3.png',
          '/projects/q-mahjong/4.png',
          '/projects/q-mahjong/5.png',
          '/projects/q-mahjong/6.png',
          '/projects/q-mahjong/7.png',
        ],
        skills: ['corona-sdk', 'lua', 'php', 'ubuntu', 'google-admob', 'google-cloud-service', 'typescript', 'javascript', 'artificial-intelligence', 'machine-learning', 'game-ai', 'monte-carlo-simulation', 'neural-networks', 'reinforcement-learning', 'tensorflow', 'offline-first'],
        category: "Mobile Games",
        related_experience_id: "cubeage",
        start_date: "2014-01-01",
        end_date: "2016-12-31",
        details: [
          'Created first Taiwan Q-style Mahjong game with cat-themed visuals',
          'Designed fast table opening and gameplay with no waiting',
          'Implemented adjustable game speed controlled by player preference',
          'Built intuitive interface with large tiles suitable for all ages',
          'Created comprehensive achievement, mission, and title systems',
          'Implemented smart guidance for moves like eat, pong, kong, and win',
          'Designed free-to-play model with daily coin rewards',
          'Developed with Corona SDK, Lua, PHP backend on Ubuntu servers',
          'Built intelligent AI with advanced pattern recognition for realistic opponent behavior'
        ]
      },
      {
        id: 'oppsdaily',
        title: 'OppsDaily',
        description: 'Medium-like publishing platform with blockchain-based creator rewards and personalized blogging features',
        images: [],
        skills: [
          'vue',
          'mysql', 
          'ubuntu', 
          'typescript', 
          'javascript', 
          'seo', 
          'google-adsense', 
          'firebase-cloud-messaging', 
          'google-analytics',
          'blockchain',
          'responsive-web-design',
          'content-management',
          'frontend-development',
          'api-development'
        ],
        category: "Web Apps",
        related_experience_id: null,
        start_date: "2018-01-01",
        end_date: "2020-12-31",
        details: [
          'Developed a Medium-like content platform using Vue.js and TypeScript',
          'Implemented blockchain-based tipping and reward system for content creators',
          'Created personalized blogging features with customizable profiles',
          'Built comprehensive content management system with drafts and publishing workflow',
          'Integrated Firebase Cloud Messaging for notification delivery',
          'Implemented SEO optimization for better content discovery',
          'Designed revenue sharing model through Google AdSense integration',
          'Deployed and maintained on Ubuntu servers with MySQL database'
        ]
      }
] as const;