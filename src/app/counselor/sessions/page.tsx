import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock, MapPin, CheckCircle2, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function CounselorSessionsPage() {
  const sessions = await prisma.counselingSession.findMany({
    include: {
      student: { include: { user: true, department: true } },
    },
    orderBy: { scheduledAt: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Counseling Sessions Manager
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Schedule, manage, and record notes for student counseling appointments.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <Card key={s.id} className="border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900">{s.student.user.name}</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {s.student.studentId}
                  </Badge>
                  <Badge variant={s.status === "COMPLETED" ? "success" : "default"} className="text-[10px]">
                    {s.status}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-800">{s.title}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-0.5">
                  <span>{formatDate(s.scheduledAt)}</span>
                  <span>•</span>
                  <span>{s.duration || 45} mins</span>
                  <span>•</span>
                  <span>{s.location || "Room 204B"}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link href={`/counselor/students/${s.studentId}`}>
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    View Profile & Notes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
