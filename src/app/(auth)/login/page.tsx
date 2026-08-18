"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, ArrowRight, ShieldCheck, UserCheck, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("student1@example.com")
  const [password, setPassword] = useState("Password@123")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Route based on role
    setTimeout(() => {
      if (email.includes("admin")) {
        router.push("/admin")
      } else if (email.includes("counselor") || email.includes("sarah")) {
        router.push("/counselor")
      } else {
        router.push("/student")
      }
    }, 600)
  }

  const setDemoUser = (role: "STUDENT" | "COUNSELOR" | "ADMIN") => {
    if (role === "ADMIN") {
      setEmail("admin@example.com")
      setPassword("Password@123")
    } else if (role === "COUNSELOR") {
      setEmail("counselor@example.com")
      setPassword("Password@123")
    } else {
      setEmail("student1@example.com")
      setPassword("Password@123")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            StudentInsight
          </span>
        </Link>
        <p className="text-xs text-indigo-200 mt-1">
          Student Personality & Well-Being Intelligence Platform
        </p>
      </div>

      <Card className="w-full max-w-md border-indigo-900/50 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-900 font-bold">
            Sign In to Your Account
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Enter your institutional email credentials to access your portal.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs h-10"
                placeholder="student@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-700">Password</Label>
                <Link href="/forgot-password" className="text-[11px] text-indigo-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 shadow-md"
            >
              <span>{loading ? "Signing in..." : "Sign In to Portal"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick 1-Click Role Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoUser("STUDENT")}
                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold text-[11px] transition-colors"
              >
                Student (John)
              </button>
              <button
                type="button"
                onClick={() => setDemoUser("COUNSELOR")}
                className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition-colors"
              >
                Counselor (Dr. M)
              </button>
              <button
                type="button"
                onClick={() => setDemoUser("ADMIN")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] transition-colors"
              >
                Super Admin
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 rounded-b-2xl flex justify-between items-center text-[11px] text-slate-500">
          <span>Protected by RBAC</span>
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Student Register →
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
