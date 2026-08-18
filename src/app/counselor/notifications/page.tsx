import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default async function CounselorNotificationsPage() {
  const counselor = await prisma.counselor.findFirst({
    include: { user: true },
  })

  const notifications = await prisma.notification.findMany({
    where: { userId: counselor?.userId || "" },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Counselor Alerts & Notifications
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Automated student assessment completion alerts and priority follow-up recommendations.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-8 text-center text-slate-500 text-xs">
              No new alerts.
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className="border-slate-200 shadow-2xs hover:shadow-sm transition-all">
              <CardContent className="p-4 flex items-start space-x-3.5">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-slate-900">{n.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
