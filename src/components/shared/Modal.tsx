"use client";

import React from 'react';

/**
 * Modal component - simplified wrapper
 * The actual modal implementation is handled by ModalPortal
 */
export default function Modal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 