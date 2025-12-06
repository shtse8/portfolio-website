import { Company } from './types';

export const COMPANIES: Record<string, Company> = {
  "sylphx": {
    id: "sylphx",
    name: "Sylphx Limited",
    description: "Open source AI tools company democratizing AI through elegant, high-performance code",
    logo: "/companys/sylphx.png",
    website: "https://sylphx.com",
    location: "United Kingdom",
    industry: "AI & Open Source",
    size: "1-10 employees"
  },
  "epiow": {
    id: "epiow",
    name: "Epiow Limited",
    description: "Leading AI application development company specializing in enterprise solutions",
    logo: "/companys/epiow.png",
    website: "https://epiow.com",
    location: "United Kingdom",
    industry: "Enterprise AI",
    size: "1-10 employees"
  },
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