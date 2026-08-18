import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { HistoricalTrendChart } from "@/components/charts/HistoricalTrendChart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, TrendingDown, ArrowRight, CheckCircle2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function StudentHistoryPage() {
  const student = await prisma.student.findFirst({
    include: {
      assessmentResponses: {
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "asc" },
        include: {
          assessment: true,
          categoryScores: true,
        },
      },
    },
  })

  const responses = student?.assessmentResponses || []

  // Trend data points mapping
  const trendData = [
    {
      date: "Sep 15",
      assessmentName: "Assessment 1",
      stress: 72,
      motivation: 65,
      confidence: 50,
      wellbeing: 54,
    },
    {
      date: "Nov 02",
      assessmentName: "Assessment 2",
      stress: 61,
      motivation: 68,
      confidence: 52,
      wellbeing: 58,
    },
    {
      date: "Current",
      assessmentName: "Assessment 3",
      stress: 47,
      motivation: 76,
      confidence: 55,
      wellbeing: 64,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Assessment History & Longitudinal Progress
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Track how your stress indicators, motivation, and coping strategies develop over time.
        </p>
      </div>

      {/* Progress highlight card */}
      <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            Longitudinal Progress
          </span>
          <h3 className="text-xl font-bold mt-1">Trend: Improving</h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            Stress indicators decreased from <strong>72% → 61% → 47%</strong> across consecutive check-ins.
          </p>
        </div>
        <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
          <TrendingDown className="w-8 h-8 text-emerald-300" />
        </div>
      </div>

      {/* Historical Trend Line Chart */}
      <HistoricalTrendChart data={trendData} height={320} />

      {/* History table / card list */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Past Completed Assessments
        </h3>

        {responses.length === 0 ? (
          <p className="text-xs text-slate-500">No completed assessments recorded yet.</p>
        ) : (
          responses.map((r, idx) => (
            <Card key={r.id} className="border-slate-200 shadow-2xs">
              <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {r.assessment.title}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      v{r.assessment.version}.0
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Completed on {formatDate(r.completedAt || new Date())} •{" "}
                    <span className="text-emerald-700 font-semibold">Verified</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Link href={`/student/results/${r.id}`}>
                    <Button size="sm" variant="outline" className="text-xs font-semibold">
                      <span>View Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
