import { PersonalInfo } from './types';

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "Technical Founder & Full Stack Developer",
  shortBio: "Founder of Sylphx and Epiow (UK), building high-performance open source AI tools. 18+ years of experience spanning web development, mobile games (10M+ downloads), blockchain solutions, and AI integration. Creator of pdf-reader-mcp (348+ stars) and multiple TypeScript/Dart frameworks.",
  email: "hi@kylet.se",
  location: {
    base: "London & Hong Kong",
    remote: "Available for remote work worldwide"
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
    "Speaking Engagement",
    "Other"
  ],
  portfolioUrl: "https://kylet.se",
  company: "Sylphx & Epiow",
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
  tagline: "Building high-performance open source tools and digital experiences",
  roles: [
    "Technical Founder",
    "Open Source Creator",
    "Full Stack Developer",
    "Game Developer",
    "Framework Author",
    "AI Tool Builder"
  ]
} as const;

// GitHub statistics for display
export const GITHUB_STATS = {
  username: "shtse8",
  totalStars: 500,
  totalRepos: 106,
  totalCommits: 4654,
  followers: 37,
  organizations: ["SylphxAI", "Cubeage", "EpiowAI"],
  featuredRepo: {
    name: "pdf-reader-mcp",
    stars: 348,
    description: "Production-ready MCP server for PDF processing"
  },
  achievements: [
    "Arctic Code Vault Contributor",
    "Starstruck x2",
    "Pull Shark x2"
  ]
} as const; 