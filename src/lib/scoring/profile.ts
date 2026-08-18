// src/lib/scoring/profile.ts
// Generates personality profile narrative and well-being breakdown

import { CATEGORY_META, getScoreLabel } from './labels'
import { getStrengths, getAreasForSupport, requiresFollowUp, calculateOverallWellbeing } from './engine'
import type { DimensionScore, PersonalityProfile, WellBeingIndicators } from '@/types'

/**
 * Convert raw score map to DimensionScore array for UI rendering
 */
export function buildDimensionScores(scores: Map<string, number>): DimensionScore[] {
  const result: DimensionScore[] = []

  for (const [key, score] of scores.entries()) {
    const meta = CATEGORY_META[key]
    if (!meta) continue

    const labelInfo = getScoreLabel(key, score)

    result.push({
      key,
      name: meta.name,
      score,
      label: labelInfo.label,
      color: labelInfo.color,
      description: meta.description,
      questionCount: 0, // filled from category scores
    })
  }

  return result.sort((a, b) => {
    const ORDER = ['stress', 'emotionalWellbeing', 'motivation', 'empathy', 'confidence',
      'resilience', 'communication', 'adaptability', 'discipline', 'socialInteraction',
      'leadership', 'cooperation', 'selfAwareness', 'generalWellbeing']
    return ORDER.indexOf(a.key) - ORDER.indexOf(b.key)
  })
}

/**
 * Generate well-being indicators breakdown
 */
export function buildWellBeingIndicators(scores: Map<string, number>): WellBeingIndicators {
  return {
    academicStress: scores.get('academicPressure') ?? 0,
    socialStress: scores.get('socialInteraction') !== undefined
      ? Math.max(0, 100 - (scores.get('socialInteraction') ?? 50))
      : 0,
    emotionalStrain: scores.get('emotionalWellbeing') !== undefined
      ? Math.max(0, 100 - (scores.get('emotionalWellbeing') ?? 50))
      : 0,
    workloadPressure: scores.get('stress') ?? 0,
    motivationDifficulty: scores.get('motivation') !== undefined
      ? Math.max(0, 100 - (scores.get('motivation') ?? 50))
      : 0,
    socialIsolation: scores.get('socialSupport') !== undefined
      ? Math.max(0, 100 - (scores.get('socialSupport') ?? 50))
      : 0,
    confidenceConcerns: scores.get('confidence') !== undefined
      ? Math.max(0, 100 - (scores.get('confidence') ?? 50))
      : 0,
    generalWellbeing: scores.get('generalWellbeing') ?? 50,
  }
}

/**
 * Generate a neutral, non-diagnostic personality summary
 */
export function generateRuleBasedSummary(scores: Map<string, number>): string {
  const empathy = scores.get('empathy') ?? 50
  const stress = scores.get('stress') ?? 50
  const motivation = scores.get('motivation') ?? 50
  const introversion = scores.get('introversion') ?? 50
  const extroversion = scores.get('extroversion') ?? 50
  const resilience = scores.get('resilience') ?? 50
  const confidence = scores.get('confidence') ?? 50
  const academicPressure = scores.get('academicPressure') ?? 50

  const parts: string[] = ['Assessment responses indicate a student who']

  // Social orientation
  if (introversion > 60 && extroversion < 40) {
    parts.push('may prefer smaller, quieter social environments')
  } else if (extroversion > 60 && introversion < 40) {
    parts.push('tends to be energized by social interaction')
  } else {
    parts.push('shows a balanced social orientation')
  }

  // Empathy
  if (empathy >= 75) parts.push('demonstrates strong empathy toward others')
  else if (empathy >= 50) parts.push('shows moderate empathy')

  // Motivation
  if (motivation >= 70) parts.push('and good motivation')
  else if (motivation < 40) parts.push('with responses indicating reduced motivation')

  // Confidence
  if (confidence < 45) parts.push('The responses suggest the student may benefit from confidence-building support')

  // Resilience
  if (resilience < 40) parts.push('Resilience indicators are lower, which may be worth exploring further')

  // Stress / academic pressure
  if (stress > 70 || academicPressure > 70) {
    parts.push('The responses also indicate elevated academic pressure. Counselor follow-up may be useful to better understand the student\'s current challenges')
  }

  const sentence = parts.join('. ') + '.'

  return (
    sentence +
    ' These observations are based on assessment responses and should be interpreted as indicators rather than definitive conclusions. ' +
    'A qualified counselor is best positioned to provide meaningful support.'
  )
}

/**
 * Build full PersonalityProfile from scores
 */
export function buildPersonalityProfile(
  studentId: string,
  assessmentResponseId: string,
  scores: Map<string, number>,
  aiSummary?: string
): PersonalityProfile {
  const dimensions = buildDimensionScores(scores)
  const strengths = getStrengths(scores)
  const areasForSupport = getAreasForSupport(scores)
  const overallWellbeing = calculateOverallWellbeing(scores)
  const followUp = requiresFollowUp(scores)
  const summary = aiSummary ?? generateRuleBasedSummary(scores)

  let wellbeingLabel = 'Moderate'
  if (overallWellbeing >= 75) wellbeingLabel = 'Good'
  else if (overallWellbeing >= 50) wellbeingLabel = 'Moderate'
  else if (overallWellbeing >= 25) wellbeingLabel = 'Needs Attention'
  else wellbeingLabel = 'Requires Support'

  return {
    studentId,
    assessmentResponseId,
    dimensions,
    strengths,
    areasForSupport,
    overallWellbeing,
    wellbeingLabel,
    summary,
    requiresFollowUp: followUp.required,
    flagReason: followUp.reason || undefined,
    generatedAt: new Date(),
  }
}
