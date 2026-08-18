"use client"

import React from "react"
import { PersonalityRadarChart } from "@/components/charts/RadarChart"
import { ScoreCard } from "@/components/charts/ScoreCard"
import { StrengthsAreas } from "@/components/profile/StrengthsAreas"
import { WellBeingSection } from "@/components/profile/WellBeingSection"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, User, Info } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface PersonalityProfileProps {
  studentName: string
  studentId: string
  departmentName?: string
  className?: string
  lastAssessmentDate?: Date | string
  scores: Record<string, number>
  strengths: string[]
  areasForSupport: string[]
  aiSummary?: string | null
  requiresFollowUp?: boolean
  flagReason?: string | null
}

export function PersonalityProfileView({
  studentName,
  studentId,
  departmentName = "Computer Science",
  className = "CSE Year 2",
  lastAssessmentDate = new Date(),
  scores,
  strengths,
  areasForSupport,
  aiSummary,
  requiresFollowUp,
  flagReason,
}: PersonalityProfileProps) {
  // Radar chart data mapping
  const radarDimensions = [
    { name: "Empathy", score: scores.empathy ?? 50 },
    { name: "Confidence", score: scores.confidence ?? 50 },
    { name: "Motivation", score: scores.motivation ?? 50 },
    { name: "Resilience", score: scores.resilience ?? 50 },
    { name: "Adaptability", score: scores.adaptability ?? 50 },
    { name: "Communication", score: scores.communication ?? 50 },
    { name: "Self-Discipline", score: scores.discipline ?? 50 },
    { name: "Cooperation", score: scores.cooperation ?? 50 },
  ]

  return (
    <div className="space-y-6">
      {/* Student Profile Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-2xl font-bold tracking-tight">{studentName}</h2>
            <Badge variant="outline" className="text-white border-indigo-400/50 bg-indigo-500/20 text-xs">
              ID: {studentId}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200">
            {departmentName} • {className} • Last Assessment: {formatDate(lastAssessmentDate)}
          </p>
        </div>

        {requiresFollowUp && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Counselor check-in recommended</span>
          </div>
        )}
      </div>

      {/* AI / Behavioral Interpretation Narrative */}
      <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/30 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2 text-indigo-950 font-bold text-base">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Assessment Interpretation & Behavioral Summary</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 leading-relaxed">
            {aiSummary ||
              "The assessment indicates a student demonstrating high empathy, strong cooperation, and positive motivation. Responses indicate elevated academic pressure and study pacing concerns. Counselor follow-up may be helpful to explore workload balancing."}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Assessment-Based Profile • Explanatory Guidance</span>
            <span>Non-diagnostic behavioral observation</span>
          </div>
        </CardContent>
      </Card>

      {/* Well-Being Analysis Component */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Well-Being & Stress Indicators</span>
        </h3>
        <WellBeingSection
          stressScore={scores.stress ?? 50}
          academicPressureScore={scores.academicPressure ?? 50}
          emotionalWellbeingScore={scores.emotionalWellbeing ?? 50}
          motivationScore={scores.motivation ?? 50}
          resilienceScore={scores.resilience ?? 50}
          generalWellbeingScore={scores.generalWellbeing ?? 50}
        />
      </div>

      {/* Radar Chart & Key Strengths / Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Radar Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-900">
              Personality Dimensions Radar Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalityRadarChart data={radarDimensions} height={320} />
          </CardContent>
        </Card>

        {/* Strengths & Areas for Exploration */}
        <div className="flex flex-col justify-between">
          <StrengthsAreas strengths={strengths} areasForSupport={areasForSupport} />
        </div>
      </div>

      {/* Full Dimensions Score Grid (20 Dimensions) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Detailed Dimension Scores (0–100%)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard categoryKey="empathy" score={scores.empathy ?? 50} />
          <ScoreCard categoryKey="humanity" score={scores.humanity ?? 50} />
          <ScoreCard categoryKey="socialInteraction" score={scores.socialInteraction ?? 50} />
          <ScoreCard categoryKey="communication" score={scores.communication ?? 50} />
          <ScoreCard categoryKey="confidence" score={scores.confidence ?? 50} />
          <ScoreCard categoryKey="motivation" score={scores.motivation ?? 50} />
          <ScoreCard categoryKey="discipline" score={scores.discipline ?? 50} />
          <ScoreCard categoryKey="resilience" score={scores.resilience ?? 50} />
          <ScoreCard categoryKey="adaptability" score={scores.adaptability ?? 50} />
          <ScoreCard categoryKey="leadership" score={scores.leadership ?? 50} />
          <ScoreCard categoryKey="cooperation" score={scores.cooperation ?? 50} />
          <ScoreCard categoryKey="socialSupport" score={scores.socialSupport ?? 50} />
          <ScoreCard categoryKey="selfAwareness" score={scores.selfAwareness ?? 50} />
          <ScoreCard categoryKey="generalWellbeing" score={scores.generalWellbeing ?? 50} />
          <ScoreCard categoryKey="introversion" score={scores.introversion ?? 50} />
          <ScoreCard categoryKey="extroversion" score={scores.extroversion ?? 50} />
        </div>
      </div>
    </div>
  )
}
