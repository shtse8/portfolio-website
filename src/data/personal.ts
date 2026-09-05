import type { PersonalInfo } from "./types";

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "AI Infrastructure Builder",
  shortBio:
    "I build the infrastructure AI agents run on — MCP servers and AI-native developer tools. Flagship pdf-reader-mcp and live GitHub/npm figures are instruments on this site. Career since 2006 (Nakuz, MiniMax, Cubeage, Epiow, Sylphx) is on Story as self-attested historical pedigree, not live GitHub/npm.",
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
    "Shipping at scale (self-attested Cubeage / MiniMax pedigree)",
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

export const SITE_DESCRIPTION = `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} builds the infrastructure AI agents run on — MCP servers and AI-native developer tools, including pdf-reader-mcp, plus Sylphx (AI-native PaaS). Live GitHub/npm proof on kylet.se; career history on /story (self-attested historical pedigree).`;
