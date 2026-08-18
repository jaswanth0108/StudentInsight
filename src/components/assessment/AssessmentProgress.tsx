"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

interface AssessmentProgressProps {
  currentStep: number
  totalSteps: number
  categoryName?: string
}

export function AssessmentProgress({
  currentStep,
  totalSteps,
  categoryName,
}: AssessmentProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Question {currentStep} of {totalSteps}
          </span>
          {categoryName && (
            <span className="hidden sm:inline-block text-slate-500 font-normal">
              • Dimension: <strong className="text-slate-700">{categoryName}</strong>
            </span>
          )}
        </div>
        <span className="font-bold text-slate-700">{percentage}% completed</span>
      </div>

      <Progress value={percentage} indicatorColor="bg-indigo-600" className="h-2.5 bg-slate-100" />
    </div>
  )
}
