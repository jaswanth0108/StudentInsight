"use client"

import React from "react"
import { getStressLabel } from "@/lib/scoring/labels"
import { AlertCircle, ShieldAlert, CheckCircle2, Info } from "lucide-react"

interface StressGaugeProps {
  score: number
  size?: "sm" | "md" | "lg"
  title?: string
  showDescription?: boolean
}

export function StressGauge({
  score,
  size = "md",
  title = "Stress Indicator",
  showDescription = true,
}: StressGaugeProps) {
  const roundedScore = Math.round(Math.max(0, Math.min(100, score)))
  const labelInfo = getStressLabel(roundedScore)

  // Semicircle gauge calculation
  const radius = size === "lg" ? 90 : size === "md" ? 70 : 50
  const strokeWidth = size === "lg" ? 14 : size === "md" ? 10 : 8
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference

  const getStatusIcon = () => {
    if (roundedScore >= 76)
      return <ShieldAlert className="w-5 h-5 text-red-600 inline mr-1" />
    if (roundedScore >= 51)
      return <AlertCircle className="w-5 h-5 text-orange-500 inline mr-1" />
    if (roundedScore >= 26)
      return <Info className="w-5 h-5 text-amber-500 inline mr-1" />
    return <CheckCircle2 className="w-5 h-5 text-emerald-600 inline mr-1" />
  }

  const getGuidanceText = () => {
    if (roundedScore >= 76) {
      return "Assessment responses indicate a potentially elevated stress level. Consider counselor follow-up based on assessment responses."
    }
    if (roundedScore >= 51) {
      return "Assessment responses indicate moderate pressure or stress factors. Regular check-ins may be beneficial."
    }
    if (roundedScore >= 26) {
      return "Mild stress responses noted, consistent with standard academic fluctuations."
    }
    return "Responses indicate positive coping and low stress levels at the time of assessment."
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
      {title && <span className="text-sm font-medium text-slate-500 mb-2">{title}</span>}

      <div className="relative flex items-center justify-center my-2">
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius + strokeWidth * 2}
          className="overflow-visible"
        >
          {/* Background track (Semicircle) */}
          <path
            d={`M ${strokeWidth},${radius + strokeWidth} A ${radius},${radius} 0 0,1 ${
              radius * 2 + strokeWidth
            },${radius + strokeWidth}`}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active progress arc */}
          <path
            d={`M ${strokeWidth},${radius + strokeWidth} A ${radius},${radius} 0 0,1 ${
              radius * 2 + strokeWidth
            },${radius + strokeWidth}`}
            fill="none"
            stroke={labelInfo.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center text */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ bottom: 0 }}
        >
          <span
            className={`font-bold text-slate-900 ${
              size === "lg"
                ? "text-3xl"
                : size === "md"
                ? "text-2xl"
                : "text-xl"
            }`}
          >
            {roundedScore}%
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${labelInfo.color}`}
          >
            {labelInfo.label}
          </span>
        </div>
      </div>

      {showDescription && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 text-left border border-slate-100 flex items-start space-x-2">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-slate-800 mb-0.5">Assessment-Based Indicator</p>
            <p className="leading-relaxed">{getGuidanceText()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
