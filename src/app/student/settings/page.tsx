import React from "react"
import { prisma } from "@/lib/database/prisma"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Lock, Bell, Eye } from "lucide-react"

export default async function StudentSettingsPage() {
  const student = await prisma.student.findFirst({
    include: { user: true, department: true, class: true },
  })

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile & Privacy Settings
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Manage your personal information, notification preferences, and privacy controls.
        </p>
      </div>

      {/* Account Info */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-900">Personal Information</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Details provided during enrollment at Nexus Institute.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input defaultValue={student?.user.name} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Student ID</Label>
              <Input defaultValue={student?.studentId} disabled className="bg-slate-50 font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <Input defaultValue={student?.user.email} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Input defaultValue={student?.department?.name || "Computer Science"} disabled className="bg-slate-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Transparency Controls */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center space-x-2 text-indigo-900">
            <Shield className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base">Privacy & Consent Controls</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            How your assessment responses are protected under institutional policy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-slate-600">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Counselor Confidentiality Access</p>
              <p className="text-slate-500">Allow assigned academic counselors to review assessment indicators for support sessions.</p>
            </div>
            <Switch defaultChecked disabled />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Anonymized Institutional Aggregation</p>
              <p className="text-slate-500">Contribute anonymized statistics to department-level well-being trends.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
