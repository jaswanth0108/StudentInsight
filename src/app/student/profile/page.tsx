import React from "react"
import { prisma } from "@/lib/database/prisma"
import { PersonalityProfileView } from "@/components/profile/PersonalityProfile"

export default async function StudentProfilePage() {
  const student = await prisma.student.findFirst({
    include: {
      user: true,
      department: true,
      class: true,
      studentProfile: true,
      assessmentResponses: {
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
  })

  const profile = student?.studentProfile
  const latestResponse = student?.assessmentResponses[0]

  const scores: Record<string, number> = {
    empathy: profile?.empathy ?? 84,
    humanity: profile?.humanity ?? 80,
    socialInteraction: profile?.socialInteraction ?? 58,
    introversion: profile?.introversion ?? 72,
    extroversion: profile?.extroversion ?? 30,
    communication: profile?.communication ?? 67,
    confidence: profile?.confidence ?? 54,
    stress: profile?.stress ?? 68,
    academicPressure: profile?.academicPressure ?? 74,
    emotionalWellbeing: profile?.emotionalWellbeing ?? 62,
    motivation: profile?.motivation ?? 70,
    discipline: profile?.discipline ?? 76,
    resilience: profile?.resilience ?? 52,
    adaptability: profile?.adaptability ?? 71,
    leadership: profile?.leadership ?? 61,
    cooperation: profile?.cooperation ?? 82,
    behavioralTendencies: profile?.behavioralTendencies ?? 70,
    socialSupport: profile?.socialSupport ?? 75,
    selfAwareness: profile?.selfAwareness ?? 78,
    generalWellbeing: profile?.generalWellbeing ?? 60,
  }

  const strengths = ["empathy", "discipline", "motivation"]
  const areasForSupport = ["academicPressure", "confidence", "resilience"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Personality Profile
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          A multi-dimensional overview of behavioral orientations and strengths derived from your assessment responses.
        </p>
      </div>

      <PersonalityProfileView
        studentName={student?.user.name || "John Doe"}
        studentId={student?.studentId || "STU-1024"}
        departmentName={student?.department?.name}
        className={student?.class?.name}
        lastAssessmentDate={latestResponse?.completedAt || new Date()}
        scores={scores}
        strengths={strengths}
        areasForSupport={areasForSupport}
        aiSummary={profile?.aiSummary}
        requiresFollowUp={profile?.requiresFollowUp}
        flagReason={profile?.flagReason}
      />
    </div>
  )
}
