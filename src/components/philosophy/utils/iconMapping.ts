/**
 * Icon mapping for Philosophy component
 */

import {
  FaTools, FaUsers, FaFingerprint, FaRocket, FaCode, FaLightbulb,
  FaRegSquare, FaLayerGroup, FaGlasses, FaHandPointer, FaRegSmile,
  FaRecycle, FaCodeBranch, FaBolt, FaMinusCircle, FaFileAlt,
  FaPalette, FaAlignLeft, FaSwatchbook, FaExpandAlt
} from 'react-icons/fa';

export const iconMap = {
  FaTools,
  FaUsers,
  FaFingerprint,
  FaRocket,
  FaCode,
  FaLightbulb,
  FaRegSquare,
  FaLayerGroup,
  FaGlasses,
  FaHandPointer,
  FaRegSmile,
  FaRecycle,
  FaCodeBranch,
  FaBolt,
  FaMinusCircle,
  FaFileAlt,
  FaPalette,
  FaAlignLeft,
  FaSwatchbook,
  FaExpandAlt
} as const;

export type IconName = keyof typeof iconMap;
