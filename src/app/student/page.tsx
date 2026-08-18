import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { StatCard } from "@/components/dashboard/StatCard"
import { PersonalityRadarChart } from "@/components/charts/RadarChart"
import { StressGauge } from "@/components/charts/StressGauge"
import { ScoreCard } from "@/components/charts/ScoreCard"
import { StrengthsAreas } from "@/components/profile/StrengthsAreas"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  HeartHandshake,
  Activity,
  Zap,
  Award,
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  UserCheck,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function StudentDashboardPage() {
  // Fetch default student (John Doe STU-1024)
  const student = await prisma.student.findFirst({
    include: {
      user: true,
      department: true,
      class: true,
      counselor: { include: { user: true } },
      studentProfile: true,
      assessmentResponses: {
        orderBy: { completedAt: "desc" },
        take: 1,
        include: { assessment: true, categoryScores: true },
      },
      counselingSessions: {
        where: { status: "SCHEDULED" },
        orderBy: { scheduledAt: "asc" },
        take: 1,
        include: { counselor: { include: { user: true } } },
      },
    },
  })

  const profile = student?.studentProfile
  const latestResponse = student?.assessmentResponses[0]
  const upcomingSession = student?.counselingSessions[0]

  const scores: Record<string, number> = {
    stress: profile?.stress ?? 68,
    academicPressure: profile?.academicPressure ?? 74,
    motivation: profile?.motivation ?? 70,
    confidence: profile?.confidence ?? 54,
    empathy: profile?.empathy ?? 84,
    resilience: profile?.resilience ?? 52,
    communication: profile?.communication ?? 67,
    adaptability: profile?.adaptability ?? 71,
    discipline: profile?.discipline ?? 76,
    cooperation: profile?.cooperation ?? 82,
    generalWellbeing: profile?.generalWellbeing ?? 60,
  }

  const radarData = [
    { name: "Empathy", score: scores.empathy },
    { name: "Confidence", score: scores.confidence },
    { name: "Motivation", score: scores.motivation },
    { name: "Resilience", score: scores.resilience },
    { name: "Adaptability", score: scores.adaptability },
    { name: "Communication", score: scores.communication },
    { name: "Discipline", score: scores.discipline },
    { name: "Cooperation", score: scores.cooperation },
  ]

  const strengths = ["empathy", "discipline", "motivation"]
  const areasForSupport = ["academicPressure", "confidence", "resilience"]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Student Dashboard
            </span>
            <Badge variant="outline" className="text-indigo-200 border-indigo-400/40 text-[10px]">
              {student?.studentId || "STU-1024"}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {student?.user.name || "Student"}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
            {student?.department?.name || "Computer Science"} • Assigned Counselor:{" "}
            <strong>{student?.counselor?.user.name || "Dr. Marcus Holloway"}</strong>
          </p>
        </div>

        <Link href="/student/assessments">
          <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold shadow-sm">
            <span>View Assessments</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Top 4 Score Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Stress Indicator"
          value={`${Math.round(scores.stress)}%`}
          description="Elevated academic load observed"
          icon={Activity}
          color="text-red-600 bg-red-50"
        />
        <StatCard
          title="Motivation Level"
          value={`${Math.round(scores.motivation)}%`}
          description="Consistent goal engagement"
          icon={Zap}
          color="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Confidence Indicator"
          value={`${Math.round(scores.confidence)}%`}
          description="Moderate self-assurance"
          icon={Award}
          color="text-sky-600 bg-sky-50"
        />
        <StatCard
          title="Empathy & Humanity"
          value={`${Math.round(scores.empathy)}%`}
          description="Strong interpersonal awareness"
          icon={HeartHandshake}
          color="text-indigo-600 bg-indigo-50"
        />
      </div>

      {/* Main Visuals: Radar Chart + Stress Gauge & Counselor Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Personality Dimensions Overview
              </h3>
              <p className="text-xs text-slate-500">
                Multi-axial representation across core behavioral tendencies
              </p>
            </div>
            <Link href="/student/profile">
              <Button variant="ghost" size="sm" className="text-xs text-indigo-600 font-semibold">
                Full Profile →
              </Button>
            </Link>
          </div>
          <PersonalityRadarChart data={radarData} height={300} />
        </div>

        {/* Stress Gauge & Upcoming Counseling */}
        <div className="lg:col-span-5 space-y-6">
          <StressGauge score={scores.stress} title="Current Stress Indicator" size="md" />

          {/* Upcoming Session Card */}
          <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/40 to-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <CardTitle className="text-sm text-slate-900">
                    Next Counseling Appointment
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Scheduled
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5">
              <p className="font-semibold text-slate-800">
                {upcomingSession?.title || "Academic Stress & Time Management Check-in"}
              </p>
              <p className="text-slate-600">
                Counselor:{" "}
                <strong>
                  {upcomingSession?.counselor.user.name || "Dr. Marcus Holloway"}
                </strong>
              </p>
              <p className="text-slate-500">
                Date: {formatDate(upcomingSession?.scheduledAt || new Date(Date.now() + 2 * 86400000))} • Location: Room 204B
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/student/counseling" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Manage Appointments
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Strengths & Areas to Explore */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Assessment Insights Summary
        </h3>
        <StrengthsAreas strengths={strengths} areasForSupport={areasForSupport} />
      </div>

      {/* Recommended Self-Improvement Resources */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Recommended Self-Improvement & Well-Being Resources
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Personalized recommendations curated by institutional counseling services based on recent responses:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <Badge variant="secondary" className="text-[10px]">Academic Strategy</Badge>
            <h4 className="font-semibold text-sm text-slate-900">The 25/5 Pomodoro Pacing Guide</h4>
            <p className="text-xs text-slate-600">Techniques to break complex programming assignments into manageable intervals without burnout.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <Badge variant="secondary" className="text-[10px]">Stress Management</Badge>
            <h4 className="font-semibold text-sm text-slate-900">Sleep Hygiene for Exam Weeks</h4>
            <p className="text-xs text-slate-600">Actionable habits to maintain 7+ hours of quality restorative sleep during midterm stress.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <Badge variant="secondary" className="text-[10px]">Confidence</Badge>
            <h4 className="font-semibold text-sm text-slate-900">Communicating with Faculty</h4>
            <p className="text-xs text-slate-600">Templates and tips for comfortably asking professors for clarification and deadline pacing.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
