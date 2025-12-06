"use client";

import { motion } from 'framer-motion';
import { PHILOSOPHY_PRINCIPLES } from '@/data';
import {
  FaLightbulb, FaUsers, FaCode, FaRocket,
  FaLayerGroup, FaBolt, FaFingerprint, FaTools
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

// Icon mapping for principles
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FaLightbulb, FaUsers, FaCode, FaRocket,
  FaLayerGroup, FaBolt, FaFingerprint, FaTools
};

// Color schemes for cards (subtle, not overwhelming)
const COLOR_SCHEMES = [
  { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800/50', icon: 'text-blue-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/50', icon: 'text-emerald-500' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800/50', icon: 'text-violet-500' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800/50', icon: 'text-amber-500' },
];

export default function Philosophy() {
  // Show core principles
  const corePrinciples = PHILOSOPHY_PRINCIPLES.filter(p => p.category === 'core').slice(0, 4);

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

            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={cn(
                  "group relative p-6 rounded-xl border transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1",
                  colors.bg, colors.border
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  "bg-white dark:bg-gray-900 shadow-sm",
                  colors.icon
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {principle.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {principle.shortDescription}
                </p>

                {/* Subtle decorative element */}
                <div className={cn(
                  "absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-50",
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
