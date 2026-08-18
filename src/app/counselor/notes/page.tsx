import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Plus, FileText, ArrowRight } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default async function CounselorNotesPage() {
  const notes = await prisma.counselingNote.findMany({
    include: {
      student: { include: { user: true, department: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Lock className="w-5 h-5 text-slate-600" />
            <span>Confidential Counseling Notes</span>
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Private clinical and academic support observations. Strictly protected by role-based authorization.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((n) => (
          <Card key={n.id} className="border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <CardContent className="p-5 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900">{n.student.user.name}</h3>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {n.student.studentId}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Private Note
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatDateTime(n.createdAt)}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                {n.content}
              </p>

              {n.tags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {n.tags.split(",").map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      #{t.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
