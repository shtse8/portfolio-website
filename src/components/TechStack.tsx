"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import SkillCloudView from './skills/cloud/SkillCloudView';
import { SKILLS } from '@/data/portfolioData';

export default function TechStack() {
  const [totalSkills, setTotalSkills] = useState(0);
  const [experienceYears, setExperienceYears] = useState(0);
  const [categories, setCategories] = useState(0);
  const [expertise, setExpertise] = useState<{[key: string]: number}>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Set up scroll progress animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  useEffect(() => {
    // Calculate statistics
    setTotalSkills(SKILLS.length);
    
    // Get unique categories count
    const uniqueCategories = new Set(SKILLS.map(skill => skill.category));
    setCategories(uniqueCategories.size);
    
    // Find max years of experience
    const maxYears = Math.max(...SKILLS.map(skill => skill.yearsOfExperience));
    setExperienceYears(maxYears);
    
    // Calculate expertise by category
    const expertiseByCategory: {[key: string]: number} = {};
    SKILLS.forEach(skill => {
      if (!expertiseByCategory[skill.category]) {
        expertiseByCategory[skill.category] = 0;
      }
      
      expertiseByCategory[skill.category] += skill.yearsOfExperience;
    });
    
    setExpertise(expertiseByCategory);
  }, []);

  // Calculate the top 3 categories by total years
  const topCategories = Object.entries(expertise)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat);

  return (
    <motion.div
      ref={sectionRef}
      className="w-full relative py-12 md:py-24 overflow-hidden"
      style={{ opacity, y }}
    >
      {/* Optional tech-themed background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none -z-10">
        <div className="h-full w-full flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      {/* Section header */}
      <div className="container mx-auto mb-12">
        <motion.div 
          className="max-w-3xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Technical <span className="text-primary-600 dark:text-primary-400">Expertise</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-8 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            With expertise across {topCategories.join(', ')}, and {categories - 3} other domains, 
            I bring {experienceYears}+ years of technical experience to build robust, scalable solutions.
          </motion.p>
          
          {/* Animated divider */}
          <motion.div 
            className="w-24 h-1 bg-primary-500 mx-auto rounded-full mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Stats section */}
      <div className="container mx-auto mb-16">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.p 
              className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {totalSkills}+
            </motion.p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">Technologies</p>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.p 
              className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {categories}
            </motion.p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">Skill Categories</p>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.p 
              className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {experienceYears}+
            </motion.p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">Years Experience</p>
          </motion.div>
        </div>
      </div>

      {/* Inner container with skill cloud visualization */}
      <div className="container mx-auto">
        <SkillCloudView />
      </div>
      
      {/* Scroll progress indicator */}
      <motion.div 
        className="fixed right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gray-200 dark:bg-gray-800 rounded-full hidden md:block"
        style={{
          scaleY: scrollYProgress,
          transformOrigin: "top"
        }}
      />
    </motion.div>
  );
} 