import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Filter, ArrowRight, Activity, Zap, AlertTriangle, CheckCircle2 } from "lucide-react"

export default async function CounselorStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; filter?: string }>
}) {
  const { query, filter } = await searchParams

  const students = await prisma.student.findMany({
    where: query
      ? {
          OR: [
            { user: { name: { contains: query } } },
            { studentId: { contains: query } },
          ],
        }
      : {},
    include: {
      user: true,
      department: true,
      class: true,
      studentProfile: true,
      assessmentResponses: {
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Assigned Student Directory
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Search, filter, and review multi-dimensional assessment indicators for all authorized students.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by student name or STU ID..."
            className="pl-9 text-xs"
            defaultValue={query || ""}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Badge variant="outline" className="text-xs py-1.5 px-3 cursor-pointer bg-slate-50 border-slate-300">
            All Students ({students.length})
          </Badge>
          <Badge variant="attention" className="text-xs py-1.5 px-3 cursor-pointer">
            Follow-Up Queue
          </Badge>
          <Badge variant="secondary" className="text-xs py-1.5 px-3 cursor-pointer">
            High Motivation (&gt;70%)
          </Badge>
        </div>
      </div>

      {/* Students Table / Cards */}
      <div className="space-y-4">
        {students.map((s) => {
          const p = s.studentProfile
          const isFlagged = p?.requiresFollowUp || s.supportLevel === "FOLLOW_UP_RECOMMENDED"

          return (
            <Card
              key={s.id}
              className={`border transition-all hover:shadow-md ${
                isFlagged
                  ? "border-orange-200 bg-orange-50/10"
                  : "border-slate-200 bg-white"
              }`}
            >
              <CardContent className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Student Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                    {s.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-base">{s.user.name}</h3>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {s.studentId}
                      </Badge>
                      {isFlagged && (
                        <Badge variant="attention" className="text-[10px]">
                          Attention Flag
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.department?.name || "Computer Science"} • {s.class?.name || "Year 2"} • {s.user.email}
                    </p>
                  </div>
                </div>

                {/* Score Indicators Pill Bar */}
                <div className="flex flex-wrap items-center gap-4 py-1 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Stress Indicator</span>
                    <span className={`font-bold ${p && p.stress > 65 ? "text-red-600" : "text-slate-800"}`}>
                      {Math.round(p?.stress || 50)}%
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Academic Pressure</span>
                    <span className="font-bold text-orange-600">
                      {Math.round(p?.academicPressure || 50)}%
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Motivation</span>
                    <span className="font-bold text-emerald-600">
                      {Math.round(p?.motivation || 50)}%
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Empathy</span>
                    <span className="font-bold text-indigo-600">
                      {Math.round(p?.empathy || 50)}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <Link href={`/counselor/students/${s.id}`}>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
