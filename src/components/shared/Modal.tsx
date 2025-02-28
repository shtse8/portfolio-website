"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hasNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
};

// Define props that will be added to the child element
interface AnimatedChildProps extends MotionProps {
  onClick?: (e: React.MouseEvent) => void;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  hasNavigation = false,
  onNext,
  onPrevious,
}: ModalProps) {
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
  
  // Define animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        mass: 0.5,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: 5, 
      transition: { duration: 0.2 } 
    }
  };

  // Function to add animation properties to child elements
  const renderChildrenWithAnimations = () => {
    // If children is not a React element (could be a string, number, etc), just return it
    if (!React.isValidElement(children)) {
      return children;
    }

    // Clone the element with animation props
    return React.cloneElement(
      children as React.ReactElement<AnimatedChildProps>, 
      {
        // Apply the animation variants to the main child element (should be the modal container)
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        variants: containerVariants,
        // Make sure onClick doesn't bubble and close the modal
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // Forward the click event if the original child had an onClick handler
          const childOnClick = (children as React.ReactElement<AnimatedChildProps>).props.onClick;
          if (typeof childOnClick === 'function') {
            childOnClick(e);
          }
        }
      }
    );
  };
  
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
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
              onClose();
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
                onClose();
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
                onClose();
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrevious();
                    }}
                    className="fixed left-4 top-1/2 -translate-y-1/2 z-[55] flex items-center justify-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg"
                    aria-label="Previous item"
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronLeft size={20} />
                  </motion.button>
                  
                  <motion.button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrevious();
                    }}
                    className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChevronLeft size={20} />
                  </motion.button>
                  
                  <motion.button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 mx-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes size={20} />
                  </motion.button>
                  
                  <motion.button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
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
              className="w-full max-w-5xl relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content - automatically inject animation props */}
              {renderChildrenWithAnimations()}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 