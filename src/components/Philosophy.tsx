"use client";

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { FaTools, FaUsers, FaFingerprint, FaRocket, FaCode, FaLightbulb, 
  FaRegSquare, FaLayerGroup, FaGlasses, FaHandPointer, FaRegSmile, 
  FaRecycle, FaCodeBranch, FaBolt, FaMinusCircle, FaFileAlt, 
  FaPalette, FaAlignLeft, FaSwatchbook, FaExpandAlt } from 'react-icons/fa';
import { useModalManager } from '@/hooks/useModalManager';
import { PHILOSOPHY_PRINCIPLES, PhilosophyPrinciple } from '@/data';

// Utility function to get background color class
const getBgColorClass = (colorName: string) => {
  // Pre-define all possible color classes to ensure Tailwind processes them
  const bgColorMap: Record<string, string> = {
    'neutral-800': 'bg-neutral-800',
    'blue-500': 'bg-blue-500',
    'indigo-400': 'bg-indigo-400',
    'emerald-500': 'bg-emerald-500',
    'amber-400': 'bg-amber-400',
    'rose-500': 'bg-rose-500',
    'teal-500': 'bg-teal-500',
    'violet-500': 'bg-violet-500'
  };
  
  return bgColorMap[colorName] || 'bg-gray-500'; // Default fallback
};

// Utility function to get text color class
const getTextColorClass = (colorName: string) => {
  // Pre-define all possible color classes to ensure Tailwind processes them
  const textColorMap: Record<string, string> = {
    'neutral-100': 'text-neutral-100',
    'blue-50': 'text-blue-50',
    'indigo-50': 'text-indigo-50',
    'emerald-50': 'text-emerald-50',
    'amber-50': 'text-amber-50',
    'rose-50': 'text-rose-50',
    'teal-50': 'text-teal-50',
    'violet-50': 'text-violet-50'
  };
  
  return textColorMap[colorName] || 'text-white'; // Default fallback
};

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
  FaFileAlt,
  FaPalette,
  FaAlignLeft,
  FaSwatchbook,
  FaExpandAlt
};

// Simplified philosophy modal
function PhilosophyModal({ 
  principle
}: { 
  principle: PhilosophyPrinciple;
}) {
  // Get the icon component
  const IconComponent = iconMap[principle.icon as keyof typeof iconMap];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className={`${getBgColorClass(principle.colorScheme.bg)} p-6`}>
        <div className="flex items-center mb-3">
          <div className={`${getTextColorClass(principle.colorScheme.text)} mr-4 bg-white/10 p-3 rounded-full`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-light text-white">{principle.title}</h2>
        </div>
        <p className="text-sm text-white/80 pl-12">
          {principle.shortDescription}
        </p>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {principle.category.charAt(0).toUpperCase() + principle.category.slice(1)}
          </span>
          {principle.keyPoints && principle.keyPoints.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {principle.keyPoints[0]}
            </span>
          )}
        </div>
        
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-6">
          {principle.fullDescription}
        </div>
        
        {principle.keyPoints && principle.keyPoints.length > 1 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key aspects
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {principle.keyPoints.slice(1).map((point, i) => (
                <div 
                  key={i}
                  className="flex items-center text-xs text-gray-600 dark:text-gray-400"
                >
                  <span className="w-1.5 h-1.5 mr-2 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        )}
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

  // Organize principles by their categories
  const corePrinciples = PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'core');
  
  const domainPrinciples = {
    "Design": PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'design'),
    "Code & Systems": PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'code'),
    "Approach": PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'approach')
  };

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent, principleId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePrincipleClick(principleId);
    }
  };

  return (
    <div id="philosophy" ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/30">
      <motion.div style={{ opacity, y }} className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-normal text-center mb-4 text-gray-700 dark:text-gray-300">
          guiding principles
        </h2>
        
        {/* Core cross-domain principles - prominently displayed */}
        <div className="mb-16">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700 mr-3"></div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                Core Philosophy
              </h3>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700 ml-3"></div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Universal principles that guide my approach across all domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence>
              {corePrinciples.map((principle, index) => {
                // Get the icon component
                const IconComponent = iconMap[principle.icon as keyof typeof iconMap];
                
                return (
                  <motion.div 
                    key={principle.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex overflow-hidden rounded-xl bg-white dark:bg-gray-800 
                      shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
                      hover:translate-y-[-3px] border border-transparent
                      hover:border-gray-200 dark:hover:border-gray-700`}
                    onClick={() => handlePrincipleClick(principle.id)}
                    onKeyDown={(e) => handleKeyDown(e, principle.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details about ${principle.title}`}
                  >
                    {/* Left colored section with icon */}
                    <div className={`${getBgColorClass(principle.colorScheme.bg)} p-4 flex items-center justify-center`}
                         style={{width: '70px'}}>
                      <div className={`${getTextColorClass(principle.colorScheme.text)} bg-white/10 p-2 rounded-full`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>
                    
                    {/* Right content section */}
                    <div className="p-4 flex-grow">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                          {principle.title}
                        </h3>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          Core
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {principle.shortDescription}
                      </p>
                      
                      {/* Key points - abbreviated */}
                      {principle.keyPoints && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {principle.keyPoints.slice(0, 2).map((point, i) => (
                            <span 
                              key={i} 
                              className="inline-block px-2 py-0.5 text-xs rounded-full 
                              bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            >
                              {point}
                            </span>
                          ))}
                          {principle.keyPoints.length > 2 && (
                            <span className="inline-block px-2 py-0.5 text-xs rounded-full 
                                  bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              +{principle.keyPoints.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Domain heading and decorative divider */}
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-xs font-medium">DOMAIN PRINCIPLES</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        
        {/* Domain-specific principles - more compact display */}
        <div className="space-y-8">
          {Object.entries(domainPrinciples)
            .filter(([, principles]) => principles.length > 0)
            .map(([domain, principles]) => (
              <div key={domain}>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                  {domain}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {principles.map((principle, index) => {
                      // Get the icon component
                      const IconComponent = iconMap[principle.icon as keyof typeof iconMap];
                      
                      return (
                        <motion.div 
                          key={principle.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex overflow-hidden rounded-lg bg-white dark:bg-gray-800 
                            shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer
                            hover:translate-y-[-2px] border border-transparent hover:border-gray-200 
                            dark:hover:border-gray-700"
                          onClick={() => handlePrincipleClick(principle.id)}
                          onKeyDown={(e) => handleKeyDown(e, principle.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`View details about ${principle.title}`}
                        >
                          {/* Compact principle card */}
                          <div className={`${getBgColorClass(principle.colorScheme.bg)} p-3 flex items-center justify-center`}
                               style={{width: '50px'}}>
                            <div className={`${getTextColorClass(principle.colorScheme.text)}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                          </div>
                          
                          <div className="p-3 flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {principle.title}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {principle.shortDescription}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
        </div>
        
        <p className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
          Click on any principle to explore in detail
        </p>
      </motion.div>
    </div>
  );
} 