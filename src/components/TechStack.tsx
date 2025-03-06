"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import SkillCloudView from './skills/cloud/SkillCloudView';
import { getSkills } from '@/data/skills';

export default function TechStack() {
  const [totalSkills, setTotalSkills] = useState(0);
  const [categories, setCategories] = useState(0);
  const [experienceYears, setExperienceYears] = useState(0);
  const [expertise, setExpertise] = useState<{[key: string]: number}>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const skills = getSkills();
  
  // Set up scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  // Calculate statistics from skills data
  useEffect(() => {
    if (!skills || skills.length === 0) return;
    
    // Calculate total skills
    setTotalSkills(skills.length);
    
    // Get unique categories count
    const uniqueCategories = new Set(skills.map(skill => skill.category));
    setCategories(uniqueCategories.size);
    
    // Find max years of experience
    const maxYears = Math.max(...skills.map(skill => skill.yearsOfExperience));
    setExperienceYears(maxYears);
    
    // Calculate expertise by category
    const expertiseByCategory: Record<string, number> = {};
    skills.forEach((skill) => {
      if (!expertiseByCategory[skill.category]) {
        expertiseByCategory[skill.category] = 0;
      }
      
      expertiseByCategory[skill.category] += skill.yearsOfExperience;
    });
    
    setExpertise(expertiseByCategory);
  }, [skills]);

  // Get the top 3 categories by total years
  const topCategories = Object.entries(expertise)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat);

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1, 
      y: 0,
      transition: {
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: 80, 
      transition: { 
        duration: 0.8, 
        delay: 0.3 
      } 
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (delay = 0) => ({
      opacity: 1, 
      scale: 1,
      transition: {
        delay,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <motion.section
      id="tech-stack"
      ref={sectionRef}
      className="w-full relative py-12 md:py-20 overflow-hidden"
      style={{ opacity, y }}
      aria-labelledby="skills-heading"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none -z-10"
        aria-hidden="true"
      >
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
      <div className="container mx-auto mb-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            id="skills-heading"
            className="text-2xl sm:text-3xl font-light mb-5 tracking-wide"
            custom={0}
            variants={fadeInVariants}
          >
            Technical <span className="text-blue-600 dark:text-blue-400">Expertise</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-6 text-base sm:text-lg font-light"
            custom={0.1}
            variants={fadeInVariants}
          >
            With expertise across {topCategories.join(', ')}, and {categories - 3} other domains, 
            I bring {experienceYears}+ years of technical experience to build robust, scalable solutions.
          </motion.p>
          
          {/* Divider */}
          <motion.div 
            className="w-20 h-0.5 bg-blue-500 dark:bg-blue-400 mx-auto rounded-full mb-10"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
        </motion.div>
      </div>

      {/* Stats section */}
      <div className="container mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-4">
          {/* Total Technologies */}
          <motion.div 
            className="text-center"
            custom={0.2}
            variants={statVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-3xl sm:text-4xl font-light text-blue-600 dark:text-blue-400"
              custom={0.25}
              variants={fadeInVariants}
            >
              {totalSkills}+
            </motion.p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 font-light">Technologies</p>
          </motion.div>
          
          {/* Skill Categories */}
          <motion.div 
            className="text-center"
            custom={0.3}
            variants={statVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-3xl sm:text-4xl font-light text-blue-600 dark:text-blue-400"
              custom={0.35}
              variants={fadeInVariants}
            >
              {categories}
            </motion.p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 font-light">Skill Categories</p>
          </motion.div>
          
          {/* Years Experience */}
          <motion.div 
            className="text-center"
            custom={0.4}
            variants={statVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-3xl sm:text-4xl font-light text-blue-600 dark:text-blue-400"
              custom={0.45}
              variants={fadeInVariants}
            >
              {experienceYears}+
            </motion.p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 font-light">Years Experience</p>
          </motion.div>
        </div>
      </div>

      {/* Skill cloud visualization */}
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
        aria-hidden="true"
      />
    </motion.section>
  );
} 