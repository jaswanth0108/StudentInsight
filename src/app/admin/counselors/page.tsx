import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Plus, Mail, Phone, Users } from "lucide-react"

export default async function AdminCounselorsPage() {
  const counselors = await prisma.counselor.findMany({
    include: {
      user: true,
      students: true,
      counselingSessions: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Counselor Roster & Workload
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Manage counseling staff, specializations, and caseload distributions.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Counselor</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counselors.map((c) => (
          <Card key={c.id} className="border-slate-200 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                  {c.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{c.user.name}</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {c.staffId}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs text-slate-600">
              <p className="font-medium text-slate-800">
                Specialization: {c.specialization || "General Academic Support"}
              </p>

              <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 bg-slate-50 rounded-lg px-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Students</span>
                  <span className="font-bold text-slate-900 text-sm">{c.students.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Active Sessions</span>
                  <span className="font-bold text-teal-600 text-sm">{c.counselingSessions.length}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{c.user.email}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{c.phoneNumber || "+1-555-0100"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
