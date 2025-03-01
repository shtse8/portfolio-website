"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as d3Cloud from 'd3-cloud';
import { SKILLS, PROJECTS } from '@/data/portfolioData';
import { motion, useInView } from 'framer-motion';
import { useTheme } from 'next-themes';

interface SkillCloudProps {
  onSkillClick: (skillId: string) => void;
  activeCategory: string | null;
}

interface CloudWord {
  text: string;
  size: number;
  id: string;
  color: string;
  projectCount: number; // Number of projects using this skill
  weight: number;
  opacity: number; // Base opacity based on project count
  category: string;
  isActive: boolean; // Whether this skill belongs to the active category
  x?: number;
  y?: number;
  rotate?: number;
}

const SkillCloud: React.FC<SkillCloudProps> = ({ onSkillClick, activeCategory }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [words, setWords] = useState<CloudWord[]>([]);
  const [cloudGenerated, setCloudGenerated] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 }); // Trigger sooner (10% visibility)
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Count projects for each skill
  const getProjectCountForSkill = (skillId: string): number => {
    return PROJECTS.filter(project => project.skills.includes(skillId)).length;
  };

  // Process skills data for cloud visualization (only once)
  useEffect(() => {
    if (words.length === 0) {
      // Initial creation of all words
      const processedWords = SKILLS.map(skill => {
        const projectCount = getProjectCountForSkill(skill.id);
        return {
          text: skill.name,
          size: getWordSize(skill.id, projectCount),
          id: skill.id,
          color: skill.color.replace('text-', ''),
          projectCount: projectCount,
          weight: Math.log(projectCount + 1) * 10, // Scale for better visual distribution
          opacity: getOpacityByProjectCount(projectCount), // Set base opacity by project count
          category: skill.category,
          isActive: true
        };
      });
      
      setWords(processedWords);
    } else if (activeCategory !== null) {
      // Just update the isActive status without regenerating words
      setWords(prevWords => 
        prevWords.map(word => ({
          ...word,
          isActive: !activeCategory || word.category === activeCategory
        }))
      );
    } else {
      // Make all words active if filter is cleared
      setWords(prevWords => 
        prevWords.map(word => ({
          ...word,
          isActive: true
        }))
      );
    }
  }, [activeCategory]);

  // Adjust size based on project count - increased contrast
  const getWordSize = (skillId: string, projectCount: number): number => {
    // Base size range with greater difference for better hierarchy
    const minSize = 14;
    const maxSize = 60;
    const minProjects = 0;
    const maxProjects = Math.max(...SKILLS.map(s => getProjectCountForSkill(s.id)));
    
    // Use exponential scale for more dramatic size difference
    const scale = d3.scalePow()
      .exponent(1.3) // Exponential scaling for more pronounced differences
      .domain([minProjects, maxProjects])
      .range([minSize, maxSize]);
    
    return scale(projectCount);
  };

  // Get opacity based on project count - more projects = more solid
  const getOpacityByProjectCount = (projectCount: number): number => {
    const minProjects = 0;
    const maxProjects = Math.max(...SKILLS.map(s => getProjectCountForSkill(s.id)));
    
    // Scale from 0.6 (fewer projects) to 1.0 (most projects)
    const opacityScale = d3.scaleLinear()
      .domain([minProjects, maxProjects])
      .range([0.6, 1.0]);
    
    return opacityScale(projectCount);
  };

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        
        // Regenerate cloud on resize
        setCloudGenerated(false);
        setAnimationComplete(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate the word cloud layout (only once)
  useEffect(() => {
    if (!svgRef.current || words.length === 0 || cloudGenerated) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const layout = d3Cloud.default()
      .size([dimensions.width, dimensions.height])
      .words(words as d3Cloud.Word[])
      .padding(8)
      .rotate(() => 0) // No rotation for better readability
      .fontSize(d => (d as CloudWord).size)
      .spiral("archimedean")
      .on("end", draw);

    layout.start();
    setCloudGenerated(true);

    function draw(computedWords: d3Cloud.Word[]) {
      const typedWords = computedWords as (d3Cloud.Word & CloudWord)[];
      
      // Set initial positions for animation - all start from center
      const enhancedWords = typedWords.map(word => {
        return {
          ...word,
          x: word.x,
          y: word.y,
          initialX: 0, // Start from center
          initialY: 0, // Start from center
          initialOpacity: 0 // Start invisible
        };
      });
      
      // Save computed layout back to words state
      setWords(enhancedWords);
      
      const g = svg.append("g")
        .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);
      
      g.selectAll("text")
        .data(enhancedWords)
        .enter()
        .append("text")
        .attr("data-id", d => d.id)
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "sans-serif")
        .style("font-weight", d => d.weight > 30 ? "bold" : "normal")
        .style("fill", d => {
          const color = d.color.replace('text-', '');
          // Use tailwind color classes mapping
          const colorMap: Record<string, string> = {
            'blue-500': '#3b82f6',
            'blue-600': '#2563eb',
            'blue-700': '#1d4ed8',
            'blue-800': '#1e40af',
            'green-500': '#22c55e',
            'green-600': '#16a34a',
            'green-700': '#15803d',
            'green-800': '#166534',
            'yellow-500': '#eab308',
            'yellow-600': '#ca8a04',
            'red-500': '#ef4444',
            'red-600': '#dc2626',
            'purple-500': '#a855f7',
            'purple-600': '#9333ea',
            'purple-700': '#7e22ce',
            'purple-800': '#6b21a8',
            'pink-500': '#ec4899',
            'gray-600': '#4b5563',
            'gray-700': '#374151',
            'gray-800': '#1f2937',
            'indigo-600': '#4f46e5',
            'teal-600': '#0d9488',
            'orange-500': '#f97316',
            'black': '#000000'
          };
          
          return colorMap[color] || (isDarkMode ? '#e5e7eb' : '#111827');
        })
        .style("opacity", 0) // Start invisible
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.initialX},${d.initialY}) scale(0.1)`) // All start from center, small scale
        .text(d => d.text)
        .attr("class", "skill-cloud-word transition-all duration-300 hover:opacity-100 cursor-pointer")
        .on("click", (event, d) => {
          onSkillClick(d.id);
        })
        // Hover effect
        .on("mouseover", function(this: SVGTextElement) {
          if (!animationComplete) return;
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", function(d) {
              return `translate(${(d as d3Cloud.Word).x},${(d as d3Cloud.Word).y}) scale(1.1)`;
            })
            .style("opacity", 1); // Full opacity on hover
        })
        .on("mouseout", function(this: SVGTextElement, event, d) {
          if (!animationComplete) return;
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", function(d) {
              return `translate(${(d as d3Cloud.Word).x},${(d as d3Cloud.Word).y}) scale(1)`;
            })
            .style("opacity", (d as CloudWord).opacity); // Return to original opacity
        });
    }
  }, [words, dimensions, isDarkMode, onSkillClick, cloudGenerated]);

  // Trigger the entry animation when component comes into view
  useEffect(() => {
    if (!svgRef.current || !cloudGenerated || !isInView || animationComplete) return;
    
    const svg = d3.select(svgRef.current);
    
    // Fast big-bang appearance - immediate and impactful 
    // No initial delay - start right away
    
    // Group words by size for better animation
    const bigWords = words.filter(w => w.size > 40);
    const mediumWords = words.filter(w => w.size > 25 && w.size <= 40);
    const smallWords = words.filter(w => w.size <= 25);
    
    // Animate the words by size groups - big ones first (they're more important)
    // But do all groups with minimal delay for immediate impact
    
    // First the big words - almost immediately
    bigWords.forEach(word => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(0) // No delay
        .duration(600)
        .ease(d3.easeElasticOut.amplitude(1).period(0.3))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Then medium words with a tiny stagger
    mediumWords.forEach((word, i) => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(50 + (i % 5) * 30) // Small staggered delay by groups of 5
        .duration(700)
        .ease(d3.easeElasticOut.amplitude(1).period(0.3))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Then small words with slightly more stagger
    smallWords.forEach((word, i) => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(100 + (i % 8) * 20) // Small staggered delay by groups of 8
        .duration(800)
        .ease(d3.easeElasticOut.amplitude(1).period(0.35))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Set animation complete after reasonable time
    const totalDuration = 800; // Fast animation
    setTimeout(() => {
      setAnimationComplete(true);
    }, totalDuration);
    
  }, [words, cloudGenerated, isInView, animationComplete]);

  // Update active/inactive skills without regenerating the cloud
  useEffect(() => {
    if (!svgRef.current || !cloudGenerated || !animationComplete) return;

    const svg = d3.select(svgRef.current);
    
    // Update each word based on its active status
    words.forEach(word => {
      svg.select<SVGTextElement>(`text[data-id="${word.id}"]`)
        .transition()
        .duration(500)
        .style("fill", () => {
          const color = word.color.replace('text-', '');
          // Use tailwind color classes mapping
          const colorMap: Record<string, string> = {
            'blue-500': '#3b82f6',
            'blue-600': '#2563eb',
            'blue-700': '#1d4ed8',
            'blue-800': '#1e40af',
            'green-500': '#22c55e',
            'green-600': '#16a34a',
            'green-700': '#15803d',
            'green-800': '#166534',
            'yellow-500': '#eab308',
            'yellow-600': '#ca8a04',
            'red-500': '#ef4444',
            'red-600': '#dc2626',
            'purple-500': '#a855f7',
            'purple-600': '#9333ea',
            'purple-700': '#7e22ce',
            'purple-800': '#6b21a8',
            'pink-500': '#ec4899',
            'gray-600': '#4b5563',
            'gray-700': '#374151',
            'gray-800': '#1f2937',
            'indigo-600': '#4f46e5',
            'teal-600': '#0d9488',
            'orange-500': '#f97316',
            'black': '#000000'
          };
          
          const baseColor = colorMap[color] || (isDarkMode ? '#e5e7eb' : '#111827');
          
          // If we have an active filter and this word doesn't match, return a very faded version
          if (activeCategory && !word.isActive) {
            return isDarkMode 
              ? 'rgba(229, 231, 235, 0.2)' // Very light gray in dark mode
              : 'rgba(17, 24, 39, 0.15)';  // Very light black in light mode
          }
          
          return baseColor;
        })
        .style("opacity", () => {
          // Base opacity is determined by project count
          const baseOpacity = word.opacity;
          
          // Further reduce opacity if not in active category
          if (activeCategory && !word.isActive) {
            return baseOpacity * 0.4;
          }
          
          return baseOpacity;
        })
        .style("pointer-events", () => word.isActive ? "auto" : "none");
    });
  }, [words, activeCategory, isDarkMode, cloudGenerated, animationComplete]);

  return (
    <motion.div 
      ref={containerRef}
      className="w-full h-[600px] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        style={{ overflow: 'visible' }}
        className="skill-cloud"
      ></svg>
    </motion.div>
  );
};

export default SkillCloud; 