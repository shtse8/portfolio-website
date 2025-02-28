"use client";

import { ReactNode, useCallback } from 'react';
import { useModal, ModalOptions } from '@/context/ModalContext';

// Define generic prop types for each modal type
type ProjectModalProps = {
  project: { id: string | number };
  nextProject?: () => void;
  prevProject?: () => void;
  closeModal: () => void;
  // Allow other props without using any
  [key: string]: unknown;
};

type SkillModalProps = {
  skillId: string | number;
  nextSkill: () => void;
  prevSkill: () => void;
  closeModal: () => void;
  // Allow other props without using any
  [key: string]: unknown;
};

type ExperienceModalProps = {
  experience: { id: string | number };
  nextExperience?: () => void;
  prevExperience?: () => void;
  closeModal: () => void;
  // Allow other props without using any
  [key: string]: unknown;
};

type CompanyModalProps = {
  company: { id: string | number };
  closeModal: () => void;
  // Allow other props without using any
  [key: string]: unknown;
};

/**
 * Custom hook for easier modal management in components
 * Provides simplified functions for common modal operations
 */
export function useModalManager() {
  const { openModal, closeModal, updateModalContent, setDirection, state } = useModal();
  
  /**
   * Open a modal with the provided content and options
   */
  const open = useCallback((content: ReactNode, options?: ModalOptions) => {
    openModal(content, options);
  }, [openModal]);
  
  /**
   * Open a project modal
   */
  const openProject = useCallback(<T extends ProjectModalProps>(
    ProjectModal: React.ComponentType<T>, 
    props: T, 
    options?: ModalOptions
  ) => {
    const modalContent = <ProjectModal {...props} />;
    openModal(modalContent, {
      hasNavigation: !!props.nextProject && !!props.prevProject,
      onNext: props.nextProject,
      onPrevious: props.prevProject,
      modalKey: props.project?.id,
      ...options
    });
  }, [openModal]);
  
  /**
   * Open a skill modal
   */
  const openSkill = useCallback(<T extends SkillModalProps>(
    SkillModal: React.ComponentType<T>, 
    props: T, 
    options?: ModalOptions
  ) => {
    const modalContent = <SkillModal {...props} />;
    openModal(modalContent, {
      hasNavigation: true,
      onNext: props.nextSkill,
      onPrevious: props.prevSkill,
      modalKey: props.skillId,
      ...options
    });
  }, [openModal]);
  
  /**
   * Open an experience modal
   */
  const openExperience = useCallback(<T extends ExperienceModalProps>(
    ExperienceModal: React.ComponentType<T>, 
    props: T, 
    options?: ModalOptions
  ) => {
    const modalContent = <ExperienceModal {...props} />;
    openModal(modalContent, {
      hasNavigation: !!props.nextExperience && !!props.prevExperience,
      onNext: props.nextExperience,
      onPrevious: props.prevExperience,
      modalKey: props.experience?.id,
      ...options
    });
  }, [openModal]);
  
  /**
   * Open a company modal
   */
  const openCompany = useCallback(<T extends CompanyModalProps>(
    CompanyModal: React.ComponentType<T>, 
    props: T, 
    options?: ModalOptions
  ) => {
    const modalContent = <CompanyModal {...props} />;
    openModal(modalContent, {
      modalKey: props.company?.id,
      ...options
    });
  }, [openModal]);
  
  /**
   * Update the content of the current modal with next/prev animations
   */
  const goToNext = useCallback((content: ReactNode) => {
    setDirection('next');
    updateModalContent(content);
  }, [setDirection, updateModalContent]);
  
  const goToPrevious = useCallback((content: ReactNode) => {
    setDirection('prev');
    updateModalContent(content);
  }, [setDirection, updateModalContent]);
  
  return {
    isOpen: state.isOpen,
    currentContent: state.content,
    open,
    openProject,
    openSkill, 
    openExperience,
    openCompany,
    close: closeModal,
    goToNext,
    goToPrevious
  };
} 