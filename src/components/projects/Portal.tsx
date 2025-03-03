import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaShareAlt, FaTimes } from 'react-icons/fa';
import type { Project } from '@/data/types';
import { getSkillNames } from '@/utils/skillHelpers';

type PortalModalProps = {
  project: Project;
  onClose: () => void;
};

export default function PortalModal({ project, onClose }: PortalModalProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl w-full shadow-xl max-h-[80vh] flex flex-col overflow-hidden"
    >
      {/* Header with preview image */}
      <div className="h-[300px] relative w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold">{project.title}</h2>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all z-10"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
      </div>
      
      <motion.div
        className="p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.2 } }}
      >
        {/* Project description */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-5">
            {project.description}
          </p>
          
          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.skills && getSkillNames(project.skills).map((skillName, index) => (
              <span 
                key={index} 
                className="text-xs px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-md"
              >
                {skillName}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <FaExternalLinkAlt className="mr-2" />
              Live Demo
            </motion.a>
          )}
          
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <FaGithub className="mr-2" />
              View Code
            </motion.a>
          )}
          
          <motion.button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({
                  title: project.title,
                  text: project.description,
                  url: window.location.href,
                });
              }
            }}
            className="inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <FaShareAlt className="mr-2" />
            Share
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
} 