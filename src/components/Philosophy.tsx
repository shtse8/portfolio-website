"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaRocket, FaTools, FaBullseye, FaRandom } from 'react-icons/fa';

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Set up scroll progress animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  return (
    <div id="philosophy" ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-20">
      <motion.div style={{ opacity, y }} className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r dark:from-blue-400 dark:to-purple-600 from-blue-600 to-purple-800">
            My Philosophy
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto italic">
            &ldquo;In today&apos;s rapidly evolving technological landscape, creating exceptional products requires mastery of these four essential elements.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Efficiency */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                <FaRocket className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Efficiency</h3>
            </div>
            
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold italic mb-4">
              &ldquo;Speed is a competitive advantage that compounds.&rdquo;
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              In a world where technologies evolve daily, the ability to learn and implement rapidly is crucial. I leverage AI and automation to accelerate development, focusing energy on innovation rather than repetition.
            </p>
          </motion.div>

          {/* Tool Mastery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
            <div className="flex items-center mb-5">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                <FaTools className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tool Mastery</h3>
            </div>
            
            <p className="text-xl text-purple-600 dark:text-purple-400 font-semibold italic mb-4">
              &ldquo;The right tool at the right time creates magic.&rdquo;
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              Success isn&apos;t about knowing everything, but rather selecting and mastering the perfect tools for each challenge. I build expertise in strategic technologies and combine them to create powerful, efficient solutions.
            </p>
          </motion.div>

          {/* Precision Focus */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-700"></div>
            <div className="flex items-center mb-5">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                <FaBullseye className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Precision Focus</h3>
            </div>
            
            <p className="text-xl text-green-600 dark:text-green-400 font-semibold italic mb-4">
              &ldquo;Excellence lies in the details others ignore.&rdquo;
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              The difference between good and exceptional is attention to detail. I approach each project with unwavering dedication to quality, optimizing everything from performance to user experience with meticulous precision.
            </p>
          </motion.div>

          {/* Adaptability */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            <div className="flex items-center mb-5">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mr-4">
                <FaRandom className="text-amber-600 dark:text-amber-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Adaptability</h3>
            </div>
            
            <p className="text-xl text-amber-600 dark:text-amber-400 font-semibold italic mb-4">
              &ldquo;The most powerful skill is the ability to reinvent yourself.&rdquo;
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              In tech, change is the only constant. I thrive in dynamic environments, quickly pivoting to new approaches when needed and finding creative solutions to emerging challenges that others might miss.
            </p>
          </motion.div>
        </div>
        
        <div className="mt-14 text-center">
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            These four elements form my foundation for creating exceptional solutions in today&apos;s rapidly evolving technological landscape. Each one enhances the others, creating a methodology that adapts as quickly as technology itself.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 