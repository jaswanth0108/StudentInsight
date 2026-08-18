import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Clock, ArrowRight, CheckCircle2, Shield } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function StudentAssessmentsPage() {
  const student = await prisma.student.findFirst({
    include: {
      assessmentResponses: {
        include: { assessment: true },
      },
    },
  })

  const assessments = await prisma.assessment.findMany({
    where: { status: "PUBLISHED" },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  })

  const completedMap = new Map(
    student?.assessmentResponses.map((r) => [r.assessmentId, r]) || []
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Assigned Assessments
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Complete structured questionnaires to update your personality and well-being profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((a) => {
          const response = completedMap.get(a.id)
          const isCompleted = response?.status === "COMPLETED"

          return (
            <Card
              key={a.id}
              className="border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-1">
                  <Badge
                    variant={isCompleted ? "success" : "default"}
                    className="text-xs"
                  >
                    {isCompleted ? "Completed" : "Action Required"}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    v{a.version}.0
                  </span>
                </div>
                <CardTitle className="text-lg text-slate-900 leading-snug">
                  {a.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {a.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-slate-600 space-y-2">
                <div className="flex items-center space-x-4 text-slate-500">
                  <div className="flex items-center space-x-1">
                    <ClipboardList className="w-4 h-4 text-indigo-600" />
                    <span>{a._count.questions} Questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>{a.timeLimit ? `${a.timeLimit} mins` : "Self-paced"}</span>
                  </div>
                </div>

                {isCompleted && response?.completedAt && (
                  <p className="text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Completed on {formatDate(response.completedAt)}</span>
                  </p>
                )}
              </CardContent>

              <CardFooter className="pt-0">
                {isCompleted ? (
                  <Link href={`/student/results/${response?.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-xs font-semibold">
                      <span>View Results & Profile</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/student/assessments/${a.id}`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm">
                      <span>Start Assessment</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
