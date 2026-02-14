import { PersonalInfo } from './types';

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "Technical Founder",
  shortBio: "Serial technical founder with 20 years of experience. Currently building open source MCP tools at Sylphx. Previously built mobile games with 10M+ downloads (Cubeage), social games reaching 10M+ MAU (MiniMax), and Hong Kong's leading gaming portal (Nakuz).",
  email: "hi@kylet.se",
  location: {
    base: "London, UK",
    remote: "Available for remote work"
  },
  social: {
    github: "https://github.com/shtse8",
    linkedin: "https://linkedin.com/in/shtse8",
    stackoverflow: "https://stackoverflow.com/users/4380384/shtse8"
  },
  contactFormSubjects: [
    "Project Inquiry",
    "Job Opportunity",
    "Consultation Request",
    "Open Source Collaboration",
    "Other"
  ],
  portfolioUrl: "https://kylet.se",
  company: "Sylphx",
  specialties: [
    "Open Source Development",
    "High-Performance Libraries",
    "Full Stack Development",
    "Mobile Game Development",
    "AI Tool Development",
    "Blockchain Solutions",
    "System Architecture",
    "TypeScript & Dart Ecosystems"
  ],
  tagline: "Building open source developer tools and shipping products",
  roles: [
    "Technical Founder",
    "Open Source Creator",
    "Full Stack Developer",
    "Game Developer",
    "Framework Author"
  ]
} as const;

// GitHub statistics for display
export const GITHUB_STATS = {
  username: "shtse8",
  totalStars: 171,
  orgStars: 597,
  totalRepos: 119,
  totalCommits: 4654,
  followers: 41,
  organizations: ["SylphxAI", "Cubeage", "EpiowAI"],
  featuredRepo: {
    name: "pdf-reader-mcp",
    stars: 492,
    description: "MCP server for PDF processing"
  },
  achievements: [
    "Arctic Code Vault Contributor",
    "Starstruck x2",
    "Pull Shark x2"
  ]
} as const; 