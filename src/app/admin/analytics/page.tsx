import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonalityRadarChart } from "@/components/charts/RadarChart"
import { BarChart3, TrendingUp, Users, Shield } from "lucide-react"

export default function AdminAnalyticsPage() {
  const cohortRadar = [
    { name: "Empathy", score: 74 },
    { name: "Confidence", score: 61 },
    { name: "Motivation", score: 67 },
    { name: "Resilience", score: 59 },
    { name: "Adaptability", score: 68 },
    { name: "Communication", score: 65 },
    { name: "Discipline", score: 71 },
    { name: "Cooperation", score: 78 },
  ]

  const departments = [
    { name: "Computer Science & Eng", students: 1240, avgStress: 64, avgMotivation: 70, avgWellbeing: 62 },
    { name: "Psychology & Behavioral", students: 480, avgStress: 52, avgMotivation: 74, avgWellbeing: 69 },
    { name: "Business Administration", students: 730, avgStress: 56, avgMotivation: 65, avgWellbeing: 66 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Institutional Well-Being & Personality Analytics
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Aggregated cohort intelligence, department comparisons, and longitudinal trends across the student body.
        </p>
      </div>

      {/* Cohort Radar + Stress Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Institutional Cohort Average Dimensions
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Aggregated composite profile of all active students
          </p>
          <PersonalityRadarChart data={cohortRadar} height={320} />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">
                Stress Indicator Distribution
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Student body categorization across stress indicator quartiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Low Stress (0–25%)", pct: 38, count: "931 students", color: "bg-emerald-500" },
                { label: "Mild Stress (26–50%)", pct: 32, count: "784 students", color: "bg-amber-500" },
                { label: "Elevated Stress (51–75%)", pct: 21, count: "514 students", color: "bg-orange-500" },
                { label: "High Stress (76–100%)", pct: 9, count: "221 students", color: "bg-red-500" },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{bar.label}</span>
                    <span>{bar.pct}% ({bar.count})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Department Comparison Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <CardTitle className="text-base text-slate-900">
            Department-Wise Comparative Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Department</th>
                <th className="p-4 text-center">Cohort Size</th>
                <th className="p-4 text-center">Avg Stress</th>
                <th className="p-4 text-center">Avg Motivation</th>
                <th className="p-4 text-center">Avg Well-Being</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => (
                <tr key={dept.name}>
                  <td className="p-4 font-bold text-slate-900">{dept.name}</td>
                  <td className="p-4 text-center font-semibold text-slate-600">{dept.students.toLocaleString()}</td>
                  <td className="p-4 text-center font-bold text-red-600">{dept.avgStress}%</td>
                  <td className="p-4 text-center font-bold text-emerald-600">{dept.avgMotivation}%</td>
                  <td className="p-4 text-center font-bold text-indigo-600">{dept.avgWellbeing}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
