"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/utils/motion';

export const ContactBackground = React.memo(() => {
  const reducedMotion = prefersReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/20 dark:from-gray-900/90 dark:to-blue-950/10"></div>

      {/* Abstract patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="contactGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contactGrid)" />
      </svg>

      {/* Accent elements */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-blue-400/5 dark:bg-blue-500/5 blur-3xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-300/5 dark:bg-indigo-400/5 blur-3xl"
            animate={{
              y: [0, -15, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </>
      )}
    </div>
  );
});

ContactBackground.displayName = 'ContactBackground';
