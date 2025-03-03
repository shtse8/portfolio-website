import { PersonalInfo } from './types';

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "Backend Engineer & Game Developer",
  shortBio: "Backend Engineer & Game Developer with 20+ years of experience in distributed systems, blockchain solutions, and AI-driven automation.",
  email: "hi@kylet.se",
  location: {
    base: "Hong Kong & UK",
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
    "Speaking Engagement",
    "Other"
  ],
  portfolioUrl: "https://kylet.se",
  company: "Soti Labs"
} as const; 