import { PersonalInfo } from './types';

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "AI Infrastructure Builder",
  shortBio: "I build the infrastructure AI agents run on — MCP servers and AI-native developer tools. My PDF reader for AI agents passed 800★ and ~24K downloads a month; I'm building Sylphx, an AI-native PaaS, plus RAG and semantic-search tooling. 20 years shipping software before this: 10M+ mobile-game downloads (Cubeage), 10M+ monthly players (MiniMax), and Hong Kong's leading gaming portal (Nakuz).",
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
    "MCP & AI-Agent Tooling",
    "AI-Native Platform Engineering",
    "RAG & Semantic Search",
    "High-Performance TypeScript Libraries",
    "Developer Tools & DX",
    "System Architecture",
    "Full Stack Development",
    "Shipping at Scale (10M+ users)"
  ],
  tagline: "Building the infrastructure AI agents run on — MCP servers & AI-native developer tools",
  roles: [
    "AI Infrastructure Builder",
    "MCP Server Author",
    "AI-Native Platform Builder",
    "Open Source Creator",
    "Technical Founder"
  ]
} as const;

// GitHub statistics for display (live-verified 2026-06-28; non-fork)
export const GITHUB_STATS = {
  username: "shtse8",
  totalStars: 987,
  orgStars: 928,
  totalRepos: 139,
  totalCommits: 4654,
  followers: 42,
  organizations: ["SylphxAI", "Cubeage", "EpiowAI"],
  featuredRepo: {
    name: "pdf-reader-mcp",
    stars: 801,
    description: "MCP server for PDF processing — 24K+ npm downloads/mo"
  },
  achievements: [
    "Arctic Code Vault Contributor",
    "Starstruck x2",
    "Pull Shark x2"
  ]
} as const; 