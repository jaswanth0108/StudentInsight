"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/student")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            StudentInsight
          </span>
        </Link>
      </div>

      <Card className="w-full max-w-md border-indigo-900/50 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-900 font-bold">
            Student Registration
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Create your account with your institution email address.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs h-10"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Institution Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs h-10"
                placeholder="student@nexus-edu.org"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs h-10"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 shadow-md"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 rounded-b-2xl flex justify-between items-center text-[11px] text-slate-500">
          <span>Already have an account?</span>
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In →
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
