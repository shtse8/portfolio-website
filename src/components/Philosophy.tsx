"use client";

import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState } from 'react';
import { 
  FaTools, FaUsers, FaFingerprint, FaRocket, FaCode, FaLightbulb, 
  FaRegSquare, FaLayerGroup, FaGlasses, FaHandPointer, FaRegSmile, 
  FaRecycle, FaCodeBranch, FaBolt, FaMinusCircle, FaFileAlt, 
  FaPalette, FaAlignLeft, FaSwatchbook, FaExpandAlt, FaArrowRight
} from 'react-icons/fa';
import { useModalManager } from '@/hooks/useModalManager';
import { PHILOSOPHY_PRINCIPLES, PhilosophyPrinciple } from '@/data';
import { cn } from '@/lib/utils';

/**
 * Color mapping utilities with type safety
 */
type ColorKey = string;
type ColorMapping = Record<ColorKey, string>;

const bgColorMap: ColorMapping = {
  'neutral-800': 'bg-neutral-800',
  'blue-500': 'bg-blue-500',
  'indigo-400': 'bg-indigo-400',
  'emerald-500': 'bg-emerald-500',
  'amber-400': 'bg-amber-400',
  'rose-500': 'bg-rose-500',
  'teal-500': 'bg-teal-500',
  'violet-500': 'bg-violet-500',
  'yellow-500': 'bg-yellow-500',
  'green-600': 'bg-green-600',
  'cyan-600': 'bg-cyan-600',
  'blue-400': 'bg-blue-400'
};

const textColorMap: ColorMapping = {
  'neutral-100': 'text-neutral-100',
  'blue-50': 'text-blue-50',
  'indigo-50': 'text-indigo-50',
  'emerald-50': 'text-emerald-50',
  'amber-50': 'text-amber-50',
  'rose-50': 'text-rose-50',
  'teal-50': 'text-teal-50',
  'violet-50': 'text-violet-50',
  'yellow-50': 'text-yellow-50',
  'green-50': 'text-green-50',
  'cyan-50': 'text-cyan-50'
};

const getBgColorClass = (colorName: string): string => 
  bgColorMap[colorName] || 'bg-gray-500';

const getTextColorClass = (colorName: string): string => 
  textColorMap[colorName] || 'text-white';

/**
 * Icon mapping with proper TypeScript typing
 */
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
} as const;

/**
 * Component Interfaces
 */
interface PhilosophyModalProps {
  principle: PhilosophyPrinciple;
}

