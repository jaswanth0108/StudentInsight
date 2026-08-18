"use client"

import React from "react"
import { QuestionType } from "@prisma/client"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface RenderQuestionProps {
  question: {
    id: string
    text: string
    type: QuestionType
    helpText?: string | null
    categoryName?: string
    weight?: number
    options: {
      id: string
      text: string
      value: number
      order: number
    }[]
  }
  value: {
    optionId?: string
    numericValue?: number
    textValue?: string
  }
  onChange: (val: {
    optionId?: string
    numericValue?: number
    textValue?: string
  }) => void
}

export function QuestionRenderer({
  question,
  value,
  onChange,
}: RenderQuestionProps) {
  const { type, options, text, helpText } = question

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 leading-snug">
          {text}
        </h3>
        {helpText && (
          <p className="mt-1 text-sm text-slate-500">{helpText}</p>
        )}
      </div>

      {/* 1. LIKERT SCALE (5 options) */}
      {type === QuestionType.LIKERT && (
        <div className="space-y-3">
          {options
            .sort((a, b) => a.order - b.order)
            .map((opt, idx) => {
              const isSelected = value.optionId === opt.id
              return (
                <label
                  key={opt.id}
                  onClick={() => onChange({ optionId: opt.id })}
                  className={cn(
                    "flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer select-none",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors",
                      isSelected
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm sm:text-base font-medium",
                      isSelected ? "text-indigo-900" : "text-slate-700"
                    )}
                  >
                    {opt.text}
                  </span>
                </label>
              )
            })}
        </div>
      )}

      {/* 2. MULTIPLE CHOICE */}
      {type === QuestionType.MCQ && (
        <div className="space-y-3">
          {options
            .sort((a, b) => a.order - b.order)
            .map((opt) => {
              const isSelected = value.optionId === opt.id
              return (
                <label
                  key={opt.id}
                  onClick={() => onChange({ optionId: opt.id })}
                  className={cn(
                    "flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer select-none",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3",
                      isSelected
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm sm:text-base font-medium",
                      isSelected ? "text-indigo-900" : "text-slate-700"
                    )}
                  >
                    {opt.text}
                  </span>
                </label>
              )
            })}
        </div>
      )}

      {/* 3. YES / NO */}
      {type === QuestionType.YES_NO && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options
            .sort((a, b) => a.order - b.order)
            .map((opt) => {
              const isSelected = value.optionId === opt.id
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => onChange({ optionId: opt.id })}
                  className={cn(
                    "p-6 rounded-xl border-2 font-semibold text-lg flex items-center justify-center space-x-3 transition-all cursor-pointer",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      isSelected
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{opt.text}</span>
                </button>
              )
            })}
        </div>
      )}

      {/* 4. RATING (1 to 10) */}
      {type === QuestionType.RATING && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 px-1">
            <span>1 — Low / Minimal</span>
            <span>5 — Moderate</span>
            <span>10 — High / Intense</span>
          </div>

          {/* Direct selection buttons 1-10 */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = value.numericValue === num
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange({ numericValue: num })}
                  className={cn(
                    "h-12 rounded-xl font-bold text-base transition-all flex items-center justify-center shadow-sm cursor-pointer",
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md scale-105 ring-2 ring-indigo-400"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                  )}
                >
                  {num}
                </button>
              )
            })}
          </div>

          <div className="text-center">
            <span className="text-sm font-medium text-slate-600">
              Selected Rating:{" "}
              <strong className="text-indigo-600 text-lg font-bold">
                {value.numericValue ?? "—"}
              </strong>{" "}
              / 10
            </span>
          </div>
        </div>
      )}

      {/* 5. OPEN-ENDED FREE TEXT */}
      {type === QuestionType.OPEN_ENDED && (
        <div className="space-y-2">
          <Textarea
            value={value.textValue || ""}
            onChange={(e) => {
              if (e.target.value.length <= 1000) {
                onChange({ textValue: e.target.value })
              }
            }}
            placeholder="Type your response here... (Share your thoughts comfortably. Your answers are reviewed only by authorized counselors)."
            className="min-h-[140px] text-base p-4 rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 resize-y leading-relaxed"
          />
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Minimum 10 characters recommended</span>
            <span
              className={cn(
                (value.textValue?.length || 0) > 900
                  ? "text-amber-600 font-semibold"
                  : "text-slate-400"
              )}
            >
              {value.textValue?.length || 0} / 1000 characters
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
