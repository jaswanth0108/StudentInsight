import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, Plus } from "lucide-react"

export default async function AdminQuestionsPage() {
  const questions = await prisma.assessmentQuestion.findMany({
    include: {
      category: true,
      options: true,
      assessment: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Question Bank
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Standardized question repository categorized by psychological and well-being dimensions.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Add Question to Bank</span>
        </Button>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <Card key={q.id} className="border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-400">#{idx + 1}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">
                    {q.type}
                  </Badge>
                  {q.category && (
                    <Badge variant="secondary" className="text-[10px]">
                      {q.category.name}
                    </Badge>
                  )}
                  {q.isReversed && (
                    <Badge variant="warning" className="text-[10px]">
                      Reverse-Scored
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-snug">{q.text}</p>
                <p className="text-[11px] text-slate-400">
                  Weight: {q.weight} • Options: {q.options.length} • Used in: {q.assessment.title}
                </p>
              </div>

              <Button size="sm" variant="ghost" className="text-xs font-medium text-slate-600">
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
