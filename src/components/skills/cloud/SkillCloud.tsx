"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as d3Cloud from 'd3-cloud';
import { SKILLS, PROJECTS } from '@/data';
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
  projectCount: number;
  weight: number;
  opacity: number;
  category: string;
  isActive: boolean;
  x?: number;
  y?: number;
  rotate?: number;
  fontFamily?: string;
  initialX?: number;
  initialY?: number;
  initialOpacity?: number;
}

const SkillCloud: React.FC<SkillCloudProps> = ({ onSkillClick, activeCategory }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [words, setWords] = useState<CloudWord[]>([]);
  const [cloudGenerated, setCloudGenerated] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 }); 
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Font options for variety
  const fonts = useMemo(() => [
    "system-ui", 
    "Segoe UI", 
    "Roboto", 
    "Helvetica", 
    "Arial", 
    "sans-serif"
  ], []);

  // Count projects for each skill
  const getProjectCountForSkill = useCallback((skillId: string): number => {
    return PROJECTS.filter(project => project.skills.includes(skillId)).length;
  }, []);

  // First useEffect for updating active/inactive status - removing the conflicting dependencies
  useEffect(() => {
    if (activeCategory) {
      // Update words to mark active/inactive based on category
      setWords(prevWords => 
        prevWords.map(word => ({
          ...word,
          isActive: !activeCategory || word.category === activeCategory
        }))
      );
    } else {
      // Reset all to active
      setWords(prevWords => 
        prevWords.map(word => ({
          ...word,
          isActive: true
        }))
      );
    }
  }, [activeCategory]);

  // Process skills data for cloud visualization
  useEffect(() => {
    // Only generate word cloud once when component mounts
    if (words.length === 0 && SKILLS && SKILLS.length > 0) {
      const processedWords = SKILLS.map(skill => {
        const projectCount = getProjectCountForSkill(skill.id);
        
        return {
          text: skill.name,
          size: getWordSize(projectCount),
          id: skill.id,
          color: skill.color || '#3182CE',
          projectCount,
          weight: getWeightValue(projectCount),
          opacity: getOpacityByProjectCount(projectCount),
          category: skill.category,
          isActive: !activeCategory || skill.category === activeCategory,
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)]
        };
      });
      
      setWords(processedWords);
    }
  }, [activeCategory, fonts, getProjectCountForSkill, words.length]);

  // Improved visual scaling functions
  const getWordSize = useCallback((projectCount: number): number => {
    const minSize = 14;
    const maxSize = 62; // Slightly larger max size
    const minProjects = 0;
    
    // Ensure we have skills to avoid errors
    if (!SKILLS || SKILLS.length === 0) return minSize;
    
    const maxProjects = Math.max(...SKILLS.map(s => getProjectCountForSkill(s.id)));
    
    // Improved power curve for more dramatic scaling
    const scale = d3.scalePow()
      .exponent(1.4) // Steeper curve for better visual hierarchy
      .domain([minProjects, maxProjects])
      .range([minSize, maxSize]);
    
    return scale(projectCount);
  }, [getProjectCountForSkill]);

  const getWeightValue = useCallback((projectCount: number): number => {
    // Ensure we have skills to avoid errors
    if (!SKILLS || SKILLS.length === 0) return 400;
    
    const maxProjects = Math.max(...SKILLS.map(s => getProjectCountForSkill(s.id)));
    // Scale from normal to bold based on project count
    const weightScale = d3.scaleQuantize<number>()
      .domain([0, maxProjects])
      .range([400, 500, 600, 700]); // Normal to bold weights
    
    return weightScale(projectCount);
  }, [getProjectCountForSkill]);

  const getOpacityByProjectCount = useCallback((projectCount: number): number => {
    const minProjects = 0;
    
    // Ensure we have skills to avoid errors
    if (!SKILLS || SKILLS.length === 0) return 0.65;
    
    const maxProjects = Math.max(...SKILLS.map(s => getProjectCountForSkill(s.id)));
    
    // Scale from 0.65 to 1.0 - slightly higher minimum opacity
    const opacityScale = d3.scaleLinear()
      .domain([minProjects, maxProjects])
      .range([0.65, 1.0]);
    
    return opacityScale(projectCount);
  }, [getProjectCountForSkill]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setCloudGenerated(false);
        setAnimationComplete(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main cloud generation and rendering
  useEffect(() => {
    if (!svgRef.current || words.length === 0 || !isInView || animationComplete || cloudGenerated) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Create a radial gradient background for the cloud
    const defs = svg.append("defs");
    const gradient = defs.append("radialGradient")
      .attr("id", "cloud-background")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", isDarkMode ? "#2d3748" : "#f3f4f6")
      .attr("stop-opacity", 0.3);
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", isDarkMode ? "#1a202c" : "#f9fafb")
      .attr("stop-opacity", 0);
    
    // Add subtle background
    svg.append("circle")
      .attr("cx", dimensions.width / 2)
      .attr("cy", dimensions.height / 2)
      .attr("r", Math.min(dimensions.width, dimensions.height) * 0.45)
      .attr("fill", "url(#cloud-background)")
      .attr("class", "cloud-background");

    // Sort words by project count for better placement
    const sortedWords = [...words].sort((a, b) => b.projectCount - a.projectCount);

    const layout = d3Cloud.default()
      .size([dimensions.width, dimensions.height])
      .words(sortedWords as d3Cloud.Word[])
      .padding(12) // Increased padding for better spacing
      .rotate(() => 0)
      .fontSize(d => (d as CloudWord).size)
      .fontWeight(d => (d as CloudWord).weight.toString())
      .spiral("archimedean")
      .on("end", drawCloud);

    layout.start();
    
    function drawCloud(computedWords: d3Cloud.Word[]) {
      // Skip if no words or container unmounted
      if (computedWords.length === 0 || !svgRef.current) return;
      
      const typedWords = computedWords as (d3Cloud.Word & CloudWord)[];
      
      // Enhance words with animation properties
      const enhancedWords = typedWords.map(word => {
        return {
          ...word,
          x: word.x,
          y: word.y,
          initialX: 0, // Start from center
          initialY: 0, // Start from center
          initialOpacity: 0
        };
      });
      
      setWords(enhancedWords);
      
      const g = svg.append("g")
        .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);
      
      // Add subtle connecting lines between words in the same category
      if (enhancedWords.length > 0) {
        const categories = Array.from(new Set(enhancedWords.map(w => w.category)));
        categories.forEach(category => {
          const categoryWords = enhancedWords.filter(w => w.category === category);
          if (categoryWords.length > 1) {
            // Find central word for this category (largest)
            const centralWord = categoryWords.reduce((max, word) => 
              word.size > max.size ? word : max, categoryWords[0]);
            
            // Add subtle connecting lines to central word
            categoryWords.forEach(word => {
              if (word.id !== centralWord.id) {
                g.append("line")
                  .attr("x1", centralWord.x!)
                  .attr("y1", centralWord.y!)
                  .attr("x2", word.x!)
                  .attr("y2", word.y!)
                  .attr("stroke", isDarkMode ? "#4b5563" : "#e5e7eb")
                  .attr("stroke-width", 0.5)
                  .attr("stroke-opacity", 0.15)
                  .attr("class", `connection ${word.category}`);
              }
            });
          }
        });
      }
      
      // Color mapping function
      const getWordColor = (colorStr: string) => {
        const color = colorStr.replace('text-', '');
        // Enhanced color mapping with slightly richer colors
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
      };
      
      // Add the text elements with enhanced styling
      g.selectAll("text")
        .data(enhancedWords)
        .enter()
        .append("text")
        .attr("data-id", d => d.id)
        .attr("data-category", d => d.category)
        .style("font-size", d => `${d.size}px`)
        .style("font-family", d => d.fontFamily || "sans-serif")
        .style("font-weight", d => d.weight)
        .style("fill", d => getWordColor(d.color))
        .style("opacity", 0)
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.initialX},${d.initialY}) scale(0.1)`)
        .text(d => d.text)
        .attr("class", "skill-cloud-word")
        .style("cursor", "pointer")
        // Add subtle letter-spacing for better readability
        .style("letter-spacing", "0.02em")
        // Add subtle text shadow for depth
        .style("text-shadow", isDarkMode ? 
          "0 1px 2px rgba(0,0,0,0.2)" : 
          "0 1px 2px rgba(0,0,0,0.05)")
        .on("click", (event, d) => {
          onSkillClick(d.id);
        })
        // Refined hover effects
        .on("mouseover", function(event, d) {
          const currentWord = d as CloudWord;
          setHoveredWord(currentWord.id);
          
          const wordX = currentWord.x!;
          const wordY = currentWord.y!;
          
          // Highlight the hovered word
          d3.select(this)
            .transition()
            .duration(180)
            .ease(d3.easeBackOut.overshoot(1.1))
            .attr("transform", `translate(${wordX},${wordY}) scale(1.3)`)
            .style("opacity", 1)
            .style("letter-spacing", "0.03em") // Slightly increase spacing on hover
            .style("z-index", 100);
          
          // Highlight connection lines for this category
          if (currentWord.category) {
            g.selectAll(`line.${currentWord.category}`)
              .transition()
              .duration(180)
              .attr("stroke-opacity", 0.4)
              .attr("stroke-width", 1);
          }
          
          // Make ALL words move away with refined distance-based effect
          svg.selectAll<SVGTextElement, CloudWord>("text").each(function(otherWord) {
            if (otherWord.id !== currentWord.id) {
              const otherX = otherWord.x!;
              const otherY = otherWord.y!;
              
              // Calculate distance between words
              const dx = otherX - wordX;
              const dy = otherY - wordY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Create dynamic wave-like effect
              const maxDistance = 450;
              const maxMoveAmount = 55;
              
              // Improved curve for more natural displacement
              const moveAmount = maxMoveAmount * Math.pow(1 - Math.min(distance / maxDistance, 1), 1.7);
              
              // Normalize direction vector
              const totalDist = Math.sqrt(dx * dx + dy * dy);
              const dirX = totalDist > 0 ? dx / totalDist : 0;
              const dirY = totalDist > 0 ? dy / totalDist : 0;
              
              // Apply the movement with refined physics
              d3.select(this)
                .transition()
                .duration(220)
                .ease(d3.easeQuadOut)
                .attr("transform", `translate(${otherX + dirX * moveAmount},${otherY + dirY * moveAmount}) scale(1)`)
                .style("opacity", () => {
                  const baseOpacity = otherWord.opacity;
                  
                  // Keep words in same category more visible
                  if (otherWord.category === currentWord.category) {
                    return baseOpacity * 0.8;
                  }
                  
                  // Distant words fade more
                  const opacityReduction = 0.2 + 0.2 * (1 - Math.min(distance / maxDistance, 1));
                  return Math.max(0.4, baseOpacity - opacityReduction);
                });
            }
          });
        })
        .on("mouseout", function() {
          setHoveredWord(null);
          
          // Reset all elements
          svg.selectAll<SVGTextElement, CloudWord>("text")
            .transition()
            .duration(160)
            .ease(d3.easeQuadIn)
            .attr("transform", function(word) {
              return `translate(${word.x},${word.y}) scale(1)`;
            })
            .style("opacity", function(word) {
              if (activeCategory && !word.isActive) {
                return word.opacity * 0.4;
              }
              return word.opacity;
            })
            .style("letter-spacing", "0.02em")
            .style("z-index", 1);
          
          // Reset connection lines
          g.selectAll("line")
            .transition()
            .duration(160)
            .attr("stroke-opacity", 0.15)
            .attr("stroke-width", 0.5);
        });
        
      // Start entry animations
      animateWordsEntry(svg, enhancedWords);
      
      // Mark cloud as generated
      setCloudGenerated(true);
    }
  }, [words, dimensions, isDarkMode, onSkillClick, isInView, animationComplete, activeCategory, cloudGenerated]);
  
  // Separate function for word entry animation
  const animateWordsEntry = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, words: CloudWord[]) => {
    if (!svg || !words.length) return;
    
    // Group words by importance for staggered animation
    const primaryWords = words.filter(w => w.size > 45);
    const secondaryWords = words.filter(w => w.size > 30 && w.size <= 45);
    const tertiaryWords = words.filter(w => w.size > 20 && w.size <= 30);
    const quaternaryWords = words.filter(w => w.size <= 20);
    
    // First wave - the largest words (immediate impact)
    primaryWords.forEach(word => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(0)
        .duration(650)
        .ease(d3.easeElasticOut.amplitude(0.9).period(0.3))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Second wave - medium-large words
    secondaryWords.forEach((word, i) => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(40 + (i % 4) * 25)
        .duration(700)
        .ease(d3.easeElasticOut.amplitude(0.8).period(0.3))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Third wave - medium-small words
    tertiaryWords.forEach((word, i) => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(80 + (i % 6) * 20)
        .duration(700)
        .ease(d3.easeElasticOut.amplitude(0.8).period(0.35))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Fourth wave - smallest words
    quaternaryWords.forEach((word, i) => {
      svg.select(`text[data-id="${word.id}"]`)
        .transition()
        .delay(120 + (i % 8) * 15)
        .duration(750)
        .ease(d3.easeElasticOut.amplitude(0.7).period(0.4))
        .style("opacity", word.opacity)
        .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
    });
    
    // Mark animation as complete after reasonable time
    const totalDuration = 850;
    setTimeout(() => {
      setAnimationComplete(true);
    }, totalDuration);
  };

  // Update active/inactive skills when filtering
  useEffect(() => {
    if (!svgRef.current || !cloudGenerated || words.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    // Get color function
    const getWordColor = (colorStr: string, isActive: boolean) => {
      const color = colorStr.replace('text-', '');
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
      
      // Refined inactive style
      if (activeCategory && !isActive) {
        return isDarkMode 
          ? 'rgba(229, 231, 235, 0.18)' // Very light gray in dark mode
          : 'rgba(17, 24, 39, 0.12)';  // Very light black in light mode
      }
      
      return baseColor;
    };
    
    // Update word styling based on active status
    words.forEach(word => {
      svg.select<SVGTextElement>(`text[data-id="${word.id}"]`)
        .transition()
        .duration(400)
        .style("fill", () => getWordColor(word.color, word.isActive))
        .style("opacity", () => {
          const baseOpacity = word.opacity;
          
          if (activeCategory && !word.isActive) {
            return baseOpacity * 0.35;
          }
          
          return baseOpacity;
        })
        .style("pointer-events", () => word.isActive ? "auto" : "none");
    });
    
    // Also update connection lines visibility
    if (activeCategory) {
      svg.selectAll("line")
        .transition()
        .duration(400)
        .attr("stroke-opacity", function() {
          // Get class from DOM element safely
          // @ts-expect-error - d3 selections have the DOM element as `this`
          const className = this.getAttribute("class") || "";
          const category = className.replace("connection ", "");
          return category === activeCategory ? 0.25 : 0.05;
        });
    } else {
      svg.selectAll("line")
        .transition()
        .duration(400)
        .attr("stroke-opacity", 0.15);
    }
    
  }, [words, activeCategory, isDarkMode, cloudGenerated]);

  // Add subtle continuous animation for "alive" feeling
  useEffect(() => {
    if (!svgRef.current || !cloudGenerated || !animationComplete || hoveredWord || words.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    let stopAnimation = false;
    
    const subtleMovement = () => {
      if (stopAnimation) return;
      
      // Select a few random words to subtly move
      const wordCount = words.length;
      const moveCount = Math.min(3, Math.floor(wordCount * 0.1));
      
      for (let i = 0; i < moveCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordCount);
        const wordToMove = words[randomIndex];
        
        if (wordToMove && wordToMove.x && wordToMove.y) {
          const randomOffset = Math.random() * 3 - 1.5; // -1.5 to 1.5px
          
          svg.select<SVGTextElement>(`text[data-id="${wordToMove.id}"]`)
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("transform", `translate(${wordToMove.x + randomOffset},${wordToMove.y + randomOffset}) scale(1)`)
            .on("end", function() {
              d3.select(this)
                .transition()
                .duration(2000)
                .ease(d3.easeSinInOut)
                .attr("transform", `translate(${wordToMove.x},${wordToMove.y}) scale(1)`);
            });
        }
      }
      
      // Schedule next subtle movement
      setTimeout(subtleMovement, 3000);
    };
    
    // Start the subtle animation
    subtleMovement();
    
    // Cleanup
    return () => {
      stopAnimation = true;
    };
  }, [words, cloudGenerated, animationComplete, hoveredWord]);

  return (
    <motion.div 
      ref={containerRef}
      className="w-full h-[600px] relative flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {words.length === 0 && (
        <div className="text-gray-400 dark:text-gray-500 text-center font-light p-4">
          <div className="animate-pulse mb-4">
            <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 mx-auto rounded"></div>
          </div>
          Loading skills...
        </div>
      )}
      
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        style={{ overflow: 'visible' }}
        className="skill-cloud"
        aria-label="Interactive skill cloud visualization"
      ></svg>
    </motion.div>
  );
};

export default SkillCloud; 