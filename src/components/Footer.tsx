"use client";

import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaArrowUp, FaMapMarkerAlt, FaHeart, FaCode, FaLayerGroup, FaBriefcase } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import DeepLink from './DeepLink';
import { SECTIONS } from '@/config/sections';

// Footer section component
const FooterSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className="md:col-span-3"
  >
    <h3 className="text-base font-medium mb-6 flex items-center text-gray-700 dark:text-gray-300">
      <span className="block w-8 h-px bg-blue-300/80 dark:bg-blue-700/50 mr-3" aria-hidden="true"></span>
      {title}
    </h3>
    {children}
  </motion.div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const toggleButtonVisibility = () => {
      // Show button when page is scrolled 300px
      if (window.scrollY > 300) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleButtonVisibility);
    toggleButtonVisibility(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', toggleButtonVisibility);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  if (!mounted) return null;

  return (
    <footer className="relative overflow-hidden pt-20 pb-12 bg-gradient-to-b from-gray-50 via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Top border */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent opacity-40"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footerGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footerGrid)" />
          </svg>
        </div>
        
        {/* Accent blurs */}
        <motion.div 
          className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-blue-100/10 dark:bg-blue-900/5 blur-3xl" 
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.5, 0.6, 0.5] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-indigo-100/10 dark:bg-indigo-900/5 blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12">
          {/* About section */}
          <motion.div 
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-extralight tracking-wide mb-3 flex items-center">
                <span className="text-blue-500 dark:text-blue-400">{PERSONAL_INFO.firstName}</span>
                <span className="text-gray-700 dark:text-white ml-1">{PERSONAL_INFO.lastName}</span>
              </h2>
              <p className="text-base font-light text-gray-500 dark:text-gray-400 mb-4">{PERSONAL_INFO.title}</p>
              <div className="w-16 h-px bg-blue-200/50 dark:bg-blue-700/30"></div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed font-light">
              {PERSONAL_INFO.shortBio}
            </p>
            
            {/* Social links with enhanced design */}
            <div className="flex space-x-3 mb-8">
              {[
                { href: PERSONAL_INFO.social.github, icon: <FaGithub className="w-4 h-4" />, label: "GitHub", color: "bg-gray-800 text-white dark:bg-gray-700" },
                { href: PERSONAL_INFO.social.linkedin, icon: <FaLinkedin className="w-4 h-4" />, label: "LinkedIn", color: "bg-blue-600 text-white" },
                { href: PERSONAL_INFO.social.stackoverflow, icon: <FaStackOverflow className="w-4 h-4" />, label: "Stack Overflow", color: "bg-orange-500 text-white" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full",
                    "transition-all duration-200",
                    social.color
                  )}
                  aria-label={social.label}
                  whileHover={{ y: -4, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            
            {/* Service categories with icons */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <FaCode className="mr-2" />, label: "Web Development" },
                { icon: <FaLayerGroup className="mr-2" />, label: "Full Stack" },
                { icon: <FaBriefcase className="mr-2" />, label: "Consulting" }
              ].map((service, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50/80 dark:bg-gray-800/30 px-3 py-1.5 rounded-full text-xs text-gray-600 dark:text-gray-400 flex items-center font-light"
                >
                  {service.icon} {service.label}
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <FooterSection title="Navigation">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {SECTIONS.map((item) => (
                <li key={item.id}>
                  <DeepLink
                    to={item.id}
                    className={cn(
                      "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400",
                      "transition-all text-sm font-light py-1 inline-flex items-center",
                      "relative overflow-hidden group"
                    )}
                    activeClassName="text-blue-500 dark:text-blue-400"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.span
                      className="absolute bottom-0 left-0 h-[1px] bg-blue-500 dark:bg-blue-400 w-full transform origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      aria-hidden="true"
                    />
                  </DeepLink>
                </li>
              ))}
            </ul>
          </FooterSection>
          
          {/* Contact */}
          <FooterSection title="Get In Touch">
            <div className="space-y-4 mb-6">
              <motion.a 
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center group text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all text-sm font-light"
                whileHover={{ x: 3 }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50/80 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 mr-3 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="w-3.5 h-3.5" />
                </div>
                <span>{PERSONAL_INFO.email}</span>
              </motion.a>
              
              <motion.div 
                className="flex items-start text-gray-600 dark:text-gray-400 text-sm font-light group"
                whileHover={{ x: 3 }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt className="w-3.5 h-3.5" />
                </div>
                <span>
                  {PERSONAL_INFO.location.remote}<br />
                  Based in {PERSONAL_INFO.location.base}
                </span>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(59, 130, 246, 0.25)" }}
              whileTap={{ scale: 0.98 }}
            >
              <DeepLink
                to="contact"
                className={cn(
                  "inline-flex items-center px-5 py-2.5 rounded-full text-sm",
                  "bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-400/90 hover:to-blue-500/90",
                  "text-white shadow-sm hover:shadow",
                  "transition-all"
                )}
              >
                Send a message
              </DeepLink>
            </motion.div>
          </FooterSection>
        </div>
        
        {/* Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200/70 dark:border-gray-800/70">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <motion.p 
              className="text-gray-500 dark:text-gray-500 mb-4 sm:mb-0 text-sm font-light"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              &copy; {currentYear} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}. All rights reserved.
            </motion.p>
            
            <motion.div 
              className="text-gray-500 dark:text-gray-500 flex items-center text-xs font-light"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span>Built with</span> 
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
                className="mx-1.5"
              >
                <FaHeart className="text-red-400 text-[0.65rem]" aria-hidden="true" />
              </motion.div>
              <span>using Next.js, TypeScript & Tailwind</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      {isButtonVisible && (
        <motion.button 
          onClick={scrollToTop}
          className={cn(
            "fixed right-6 bottom-6 p-3 rounded-full",
            "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
            "text-blue-500 dark:text-blue-400",
            "shadow-sm hover:shadow",
            "border border-gray-100/50 dark:border-gray-700/50",
            "transition-all z-30",
            "hidden md:flex"
          )}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ 
            y: -5,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </footer>
  );
} 