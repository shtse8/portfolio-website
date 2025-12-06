"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHILOSOPHY_PRINCIPLES } from '@/data';
import {
  FaLightbulb, FaUsers, FaCode, FaRocket,
  FaLayerGroup, FaBolt, FaFingerprint, FaTools,
  FaChevronDown
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

// Icon mapping for principles
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FaLightbulb, FaUsers, FaCode, FaRocket,
  FaLayerGroup, FaBolt, FaFingerprint, FaTools
};

// Color schemes for cards (subtle, not overwhelming)
const COLOR_SCHEMES = [
  { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800/50', icon: 'text-blue-500', activeBorder: 'border-blue-400 dark:border-blue-600' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/50', icon: 'text-emerald-500', activeBorder: 'border-emerald-400 dark:border-emerald-600' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800/50', icon: 'text-violet-500', activeBorder: 'border-violet-400 dark:border-violet-600' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800/50', icon: 'text-amber-500', activeBorder: 'border-amber-400 dark:border-amber-600' },
];

export default function Philosophy() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Show core principles
  const corePrinciples = PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'core').slice(0, 4);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      id="philosophy"
      className="py-24 px-6"
      aria-labelledby="philosophy-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 id="philosophy-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Philosophy
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Guiding principles that shape my approach to building software.
          </p>
        </motion.div>

        {/* Principles grid - cards with icons */}
        <div className="grid md:grid-cols-2 gap-6">
          {corePrinciples.map((principle, index) => {
            const IconComponent = ICON_MAP[principle.icon as keyof typeof ICON_MAP] || FaLightbulb;
            const colors = COLOR_SCHEMES[index % COLOR_SCHEMES.length];
            const isExpanded = expandedId === principle.id;

            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => toggleExpand(principle.id)}
                className={cn(
                  "group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                  "hover:shadow-lg hover:-translate-y-1",
                  colors.bg,
                  isExpanded ? colors.activeBorder : colors.border
                )}
              >
                {/* Icon + Header */}
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                    "bg-white dark:bg-gray-900 shadow-sm",
                    colors.icon
                  )}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-medium text-text-primary">
                        {principle.title}
                      </h3>
                      <FaChevronDown className={cn(
                        "w-4 h-4 text-text-tertiary transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )} />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mt-1">
                      {principle.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-current/10">
                        <p className="text-text-secondary text-sm leading-relaxed mb-4">
                          {principle.fullDescription}
                        </p>

                        {principle.keyPoints && principle.keyPoints.length > 0 && (
                          <ul className="space-y-2">
                            {principle.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", colors.icon.replace('text-', 'bg-'))} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Click hint */}
                {!isExpanded && (
                  <p className="text-xs text-text-tertiary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to read more
                  </p>
                )}

                {/* Subtle decorative element */}
                <div className={cn(
                  "absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-50 pointer-events-none",
                  colors.bg
                )} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
