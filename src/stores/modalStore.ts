"use client";

import { create } from 'zustand';
import { ReactNode } from 'react';

// Types
export type ModalOptions = {
  hasNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  modalKey?: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

type NavigationDirection = 'next' | 'prev' | null;

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  direction: NavigationDirection;
  options: ModalOptions;

  // Actions
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  updateModalContent: (content: ReactNode, direction?: NavigationDirection) => void;
  setDirection: (direction: NavigationDirection) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Initial state
  isOpen: false,
  content: null,
  direction: null,
  options: {},

  // Actions
  openModal: (content, options = {}) =>
    set({
      isOpen: true,
      content,
      options,
      direction: null
    }),

  closeModal: () =>
    set({
      isOpen: false,
      direction: null
    }),

  updateModalContent: (content, direction) =>
    set((state) => ({
      content,
      direction: direction !== undefined ? direction : state.direction
    })),

  setDirection: (direction) =>
    set({ direction })
}));

/**
 * Compatibility hook that mimics the old useModal interface
 */
export function useModal() {
  const store = useModalStore();

  return {
    state: {
      isOpen: store.isOpen,
      content: store.content,
      direction: store.direction,
      options: store.options
    },
    openModal: store.openModal,
    closeModal: store.closeModal,
    updateModalContent: store.updateModalContent,
    setDirection: store.setDirection
  };
}
