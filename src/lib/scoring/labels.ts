// src/lib/scoring/labels.ts
// Score → human-readable labels and colors

export interface ScoreLabel {
  label: string
  color: string        // Tailwind class
  hex: string          // CSS hex for charts
  range: [number, number]
}

// Generic thresholds (configurable by admin in DB — these are defaults)
export const SCORE_THRESHOLDS = {
  low: 25,
  mild: 50,
  moderate: 75,
  high: 100,
}

/**
 * For "positive" dimensions (empathy, motivation, confidence, etc.)
 * Higher = better
 */
export function getPositiveLabel(score: number): ScoreLabel {
  if (score >= 80) return { label: 'Strong', color: 'text-emerald-700 bg-emerald-50', hex: '#059669', range: [80, 100] }
  if (score >= 60) return { label: 'Good', color: 'text-teal-700 bg-teal-50', hex: '#0d9488', range: [60, 79] }
  if (score >= 40) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50', hex: '#d97706', range: [40, 59] }
  if (score >= 20) return { label: 'Needs Support', color: 'text-orange-700 bg-orange-50', hex: '#ea580c', range: [20, 39] }
  return { label: 'Low', color: 'text-red-700 bg-red-50', hex: '#dc2626', range: [0, 19] }
}

/**
 * For "stress/pressure" dimensions (stress, academicPressure, etc.)
 * Higher = worse
 */
export function getStressLabel(score: number): ScoreLabel {
  if (score >= 76) return { label: 'High Indicator', color: 'text-red-700 bg-red-50', hex: '#dc2626', range: [76, 100] }
  if (score >= 51) return { label: 'Elevated', color: 'text-orange-700 bg-orange-50', hex: '#ea580c', range: [51, 75] }
  if (score >= 26) return { label: 'Mild', color: 'text-amber-700 bg-amber-50', hex: '#d97706', range: [26, 50] }
  return { label: 'Low Indicator', color: 'text-emerald-700 bg-emerald-50', hex: '#059669', range: [0, 25] }
}

// Category metadata — display names, whether stress-type, chart color
export const CATEGORY_META: Record<string, {
  name: string
  description: string
  isStressType: boolean
  chartColor: string
  icon: string
}> = {
  empathy: {
    name: 'Empathy',
    description: 'Ability to understand and share the feelings of others',
    isStressType: false,
    chartColor: '#6366f1',
    icon: 'Heart',
  },
  humanity: {
    name: 'Humanity',
    description: 'Compassion and care for others\' well-being',
    isStressType: false,
    chartColor: '#ec4899',
    icon: 'Users',
  },
  socialInteraction: {
    name: 'Social Interaction',
    description: 'Comfort and skill in social situations',
    isStressType: false,
    chartColor: '#14b8a6',
    icon: 'MessageCircle',
  },
  introversion: {
    name: 'Introversion',
    description: 'Preference for quiet, reflective environments',
    isStressType: false,
    chartColor: '#8b5cf6',
    icon: 'User',
  },
  extroversion: {
    name: 'Extroversion',
    description: 'Energy gained from social interactions',
    isStressType: false,
    chartColor: '#f59e0b',
    icon: 'Users',
  },
  communication: {
    name: 'Communication',
    description: 'Effectiveness in expressing thoughts and listening',
    isStressType: false,
    chartColor: '#3b82f6',
    icon: 'MessageSquare',
  },
  confidence: {
    name: 'Confidence',
    description: 'Self-assurance in abilities and decisions',
    isStressType: false,
    chartColor: '#0ea5e9',
    icon: 'Award',
  },
  stress: {
    name: 'Stress Level',
    description: 'Overall stress indicator based on responses',
    isStressType: true,
    chartColor: '#ef4444',
    icon: 'AlertTriangle',
  },
  academicPressure: {
    name: 'Academic Pressure',
    description: 'Perceived pressure from academic responsibilities',
    isStressType: true,
    chartColor: '#f97316',
    icon: 'BookOpen',
  },
  emotionalWellbeing: {
    name: 'Emotional Well-being',
    description: 'Overall emotional health and stability',
    isStressType: false,
    chartColor: '#a855f7',
    icon: 'Heart',
  },
  motivation: {
    name: 'Motivation',
    description: 'Drive and enthusiasm toward goals',
    isStressType: false,
    chartColor: '#22c55e',
    icon: 'Zap',
  },
  discipline: {
    name: 'Self-Discipline',
    description: 'Ability to stay focused and organized',
    isStressType: false,
    chartColor: '#16a34a',
    icon: 'Target',
  },
  resilience: {
    name: 'Resilience',
    description: 'Ability to recover from setbacks',
    isStressType: false,
    chartColor: '#0891b2',
    icon: 'Shield',
  },
  adaptability: {
    name: 'Adaptability',
    description: 'Flexibility in adjusting to change',
    isStressType: false,
    chartColor: '#7c3aed',
    icon: 'RefreshCw',
  },
  leadership: {
    name: 'Leadership',
    description: 'Tendency to guide and influence others',
    isStressType: false,
    chartColor: '#b45309',
    icon: 'Star',
  },
  cooperation: {
    name: 'Cooperation',
    description: 'Willingness to work collaboratively',
    isStressType: false,
    chartColor: '#0d9488',
    icon: 'Handshake',
  },
  behavioralTendencies: {
    name: 'Behavioral Tendencies',
    description: 'General patterns of behavior and responses',
    isStressType: false,
    chartColor: '#64748b',
    icon: 'Activity',
  },
  socialSupport: {
    name: 'Social Support',
    description: 'Perceived support from social network',
    isStressType: false,
    chartColor: '#db2777',
    icon: 'Users',
  },
  selfAwareness: {
    name: 'Self-Awareness',
    description: 'Understanding of own emotions and behaviors',
    isStressType: false,
    chartColor: '#9333ea',
    icon: 'Eye',
  },
  generalWellbeing: {
    name: 'General Well-being',
    description: 'Overall sense of well-being and life satisfaction',
    isStressType: false,
    chartColor: '#2dd4bf',
    icon: 'Sun',
  },
}

export function getScoreLabel(categoryKey: string, score: number): ScoreLabel {
  const meta = CATEGORY_META[categoryKey]
  if (meta?.isStressType) {
    return getStressLabel(score)
  }
  return getPositiveLabel(score)
}

export function getScoreColor(categoryKey: string, score: number): string {
  const label = getScoreLabel(categoryKey, score)
  return label.hex
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`
}
