/**
 * Color mapping utilities for Philosophy component
 */

type ColorMapping = Record<string, string>;

export const bgColorMap: ColorMapping = {
  'neutral-800': 'bg-neutral-800',
  'blue-500': 'bg-blue-500',
  'indigo-400': 'bg-indigo-400',
  'emerald-500': 'bg-emerald-500',
  'amber-400': 'bg-amber-400',
  'rose-500': 'bg-rose-500',
  'teal-500': 'bg-teal-500',
  'violet-500': 'bg-violet-500',
  'yellow-500': 'bg-yellow-500',
  'green-600': 'bg-green-600',
  'cyan-600': 'bg-cyan-600',
  'blue-400': 'bg-blue-400'
};

export const textColorMap: ColorMapping = {
  'neutral-100': 'text-neutral-100',
  'blue-50': 'text-blue-50',
  'indigo-50': 'text-indigo-50',
  'emerald-50': 'text-emerald-50',
  'amber-50': 'text-amber-50',
  'rose-50': 'text-rose-50',
  'teal-50': 'text-teal-50',
  'violet-50': 'text-violet-50',
  'yellow-50': 'text-yellow-50',
  'green-50': 'text-green-50',
  'cyan-50': 'text-cyan-50'
};

export const getBgColorClass = (colorName: string): string =>
  bgColorMap[colorName] || 'bg-gray-500';

export const getTextColorClass = (colorName: string): string =>
  textColorMap[colorName] || 'text-white';
