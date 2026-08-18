import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Plus, CheckCircle2, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function CounselorFollowUpsPage() {
  const tasks = await prisma.followUpTask.findMany({
    include: {
      student: { include: { user: true, department: true } },
    },
    orderBy: { dueDate: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Follow-Up Action Items
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Track action tasks, student review milestones, and pacing schedules.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>New Action Item</span>
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <Card key={t.id} className="border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900">{t.student.user.name}</h3>
                  <Badge variant={t.status === "COMPLETED" ? "success" : "attention"} className="text-[10px]">
                    {t.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Priority {t.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{t.title}</p>
                <p className="text-xs text-slate-600">{t.description}</p>
                {t.dueDate && (
                  <p className="text-[11px] text-slate-400 pt-0.5">
                    Target Due Date: {formatDate(t.dueDate)}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link href={`/counselor/students/${t.studentId}`}>
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    Open Student Profile
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
