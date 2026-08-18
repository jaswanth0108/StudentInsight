import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/database/prisma"
import { PersonalityProfileView } from "@/components/profile/PersonalityProfile"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserCheck, Download } from "lucide-react"

export default async function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Check if ID is responseId or assessmentId
  let response = await prisma.assessmentResponse.findUnique({
    where: { id },
    include: {
      student: { include: { user: true, department: true, class: true, counselor: { include: { user: true } } } },
      assessment: true,
      categoryScores: true,
    },
  })

  if (!response) {
    // Fallback: look up by assessmentId for default student
    const student = await prisma.student.findFirst()
    if (student) {
      response = await prisma.assessmentResponse.findFirst({
        where: {
          assessmentId: id,
          studentId: student.id,
        },
        include: {
          student: { include: { user: true, department: true, class: true, counselor: { include: { user: true } } } },
          assessment: true,
          categoryScores: true,
        },
      })
    }
  }

  if (!response) {
    notFound()
  }

  const scores: Record<string, number> = {}
  for (const cs of response.categoryScores) {
    scores[cs.categoryKey] = cs.score
  }

  const strengths = ["empathy", "discipline", "motivation"]
  const areasForSupport = ["academicPressure", "confidence", "resilience"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/student/assessments">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1.5 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Assessments</span>
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Link href="/student/counseling">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4" />
              <span>Request Counseling Session</span>
            </Button>
          </Link>
        </div>
      </div>

      <PersonalityProfileView
        studentName={response.student.user.name}
        studentId={response.student.studentId}
        departmentName={response.student.department?.name}
        className={response.student.class?.name}
        lastAssessmentDate={response.completedAt || new Date()}
        scores={scores}
        strengths={strengths}
        areasForSupport={areasForSupport}
        aiSummary={response.aiSummary}
        requiresFollowUp={response.requiresFlag}
        flagReason={response.flagReason}
      />
    </div>
  )
}
