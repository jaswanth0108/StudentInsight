import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Users, GraduationCap } from "lucide-react"

export default async function AdminDepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: {
      classes: true,
      students: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Departments & Academic Classes
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Organize the institution structure across academic colleges, departments, and class sections.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((d) => (
          <Card key={d.id} className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50 pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-900">{d.name}</CardTitle>
                    <span className="text-xs text-slate-400 font-mono">Code: {d.code}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {d.students.length} Students
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              <p className="text-xs text-slate-600">{d.description}</p>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Classes & Cohorts ({d.classes.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {d.classes.map((cls) => (
                    <div key={cls.id} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                      {cls.name} (Year {cls.year})
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
