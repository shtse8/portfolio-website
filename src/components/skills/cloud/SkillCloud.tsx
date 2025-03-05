"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as d3Cloud from 'd3-cloud';
import { PROJECTS } from '@/data';
import { getSkills } from '@/data/skills';
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
    if (words.length === 0 && getSkills() && getSkills().length > 0) {
      const processedWords = getSkills().map(skill => {
        const projectCount = getProjectCountForSkill(skill.id);
        
        // Define these functions inside the useEffect
        const getWordSizeInner = (count: number): number => {
          const minSize = 14;
          const maxSize = 62;
          const minProjects = 0;
          
          if (!getSkills() || getSkills().length === 0) return minSize;
          
          const maxProjects = Math.max(...getSkills().map(s => getProjectCountForSkill(s.id)));
          
          const scale = d3.scalePow()
            .exponent(1.4)
            .domain([minProjects, maxProjects])
            .range([minSize, maxSize]);
          
          return scale(count);
        };
        
        const getWeightValueInner = (count: number): number => {
          if (!getSkills() || getSkills().length === 0) return 400;
          
          const maxProjects = Math.max(...getSkills().map(s => getProjectCountForSkill(s.id)));
          const weightScale = d3.scaleQuantize<number>()
            .domain([0, maxProjects])
            .range([400, 500, 600, 700]);
          
          return weightScale(count);
        };
        
        const getOpacityByProjectCountInner = (count: number): number => {
          const minProjects = 0;
          
          if (!getSkills() || getSkills().length === 0) return 0.65;
          
          const maxProjects = Math.max(...getSkills().map(s => getProjectCountForSkill(s.id)));
          
          const opacityScale = d3.scaleLinear()
            .domain([minProjects, maxProjects])
            .range([0.65, 1.0]);
          
          return opacityScale(count);
        };
        
        return {
          text: skill.name,
          size: getWordSizeInner(projectCount),
          id: skill.id,
          color: skill.color || '#3182CE',
          projectCount,
          weight: getWeightValueInner(projectCount),
          opacity: getOpacityByProjectCountInner(projectCount),
          category: skill.category,
          isActive: !activeCategory || skill.category === activeCategory,
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)]
        };
      });
      
      setWords(processedWords);
    }
  }, [activeCategory, fonts, getProjectCountForSkill, words.length]);

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
    
    // Show loading indicator first if needed
    const svg = d3.select(svgRef.current)
      .attr("shape-rendering", "geometricPrecision") // Improve render quality
      .style("text-rendering", "optimizeLegibility"); // Improve text rendering
    
    svg.selectAll("*").remove();
    
    // Add SVG filter for better text readability if needed
    const defs = svg.append("defs");
    
    // Add a subtle drop shadow filter for text
    const filter = defs.append("filter")
      .attr("id", "text-shadow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    
    filter.append("feDropShadow")
      .attr("dx", "0")
      .attr("dy", "0")
      .attr("stdDeviation", "1")
      .attr("flood-opacity", "0.2")
      .attr("flood-color", isDarkMode ? "#000" : "#333");
    
    // Use a more efficient layout computation with better defaults
    const layout = d3Cloud.default()
      .size([dimensions.width, dimensions.height])
      .words(words as d3Cloud.Word[])
      .padding(8) // Further reduced padding for denser layout
      .rotate(() => 0) // No rotation for cleaner appearance and faster calculation
      .fontSize(d => (d as CloudWord).size)
      .fontWeight(d => (d as CloudWord).weight.toString())
      .spiral("archimedean")
      .random(() => 0.5) // Make layout more deterministic
      .timeInterval(1) // Minimize time intervals for faster calculation
      .on("end", drawCloud);
    
    // Add background with requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      // Create a radial gradient background for the cloud
      const gradient = defs.append("radialGradient")
        .attr("id", "cloud-background")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "50%")
        .attr("fy", "50%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", isDarkMode ? "#1f2937" : "#f9fafb")
        .attr("stop-opacity", 0.2);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", isDarkMode ? "#111827" : "#f3f4f6")
        .attr("stop-opacity", 0);
      
      // Start the layout computation immediately
      layout.start();
    });

    // Precompute word positions for better performance
    function drawCloud(computedWords: d3Cloud.Word[]) {
      // Skip if no words or container unmounted
      if (computedWords.length === 0 || !svgRef.current) return;
      
      const typedWords = computedWords as (d3Cloud.Word & CloudWord)[];
      
      // Process all words in a batch for better performance
      const enhancedWords = typedWords.map(word => ({
        ...word,
        x: word.x,
        y: word.y,
        initialX: word.x, // Start from final position for smoother appearance
        initialY: word.y,
        initialOpacity: 0
      }));
      
      setWords(enhancedWords);
      
      const g = svg.append("g")
        .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);
      
      // Only draw connections for words visible on screen
      if (enhancedWords.length > 0) {
        const categories = Array.from(new Set(enhancedWords.map(w => w.category)));
        
        // Only draw a minimal number of connections for better performance
        const maxConnectionsPerCategory = Math.min(3, Math.floor(enhancedWords.length / categories.length / 3));
        
        // Draw connections with requestAnimationFrame
        requestAnimationFrame(() => {
          // Create a separate group for connections for better performance
          const connectionGroup = g.append("g").attr("class", "connections");
          
          // Process all connections in a single batch
          const allConnections: {source: CloudWord, target: CloudWord, category: string}[] = [];
          
          categories.forEach(category => {
            const categoryWords = enhancedWords.filter(w => w.category === category);
            if (categoryWords.length > 1) {
              // Find central word for this category (largest)
              const centralWord = categoryWords.reduce((max, word) => 
                word.size > max.size ? word : max, categoryWords[0]);
              
              // Only connect to the largest words in each category
              const connectedWords = categoryWords
                .filter(w => w.id !== centralWord.id)
                .sort((a, b) => b.size - a.size)
                .slice(0, maxConnectionsPerCategory);
              
              // Collect connections rather than drawing immediately
              connectedWords.forEach(word => {
                allConnections.push({
                  source: centralWord,
                  target: word,
                  category: word.category
                });
              });
            }
          });
          
          // Draw all connections at once
          connectionGroup.selectAll("line")
            .data(allConnections)
            .enter()
            .append("line")
            .attr("x1", d => d.source.x!)
            .attr("y1", d => d.source.y!)
            .attr("x2", d => d.target.x!)
            .attr("y2", d => d.target.y!)
            .attr("stroke", isDarkMode ? "#4b5563" : "#e5e7eb")
            .attr("stroke-width", 0.5)
            .attr("stroke-opacity", 0.15)
            .attr("class", d => `connection ${d.category}`);
        });
      }
      
      // Process all words at once for better performance
      // Color mapping function
      const getWordColor = (colorStr: string) => {
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
        
        return colorMap[color] || (isDarkMode ? '#e5e7eb' : '#111827');
      };
      
      // Use a single selection for better performance
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
        .attr("transform", d => `translate(${d.initialX},${d.initialY}) scale(0.8)`)
        .text(d => d.text)
        .attr("class", "skill-cloud-word")
        .style("cursor", "pointer")
        .style("letter-spacing", "0.02em")
        .style("text-shadow", isDarkMode ? 
          "0 1px 2px rgba(0,0,0,0.2)" : 
          "0 1px 2px rgba(0,0,0,0.05)")
        .attr("filter", "url(#text-shadow)")
        .on("click", (event, d) => {
          onSkillClick(d.id);
        })
        // Optimize hover effects
        .on("mouseover", function(event, d) {
          const currentWord = d as CloudWord;
          setHoveredWord(currentWord.id);
          
          // Transition optimization
          d3.select(this)
            .interrupt() // Stop any ongoing transitions
            .transition()
            .duration(180)
            .ease(d3.easeBackOut.overshoot(1.1))
            .attr("transform", `translate(${currentWord.x},${currentWord.y}) scale(1.3)`)
            .style("opacity", 1)
            .style("z-index", 100);
          
          // Only highlight connections for this category
          g.selectAll(`line.${currentWord.category}`)
            .interrupt() // Stop any ongoing transitions
            .transition()
            .duration(180)
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1);
          
          // Optimize word displacement by only affecting closest words
          const wordX = currentWord.x!;
          const wordY = currentWord.y!;
          const maxDistance = 300; // Reduce affected radius for better performance
          
          svg.selectAll<SVGTextElement, CloudWord>("text").each(function(otherWord) {
            if (otherWord.id !== currentWord.id) {
              const otherX = otherWord.x!;
              const otherY = otherWord.y!;
              
              // Calculate distance
              const dx = otherX - wordX;
              const dy = otherY - wordY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Only affect closer words for better performance
              if (distance < maxDistance) {
                const moveAmount = 30 * Math.pow(1 - distance / maxDistance, 1.5);
                const dirX = dx / (Math.abs(dx) + 0.1);
                const dirY = dy / (Math.abs(dy) + 0.1);
                
                d3.select(this)
                  .interrupt() // Stop any ongoing transitions
                  .transition()
                  .duration(180)
                  .ease(d3.easeQuadOut)
                  .attr("transform", `translate(${otherX + dirX * moveAmount},${otherY + dirY * moveAmount}) scale(1)`)
                  .style("opacity", otherWord.category === currentWord.category ? 
                    Math.max(0.6, otherWord.opacity * 0.8) : 
                    Math.max(0.4, otherWord.opacity * 0.6));
              }
            }
          });
        })
        .on("mouseout", function() {
          setHoveredWord(null);
          
          // Reset all elements with a single selection for better performance
          svg.selectAll<SVGTextElement, CloudWord>("text")
            .interrupt() // Stop any ongoing transitions
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
            .style("z-index", 1);
          
          // Reset connection lines
          g.selectAll("line")
            .interrupt() // Stop any ongoing transitions
            .transition()
            .duration(160)
            .attr("stroke-opacity", 0.15)
            .attr("stroke-width", 0.5);
        });
      
      // Start entry animations with requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        animateWordsEntry(svg, enhancedWords);
      });
      
      // Mark cloud as generated
      setCloudGenerated(true);
    }
  }, [words, dimensions, isDarkMode, onSkillClick, isInView, animationComplete, activeCategory, cloudGenerated]);
  
  // Separate function for word entry animation
  const animateWordsEntry = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, words: CloudWord[]) => {
    if (!svg || !words.length) return;
    
    // Sort words by size for more uniform animation
    const sortedWords = [...words].sort((a, b) => b.size - a.size);
    
    // Divide words into just two groups for simpler, faster animation
    const primaryWords = sortedWords.slice(0, Math.ceil(sortedWords.length * 0.3)); // Top 30%
    const secondaryWords = sortedWords.slice(Math.ceil(sortedWords.length * 0.3));
    
    // Pre-calculate positions and transformations for better performance
    const allWordElements = sortedWords.map(word => ({
      element: svg.select(`text[data-id="${word.id}"]`),
      word: word
    }));

    // Batch animations for better performance and smoother appearance
    
    // First add all words with opacity 0 to prevent layout shifts
    allWordElements.forEach(({ element, word }) => {
      element
        .style("opacity", 0)
        .attr("transform", `translate(${word.x},${word.y}) scale(0.6)`)
        .style("will-change", "transform, opacity"); // Add GPU acceleration hint
    });
    
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      // Animate primary words (larger/more important) first with minimal delays
      primaryWords.forEach((word, i) => {
        svg.select(`text[data-id="${word.id}"]`)
          .transition()
          .delay(i < 5 ? i * 10 : 50 + Math.min(i * 2, 30)) // Drastically reduced delays
          .duration(300) // Shorter duration
          .ease(d3.easeBackOut.overshoot(1.2)) // More dynamic easing
          .style("opacity", word.opacity)
          .attr("transform", `translate(${word.x},${word.y}) scale(1)`);
      });
      
      // Animate all secondary words almost simultaneously with a short initial delay
      secondaryWords.forEach((word, i) => {
        svg.select(`text[data-id="${word.id}"]`)
          .transition()
          .delay(80 + Math.min(i * 1.5, 100)) // Very short delays, capped at 100ms
          .duration(250) // Very short duration
          .ease(d3.easeCubicOut) // Smoother easing
          .style("opacity", word.opacity)
          .attr("transform", `translate(${word.x},${word.y}) scale(1)`)
          .on("end", function() {
            // Remove will-change after animation to free up GPU resources
            d3.select(this).style("will-change", "auto");
          });
      });
    });
    
    // Mark animation as complete after a much shorter time
    const totalDuration = 350; // Dramatically reduced
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