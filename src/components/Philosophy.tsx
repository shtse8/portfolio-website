"use client";

import { motion } from 'framer-motion';
import { PHILOSOPHY_PRINCIPLES } from '@/data';

export default function Philosophy() {
  // Only show core principles (most important)
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

        {/* Principles list - simple typography-focused layout */}
        <div className="space-y-12 max-w-2xl mx-auto">
          {corePrinciples.map((principle, index) => (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {principle.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {principle.shortDescription}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
