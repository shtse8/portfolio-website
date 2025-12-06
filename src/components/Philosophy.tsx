"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Philosophy expressed as contrarian beliefs with evidence
const PHILOSOPHY_ITEMS = [
  {
    id: 'simplicity',
    belief: "Complexity is debt. Simplicity is wealth.",
    contrast: "Most add features to solve problems.",
    approach: "I remove complexity to reveal solutions.",
    evidence: "My libraries average 200 LOC. They do one thing well.",
    tags: ['minimalism', 'focus', 'clarity']
  },
  {
    id: 'speed',
    belief: "Ship fast, but never ship broken.",
    contrast: "Most trade quality for speed.",
    approach: "I use AI and automation to have both.",
    evidence: "4,600+ commits. Strict semantic versioning.",
    tags: ['velocity', 'quality', 'automation']
  },
  {
    id: 'users',
    belief: "If users need a manual, you've already failed.",
    contrast: "Most document after building.",
    approach: "I design interfaces that explain themselves.",
    evidence: "10M+ app downloads with 4.5+ star ratings.",
    tags: ['intuitive', 'user-first', 'self-explanatory']
  },
  {
    id: 'open',
    belief: "Open source isn't charity. It's leverage.",
    contrast: "Most keep solutions private.",
    approach: "I share to multiply impact and attract talent.",
    evidence: "500+ GitHub stars. Used in production worldwide.",
    tags: ['leverage', 'community', 'compounding']
  },
];

export default function Philosophy() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
            How I Think
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Beliefs that shape every decision I make.
          </p>
        </motion.div>

        {/* Philosophy cards - contrarian style */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PHILOSOPHY_ITEMS.map((item, index) => {
            const isHovered = hoveredId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group relative p-6 rounded-xl border bg-surface",
                  "border-border hover:border-accent/40",
                  "transition-all duration-300 hover:shadow-lg"
                )}
              >
                {/* Main belief - large quote */}
                <blockquote className="text-lg md:text-xl font-medium text-text-primary mb-4 leading-snug">
                  "{item.belief}"
                </blockquote>

                {/* Contrast + Approach */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-text-tertiary">
                    <span className="line-through opacity-60">{item.contrast}</span>
                  </p>
                  <p className="text-sm text-accent font-medium">
                    → {item.approach}
                  </p>
                </div>

                {/* Evidence */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">
                    Evidence
                  </p>
                  <p className="text-sm text-text-secondary">
                    {item.evidence}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-surface-elevated rounded text-text-tertiary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Index number */}
                <div className="absolute top-4 right-4 text-xs font-mono text-text-tertiary">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary equation */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-mono text-text-tertiary">
            value = impact / complexity
          </p>
        </motion.div>
      </div>
    </section>
  );
}
