"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

// Types
type ModalContent = ReactNode;
type NavigationDirection = 'next' | 'prev' | null;

export type ModalOptions = {
  hasNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  modalKey?: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

type ModalState = {
  isOpen: boolean;
  content: ModalContent | null;
  direction: NavigationDirection;
  options: ModalOptions;
};

type ModalAction =
  | { type: 'OPEN_MODAL'; payload: { content: ModalContent; options?: ModalOptions } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_DIRECTION'; payload: { direction: NavigationDirection } }
  | { type: 'UPDATE_CONTENT'; payload: { content: ModalContent; direction?: NavigationDirection } };

type ModalContextType = {
  state: ModalState;
  openModal: (content: ModalContent, options?: ModalOptions) => void;
  closeModal: () => void;
  updateModalContent: (content: ModalContent, direction?: NavigationDirection) => void;
  setDirection: (direction: NavigationDirection) => void;
};

// Initial state
const initialState: ModalState = {
  isOpen: false,
  content: null,
  direction: null,
  options: {}
};

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Reducer function
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpen: true,
        content: action.payload.content,
        options: action.payload.options || {},
        direction: null
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isOpen: false,
        direction: null
      };
    case 'SET_DIRECTION':
      return {
        ...state,
        direction: action.payload.direction
      };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        content: action.payload.content,
        direction: action.payload.direction || state.direction
      };
    default:
      return state;
  }
}

// Provider component
export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const openModal = useCallback((content: ModalContent, options?: ModalOptions) => {
    dispatch({ type: 'OPEN_MODAL', payload: { content, options } });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const updateModalContent = useCallback((content: ModalContent, direction?: NavigationDirection) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { content, direction } });
  }, []);

  const setDirection = useCallback((direction: NavigationDirection) => {
    dispatch({ type: 'SET_DIRECTION', payload: { direction } });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        state,
        openModal,
        closeModal,
        updateModalContent,
        setDirection
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// Custom hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
} 