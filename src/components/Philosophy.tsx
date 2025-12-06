"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHILOSOPHY_PRINCIPLES } from '@/data';
import { cn } from '@/lib/utils';

// Select key principles for display (mix of categories)
const DISPLAY_PRINCIPLES = PHILOSOPHY_PRINCIPLES.filter(p =>
  ['minimal', 'clarity', 'intuitive', 'users', 'efficiency', 'open'].includes(p.id)
);

export default function Philosophy() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
            Guiding principles that shape how I build software.
          </p>
        </motion.div>

        {/* Manifesto-style list */}
        <div className="max-w-3xl mx-auto">
          {DISPLAY_PRINCIPLES.map((principle, index) => {
            const isExpanded = expandedId === principle.id;
            const number = String(index + 1).padStart(2, '0');

            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : principle.id)}
                  className={cn(
                    "w-full text-left py-6 border-b border-border",
                    "hover:bg-surface-elevated/50 transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  )}
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    {/* Number */}
                    <span className="text-sm font-mono text-accent mt-1 shrink-0 w-6">
                      {number}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-medium text-text-primary group-hover:text-accent transition-colors capitalize">
                            {principle.title}
                          </h3>
                          <p className="text-text-secondary text-sm md:text-base mt-0.5">
                            {principle.shortDescription}
                          </p>
                        </div>

                        {/* Expand indicator */}
                        <div className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                          isExpanded
                            ? "bg-accent border-accent text-white rotate-45"
                            : "border-border text-text-tertiary group-hover:border-accent group-hover:text-accent"
                        )}>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 md:pl-12 pr-4 py-6 bg-surface-elevated/30 border-b border-border">
                        <p className="text-text-secondary leading-relaxed mb-5 max-w-2xl">
                          {principle.fullDescription}
                        </p>

                        {/* Key points as tags */}
                        {principle.keyPoints && principle.keyPoints.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {principle.keyPoints.map((point, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1.5 bg-accent-subtle text-accent rounded-full text-sm"
                              >
                                {point}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          className="mt-12 text-center text-sm text-text-tertiary max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          These principles guide every project — from architecture decisions to pixel-level details.
        </motion.p>
      </div>
    </section>
  );
}
