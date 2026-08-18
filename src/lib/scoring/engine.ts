// src/lib/scoring/engine.ts
// Deterministic scoring engine — converts raw answers to normalized 0–100 scores

import type { AssessmentAnswer } from '@/types'

export interface ScoringInput {
  answers: AssessmentAnswer[]
  questions: {
    id: string
    weight: number
    isReversed: boolean
    categoryKey?: string
    options: { id: string; value: number }[]
    type: string
  }[]
}

export interface CategoryRawScore {
  categoryKey: string
  totalWeightedScore: number
  totalWeight: number
  questionCount: number
}

/**
 * Normalize a raw answer to 0–100 scale
 */
function normalizeAnswer(
  answer: AssessmentAnswer,
  question: ScoringInput['questions'][0]
): number | null {
  let raw: number | null = null

  if (answer.optionId && question.options.length > 0) {
    const opt = question.options.find(o => o.id === answer.optionId)
    raw = opt ? opt.value : null
  } else if (answer.numericValue !== undefined && answer.numericValue !== null) {
    // Rating 1–10 → 0–100
    raw = ((answer.numericValue - 1) / 9) * 100
  } else if (answer.textValue !== undefined && answer.textValue !== null) {
    // Open-ended: not scored numerically
    return null
  }

  if (raw === null) return null

  // Apply reverse scoring: score = 100 - raw
  if (question.isReversed) {
    raw = 100 - raw
  }

  return Math.max(0, Math.min(100, raw))
}

/**
 * Calculate category scores from answers
 * Returns a map of categoryKey → score (0–100)
 */
export function calculateCategoryScores(input: ScoringInput): Map<string, CategoryRawScore> {
  const categoryMap = new Map<string, CategoryRawScore>()

  for (const answer of input.answers) {
    const question = input.questions.find(q => q.id === answer.questionId)
    if (!question || !question.categoryKey) continue

    const normalizedScore = normalizeAnswer(answer, question)
    if (normalizedScore === null) continue

    const key = question.categoryKey
    const existing = categoryMap.get(key) ?? {
      categoryKey: key,
      totalWeightedScore: 0,
      totalWeight: 0,
      questionCount: 0,
    }

    existing.totalWeightedScore += normalizedScore * question.weight
    existing.totalWeight += question.weight
    existing.questionCount += 1
    categoryMap.set(key, existing)
  }

  return categoryMap
}

/**
 * Get final 0–100 score for each category (weighted average)
 */
export function getFinalScores(categoryMap: Map<string, CategoryRawScore>): Map<string, number> {
  const result = new Map<string, number>()
  for (const [key, raw] of categoryMap.entries()) {
    if (raw.totalWeight === 0) continue
    const score = raw.totalWeightedScore / raw.totalWeight
    result.set(key, Math.round(score * 10) / 10)
  }
  return result
}

/**
 * Calculate overall well-being score from all category scores
 * Uses a weighted combination prioritizing well-being dimensions
 */
export function calculateOverallWellbeing(scores: Map<string, number>): number {
  const WELLBEING_WEIGHTS: Record<string, number> = {
    stress: -1.5,         // high stress reduces wellbeing
    academicPressure: -1.0,
    emotionalWellbeing: 2.0,
    motivation: 1.5,
    resilience: 1.5,
    generalWellbeing: 2.0,
    socialSupport: 1.0,
    adaptability: 0.8,
    confidence: 0.8,
  }

  let weightedSum = 0
  let totalWeight = 0

  // Base: start at 50
  let base = 50
  let adjustments = 0
  let adjWeight = 0

  for (const [key, weight] of Object.entries(WELLBEING_WEIGHTS)) {
    const score = scores.get(key)
    if (score === undefined) continue
    // For negative weights: invert the score contribution
    const adjusted = weight < 0 ? (100 - score) * Math.abs(weight) : score * weight
    adjustments += adjusted
    adjWeight += Math.abs(weight)
  }

  if (adjWeight === 0) return 50

  const overall = adjustments / adjWeight
  return Math.max(0, Math.min(100, Math.round(overall * 10) / 10))
}

/**
 * Identify strengths (top scoring categories)
 */
export function getStrengths(scores: Map<string, number>, topN = 3): string[] {
  const EXCLUDE = ['stress', 'academicPressure'] // these are stress indicators, not strengths
  const entries = Array.from(scores.entries())
    .filter(([key]) => !EXCLUDE.includes(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key]) => key)
  return entries
}

/**
 * Identify areas for support (lower scoring or high-stress categories)
 */
export function getAreasForSupport(scores: Map<string, number>, bottomN = 3): string[] {
  // Low scores on positive dimensions
  const POSITIVE_DIMS = ['empathy', 'confidence', 'motivation', 'resilience', 'adaptability', 'communication', 'emotionalWellbeing']
  const STRESS_DIMS = ['stress', 'academicPressure']

  const lowPositive = Array.from(scores.entries())
    .filter(([key]) => POSITIVE_DIMS.includes(key) && (scores.get(key) ?? 100) < 50)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([key]) => key)

  const highStress = Array.from(scores.entries())
    .filter(([key]) => STRESS_DIMS.includes(key) && (scores.get(key) ?? 0) > 65)
    .map(([key]) => key)

  const combined = [...new Set([...highStress, ...lowPositive])].slice(0, bottomN)
  return combined
}

/**
 * Determine if follow-up is required based on scores
 */
export function requiresFollowUp(scores: Map<string, number>): { required: boolean; reason: string } {
  const stress = scores.get('stress') ?? 0
  const academicPressure = scores.get('academicPressure') ?? 0
  const emotionalWellbeing = scores.get('emotionalWellbeing') ?? 100
  const motivation = scores.get('motivation') ?? 100
  const resilience = scores.get('resilience') ?? 100

  const reasons: string[] = []

  if (stress > 80) reasons.push('High stress indicator detected')
  if (academicPressure > 80) reasons.push('High academic pressure indicator detected')
  if (emotionalWellbeing < 25) reasons.push('Low emotional well-being indicator')
  if (motivation < 20) reasons.push('Very low motivation indicator')
  if (resilience < 20 && stress > 60) reasons.push('Low resilience combined with elevated stress')

  return {
    required: reasons.length > 0,
    reason: reasons.join('. '),
  }
}
