import React from "react"
import { CheckCircle2, AlertCircle, Sparkles, Compass } from "lucide-react"
import { CATEGORY_META } from "@/lib/scoring/labels"

interface StrengthsAreasProps {
  strengths: string[]
  areasForSupport: string[]
}

export function StrengthsAreas({
  strengths,
  areasForSupport,
}: StrengthsAreasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths Card */}
      <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-white rounded-xl border border-emerald-100 shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-3">
          <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Key Personal Strengths</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Dimensions reflecting positive coping tendencies and high self-rated capability:
        </p>
        <div className="space-y-2">
          {strengths.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No specific strengths isolated.</p>
          ) : (
            strengths.map((key) => {
              const meta = CATEGORY_META[key]
              return (
                <div
                  key={key}
                  className="flex items-center space-x-2.5 p-2.5 bg-white rounded-lg border border-emerald-100/80 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      {meta?.name || key}
                    </span>
                    {meta?.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {meta.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Areas for Support Card */}
      <div className="p-5 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border border-amber-100 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm mb-3">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
            <Compass className="w-4 h-4" />
          </div>
          <span>Areas for Counselor Exploration</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Topics that may benefit from supportive check-ins or workload pacing:
        </p>
        <div className="space-y-2">
          {areasForSupport.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No high-concern areas identified.</p>
          ) : (
            areasForSupport.map((key) => {
              const meta = CATEGORY_META[key]
              return (
                <div
                  key={key}
                  className="flex items-center space-x-2.5 p-2.5 bg-white rounded-lg border border-amber-100/80 shadow-2xs"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      {meta?.name || key}
                    </span>
                    {meta?.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {meta.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
