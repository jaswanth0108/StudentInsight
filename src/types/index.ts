// src/types/index.ts — Shared TypeScript types for the platform

import { UserRole, QuestionType, AssessmentStatus, ResponseStatus, SessionStatus, SupportLevel } from '@prisma/client'

// ─────────────────────────────────────────────────────────
// AUTH TYPES
// ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: UserRole
}

// ─────────────────────────────────────────────────────────
// SCORING TYPES
// ─────────────────────────────────────────────────────────

export interface DimensionScore {
  key: string
  name: string
  score: number       // 0–100
  label: string       // "Strong" | "Moderate" | "Needs Support" | "Elevated" | "Low"
  color: string       // CSS color class
  description: string
  questionCount: number
}

export interface PersonalityProfile {
  studentId: string
  assessmentResponseId: string
  dimensions: DimensionScore[]
  strengths: string[]           // top dimension keys
  areasForSupport: string[]     // lower dimension keys
  overallWellbeing: number      // 0–100
  wellbeingLabel: string
  summary: string               // AI or rule-based narrative
  requiresFollowUp: boolean
  flagReason?: string
  generatedAt: Date
}

export type ScoreLabel = 'Low' | 'Mild' | 'Moderate' | 'Elevated' | 'High' | 'Strong' | 'Good' | 'Needs Support'

export interface WellBeingIndicators {
  academicStress: number
  socialStress: number
  emotionalStrain: number
  workloadPressure: number
  motivationDifficulty: number
  socialIsolation: number
  confidenceConcerns: number
  generalWellbeing: number
}

// ─────────────────────────────────────────────────────────
// ASSESSMENT TYPES
// ─────────────────────────────────────────────────────────

export interface QuestionOption {
  id: string
  text: string
  value: number
  order: number
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  weight: number
  isRequired: boolean
  isReversed: boolean
  order: number
  helpText?: string
  categoryId?: string
  categoryKey?: string
  categoryName?: string
  options: QuestionOption[]
}

export interface AssessmentWithQuestions {
  id: string
  title: string
  description?: string
  instructions?: string
  version: number
  status: AssessmentStatus
  timeLimit?: number
  questions: Question[]
  totalQuestions: number
}

export interface AssessmentAnswer {
  questionId: string
  optionId?: string
  numericValue?: number
  textValue?: string
}

export interface AssessmentSubmission {
  assessmentId: string
  answers: AssessmentAnswer[]
  consentGiven: boolean
}

// ─────────────────────────────────────────────────────────
// STUDENT TYPES
// ─────────────────────────────────────────────────────────

export interface StudentSummary {
  id: string
  studentId: string
  name: string
  email: string
  department?: string
  class?: string
  year?: number
  counselorName?: string
  counselorId?: string
  supportLevel: SupportLevel
  lastAssessmentDate?: Date
  completedAssessments: number
  requiresFollowUp: boolean
  // Latest profile scores (summary)
  stress?: number
  motivation?: number
  confidence?: number
  empathy?: number
}

export interface StudentDetail extends StudentSummary {
  dateOfBirth?: Date
  gender?: string
  phoneNumber?: string
  avatarUrl?: string
  profile?: PersonalityProfile
  wellbeing?: WellBeingIndicators
  assessmentHistory: AssessmentHistoryItem[]
}

export interface AssessmentHistoryItem {
  responseId: string
  assessmentId: string
  assessmentTitle: string
  assessmentVersion: number
  completedAt: Date
  status: ResponseStatus
  scores: DimensionScore[]
  overallWellbeing: number
}

// ─────────────────────────────────────────────────────────
// COUNSELOR TYPES
// ─────────────────────────────────────────────────────────

export interface CounselingSessionData {
  id: string
  studentId: string
  studentName: string
  counselorId: string
  counselorName: string
  title: string
  scheduledAt: Date
  duration?: number
  status: SessionStatus
  location?: string
  meetingUrl?: string
  summary?: string
  completedAt?: Date
}

export interface CounselingNoteData {
  id: string
  sessionId?: string
  counselorId: string
  studentId: string
  content: string
  isPrivate: boolean
  tags: string[]
  createdAt: Date
}

// ─────────────────────────────────────────────────────────
// ANALYTICS TYPES
// ─────────────────────────────────────────────────────────

export interface AdminOverview {
  totalStudents: number
  completedAssessments: number
  pendingAssessments: number
  studentsRequiringFollowUp: number
  completionRate: number
  avgStress: number
  avgMotivation: number
  avgConfidence: number
  avgEmpathy: number
  avgWellbeing: number
}

export interface DimensionDistribution {
  category: string
  low: number
  mild: number
  moderate: number
  elevated: number
  high: number
}

export interface TrendPoint {
  date: string
  value: number
}

export interface DepartmentComparison {
  department: string
  stress: number
  motivation: number
  confidence: number
  wellbeing: number
  studentCount: number
}

// ─────────────────────────────────────────────────────────
// NOTIFICATION TYPES
// ─────────────────────────────────────────────────────────

export interface NotificationData {
  id: string
  type: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: Date
}

// ─────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─────────────────────────────────────────────────────────
// FILTER TYPES
// ─────────────────────────────────────────────────────────

export interface StudentFilter {
  search?: string
  departmentId?: string
  classId?: string
  counselorId?: string
  supportLevel?: SupportLevel
  requiresFollowUp?: boolean
  stressMin?: number
  stressMax?: number
  motivationMin?: number
  motivationMax?: number
  assessmentStatus?: ResponseStatus
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
