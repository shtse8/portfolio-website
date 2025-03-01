"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaTools, FaUsers, FaFingerprint, FaRocket, FaCode, FaLightbulb, 
  FaRegSquare, FaLayerGroup, FaGlasses, FaHandPointer, FaRegSmile, 
  FaRecycle, FaCodeBranch, FaBolt, FaMinusCircle, FaFileAlt } from 'react-icons/fa';
import { useModalManager } from '@/hooks/useModalManager';
import { PHILOSOPHY_PRINCIPLES, PhilosophyPrinciple } from '@/data';

// Map of icon string names to actual icon components
const iconMap = {
  FaTools,
  FaUsers,
  FaFingerprint,
  FaRocket,
  FaCode,
  FaLightbulb,
  FaRegSquare,
  FaLayerGroup,
  FaGlasses,
  FaHandPointer,
  FaRegSmile,
  FaRecycle,
  FaCodeBranch,
  FaBolt,
  FaMinusCircle,
  FaFileAlt
};

// Philosophy modal component with improved spacing and readability
function PhilosophyModal({ 
  principle
}: { 
  principle: PhilosophyPrinciple;
}) {
  // Get the icon component
  const IconComponent = iconMap[principle.icon as keyof typeof iconMap];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className={`${principle.color} p-6 sm:p-8 flex items-center`}>
        <div className={`${principle.textColor} mr-5 bg-white/10 p-3.5 rounded-full`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <h2 className="text-xl md:text-2xl font-light text-white">{principle.title}</h2>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="max-w-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl text-gray-800 dark:text-gray-200 font-light tracking-wide">
              Core principle
            </h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-8">
            <p className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
              {principle.shortDescription}
            </p>
          </div>
          
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg space-y-5">
            {principle.fullDescription.split('. ').map((sentence, i) => (
              sentence ? <p key={i}>{sentence}.</p> : null
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center border-t border-gray-100 dark:border-gray-700 pt-6">
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
  
  // Set up scroll progress animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  // Handle opening a principle modal
  const handlePrincipleClick = (principleId: string) => {
    // Find the principle within the full array
    const currentIndex = PHILOSOPHY_PRINCIPLES.findIndex(p => p.id === principleId);
    
    const goToNext = () => {
      const nextIndex = (currentIndex + 1) % PHILOSOPHY_PRINCIPLES.length;
      handlePrincipleClick(PHILOSOPHY_PRINCIPLES[nextIndex].id);
    };
    
    const goToPrev = () => {
      const prevIndex = (currentIndex - 1 + PHILOSOPHY_PRINCIPLES.length) % PHILOSOPHY_PRINCIPLES.length;
      handlePrincipleClick(PHILOSOPHY_PRINCIPLES[prevIndex].id);
    };
    
    const principle = PHILOSOPHY_PRINCIPLES[currentIndex];
    
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
    <div id="philosophy" ref={sectionRef} className="py-24 px-6 sm:px-8 lg:px-10 bg-gray-50 dark:bg-gray-900/30">
      <motion.div style={{ opacity, y }} className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-normal text-center mb-16 text-gray-700 dark:text-gray-300">
          philosophy
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {PHILOSOPHY_PRINCIPLES.map((principle, index) => {
            // Get the icon component
            const IconComponent = iconMap[principle.icon as keyof typeof iconMap];
            
            // Calculate if this is the last item and needs special centering
            const isLastItem = index === PHILOSOPHY_PRINCIPLES.length - 1;
            const isLastItemAlone = PHILOSOPHY_PRINCIPLES.length % 3 === 1 && isLastItem;
            
            return (
              <motion.div 
                key={principle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className={`flex flex-col items-center text-center cursor-pointer rounded-xl p-5 sm:p-6
                  transition-all duration-200 hover:scale-105 hover:bg-white/50 dark:hover:bg-gray-800/30 
                  hover:shadow-sm relative group ${isLastItemAlone ? 'md:col-start-2' : ''}`}
                onClick={() => handlePrincipleClick(principle.id)}
                onKeyDown={(e) => handleKeyDown(e, principle.id)}
                role="button"
                tabIndex={0}
                aria-label={`View details about ${principle.title}`}
              >
                <div className={principle.color.replace('bg-', 'text-').replace('dark:bg-', 'dark:text-') + " mb-4"}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <p className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">{principle.title}</p>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{principle.shortDescription}</p>
                
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 
                  rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-sm bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-3 py-1.5 rounded">
                    View details
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <p className="text-center mt-16 text-sm md:text-base text-gray-500 dark:text-gray-400">
          Click or press Enter on any principle to learn more
        </p>
      </motion.div>
    </div>
  );
} 