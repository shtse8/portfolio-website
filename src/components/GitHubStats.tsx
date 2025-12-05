"use client";

import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaCode } from 'react-icons/fa';
import { GITHUB_STATS } from '@/data/personal';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay?: number;
}

const StatCard = ({ icon, value, label, delay = 0 }: StatCardProps) => (
  <motion.div
    className="flex flex-col items-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/30
               border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm
               hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4 }}
  >
    <div className="text-blue-500 dark:text-blue-400 mb-2">
      {icon}
    </div>
    <span className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </span>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</span>
  </motion.div>
);

export default function GitHubStats() {
  const stats = [
    { icon: <FaStar className="w-5 h-5" />, value: `${GITHUB_STATS.totalStars}+`, label: 'GitHub Stars' },
    { icon: <FaCodeBranch className="w-5 h-5" />, value: GITHUB_STATS.totalRepos, label: 'Repositories' },
    { icon: <FaCode className="w-5 h-5" />, value: `${GITHUB_STATS.totalCommits.toLocaleString()}+`, label: 'Commits' },
    { icon: <FaUsers className="w-5 h-5" />, value: GITHUB_STATS.followers, label: 'Followers' },
  ];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <FaGithub className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
          OPEN SOURCE ACTIVITY
        </span>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Featured Project Banner */}
      <motion.a
        href={`https://github.com/SylphxAI/${GITHUB_STATS.featuredRepo.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-between p-4 rounded-xl
                   bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                   border border-blue-100 dark:border-blue-800/30
                   hover:border-blue-300 dark:hover:border-blue-700/50
                   transition-all duration-300 group"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-400/10">
            <FaStar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {GITHUB_STATS.featuredRepo.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {GITHUB_STATS.featuredRepo.description}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <FaStar className="w-4 h-4" />
          <span className="font-medium">{GITHUB_STATS.featuredRepo.stars}+</span>
        </div>
      </motion.a>

      {/* Organizations */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-2 flex-wrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-gray-400 dark:text-gray-500">Organizations:</span>
        {GITHUB_STATS.organizations.map((org) => (
          <a
            key={org}
            href={`https://github.com/${org}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800
                     text-gray-600 dark:text-gray-400 hover:text-blue-500
                     dark:hover:text-blue-400 transition-colors"
          >
            @{org}
          </a>
        ))}
      </motion.div>
    </motion.div>
  );
}
