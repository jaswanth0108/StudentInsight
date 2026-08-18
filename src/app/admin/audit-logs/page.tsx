import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, User, Lock, Clock } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Security & Access Audit Logs
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Immutable logging of access, assessment publishing, and profile reviews under privacy regulations.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{log.user.name}</div>
                      <div className="text-[10px] text-slate-400">{log.user.role}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-indigo-700">
                      {log.resource}
                    </td>
                    <td className="p-4 text-[11px] text-slate-600">
                      {log.details ? String(log.details) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
