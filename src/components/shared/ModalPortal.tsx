"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useModal } from '@/context/ModalContext';

export default function ModalPortal() {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const { state, closeModal, setDirection } = useModal();
  const { isOpen, content, direction, options } = state;
  const { hasNavigation, onNext, onPrevious, modalKey, size = 'xl', className = '' } = options;

  // Create portal element on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if portal container exists
      let portalContainer = document.getElementById('modal-portal');
      
      // Create it if it doesn't exist
      if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'modal-portal';
        document.body.appendChild(portalContainer);
      }
      
      portalRef.current = portalContainer as HTMLDivElement;
      
      // Cleanup function
      return () => {
        if (portalContainer && portalContainer.childNodes.length === 0) {
          document.body.removeChild(portalContainer);
        }
      };
    }
  }, []);

  // Prevent scrolling of background content when modal is open
  useEffect(() => {
    if (isOpen) {
      // Add overlay class to html to prevent scrolling of background
      document.documentElement.classList.add('modal-open');
    } else {
      // Remove overlay class when modal closes
      document.documentElement.classList.remove('modal-open');
    }
    
    return () => {
      // Clean up on unmount
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Define size classes
  const getSizeClass = (size: string): string => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-2xl';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-5xl';
      case 'full': return 'max-w-full mx-4';
      default: return 'max-w-5xl';
    }
  };

  // Define animation variants with directional support
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const containerVariants = {
    hidden: (direction: 'next' | 'prev' | null) => ({
      opacity: 0, 
      x: direction === 'next' ? 75 : direction === 'prev' ? -75 : 0,
      y: !direction ? 15 : 0,
      scale: 0.96,
      rotateY: direction === 'next' ? 3 : direction === 'prev' ? -3 : 0,
    }),
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: { 
        type: "spring",
        damping: 22,
        stiffness: 250,
        mass: 0.6,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.25 } 
    }
  };

  // Handle navigation with direction
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('next');
    if (onNext) onNext();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('prev');
    if (onPrevious) onPrevious();
  };

  // If the portal element doesn't exist or modal is not open, return null
  if (!portalRef.current || !isOpen) return null;

  // Return portal with modal content
  return createPortal(
    <>
      {/* Fixed overlay with backdrop */}
      <motion.div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
      
      {/* Scrollable content container */}
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
        style={{ 
          overscrollBehavior: 'contain',
          paddingTop: 'min(10vh, 5rem)',
          paddingBottom: 'min(10vh, 5rem)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        {/* Desktop close button - fixed at top right */}
        <motion.button 
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          className="fixed top-4 right-4 z-[60] p-3 hidden md:flex items-center justify-center 
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 
            hover:text-gray-900 dark:hover:text-white rounded-full shadow-lg transition-all duration-300"
          aria-label="Close modal"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <FaTimes size={20} />
        </motion.button>
        
        {/* Mobile close button - fixed to screen */}
        <motion.button 
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          className="fixed top-4 right-4 z-[60] p-3 flex md:hidden items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full shadow-lg"
          aria-label="Close modal"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <FaTimes size={20} />
        </motion.button>
        
        {/* Navigation buttons - only if hasNavigation is true */}
        {hasNavigation && typeof onPrevious === 'function' && typeof onNext === 'function' && (
          <>
            {/* Desktop navigation - fixed at center height */}
            <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
              <motion.button 
                onClick={handlePrevious}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-[55] flex items-center justify-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg"
                aria-label="Previous item"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronLeft size={20} />
              </motion.button>
              
              <motion.button 
                onClick={handleNext}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-[55] flex items-center justify-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg"
                aria-label="Next item"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronRight size={20} />
              </motion.button>
            </div>
            
            {/* Mobile navigation - fixed at bottom of screen */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg" onClick={(e) => e.stopPropagation()}>
              <motion.button 
                onClick={handlePrevious}
                className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChevronLeft size={20} />
              </motion.button>
              
              <motion.button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 mx-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes size={20} />
              </motion.button>
              
              <motion.button 
                onClick={handleNext}
                className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChevronRight size={20} />
              </motion.button>
            </div>
          </>
        )}
        
        <motion.div 
          className={`w-full relative my-auto ${getSizeClass(size)} ${className}`}
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: "1200px" }}
        >
          {/* Content wrapper with animations */}
          <AnimatePresence mode="sync" custom={direction}>
            <motion.div
              key={modalKey || "modal-content"}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="relative"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>,
    portalRef.current
  );
} 