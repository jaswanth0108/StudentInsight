"use client"

import React from "react"
import { getScoreLabel, CATEGORY_META } from "@/lib/scoring/labels"
import {
  Heart,
  Users,
  MessageCircle,
  User,
  MessageSquare,
  Award,
  AlertTriangle,
  BookOpen,
  Zap,
  Target,
  Shield,
  RefreshCw,
  Star,
  Handshake,
  Activity,
  Eye,
  Sun,
  LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Users,
  MessageCircle,
  User,
  MessageSquare,
  Award,
  AlertTriangle,
  BookOpen,
  Zap,
  Target,
  Shield,
  RefreshCw,
  Star,
  Handshake,
  Activity,
  Eye,
  Sun,
}

interface ScoreCardProps {
  categoryKey: string
  score: number
  customTitle?: string
  customDescription?: string
}

export function ScoreCard({
  categoryKey,
  score,
  customTitle,
  customDescription,
}: ScoreCardProps) {
  const meta = CATEGORY_META[categoryKey] || {
    name: customTitle || categoryKey,
    description: customDescription || "",
    isStressType: false,
    chartColor: "#6366f1",
    icon: "Activity",
  }

  const roundedScore = Math.round(Math.max(0, Math.min(100, score)))
  const labelInfo = getScoreLabel(categoryKey, roundedScore)
  const IconComponent = ICON_MAP[meta.icon] || Activity

  return (
    <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: `${meta.chartColor}15`,
              color: meta.chartColor,
            }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {customTitle || meta.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1">
              {customDescription || meta.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900">
            {roundedScore}%
          </span>
          <span
            className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${labelInfo.color}`}
          >
            {labelInfo.label}
          </span>
        </div>
      </div>

      {/* Mini progress bar */}
      <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${roundedScore}%`,
            backgroundColor: labelInfo.hex,
          }}
        />
      </div>
    </div>
  )
}
