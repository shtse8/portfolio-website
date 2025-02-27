"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaArrowUp, FaMapMarkerAlt, FaCode, FaHeart } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 8
      }
    }
  };
  
  if (!mounted) return null;

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 w-80 h-80 bg-primary-700/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div 
            className="md:col-span-5"
            variants={itemVariants}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-2 tracking-tight">
                <span className="gradient-text">{PERSONAL_INFO.firstName}</span>
                <span className="ml-1">{PERSONAL_INFO.lastName}</span>
              </h3>
              <p className="text-lg font-medium text-gray-400 mb-2">Full-Stack Developer & Founder</p>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {PERSONAL_INFO.shortBio || 'Building innovative digital experiences with clean code and modern technologies.'}
            </p>
            <div className="flex space-x-4 mb-8">
              <motion.a
                href={PERSONAL_INFO.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-300 hover:text-white transition-all transform hover:-translate-y-1"
                aria-label="GitHub"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub className="text-xl" />
              </motion.a>
              <motion.a 
                href={PERSONAL_INFO.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-300 hover:text-white transition-all transform hover:-translate-y-1"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a 
                href={PERSONAL_INFO.social.stackoverflow} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-300 hover:text-white transition-all transform hover:-translate-y-1"
                aria-label="Stack Overflow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaStackOverflow className="text-xl" />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-3"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-gray-800 p-2 rounded-lg mr-2"><FaCode className="text-primary-400" /></span>
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#hero" 
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="#tech-stack" 
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-200"
                >
                  Technologies
                </Link>
              </li>
              <li>
                <Link 
                  href="#projects" 
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-200"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  href="#experience" 
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-200"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link 
                  href="#contact" 
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="md:col-span-4"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-gray-800 p-2 rounded-lg mr-2"><FaEnvelope className="text-primary-400" /></span>
              Contact Info
            </h3>
            <div className="space-y-3 mb-6">
              <p className="flex items-center text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="mr-3 text-primary-500" /> 
                <a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a>
              </p>
              <p className="flex items-start text-gray-400">
                <FaMapMarkerAlt className="mr-3 mt-1 text-primary-500" />
                <span>
                  {PERSONAL_INFO.location.remote}<br />
                  Based in {PERSONAL_INFO.location.base}
                </span>
              </p>
            </div>
            <motion.a 
              href="#contact" 
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-3 rounded-lg transition-all shadow-md hover:shadow-xl hover:shadow-primary-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}. All rights reserved.
          </p>
          
          <div className="text-gray-500 flex items-center text-sm">
            <span className="mr-1">Made with</span> 
            <FaHeart className="text-red-500 mx-1" />
            <span className="ml-1">using Next.js, TypeScript, and Tailwind CSS</span>
          </div>
        </motion.div>
      </div>
      
      <motion.button 
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-primary-500/20"
        aria-label="Scroll to top"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.5
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  );
} 