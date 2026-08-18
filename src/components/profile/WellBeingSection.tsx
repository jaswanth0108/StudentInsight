import React from "react"
import { StressGauge } from "@/components/charts/StressGauge"
import { ScoreCard } from "@/components/charts/ScoreCard"
import { ShieldCheck, Heart, AlertTriangle } from "lucide-react"

interface WellBeingSectionProps {
  stressScore: number
  academicPressureScore: number
  emotionalWellbeingScore: number
  motivationScore: number
  resilienceScore: number
  generalWellbeingScore: number
}

export function WellBeingSection({
  stressScore,
  academicPressureScore,
  emotionalWellbeingScore,
  motivationScore,
  resilienceScore,
  generalWellbeingScore,
}: WellBeingSectionProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner with Stress Gauge & Overall Wellbeing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semicircle Stress Gauge */}
        <div className="lg:col-span-1">
          <StressGauge score={stressScore} title="Primary Stress Indicator" size="lg" />
        </div>

        {/* Well-Being Overview Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScoreCard
            categoryKey="academicPressure"
            score={academicPressureScore}
            customTitle="Academic Pressure"
            customDescription="Perceived load from exams and coursework deadlines"
          />
          <ScoreCard
            categoryKey="emotionalWellbeing"
            score={emotionalWellbeingScore}
            customTitle="Emotional Stability"
            customDescription="Daily emotional balance and self-regulation"
          />
          <ScoreCard
            categoryKey="motivation"
            score={motivationScore}
            customTitle="Academic Motivation"
            customDescription="Engagement and drive toward learning goals"
          />
          <ScoreCard
            categoryKey="resilience"
            score={resilienceScore}
            customTitle="Adaptive Resilience"
            customDescription="Capacity to handle academic and personal challenges"
          />
        </div>
      </div>
    </div>
  )
}