// Background elements with interactive particles
const PhilosophyBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900/80 dark:to-blue-950/20"></div>
    
    {/* Abstract patterns */}
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="philosophyGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#philosophyGrid)" />
      </svg>
    </div>
    
    {/* Floating accent elements */}
    <motion.div 
      className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-500/5 dark:bg-blue-400/5 blur-3xl"
      animate={{
        y: [0, 20, 0],
        x: [0, -10, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-violet-400/5 dark:bg-violet-500/5 blur-3xl"
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  </div>
);

/**
 * Philosophy principle modal for detailed view
 */
function PhilosophyModal({ principle }: PhilosophyModalProps) {
  const IconComponent = iconMap[principle.icon as keyof typeof iconMap];

  return (
    <div className="bg-white/90 dark:bg-gray-800/80 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
      <div className={cn("p-6", getBgColorClass(principle.colorScheme.bg))}>
        <div className="flex items-center mb-4">
          <motion.div 
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={cn("mr-4 p-3 rounded-full", getTextColorClass(principle.colorScheme.text))}
          >
            <div className="bg-white/10 p-3 rounded-full">
              <IconComponent className="h-6 w-6" aria-hidden="true" />
            </div>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
            {principle.title}
          </h2>
        </div>
        <p className="text-base text-white/90 pl-14 font-light italic">
          &ldquo;{principle.shortDescription}&rdquo;
        </p>
      </div>
      
      <div className="p-8 md:p-10">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100/70 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-light">
            {principle.category.charAt(0).toUpperCase() + principle.category.slice(1)}
          </span>
          {principle.keyPoints?.slice(0, 1).map((point, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full bg-gray-100/70 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-light">
              {point}
            </span>
          ))}
        </div>
        
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-8 font-light">
          {principle.fullDescription}
        </div>
        
        {principle.keyPoints && principle.keyPoints.length > 1 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-base font-normal text-gray-900 dark:text-gray-200 mb-4">
              Key aspects:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {principle.keyPoints.map((point, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start text-sm text-gray-600 dark:text-gray-400 font-light"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mr-3 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{i+1}</span>
                  </span>
                  {point}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * New creative visualization of philosophy principles
 */
export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { open } = useModalManager();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  // Organize principles by categories
  const { corePrinciples, categorizedPrinciples } = useMemo(() => {
    return {
      corePrinciples: PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'core'),
      categorizedPrinciples: {
        design: PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'design'),
        code: PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'code'), 
        approach: PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'approach')
      }
    };
  }, []);

  // Handle opening a principle modal
  const handlePrincipleClick = (principleId: string): void => {
    const currentIndex = PHILOSOPHY_PRINCIPLES.findIndex(p => p.id === principleId);
    
    const goToNext = (): void => {
      const nextIndex = (currentIndex + 1) % PHILOSOPHY_PRINCIPLES.length;
      handlePrincipleClick(PHILOSOPHY_PRINCIPLES[nextIndex].id);
    };
    
    const goToPrev = (): void => {
      const prevIndex = (currentIndex - 1 + PHILOSOPHY_PRINCIPLES.length) % PHILOSOPHY_PRINCIPLES.length;
      handlePrincipleClick(PHILOSOPHY_PRINCIPLES[prevIndex].id);
    };
    
    const principle = PHILOSOPHY_PRINCIPLES[currentIndex];
    
    open(
      <PhilosophyModal principle={principle} />,
      {
        hasNavigation: true,
        onNext: goToNext,
        onPrevious: goToPrev,
        modalKey: principleId,
        size: 'lg'
      }
    );
  };

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <section 
      id="philosophy" 
      ref={sectionRef} 
      className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden"
      aria-labelledby="philosophy-heading"
    >
      <PhilosophyBackground />
      
      <motion.div 
        style={{ opacity, y }} 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Section Title */}
        <div className="mb-20 relative">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute -top-14 -left-6 w-24 h-24 rounded-full border border-blue-200/50 dark:border-blue-700/30"
          />
          
          <motion.h2 
            id="philosophy-heading" 
            className="text-4xl md:text-5xl font-extralight mb-3 text-gray-800 dark:text-gray-200 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            philosophical<span className="text-blue-600 dark:text-blue-400"> approach</span>
          </motion.h2>
          
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-lg font-light max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            The guiding principles that influence my thinking across design, development, and problem-solving.
          </motion.p>
        </div>
        
        {/* Core Philosophy Centerpiece */}
        <div className="mb-24">
          <div className="flex flex-col items-center">
            <motion.div 
              className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600 mb-10 flex items-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-gray-500 dark:text-gray-400 text-xs tracking-widest uppercase font-medium">Core</span>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 max-w-6xl">
              {corePrinciples.map((principle, i) => (
                <motion.div 
                  key={principle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="flex flex-col"
                >
                  <div className="mb-4 flex items-center">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center mr-4",
                      getBgColorClass(principle.colorScheme.bg)
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center bg-white/10",
                        getTextColorClass(principle.colorScheme.text)
                      )}>
                        {React.createElement(iconMap[principle.icon as keyof typeof iconMap], {
                          className: "w-5 h-5"
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-1">
                        {principle.title}
                      </h3>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        {principle.shortDescription}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-20 relative">
                    <div className="absolute left-7 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-base font-light mb-4">
                      {principle.fullDescription.split(' ').slice(0, 30).join(' ')}...
                    </p>
                    <button 
                      onClick={() => handlePrincipleClick(principle.id)}
                      className={cn(
                        "inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
                        i % 2 === 0 ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {i % 2 === 0 ? (
                        <>Read more <FaArrowRight className="mr-2 w-3 h-3" /></>
                      ) : (
                        <>Read more <FaArrowRight className="ml-2 w-3 h-3" /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Thought Constellations - Domain Specific Principles */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-2">
              Domain Specializations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
              These principles take core philosophies and apply them to specific domains of practice.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(categorizedPrinciples).map((category) => (
              <motion.button
                key={category}
                onClick={() => toggleCategory(category)}
                className={cn(
                  "px-5 py-2 rounded-full font-light text-sm transition-all",
                  activeCategory === category 
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-200 shadow-sm" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
          
          {/* Domain principles visualization */}
          <div className="constellation-container">
            <AnimatePresence mode="wait">
              {activeCategory ? (
                <motion.div 
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="domain-principles"
                >
                  <div className="relative py-10 px-4">
                    <div className="absolute top-0 left-1/2 w-px h-full bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
                    
                    <div className="max-w-4xl mx-auto space-y-16">
                      {categorizedPrinciples[activeCategory as keyof typeof categorizedPrinciples].map((principle, i) => (
                        <motion.div 
                          key={principle.id}
                          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15, duration: 0.5 }}
                          className={cn(
                            "flex relative",
                            i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                          )}
                        >
                          {/* Timeline node */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className={cn(
                              "w-14 h-14 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900",
                              getBgColorClass(principle.colorScheme.bg)
                            )}>
                              {React.createElement(iconMap[principle.icon as keyof typeof iconMap], {
                                className: cn("w-6 h-6", getTextColorClass(principle.colorScheme.text))
                              })}
                            </div>
                          </div>
                          
                          {/* Content card */}
                          <div className={cn(
                            "w-5/12 p-6 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm",
                            "border border-gray-100 dark:border-gray-700",
                            i % 2 === 0 ? "text-right mr-auto" : "text-left ml-auto"
                          )}>
                            <h4 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-2">
                              {principle.title}
                            </h4>
                            <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-3">
                              {principle.shortDescription}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-light">
                              {principle.fullDescription.split(' ').slice(0, 20).join(' ')}...
                            </p>
                            <div className="mt-3">
                              <button 
                                onClick={() => handlePrincipleClick(principle.id)}
                                className={cn(
                                  "inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
                                  i % 2 === 0 ? "flex-row-reverse" : "flex-row"
                                )}
                              >
                                {i % 2 === 0 ? (
                                  <>Read more <FaArrowRight className="mr-2 w-3 h-3" /></>
                                ) : (
                                  <>Read more <FaArrowRight className="ml-2 w-3 h-3" /></>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="select-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-lg font-light italic"
                >
                  Select a domain to explore specific principles
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Philosophy Synthesis */}
        <motion.div 
          className="mt-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-3">
              Philosophical Synthesis
            </h3>
            <div className="w-20 h-1 bg-blue-600/30 dark:bg-blue-600/20 mx-auto"></div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-lg font-light mb-6">
            These principles don&apos;t exist in isolation—they form an interconnected philosophy where each concept reinforces and balances the others. The focus on minimalism is tempered by user-centricity, efficiency is guided by clarity, and systematic thinking supports adaptability.
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 text-base font-light">
            Together, they create a holistic approach to technology that prioritizes human needs while embracing technical excellence.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
} 