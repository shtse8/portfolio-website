import { Experience } from './types';

export const EXPERIENCES: Experience[] = [
  {
    id: 'cubeage',
    title: 'Founder and Lead Developer',
    company: 'cubeage',
    period: '2014 - Present',
    location: 'Hong Kong',
    description: 'Founded and led a mobile gaming company specializing in card and casino games with millions of downloads',
    image: '/projects/cubeage.jpg',
    logo: '/companys/cubeage.jpeg',
    skills: ['unity3d', 'gamedev', 'databases', 'team-leadership', 'business-growth', 'csharp', 'ios', 'android', 'java'],
    liveUrl: 'https://cubeage.com',
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
    id: 'minimax',
    title: 'Founder and Lead Developer',
    company: 'minimax',
    period: '2010 - 2014',
    location: 'Hong Kong',
    description: 'Led development at a gaming platform company focusing on game operations and agency distribution in Hong Kong',
    image: '/companys/minimax.jpeg',
    logo: '/companys/minimax.jpeg',
    skills: ['databases', 'team-leadership', 'business-growth', 'php', 'nodejs', 'payment-integration'],
    details: [
      'Led development at MiniMax Game Entertainment Limited, a gaming platform company in Hong Kong',
      'Managed Funimax platform, a well-known game distribution service with physical game cards',
      'Oversaw game operations, distribution, and agency relationships',
      'Implemented payment systems integration for physical and digital purchases',
      'Designed systems to manage game inventory, distribution, and analytics',
      'Built user management and loyalty systems to improve customer retention'
    ]
  },
  {
    id: 'nakuz',
    title: 'Founder and Lead Developer',
    company: 'nakuz',
    period: '2006 - Present',
    location: 'Hong Kong',
    description: 'Designed and developed professional corporate website and business solutions',
    image: '/companys/nakuz.jpeg',
    logo: '/companys/nakuz.jpeg',
    skills: ['react', 'typescript', 'team-leadership', 'nextjs', 'responsive-design', 'seo', 'business-growth'],
    liveUrl: 'https://nakuz.com',
    details: [
      'Designed and developed the corporate website for Nakuz.com Limited',
      'Built with modern technologies including React and Next.js',
      'Implemented responsive design for optimal viewing on all devices',
      'Integrated SEO best practices to improve visibility and organic traffic',
      'Created an intuitive user interface with streamlined navigation'
    ]
  }
] as const; 