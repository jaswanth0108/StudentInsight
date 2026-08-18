"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Shield, Eye, Lock, CheckCircle, AlertTriangle, FileText } from "lucide-react"

interface AssessmentConsentProps {
  assessmentTitle: string
  timeLimit?: number | null
  totalQuestions: number
  onConsent: () => void
}

export function AssessmentConsent({
  assessmentTitle,
  timeLimit,
  totalQuestions,
  onConsent,
}: AssessmentConsentProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="border-indigo-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50/70 to-teal-50/70 border-b border-slate-100 rounded-t-xl pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">
                Assessment Transparency & Consent
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                {assessmentTitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-sm text-slate-700">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-amber-900 text-xs sm:text-sm">
              <span className="font-semibold block mb-0.5">
                Ethical Notice & Assessment Boundaries
              </span>
              This assessment produces estimated indicators based on your self-reported responses. It is <strong>NOT a medical or psychiatric diagnosis</strong>. Its sole objective is to help authorized academic counselors provide meaningful guidance and early support.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 font-semibold text-slate-900">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>What is Collected?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your responses to rating scales, multiple-choice options, and open-ended reflections regarding academic habits, stress, and behavioral tendencies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 font-semibold text-slate-900">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>Who Can Access It?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only you, your assigned institution counselors, and authorized administrators. Student results are strictly confidential and never visible to other students.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 font-semibold text-slate-900">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>How is it Used?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                To generate your personalized well-being overview, identify your strengths, highlight areas where counseling can support you, and track longitudinal progress.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 font-semibold text-slate-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Assessment Structure</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {totalQuestions} questions. Estimated time: {timeLimit ? `${timeLimit} minutes` : '15–20 minutes'}. You can save and return at any step.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-slate-700 font-medium leading-normal">
                I understand that this assessment generates non-clinical behavioral indicators, and I give consent for my responses to be reviewed by authorized institutional counselors.
              </span>
            </label>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 rounded-b-xl flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Institutional Privacy Compliant • 256-bit Secure
          </span>
          <Button
            onClick={onConsent}
            disabled={!agreed}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
          >
            Begin Assessment →
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
