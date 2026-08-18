import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { StatCard } from "@/components/dashboard/StatCard"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  AlertTriangle,
  ClipboardList,
  Calendar,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function CounselorDashboardPage() {
  const counselor = await prisma.counselor.findFirst({
    include: { user: true },
  })

  // Fetch counselor's assigned students
  const students = await prisma.student.findMany({
    include: {
      user: true,
      department: true,
      class: true,
      studentProfile: true,
      assessmentResponses: {
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
  })

  // Priority follow-up students
  const priorityStudents = students.filter(
    (s) => s.studentProfile?.requiresFollowUp || s.supportLevel === "FOLLOW_UP_RECOMMENDED"
  )

  // Upcoming sessions
  const sessions = await prisma.counselingSession.findMany({
    where: { status: "SCHEDULED" },
    orderBy: { scheduledAt: "asc" },
    include: { student: { include: { user: true } } },
    take: 5,
  })

  // Pending follow-up tasks
  const tasks = await prisma.followUpTask.findMany({
    where: { status: "PENDING" },
    include: { student: { include: { user: true } } },
    take: 5,
  })

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
            Counselor Workspace
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-1">
            Welcome, {counselor?.user.name || "Dr. Marcus Holloway"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Specialization: {counselor?.specialization || "Student Well-Being & Academic Stress"} • Staff ID: {counselor?.staffId || "CNS-101"}
          </p>
        </div>

        <Link href="/counselor/students">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md">
            <span>Search All Students</span>
            <Search className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Students"
          value={students.length}
          description="Active student portfolio"
          icon={Users}
          color="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Priority Follow-Ups"
          value={priorityStudents.length}
          description="Assessment indicators elevated"
          icon={AlertTriangle}
          color="text-orange-600 bg-orange-50"
        />
        <StatCard
          title="Scheduled Sessions"
          value={sessions.length}
          description="Upcoming calendar appointments"
          icon={Calendar}
          color="text-teal-600 bg-teal-50"
        />
        <StatCard
          title="Pending Action Items"
          value={tasks.length}
          description="Follow-up tasks awaiting review"
          icon={ClipboardList}
          color="text-sky-600 bg-sky-50"
        />
      </div>

      {/* Priority Follow-Up List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Priority Follow-Up Queue
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Rules-based flags • Non-diagnostic early support triggers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorityStudents.map((s) => {
            const p = s.studentProfile
            return (
              <Card key={s.id} className="border-orange-200/80 bg-orange-50/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base text-slate-900">{s.user.name}</CardTitle>
                      <CardDescription className="text-xs text-slate-500 font-mono">
                        {s.studentId} • {s.department?.name || "CSE"}
                      </CardDescription>
                    </div>
                    <Badge variant="attention" className="text-[10px]">
                      Follow-up Recommended
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="text-xs space-y-2">
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-orange-100 bg-white/80 rounded-lg px-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Stress Indicator</span>
                      <span className="font-bold text-red-600 text-sm">{Math.round(p?.stress || 68)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Motivation</span>
                      <span className="font-bold text-emerald-600 text-sm">{Math.round(p?.motivation || 70)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Confidence</span>
                      <span className="font-bold text-sky-600 text-sm">{Math.round(p?.confidence || 54)}%</span>
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs line-clamp-2">
                    <strong>Reason:</strong> {p?.flagReason || "Assessment indicates elevated academic pressure and study pacing concerns."}
                  </p>
                </CardContent>

                <CardFooter className="pt-0 flex justify-between gap-2">
                  <Link href={`/counselor/students/${s.id}`} className="w-full">
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                      <span>Review Student Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Counseling Workflow Timeline & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheduled Sessions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Upcoming Counseling Appointments</span>
            </h3>
            <Link href="/counselor/sessions">
              <Button variant="ghost" size="sm" className="text-xs text-indigo-600 font-semibold">
                Manage All →
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-sm text-slate-900">{s.student.user.name}</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{s.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(s.scheduledAt)} • {s.duration || 45} mins • {s.location || "Room 204B"}
                  </p>
                </div>
                <Link href={`/counselor/students/${s.studentId}`}>
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    Open Record
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Student Support Lifecycle Timeline */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="font-bold text-sm text-white">
                Counseling Care Cycle
              </h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Standard operating procedure for proactive student well-being support:
            </p>

            <div className="space-y-3 text-xs">
              {[
                { step: "1", title: "Assessment Completed", sub: "Responses submitted by student" },
                { step: "2", title: "Deterministic Indicators", sub: "Normalized scores & radar profile calculated" },
                { step: "3", title: "Counselor Clinical Review", sub: "Counselor reviews raw responses and flags" },
                { step: "4", title: "Support Session Scheduled", sub: "Confidential 1-on-1 check-in" },
                { step: "5", title: "Action Plan & Follow-Up", sub: "Pacing guidance and progress monitoring" },
                { step: "6", title: "Reassessment & Longitudinal Trend", sub: "Compare subsequent results over time" },
              ].map((cycle) => (
                <div key={cycle.step} className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-teal-500/40">
                    {cycle.step}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-100">{cycle.title}</p>
                    <p className="text-[11px] text-slate-400">{cycle.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
