import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, ShieldCheck } from "lucide-react"

export default function AdminScoringPage() {
  const categories = [
    { key: "stress", name: "Stress Level", defaultWeight: "1.5", highThreshold: "76%", requiresFollowUp: true },
    { key: "academicPressure", name: "Academic Pressure", defaultWeight: "1.5", highThreshold: "76%", requiresFollowUp: true },
    { key: "emotionalWellbeing", name: "Emotional Well-Being", defaultWeight: "1.4", highThreshold: "25% (Low)", requiresFollowUp: true },
    { key: "empathy", name: "Empathy", defaultWeight: "1.2", highThreshold: "80%", requiresFollowUp: false },
    { key: "motivation", name: "Motivation", defaultWeight: "1.2", highThreshold: "75%", requiresFollowUp: false },
    { key: "resilience", name: "Resilience", defaultWeight: "1.5", highThreshold: "25% (Low)", requiresFollowUp: true },
    { key: "confidence", name: "Confidence", defaultWeight: "1.3", highThreshold: "80%", requiresFollowUp: false },
    { key: "discipline", name: "Self-Discipline", defaultWeight: "1.2", highThreshold: "75%", requiresFollowUp: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Scoring & Normalization Configuration
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Configure weighted algorithms, reverse-scoring multipliers, and early follow-up alert thresholds.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Save className="w-4 h-4" />
          <span>Save Scoring Rules</span>
        </Button>
      </div>

      {/* Global Indicator Ranges */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-900">Standard Visual Indicator Scales (0–100%)</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Define threshold cutoffs for visual color-coding and counselor priority queues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-800">Low Indicator (0–25%)</span>
              <p className="text-emerald-700">Minimal observed concern; standard coping habits.</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="font-bold text-amber-800">Mild Indicator (26–50%)</span>
              <p className="text-amber-700">Manageable routine stress and standard study fluctuations.</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-1">
              <span className="font-bold text-orange-800">Elevated Indicator (51–75%)</span>
              <p className="text-orange-700">Noticeable pressure noted; proactive check-in recommended.</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <span className="font-bold text-red-800">High Indicator (76–100%)</span>
              <p className="text-red-700">Significant load; prioritized for counselor outreach.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Weights and Escalation Configuration */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-900">Dimension Multipliers & Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Dimension</th>
                  <th className="p-3">Default Weight Multiplier</th>
                  <th className="p-3">Attention Threshold</th>
                  <th className="p-3">Triggers Follow-Up Queue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <tr key={c.key}>
                    <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="p-3">
                      <Input defaultValue={c.defaultWeight} className="h-8 w-24 text-xs font-mono" />
                    </td>
                    <td className="p-3 font-mono text-slate-600">{c.highThreshold}</td>
                    <td className="p-3">
                      {c.requiresFollowUp ? (
                        <Badge variant="attention" className="text-[10px]">
                          Yes • Priority Queue
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Informational Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
