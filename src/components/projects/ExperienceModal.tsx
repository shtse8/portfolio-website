"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { Experience, COMPANIES } from '../../data/portfolioData';

type ExperienceModalProps = {
  experience: Experience;
  closeModal: () => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  modalContentRef: React.RefObject<HTMLDivElement>;
};

export default function ExperienceModal({
  experience,
  closeModal,
  openCompanyModal,
  parseMarkdownLinks,
  modalContentRef
}: ExperienceModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);
  
  return (
    <div 
      ref={modalContentRef}
      className="bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{experience.period}</h2>
        <button 
          onClick={closeModal}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={24} />
        </button>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Founder & Lead Developer
            </h3>
            <span className="mx-2 text-gray-500 dark:text-gray-400">at</span>
            {COMPANIES[experience.company] && (
              <button
                onClick={() => openCompanyModal(experience.company)}
                className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <span className="w-6 h-6 mr-2 relative">
                  <Image
                    src={COMPANIES[experience.company].logo}
                    alt={COMPANIES[experience.company].name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-sm"
                  />
                </span>
                {COMPANIES[experience.company].name}
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            {experience.liveUrl && (
              <Link 
                href={experience.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={18} />
              </Link>
            )}
          </div>
        </div>
        
        {/* Experience Image */}
        <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        
        {/* Experience Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">{experience.description}</p>
        
        {/* Experience Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Highlights</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            {experience.details.map((detail, index) => (
              <li key={index}>{parseMarkdownLinks(detail)}</li>
            ))}
          </ul>
        </div>
        
        {/* Technologies */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Skills & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {experience.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 