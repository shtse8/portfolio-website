"use client";

import { useState, useEffect } from 'react';
import { FaTerminal, FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';

export default function Hero() {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [mounted, setMounted] = useState(false);
  const fullText = 'Full Stack Developer & Founder';
  
  useEffect(() => {
    setMounted(true);
    
    // Start typing animation only after component is mounted
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [text]);
  
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, [mounted]);
  
  // During SSR or before mounting, render a static version
  const staticTitle = mounted ? null : (
    <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-mono">
      {fullText}
    </h2>
  );
  
  // Only render the interactive text after mounting
  const dynamicTitle = mounted ? (
    <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-mono">
      {text}<span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </h2>
  ) : null;
  
  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-full">
          <span className="font-mono">Hello, World!</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Kyle Tse
        </h1>
        
        <div className="h-12 mb-8">
          {staticTitle}
          {dynamicTitle}
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <Link 
            href="#projects" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            View Projects <FaTerminal className="ml-2" />
          </Link>
          <Link 
            href="#contact" 
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Contact Me
          </Link>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaArrowDown className="text-blue-600 text-2xl" />
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </section>
  );
} 