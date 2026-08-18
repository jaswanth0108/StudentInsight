import React from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft, ShieldCheck, HeartHandshake, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
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
        <h1 className="text-3xl font-bold text-slate-900">About StudentInsight</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          StudentInsight is a dedicated educational technology platform designed for universities, colleges, and schools to bridge the gap between student self-reported challenges and authorized counselor support.
        </p>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Core Objectives</h2>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
            <li>Empower students with self-awareness regarding academic pressure, emotional balance, and personal strengths.</li>
            <li>Equip institutional counselors with longitudinal assessment tracking to provide timely, compassionate guidance.</li>
            <li>Maintain non-diagnostic ethical guardrails, protecting student data with strict least-privilege security.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
