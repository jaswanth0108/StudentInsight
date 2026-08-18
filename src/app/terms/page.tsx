import React from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service & Usage</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          These terms govern the institutional usage of the Student Personality and Well-Being Assessment platform.
        </p>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Educational Decision Support</h3>
            <p className="leading-relaxed">StudentInsight is designed solely as an educational counseling support platform. It is not intended to substitute for emergency psychiatric intervention.</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Confidentiality Agreement</h3>
            <p className="leading-relaxed">All authorized counselors and administrators must uphold institutional and statutory data protection protocols.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
