import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Calendar, Clock, MapPin, Plus, CheckCircle2, MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function StudentCounselingPage() {
  const student = await prisma.student.findFirst({
    include: {
      counselor: { include: { user: true } },
      counselingSessions: {
        orderBy: { scheduledAt: "desc" },
        include: { counselor: { include: { user: true } } },
      },
    },
  })

  const counselor = student?.counselor
  const sessions = student?.counselingSessions || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Counseling & Student Support
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Connect with your designated academic and well-being counselor for confidential guidance.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Request New Appointment</span>
        </Button>
      </div>

      {/* Assigned Counselor Profile Card */}
      <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {counselor?.user.name ? counselor.user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2) : "MH"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-slate-900">
                  {counselor?.user.name || "Dr. Marcus Holloway"}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Assigned Counselor
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Specialization: {counselor?.specialization || "Student Well-Being & Academic Stress"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Office: Room 204B, Student Services Wing • Phone: {counselor?.phoneNumber || "+1-555-0192"}
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="font-semibold text-xs text-indigo-700 border-indigo-200">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            <span>Send Direct Message</span>
          </Button>
        </CardContent>
      </Card>

      {/* Counseling Sessions Timeline */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          My Counseling Sessions & Appointments
        </h3>

        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-8 text-center text-slate-500 text-xs">
                No counseling sessions scheduled yet. Click &quot;Request New Appointment&quot; above to book a time.
              </CardContent>
            </Card>
          ) : (
            sessions.map((s) => (
              <Card key={s.id} className="border-slate-200 shadow-2xs">
                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {s.title}
                      </span>
                      <Badge
                        variant={s.status === "COMPLETED" ? "success" : "default"}
                        className="text-[10px]"
                      >
                        {s.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{formatDate(s.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{s.duration || 45} minutes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{s.location || "Room 204B"}</span>
                      </div>
                    </div>

                    {s.summary && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mt-2 border border-slate-100">
                        {s.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {s.status === "SCHEDULED" ? (
                      <Button size="sm" variant="outline" className="text-xs font-semibold">
                        Reschedule
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
