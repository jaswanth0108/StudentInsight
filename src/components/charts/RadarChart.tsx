"use client"

import React from "react"
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface RadarDimension {
  name: string
  score: number
  fullMark?: number
}

interface PersonalityRadarChartProps {
  data: RadarDimension[]
  title?: string
  height?: number
}

export function PersonalityRadarChart({
  data,
  title,
  height = 340,
}: PersonalityRadarChartProps) {
  const chartData = data.map((d) => ({
    dimension: d.name,
    score: Math.round(d.score),
    fullMark: 100,
  }))

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-semibold text-slate-700 mb-2">{title}</h4>
      )}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickCount={5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      <div className="font-medium">{item.dimension}</div>
                      <div className="text-indigo-300 font-bold text-sm">
                        {item.score}%
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
