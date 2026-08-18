import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Save, Sparkles, Lock } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional System Settings
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Global institution configuration, AI assistance toggles, and security retention rules.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Institution Info */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-900">Institution Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Institution Name</Label>
              <Input defaultValue="Nexus Institute of Technology & Sciences" className="text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Institution Code</Label>
              <Input defaultValue="NITS" className="text-xs font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Support Contact Email</Label>
              <Input defaultValue="counseling@nexus-edu.org" className="text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Academic Year</Label>
              <Input defaultValue="2025–2026" className="text-xs" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistance Policy */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2 text-indigo-900">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base">Responsible AI Assistance Policy</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Ensure automated algorithms function strictly as non-diagnostic counselor aids.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-slate-600">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Free-Text Summarization for Counselors</p>
              <p className="text-slate-500">Generate non-clinical summaries of student reflections for counselors.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Distress Language Pre-Screening Flag</p>
              <p className="text-slate-500">Automatically flag open-ended responses indicating extreme distress for immediate counselor review.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
