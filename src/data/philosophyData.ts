/**
 * Types for Philosophy principles data
 */
export type PhilosophyPrinciple = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string; // Icon name from react-icons/fa
  color: string;
  textColor: string;
};

/**
 * Philosophy principles data
 */
export const PHILOSOPHY_PRINCIPLES: PhilosophyPrinciple[] = [
  {
    id: 'tools',
    title: 'right tools',
    shortDescription: 'foundation of great products',
    fullDescription: 'Choosing the right tools is fundamental to building exceptional products. I carefully select technologies that align with project goals, team expertise, and long-term scalability. By leveraging modern frameworks, libraries, and development tools, I ensure efficiency while maintaining code quality. The right tools reduce complexity, improve collaboration, and create a solid foundation for innovation.',
    icon: 'FaTools',
    color: 'bg-blue-500 dark:bg-blue-600',
    textColor: 'text-blue-100'
  },
  {
    id: 'speed',
    title: 'speed matters',
    shortDescription: 'accelerated by AI and automation',
    fullDescription: 'Development velocity is a competitive advantage in today\'s fast-paced technology landscape. I embrace AI-assisted development, automation, and efficient workflows to deliver high-quality results quickly. This approach allows for rapid prototyping, iterative improvements, and responsive adaptation to changing requirements. Speed doesn\'t mean cutting corners—it means strategically using technology to enhance productivity while maintaining excellence.',
    icon: 'FaRocket',
    color: 'bg-green-500 dark:bg-green-600',
    textColor: 'text-green-100'
  },
  {
    id: 'open',
    title: 'open code',
    shortDescription: 'transparency builds trust',
    fullDescription: 'Open and transparent code is essential for building trust and fostering collaboration. I write clean, well-documented code that others can easily understand and contribute to. This philosophy extends to embracing open-source technologies and giving back to the developer community. By sharing knowledge and solutions, we collectively elevate the quality of software development and create more robust, innovative products.',
    icon: 'FaCode',
    color: 'bg-teal-500 dark:bg-teal-600',
    textColor: 'text-teal-100'
  },
  {
    id: 'users',
    title: 'users first',
    shortDescription: 'technology exists to serve people',
    fullDescription: 'Technology should enhance human experiences, not complicate them. I approach every project with a deep focus on user needs, preferences, and pain points. This user-centric philosophy informs decisions about features, interfaces, and interactions. By prioritizing accessibility, usability, and meaningful functionality, I create solutions that genuinely improve lives and deliver value. Ultimately, even the most advanced technology is only successful if it serves people effectively.',
    icon: 'FaUsers',
    color: 'bg-amber-500 dark:bg-amber-600',
    textColor: 'text-amber-100'
  },
  {
    id: 'personalized',
    title: 'personalized',
    shortDescription: 'we are all different',
    fullDescription: 'Each user brings unique preferences, needs, and contexts to their interactions with technology. I believe in designing systems that adapt to individual differences rather than forcing uniformity. This means implementing customization options, responsive designs, and intelligent defaults that respect diverse use cases. By acknowledging and accommodating human variety, we create more inclusive, satisfying, and effective digital experiences that resonate on a personal level.',
    icon: 'FaFingerprint',
    color: 'bg-indigo-500 dark:bg-indigo-600',
    textColor: 'text-indigo-100'
  },
  {
    id: 'invisible',
    title: 'invisible design',
    shortDescription: 'intuitive and unobtrusive',
    fullDescription: 'The best design often goes unnoticed because it works so naturally that users barely perceive it. I strive to create interfaces and experiences that feel intuitive, reducing cognitive load and learning curves. This means thoughtful information architecture, consistent patterns, and anticipatory design that solves problems before users even recognize them. By making technology fade into the background, we allow people to focus on their goals rather than the tools they\'re using to achieve them.',
    icon: 'FaLightbulb',
    color: 'bg-purple-500 dark:bg-purple-600',
    textColor: 'text-purple-100'
  }
]; 