"use client"

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface TrendDataPoint {
  date: string
  assessmentName: string
  stress?: number
  motivation?: number
  confidence?: number
  wellbeing?: number
  resilience?: number
}

interface HistoricalTrendChartProps {
  data: TrendDataPoint[]
  height?: number
  title?: string
}

export function HistoricalTrendChart({
  data,
  height = 320,
  title = "Progress & Dimension Trends Over Time",
}: HistoricalTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">
          Not enough assessment history to display trends yet. Complete another assessment to see longitudinal progress.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      {title && (
        <h4 className="text-sm font-semibold text-slate-800 mb-4">{title}</h4>
      )}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl space-y-1">
                      <p className="font-semibold text-slate-300">{label}</p>
                      {payload.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex justify-between space-x-4"
                        >
                          <span style={{ color: entry.color }}>
                            {entry.name}:
                          </span>
                          <span className="font-bold">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              iconType="circle"
            />
            {data.some((d) => d.stress !== undefined) && (
              <Line
                type="monotone"
                dataKey="stress"
                name="Stress Indicator"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {data.some((d) => d.motivation !== undefined) && (
              <Line
                type="monotone"
                dataKey="motivation"
                name="Motivation"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            )}
            {data.some((d) => d.confidence !== undefined) && (
              <Line
                type="monotone"
                dataKey="confidence"
                name="Confidence"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            )}
            {data.some((d) => d.wellbeing !== undefined) && (
              <Line
                type="monotone"
                dataKey="wellbeing"
                name="General Well-Being"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
