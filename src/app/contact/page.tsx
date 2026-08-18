import React from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
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

      <main className="max-w-3xl mx-auto py-12 px-4 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Contact Counseling Services</h1>
        <p className="text-sm text-slate-600">
          Reach out to the institutional well-being and counseling department for immediate inquiries or privacy questions.
        </p>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="font-bold text-slate-900 block">General Inquiries & Support</span>
              <span className="text-slate-500">counseling@nexus-edu.org</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-teal-600" />
            <div>
              <span className="font-bold text-slate-900 block">Student Services Hotline</span>
              <span className="text-slate-500">+1-555-0192 (Mon–Fri 8:00 AM – 5:00 PM)</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="font-bold text-slate-900 block">Campus Center Location</span>
              <span className="text-slate-500">Student Services Wing, 2nd Floor, Room 204</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
