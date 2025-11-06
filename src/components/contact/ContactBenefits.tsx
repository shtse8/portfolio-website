"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaRegLightbulb, FaRegCommentDots, FaUsers, FaRegClock } from 'react-icons/fa';
import { staggerContainerVariants, slideUpVariants } from '@/utils/motion';

const benefits = [
  {
    icon: <FaRegLightbulb />,
    title: "Innovative Approach",
    description: "Every project begins with fresh ideas and creative thinking"
  },
  {
    icon: <FaRegCommentDots />,
    title: "Clear Communication",
    description: "Regular updates and transparent discussion throughout"
  },
  {
    icon: <FaUsers />,
    title: "Collaborative Process",
    description: "Working together to achieve your vision and goals"
  },
  {
    icon: <FaRegClock />,
    title: "Timely Delivery",
    description: "Respect for deadlines and efficient workflow management"
  }
];

export const ContactBenefits = React.memo(() => {
  return (
    <motion.div
      className="grid sm:grid-cols-2 gap-6 mt-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm p-5 rounded-xl border border-gray-100/70 dark:border-gray-700/20 flex"
          variants={slideUpVariants}
        >
          <div className="mr-4 bg-blue-100/70 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 p-3 rounded-full h-min">
            {benefit.icon}
          </div>
          <div>
            <h4 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-1">{benefit.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

ContactBenefits.displayName = 'ContactBenefits';
