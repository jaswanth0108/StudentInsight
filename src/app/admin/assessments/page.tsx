import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Plus, Clock, Users, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function AdminAssessmentsPage() {
  const assessments = await prisma.assessment.findMany({
    include: {
      _count: { select: { questions: true, assessmentResponses: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Assessments Manager
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Create, version, configure, and publish structured student assessments.
          </p>
        </div>

        <Link href="/admin/assessments/builder">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Create New Assessment</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {assessments.map((a) => (
          <Card key={a.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-slate-900">{a.title}</h3>
                  <Badge variant="success" className="text-[10px]">
                    {a.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    v{a.version}.0
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl">{a.description}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <span>{a._count.questions} Questions</span>
                  <span>•</span>
                  <span>{a._count.assessmentResponses} Responses Recorded</span>
                  <span>•</span>
                  <span>Published on {formatDate(a.publishedAt || a.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Link href={`/student/assessments/${a.id}`}>
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    Preview Flow
                  </Button>
                </Link>
                <Link href="/admin/assessments/builder">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                    Edit Version
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
