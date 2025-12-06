"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import type { Role } from '@/data/types';
import { ORGANIZATIONS } from '@/data/organizations';
import { formatPeriod } from '@/data';
import { motion } from 'framer-motion';
import { getSkillNames } from '@/utils/skillHelpers';

type ExperienceModalProps = {
  experience: Role;
  nextExperience?: () => void;
  prevExperience?: () => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  closeModal?: () => void;
};

export default function ExperienceModal({
  experience: role,
  nextExperience,
  prevExperience,
  openCompanyModal,
  parseMarkdownLinks
}: ExperienceModalProps) {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && nextExperience) {
        nextExperience();
      } else if (e.key === 'ArrowLeft' && prevExperience) {
        prevExperience();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextExperience, prevExperience]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
      {/* Experience Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {role.logo && (
                <div className="w-20 h-20 relative overflow-hidden rounded-lg shadow-sm">
                  <Image
                    src={role.logo}
                    alt={role.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-white mb-2">
                  {role.title}
                </h2>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  {role.organizationId && (
                    <>
                      <button
                        onClick={() => openCompanyModal(role.organizationId as string)}
                        className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      >
                        <FaBuilding className="mr-2 text-blue-500 dark:text-blue-400" />
                        <span className="underline-offset-4 hover:underline">
                          {ORGANIZATIONS[role.organizationId]?.name || role.organizationId}
                        </span>
                      </button>
                      <span className="mx-3">•</span>
                    </>
                  )}
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    {role.location}
                  </span>
                  <span className="mx-3">•</span>
                  <span>{formatPeriod(role.period)}</span>
                </div>
              </div>
            </div>
            
            {/* Removed navigation controls - now handled by modal context */}
          </div>
          
          {/* Tabs */}
          <div className="flex mt-8 gap-4 border-b border-blue-100/50 dark:border-blue-900/30">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
              {activeTab === 'overview' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                  layoutId="activeTabIndicator"
                />
              )}
            </button>
            
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'details'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
              {activeTab === 'details' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                  layoutId="activeTabIndicator"
                />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Tab Content */}
        <div className="p-10">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="prose dark:prose-invert prose-lg max-w-none"
            >
              <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                {role.description}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {role.skills && getSkillNames(role.skills).map((skillName, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
              
              {role.liveUrl && (
                <div className="mt-8">
                  <a
                    href={role.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    <span>Visit Project</span>
                  </a>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="space-y-6 text-gray-700 dark:text-gray-300">
                {role.responsibilities.map((detail, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                    </div>
                    <p className="flex-1 font-light leading-relaxed">
                      {parseMarkdownLinks(detail)}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 