"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaArrowUp, FaMapMarkerAlt } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';

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
  
  if (!mounted) return null;

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* About Column */}
          <div className="md:col-span-4">
            <h3 className="text-xl font-normal mb-4 tracking-tight">
              <span className="text-primary-500">{PERSONAL_INFO.firstName}</span>
              <span className="ml-1">{PERSONAL_INFO.lastName}</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-md font-light text-sm">
              {PERSONAL_INFO.shortBio || 'Building innovative digital experiences with clean code and modern technologies.'}
            </p>
            <div className="flex space-x-4 mb-8">
              <a
                href={PERSONAL_INFO.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </a>
              <a 
                href={PERSONAL_INFO.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
              </a>
              <a 
                href={PERSONAL_INFO.social.stackoverflow} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Stack Overflow"
              >
                <FaStackOverflow className="text-lg" />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="md:col-span-3 md:ml-auto">
            <h3 className="text-sm uppercase tracking-wider mb-4 text-gray-500 font-light">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="#hero" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="#tech-stack" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Technologies
                </Link>
              </li>
              <li>
                <Link 
                  href="#projects" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  href="#experience" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link 
                  href="#contact" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-4">
            <h3 className="text-sm uppercase tracking-wider mb-4 text-gray-500 font-light">
              Contact
            </h3>
            <div className="space-y-3 mb-6">
              <p className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="mr-3 text-gray-500" /> 
                <a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a>
              </p>
              <p className="flex items-start text-sm text-gray-400">
                <FaMapMarkerAlt className="mr-3 mt-1 text-gray-500" />
                <span>
                  {PERSONAL_INFO.location.remote}<br />
                  Based in {PERSONAL_INFO.location.base}
                </span>
              </p>
            </div>
            <a 
              href="#contact" 
              className="inline-flex items-center border border-gray-700 text-white px-5 py-2 hover:bg-gray-800 transition-colors text-sm"
            >
              Get In Touch
            </a>
          </div>
        </div>
        
        {/* Bottom Area */}
        <div className="mt-16 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
          </p>
          
          <div className="text-gray-500 text-xs">
            Built with Next.js, TypeScript, and Tailwind CSS
          </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 p-3 bg-gray-800 hover:bg-gray-700 text-white"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-sm" />
      </button>
    </footer>
  );
} 