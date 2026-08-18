import React from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft, ShieldCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-slate-900">StudentInsight</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back Home</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <div className="flex items-center space-x-2 text-indigo-900">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900">Privacy & Transparency Policy</h1>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          StudentInsight upholds strict institutional student privacy and least-privilege role-based data governance.
        </p>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">1. Data Minimization & Purpose</h3>
            <p className="leading-relaxed">We collect only self-reported questionnaire responses necessary to generate multi-dimensional well-being indicators and support counseling care.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">2. Non-Diagnostic Guarantee</h3>
            <p className="leading-relaxed">Indicators are never calculated or stored as psychiatric or medical diagnoses. They represent assessment-based behavioral observations.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">3. Access Boundaries</h3>
            <p className="leading-relaxed">Student profiles are strictly confidential. Students cannot view peer information. Private clinical observations are encrypted and restricted solely to authorized counselors.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
