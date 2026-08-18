import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Filter, ArrowRight, Activity, Zap, AlertTriangle, FileSpreadsheet } from "lucide-react"

export default async function AdminStudentsPage({
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
      counselor: { include: { user: true } },
      studentProfile: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Population Management
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Browse and filter all enrolled students with multi-dimensional indicators.
          </p>
        </div>

        <Link href="/admin/reports">
          <Button variant="outline" size="sm" className="font-semibold text-xs flex items-center space-x-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Student Roster (CSV)</span>
          </Button>
        </Link>
      </div>

      {/* Advanced Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by student name or STU ID..."
            className="pl-9 text-xs"
            defaultValue={query || ""}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs py-1.5 px-3 bg-slate-50 border-slate-300">
            All ({students.length})
          </Badge>
          <Badge variant="attention" className="text-xs py-1.5 px-3">
            Stress &gt; 70%
          </Badge>
          <Badge variant="secondary" className="text-xs py-1.5 px-3">
            Motivation &lt; 50%
          </Badge>
        </div>
      </div>

      {/* Students Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Department & Class</th>
                <th className="p-4">Assigned Counselor</th>
                <th className="p-4 text-center">Stress</th>
                <th className="p-4 text-center">Motivation</th>
                <th className="p-4 text-center">Confidence</th>
                <th className="p-4 text-center">Support Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => {
                const p = s.studentProfile
                const isFlagged = p?.requiresFollowUp || s.supportLevel === "FOLLOW_UP_RECOMMENDED"

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{s.user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId} • {s.user.email}</div>
                    </td>
                    <td className="p-4">
                      <div>{s.department?.name || "Computer Science"}</div>
                      <div className="text-[11px] text-slate-400">{s.class?.name || "Year 2"}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {s.counselor?.user.name || "Unassigned"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${p && p.stress > 65 ? "text-red-600" : "text-slate-800"}`}>
                        {Math.round(p?.stress || 50)}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-emerald-600">
                        {Math.round(p?.motivation || 50)}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-sky-600">
                        {Math.round(p?.confidence || 50)}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {isFlagged ? (
                        <Badge variant="attention" className="text-[10px]">
                          Follow-up
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Stable
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/counselor/students/${s.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs text-indigo-600 font-semibold">
                          Profile →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
