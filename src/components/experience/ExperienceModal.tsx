"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight, FaBuilding } from 'react-icons/fa';
import Link from 'next/link';
import { COMPANIES, Experience } from '@/data/portfolioData';

type ExperienceModalProps = {
  experience: Experience;
  experiences: Experience[];
  selectedExperienceIndex: number;
  setSelectedExperienceIndex: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => React.ReactNode;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  modalContentRef: React.RefObject<HTMLDivElement>;
};

export default function ExperienceModal({
  experience,
  experiences,
  setSelectedExperienceIndex,
  closeModal,
  openCompanyModal,
  parseMarkdownLinks,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  modalContentRef
}: ExperienceModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        setSelectedExperienceIndex(prev => (prev + 1) % experiences.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedExperienceIndex(prev => (prev - 1 + experiences.length) % experiences.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, setSelectedExperienceIndex, experiences.length]);

  return (
    <div 
      ref={modalContentRef}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button 
        onClick={closeModal}
        className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
        aria-label="Close modal"
      >
        <FaTimes />
      </button>
      
      {experiences.length > 1 && (
        <>
          <button 
            onClick={() => setSelectedExperienceIndex(prev => (prev - 1 + experiences.length) % experiences.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
            aria-label="Previous experience"
          >
            <FaChevronLeft />
          </button>
          
          <button 
            onClick={() => setSelectedExperienceIndex(prev => (prev + 1) % experiences.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
            aria-label="Next experience"
          >
            <FaChevronRight />
          </button>
        </>
      )}
      
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-8">
          <div 
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 cursor-pointer"
            onClick={() => openCompanyModal(experience.company)}
            title={`View company details`}
          >
            <Image 
              src={experience.logo}
              alt={experience.company}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-medium rounded-full">
                Professional Experience
              </span>
              
              {/* Link to related company */}
              <button 
                type="button"
                className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors"
                onClick={() => openCompanyModal(experience.company)}
                title={`View company details`}
              >
                <FaBuilding className="text-xs mr-1" /> 
                {COMPANIES[experience.company]?.name || experience.company}
              </button>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{experience.title}</h3>
            <div className="flex items-center">
              <button 
                className="text-gray-600 dark:text-gray-400 text-lg hover:underline"
                onClick={() => openCompanyModal(experience.company)}
              >
                {experience.company}
              </button>
              <span className="mx-2 text-gray-400">•</span>
              <p className="text-gray-500 dark:text-gray-500">{experience.period}</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="order-2 md:order-1 animate-slideInRight">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <FaCalendarAlt className="mr-2" />
              <span>{experience.location || 'Remote'}</span>
            </div>
            
            <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                Key Achievements
              </h4>
              <ul className="space-y-3">
                {experience.details.map((detail: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {experience.tags.map((tech: string, idx: number) => (
                <span 
                  key={idx}
                  className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            {experience.liveUrl && (
              <div className="flex gap-4">
                <Link 
                  href={experience.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                >
                  <FaExternalLinkAlt /> Visit Website
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 