"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QuestionRenderer } from "@/components/assessment/QuestionRenderer"
import { AssessmentProgress } from "@/components/assessment/AssessmentProgress"
import { AssessmentConsent } from "@/components/assessment/AssessmentConsent"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CheckCircle, Save, AlertCircle } from "lucide-react"

export interface AssessmentQuestionItem {
  id: string
  text: string
  type: any
  weight: number
  isRequired: boolean
  isReversed: boolean
  order: number
  helpText?: string | null
  categoryId?: string | null
  categoryKey?: string
  categoryName?: string
  options: {
    id: string
    text: string
    value: number
    order: number
  }[]
}

interface StepByStepAssessmentProps {
  assessmentId: string
  title: string
  description?: string | null
  instructions?: string | null
  timeLimit?: number | null
  questions: AssessmentQuestionItem[]
  studentId?: string
}

export function StepByStepAssessment({
  assessmentId,
  title,
  description,
  instructions,
  timeLimit,
  questions,
  studentId,
}: StepByStepAssessmentProps) {
  const router = useRouter()
  const [consentGiven, setConsentGiven] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<
    Record<
      string,
      { optionId?: string; numericValue?: number; textValue?: string }
    >
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Warn student before closing tab if assessment is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (consentGiven && Object.keys(answers).length > 0 && !isSubmitting) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [consentGiven, answers, isSubmitting])

  if (!consentGiven) {
    return (
      <AssessmentConsent
        assessmentTitle={title}
        timeLimit={timeLimit}
        totalQuestions={questions.length}
        onConsent={() => setConsentGiven(true)}
      />
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentQuestion?.id] || {}
  const totalQuestions = questions.length

  const handleAnswerChange = (val: {
    optionId?: string
    numericValue?: number
    textValue?: string
  }) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        ...val,
      },
    }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, ans]) => ({
          questionId,
          optionId: ans.optionId,
          numericValue: ans.numericValue,
          textValue: ans.textValue,
        })
      )

      const res = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: formattedAnswers,
          consentGiven: true,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/student/results/${data.responseId || assessmentId}`)
      } else {
        setErrorMessage(data.error || "Failed to submit assessment.")
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setErrorMessage("Network error while submitting. Please try again.")
      setIsSubmitting(false)
    }
  }

  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false
    const ans = answers[currentQuestion.id]
    if (!ans) return false
    if (ans.optionId) return true
    if (ans.numericValue !== undefined) return true
    if (ans.textValue && ans.textValue.trim().length > 0) return true
    return false
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Progress header */}
      <AssessmentProgress
        currentStep={currentIndex + 1}
        totalSteps={totalQuestions}
        categoryName={currentQuestion?.categoryName}
      />

      <Card className="border-slate-200 shadow-md">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {title}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {answeredCount} of {totalQuestions} answered
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 min-h-[280px]">
          {currentQuestion ? (
            <QuestionRenderer
              question={currentQuestion}
              value={currentAnswer}
              onChange={handleAnswerChange}
            />
          ) : (
            <p>No questions available.</p>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 sm:p-6 flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentIndex < totalQuestions - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1 font-semibold"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1 font-semibold shadow-md"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>{isSubmitting ? "Processing Scores..." : "Submit & Complete Assessment"}</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
