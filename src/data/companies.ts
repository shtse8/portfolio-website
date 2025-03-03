import { Company } from './types';

export const COMPANIES: Record<string, Company> = {
  "cubeage": {
    id: "cubeage",
    name: "Cubeage Limited",
    description: "Mobile gaming company specializing in card and casino games with millions of downloads",
    logo: "/companys/cubeage.jpeg",
    website: "https://cubeage.com",
    location: "Hong Kong",
    industry: "Game Development",
    size: "10-50 employees"
  },
  "nakuz": {
    id: "nakuz",
    name: "Nakuz.com Limited",
    description: "Web development and gaming media company",
    logo: "/companys/nakuz.jpeg",
    website: "https://nakuz.com",
    location: "Hong Kong",
    industry: "Digital Media",
    size: "10-50 employees"
  },
  "minimax": {
    id: "minimax",
    name: "MiniMax Game Entertainment Limited",
    description: "Gaming platform and distribution company",
    logo: "/companys/minimax.jpeg",
    website: "https://funimax.com",
    location: "Hong Kong",
    industry: "Game Distribution",
    size: "10-50 employees"
  }
} as const; 