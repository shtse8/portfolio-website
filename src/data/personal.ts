import type { PersonalInfo } from "./types";

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "AI Infrastructure Builder",
  shortBio:
    "I build the infrastructure AI agents run on — MCP servers and AI-native developer tools. My PDF reader for AI agents has thousands of GitHub stars and tens of thousands of monthly npm downloads; I'm building Sylphx, an AI-native PaaS, plus RAG and semantic-search tooling. 20 years shipping software before this: 10M+ mobile-game downloads (Cubeage), 10M+ monthly players (MiniMax), and Hong Kong's leading gaming portal (Nakuz).",
  email: "hi@kylet.se",
  location: {
    base: "London, UK",
    remote: "Available for remote work",
  },
  social: {
    github: "https://github.com/shtse8",
    linkedin: "https://linkedin.com/in/shtse8",
    stackoverflow: "https://stackoverflow.com/users/4380384/shtse8",
  },
  contactFormSubjects: [
    "Project Inquiry",
    "Job Opportunity",
    "Consultation Request",
    "Open Source Collaboration",
    "Other",
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
    "Shipping at Scale (10M+ users)",
  ],
  tagline:
    "Building the infrastructure AI agents run on — MCP servers & AI-native developer tools",
  roles: [
    "AI Infrastructure Builder",
    "MCP Server Author",
    "AI-Native Platform Builder",
    "Open Source Creator",
    "Technical Founder",
  ],
} as const;
