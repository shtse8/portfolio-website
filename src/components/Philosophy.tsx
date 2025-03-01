"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaTools, FaUsers, FaFingerprint, FaRocket, FaCode, FaLightbulb } from 'react-icons/fa';
import { useModalManager } from '@/hooks/useModalManager';

// Define the structure for philosophy principles
type PhilosophyPrinciple = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
};

// Philosophy modal component
function PhilosophyModal({ 
  principle
}: { 
  principle: PhilosophyPrinciple;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className={`${principle.color} p-6 flex items-center`}>
        <div className={`${principle.textColor} mr-4 bg-white/10 p-3 rounded-full`}>
          {principle.icon}
        </div>
        <h2 className="text-xl md:text-2xl font-light text-white">{principle.title}</h2>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="max-w-none">
          <h3 className="text-lg text-gray-800 dark:text-gray-200 font-light mb-5 tracking-wide">
            Core principle
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {principle.shortDescription}
            </p>
          </div>
          
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base space-y-4">
            {principle.fullDescription.split('. ').map((sentence, i) => (
              sentence ? <p key={i}>{sentence}.</p> : null
            ))}
          </div>
        </div>
        
        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center border-t border-gray-100 dark:border-gray-700 pt-5">
          <span className="inline-flex items-center">
            <span className="mr-2">←</span> 
            Navigate between principles
            <span className="ml-2">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { open } = useModalManager();
  
  // Define principles data
  const principles: PhilosophyPrinciple[] = [
    {
      id: 'tools',
      title: 'right tools',
      shortDescription: 'foundation of great products',
      fullDescription: 'Choosing the right tools is fundamental to building exceptional products. I carefully select technologies that align with project goals, team expertise, and long-term scalability. By leveraging modern frameworks, libraries, and development tools, I ensure efficiency while maintaining code quality. The right tools reduce complexity, improve collaboration, and create a solid foundation for innovation.',
      icon: <FaTools className="h-5 w-5" />,
      color: 'bg-blue-500 dark:bg-blue-600',
      textColor: 'text-blue-100'
    },
    {
      id: 'speed',
      title: 'speed matters',
      shortDescription: 'accelerated by AI and automation',
      fullDescription: 'Development velocity is a competitive advantage in today\'s fast-paced technology landscape. I embrace AI-assisted development, automation, and efficient workflows to deliver high-quality results quickly. This approach allows for rapid prototyping, iterative improvements, and responsive adaptation to changing requirements. Speed doesn\'t mean cutting corners—it means strategically using technology to enhance productivity while maintaining excellence.',
      icon: <FaRocket className="h-5 w-5" />,
      color: 'bg-green-500 dark:bg-green-600',
      textColor: 'text-green-100'
    },
    {
      id: 'open',
      title: 'open code',
      shortDescription: 'transparency builds trust',
      fullDescription: 'Open and transparent code is essential for building trust and fostering collaboration. I write clean, well-documented code that others can easily understand and contribute to. This philosophy extends to embracing open-source technologies and giving back to the developer community. By sharing knowledge and solutions, we collectively elevate the quality of software development and create more robust, innovative products.',
      icon: <FaCode className="h-5 w-5" />,
      color: 'bg-teal-500 dark:bg-teal-600',
      textColor: 'text-teal-100'
    },
    {
      id: 'users',
      title: 'users first',
      shortDescription: 'technology exists to serve people',
      fullDescription: 'Technology should enhance human experiences, not complicate them. I approach every project with a deep focus on user needs, preferences, and pain points. This user-centric philosophy informs decisions about features, interfaces, and interactions. By prioritizing accessibility, usability, and meaningful functionality, I create solutions that genuinely improve lives and deliver value. Ultimately, even the most advanced technology is only successful if it serves people effectively.',
      icon: <FaUsers className="h-5 w-5" />,
      color: 'bg-amber-500 dark:bg-amber-600',
      textColor: 'text-amber-100'
    },
    {
      id: 'personalized',
      title: 'personalized',
      shortDescription: 'we are all different',
      fullDescription: 'Each user brings unique preferences, needs, and contexts to their interactions with technology. I believe in designing systems that adapt to individual differences rather than forcing uniformity. This means implementing customization options, responsive designs, and intelligent defaults that respect diverse use cases. By acknowledging and accommodating human variety, we create more inclusive, satisfying, and effective digital experiences that resonate on a personal level.',
      icon: <FaFingerprint className="h-5 w-5" />,
      color: 'bg-indigo-500 dark:bg-indigo-600',
      textColor: 'text-indigo-100'
    },
    {
      id: 'invisible',
      title: 'invisible design',
      shortDescription: 'intuitive and unobtrusive',
      fullDescription: 'The best design often goes unnoticed because it works so naturally that users barely perceive it. I strive to create interfaces and experiences that feel intuitive, reducing cognitive load and learning curves. This means thoughtful information architecture, consistent patterns, and anticipatory design that solves problems before users even recognize them. By making technology fade into the background, we allow people to focus on their goals rather than the tools they\'re using to achieve them.',
      icon: <FaLightbulb className="h-5 w-5" />,
      color: 'bg-purple-500 dark:bg-purple-600',
      textColor: 'text-purple-100'
    }
  ];
  
  // Set up scroll progress animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  // Handle opening a principle modal
  const handlePrincipleClick = (principleId: string) => {
    const currentIndex = principles.findIndex(p => p.id === principleId);
    
    const goToNext = () => {
      const nextIndex = (currentIndex + 1) % principles.length;
      handlePrincipleClick(principles[nextIndex].id);
    };
    
    const goToPrev = () => {
      const prevIndex = (currentIndex - 1 + principles.length) % principles.length;
      handlePrincipleClick(principles[prevIndex].id);
    };
    
    const principle = principles[currentIndex];
    
    open(
      <PhilosophyModal
        principle={principle}
      />,
      {
        hasNavigation: true,
        onNext: goToNext,
        onPrevious: goToPrev,
        modalKey: principleId,
        size: 'md'
      }
    );
  };

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent, principleId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePrincipleClick(principleId);
    }
  };

  return (
    <div id="philosophy" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/30">
      <motion.div style={{ opacity, y }} className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-normal text-center mb-16 text-gray-700 dark:text-gray-300">
          philosophy
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <motion.div 
              key={principle.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center cursor-pointer rounded-xl p-4 
                transition-all duration-200 hover:scale-105 hover:bg-white/50 dark:hover:bg-gray-800/30 
                hover:shadow-sm relative group"
              onClick={() => handlePrincipleClick(principle.id)}
              onKeyDown={(e) => handleKeyDown(e, principle.id)}
              role="button"
              tabIndex={0}
              aria-label={`View details about ${principle.title}`}
            >
              <div className={principle.color.replace('bg-', 'text-').replace('dark:bg-', 'dark:text-') + " mb-3"}>
                {principle.icon}
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{principle.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{principle.shortDescription}</p>
              
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 
                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-2 py-1 rounded">
                  View details
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center mt-12 text-xs text-gray-500 dark:text-gray-400">
          Click or press Enter on any principle to learn more
        </p>
      </motion.div>
    </div>
  );
} 