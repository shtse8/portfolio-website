"use client";

import { motion } from 'framer-motion';
import { FaBrain, FaGraduationCap, FaGlobe, FaAward, FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';

// Credentials that set you apart
const CREDENTIALS = [
  {
    id: 'mensa',
    icon: FaBrain,
    title: 'Mensa International',
    subtitle: 'Member since 2004',
    description: 'Top 2% IQ worldwide',
    highlight: true,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800/50'
  },
  {
    id: 'education',
    icon: FaGraduationCap,
    title: 'Computer Science',
    subtitle: 'Chinese University of Hong Kong',
    description: 'Exchange: KTH Royal Institute of Technology, Sweden',
    highlight: false,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800/50'
  },
  {
    id: 'languages',
    icon: FaGlobe,
    title: 'Multilingual',
    subtitle: 'English · Cantonese · Mandarin',
    description: 'Native fluency in 3 languages',
    highlight: false,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50'
  },
  {
    id: 'github',
    icon: FaGithub,
    title: 'Arctic Code Vault',
    subtitle: 'GitHub Archive Program',
    description: 'Code preserved for 1,000 years',
    highlight: false,
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    borderColor: 'border-gray-200 dark:border-gray-700'
  },
];

export default function Credentials() {
  return (
    <section
      id="credentials"
      className="py-24 px-6"
      aria-labelledby="credentials-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 id="credentials-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Background
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Education, memberships, and recognitions.
          </p>
        </motion.div>

        {/* Credentials grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {CREDENTIALS.map((credential, index) => (
            <motion.div
              key={credential.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={cn(
                "relative p-5 rounded-xl border transition-all duration-300",
                "hover:shadow-md",
                credential.bgColor,
                credential.borderColor,
                credential.highlight && "md:col-span-2"
              )}
            >
              <div className={cn(
                "flex gap-4",
                credential.highlight ? "md:items-center" : "items-start"
              )}>
                {/* Icon */}
                <div className={cn(
                  "shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                  "bg-white dark:bg-gray-900 shadow-sm",
                  credential.color
                )}>
                  <credential.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    credential.highlight && "md:flex md:items-center md:justify-between md:gap-4"
                  )}>
                    <div>
                      <h3 className="font-medium text-text-primary">
                        {credential.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {credential.subtitle}
                      </p>
                    </div>
                    <p className={cn(
                      "text-sm mt-1",
                      credential.highlight ? "text-purple-600 dark:text-purple-400 font-medium md:mt-0" : "text-text-tertiary"
                    )}>
                      {credential.description}
                    </p>
                  </div>
                </div>

                {/* Highlight badge for Mensa */}
                {credential.highlight && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="mt-10 text-center text-sm text-text-tertiary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Based in London & Hong Kong · Available worldwide
        </motion.p>
      </div>
    </section>
  );
}
