import React from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/database/prisma"
import { StepByStepAssessment } from "@/components/assessment/StepByStepAssessment"

export default async function TakeAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: true,
          category: true,
        },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!assessment) {
    notFound()
  }

  const student = await prisma.student.findFirst()

  const formattedQuestions = assessment.questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    weight: q.weight,
    isRequired: q.isRequired,
    isReversed: q.isReversed,
    order: q.order,
    helpText: q.helpText,
    categoryId: q.categoryId,
    categoryKey: q.category?.key,
    categoryName: q.category?.name,
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      value: o.value,
      order: o.order,
    })),
  }))

  return (
    <div className="py-2">
      <StepByStepAssessment
        assessmentId={assessment.id}
        title={assessment.title}
        description={assessment.description}
        instructions={assessment.instructions}
        timeLimit={assessment.timeLimit}
        questions={formattedQuestions}
        studentId={student?.id}
      />
    </div>
  )
}
