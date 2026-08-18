import React from "react"
import { prisma } from "@/lib/database/prisma"
import { WellBeingSection } from "@/components/profile/WellBeingSection"
import { ScoreCard } from "@/components/charts/ScoreCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShieldCheck, Heart, AlertCircle, Info, Sparkles } from "lucide-react"

export default async function StudentWellBeingPage() {
  const student = await prisma.student.findFirst({
    include: { studentProfile: true },
  })

  const p = student?.studentProfile

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Well-Being & Stress Analysis
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Detailed indicators tracking academic load, emotional stability, and social support.
        </p>
      </div>

      {/* Primary Well-being Component */}
      <WellBeingSection
        stressScore={p?.stress ?? 68}
        academicPressureScore={p?.academicPressure ?? 74}
        emotionalWellbeingScore={p?.emotionalWellbeing ?? 62}
        motivationScore={p?.motivation ?? 70}
        resilienceScore={p?.resilience ?? 52}
        generalWellbeingScore={p?.generalWellbeing ?? 60}
      />

      {/* Additional Well-Being Dimensions */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Secondary Well-Being Factors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScoreCard
            categoryKey="socialSupport"
            score={p?.socialSupport ?? 75}
            customTitle="Perceived Social Support"
            customDescription="Availability of trusted mentors and supportive peers"
          />
          <ScoreCard
            categoryKey="discipline"
            score={p?.discipline ?? 76}
            customTitle="Study Habit Stability"
            customDescription="Consistent time management and focus routines"
          />
          <ScoreCard
            categoryKey="selfAwareness"
            score={p?.selfAwareness ?? 78}
            customTitle="Emotional Awareness"
            customDescription="Understanding of personal stress triggers"
          />
        </div>
      </div>

      {/* Ethical Clarity Box */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 flex items-start space-x-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Ethical & Non-Diagnostic Notice:</strong> These well-being indicators reflect your self-reported responses from standard questionnaires. They are not psychological diagnoses and are designed to assist you and your counselor in developing healthy academic routines.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
