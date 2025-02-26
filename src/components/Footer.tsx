"use client";

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-gray-900 text-white py-12 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{PERSONAL_INFO.firstName}<span className="text-blue-500">{PERSONAL_INFO.lastName}</span></h3>
            <p className="text-gray-400 mb-4">
              {PERSONAL_INFO.shortBio}
            </p>
            <div className="flex space-x-4">
              <Link 
                href={PERSONAL_INFO.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </Link>
              <Link 
                href={PERSONAL_INFO.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </Link>
              <Link 
                href={PERSONAL_INFO.social.stackoverflow} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Stack Overflow"
              >
                <FaStackOverflow className="text-xl" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#tech" className="text-gray-400 hover:text-white transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-gray-400 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#experience" className="text-gray-400 hover:text-white transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="flex items-center text-gray-400 mb-2">
              <FaEnvelope className="mr-2" /> {PERSONAL_INFO.email}
            </p>
            <p className="text-gray-400 mb-4">
              {PERSONAL_INFO.location.remote}<br />
              Based in {PERSONAL_INFO.location.base}
            </p>
            <Link 
              href="#contact" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}. All rights reserved.
          </p>
          
          <div className="text-gray-500 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS. Deployed on Cloudflare Pages.
          </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
} 