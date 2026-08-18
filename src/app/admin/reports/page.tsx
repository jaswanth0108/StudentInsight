import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from "lucide-react"

export default function AdminReportsPage() {
  const reports = [
    {
      title: "Comprehensive Student Assessment Roster",
      format: "CSV / Excel",
      desc: "Anonymized or authorized student dimension scores, completion dates, and support categories.",
      action: "Export Roster",
    },
    {
      title: "Department Well-Being Aggregation Report",
      format: "PDF / CSV",
      desc: "Aggregated statistical indicators comparing average academic stress and resilience across colleges.",
      action: "Generate Summary",
    },
    {
      title: "Counselor Workload & Follow-up Audit",
      format: "CSV",
      desc: "Caseload metrics, scheduled check-ins, and priority queue resolution times.",
      action: "Export Workload",
    },
    {
      title: "Institutional Assessment Completion Audit",
      format: "Excel",
      desc: "Participation rates, incomplete drafts, and response timeline analytics.",
      action: "Export Audit",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Export & Reporting Center
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Generate authorized administrative reports and export cohort data under institutional compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <Card key={r.title} className="border-slate-200 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {r.format}
                </Badge>
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              </div>
              <CardTitle className="text-base text-slate-900 leading-snug mt-2">
                {r.title}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                {r.desc}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <Button variant="outline" size="sm" className="w-full text-xs font-semibold flex items-center justify-center space-x-1.5 border-slate-300 hover:bg-slate-50">
                <Download className="w-3.5 h-3.5" />
                <span>{r.action}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
