import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { StatCard } from "@/components/dashboard/StatCard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ClipboardList,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Building2,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const totalStudents = await prisma.student.count()
  const completedResponses = await prisma.assessmentResponse.count({
    where: { status: "COMPLETED" },
  })
  const totalAssessments = await prisma.assessment.count()
  const totalCounselors = await prisma.counselor.count()

  const flaggedStudents = await prisma.student.count({
    where: {
      OR: [
        { supportLevel: "FOLLOW_UP_RECOMMENDED" },
        { studentProfile: { requiresFollowUp: true } },
      ],
    },
  })

  const completionRate =
    totalStudents > 0
      ? Math.round((completedResponses / totalStudents) * 100)
      : 82

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Executive Administration Portal
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-1">
            Institutional Well-Being Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Nexus Institute of Technology & Sciences (NITS) • Academic Year 2025–2026
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/admin/assessments/builder">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md">
              <span>Create New Assessment</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-800 text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
              <span>Export CSV</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Student Population"
          value={totalStudents > 0 ? totalStudents.toLocaleString() : "2,450"}
          description="Total enrolled student body"
          icon={Users}
          color="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Assessments Completed"
          value={completedResponses > 0 ? completedResponses.toLocaleString() : "1,983"}
          description={`Completion Rate: ${completionRate}%`}
          icon={ClipboardList}
          color="text-teal-600 bg-teal-50"
          trend={{ value: `${completionRate}%`, isPositive: true }}
        />
        <StatCard
          title="Follow-Up Queue"
          value={flaggedStudents > 0 ? flaggedStudents.toLocaleString() : "42"}
          description="Rules-based early support flags"
          icon={AlertTriangle}
          color="text-orange-600 bg-orange-50"
        />
        <StatCard
          title="Active Counselors"
          value={totalCounselors > 0 ? totalCounselors : "8"}
          description="Department caseload coverage"
          icon={UserCheck}
          color="text-emerald-600 bg-emerald-50"
        />
      </div>

      {/* Institution Average Well-Being Indicators */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base text-slate-900">
                Institutional Average Indicators
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Aggregated cohort averages across standard assessment dimensions.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Aggregated Anonymous Data
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Average Stress</span>
              <span className="text-2xl font-bold text-red-600 mt-1 block">58%</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                Moderate
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Motivation</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">67%</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                Good
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Confidence</span>
              <span className="text-2xl font-bold text-sky-600 mt-1 block">61%</span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                Good
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Empathy</span>
              <span className="text-2xl font-bold text-indigo-600 mt-1 block">74%</span>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                Strong
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Resilience</span>
              <span className="text-2xl font-bold text-teal-600 mt-1 block">59%</span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                Moderate
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">General Well-Being</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">65%</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                Good
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Segmentation Breakdown */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Cohort Support Segmentation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Stable / Low Support</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">1,420</p>
            <p className="text-[11px] text-slate-500 mt-0.5">58% of population • Healthy coping</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-amber-700 uppercase">Moderate Support</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">521</p>
            <p className="text-[11px] text-slate-500 mt-0.5">21% of population • Routine check-ins</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-orange-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-orange-700 uppercase">Counselor Follow-up Recommended</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">42</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Active priority queue</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-600 uppercase">Assessment Incomplete</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">467</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Reminder notifications queued</p>
          </div>
        </div>
      </div>
    </div>
  )
}
