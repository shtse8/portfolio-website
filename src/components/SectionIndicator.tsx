"use client";

import { useEffect, useMemo, useState } from 'react';
import { useNavigationStore } from '@/context/NavigationContext';
import { SECTIONS } from '@/config/sections';

export default function SectionIndicator() {
  const [mounted, setMounted] = useState(false);
  const activeSection = useNavigationStore(state => state.activeSection);

  useEffect(() => {
    setMounted(true);
  }, []);

  const label = useMemo(() => {
    const item = SECTIONS.find(s => s.id === activeSection);
    return item ? item.label : activeSection;
  }, [activeSection]);

  if (!mounted || !activeSection) return null;

  return (
    <div className="fixed top-20 left-4 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-md hidden md:block">
      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        Currently viewing: <span className="font-bold">{label}</span>
      </div>
    </div>
  );
}