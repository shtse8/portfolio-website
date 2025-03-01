"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaArrowUp, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
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
  
  // Animation variants for smoother, more intentional animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.5
      }
    },
    hover: { 
      y: -4,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.97 }
  };
  
  if (!mounted) return null;

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden pt-20 pb-16">
      {/* Subtle decorative accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent opacity-50"></div>
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-blue-100/20 dark:bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-indigo-100/20 dark:bg-indigo-900/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-5xl">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14"
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
              <h3 className="text-2xl font-light tracking-wide mb-2">
                <span className="text-blue-500 dark:text-blue-400">{PERSONAL_INFO.firstName}</span>
                <span className="text-gray-700 dark:text-white ml-1">{PERSONAL_INFO.lastName}</span>
              </h3>
              <p className="text-base font-light text-gray-500 dark:text-gray-400 mb-3">{PERSONAL_INFO.title}</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed font-light">
              {PERSONAL_INFO.shortBio}
            </p>
            <div className="flex space-x-4 mb-8">
              <motion.a
                href={PERSONAL_INFO.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all"
                aria-label="GitHub"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href={PERSONAL_INFO.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all"
                aria-label="LinkedIn"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href={PERSONAL_INFO.social.stackoverflow} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all"
                aria-label="Stack Overflow"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaStackOverflow className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-3"
            variants={itemVariants}
          >
            <h3 className="text-base font-medium mb-6 text-gray-700 dark:text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home', 'Skills', 'Projects', 'Experience', 'Philosophy', 'Contact'].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={`#${item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase()}`} 
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 
                               transition-all text-sm font-light py-1 inline-block
                               border-b border-transparent hover:border-blue-500 dark:hover:border-blue-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            className="md:col-span-4"
            variants={itemVariants}
          >
            <h3 className="text-base font-medium mb-6 text-gray-700 dark:text-gray-300">
              Get In Touch
            </h3>
            <div className="space-y-4 mb-8">
              <motion.a 
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center group text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all text-sm font-light"
                whileHover={{ x: 3 }}
              >
                <FaEnvelope className="mr-3 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" /> 
                <span>{PERSONAL_INFO.email}</span>
              </motion.a>
              <motion.div 
                className="flex items-start text-gray-500 dark:text-gray-400 text-sm font-light group"
                whileHover={{ x: 3 }}
              >
                <FaMapMarkerAlt className="mr-3 mt-1 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span>
                  {PERSONAL_INFO.location.remote}<br />
                  Based in {PERSONAL_INFO.location.base}
                </span>
              </motion.div>
            </div>
            <motion.a 
              href="#contact" 
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm
                        bg-blue-500/10 hover:bg-blue-500/15 dark:bg-blue-500/20 dark:hover:bg-blue-500/25
                        text-blue-700 dark:text-blue-300
                        border border-blue-200 dark:border-blue-700/40
                        transition-all shadow-sm hover:shadow"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Send a message
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-gray-400 dark:text-gray-500 mb-4 sm:mb-0 text-sm font-light">
            &copy; {currentYear} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}. All rights reserved.
          </p>
          
          <div className="text-gray-400 dark:text-gray-500 flex items-center text-xs font-light">
            <span>Built with</span> 
            <FaHeart className="text-red-400 mx-1.5 text-[0.65rem]" />
            <span>using Next.js, TypeScript & Tailwind</span>
          </div>
        </motion.div>
      </div>
      
      <motion.button 
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 p-3 rounded-full
                  bg-white dark:bg-gray-800
                  text-blue-500 dark:text-blue-400
                  shadow-sm hover:shadow
                  border border-gray-100 dark:border-gray-700
                  transition-all"
        aria-label="Scroll to top"
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <FaArrowUp className="w-4 h-4" />
      </motion.button>
    </footer>
  );
} 