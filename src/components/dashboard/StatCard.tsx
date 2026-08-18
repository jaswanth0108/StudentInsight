import React from "react"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  color?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "text-indigo-600 bg-indigo-50",
  trend,
}: StatCardProps) {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("p-2 rounded-xl", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                trend.isPositive
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-amber-700 bg-amber-50"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-slate-500 leading-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
