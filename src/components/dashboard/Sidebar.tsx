"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  HeartHandshake,
  Settings,
  Bell,
  BarChart3,
  Users,
  Building2,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  History,
  FileSpreadsheet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  role: "STUDENT" | "COUNSELOR" | "ADMIN"
  userName?: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()

  const studentLinks = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "My Assessments", href: "/student/assessments", icon: ClipboardList },
    { label: "Personality Profile", href: "/student/profile", icon: Sparkles },
    { label: "Well-Being Overview", href: "/student/wellbeing", icon: HeartHandshake },
    { label: "Assessment History", href: "/student/history", icon: History },
    { label: "Counseling & Support", href: "/student/counseling", icon: UserCheck },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
    { label: "Profile Settings", href: "/student/settings", icon: Settings },
  ]

  const counselorLinks = [
    { label: "Counselor Workspace", href: "/counselor", icon: LayoutDashboard },
    { label: "Assigned Students", href: "/counselor/students", icon: Users },
    { label: "Counseling Sessions", href: "/counselor/sessions", icon: UserCheck },
    { label: "Follow-up Tasks", href: "/counselor/followups", icon: ClipboardList },
    { label: "Counselor Notes", href: "/counselor/notes", icon: FileCheck },
    { label: "Notifications", href: "/counselor/notifications", icon: Bell },
  ]

  const adminLinks = [
    { label: "Admin Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Student Directory", href: "/admin/students", icon: Users },
    { label: "Counselor Roster", href: "/admin/counselors", icon: UserCheck },
    { label: "Departments & Classes", href: "/admin/departments", icon: Building2 },
    { label: "Assessments Manager", href: "/admin/assessments", icon: ClipboardList },
    { label: "Visual Assessment Builder", href: "/admin/assessments/builder", icon: Sparkles },
    { label: "Question Bank", href: "/admin/questions", icon: HelpCircle },
    { label: "Scoring Configuration", href: "/admin/scoring", icon: Settings },
    { label: "Institution Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Reports & Exports", href: "/admin/reports", icon: FileSpreadsheet },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ]

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "COUNSELOR"
      ? counselorLinks
      : studentLinks

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight text-base">
            StudentInsight
          </h1>
          <Badge
            variant="secondary"
            className="text-[10px] uppercase font-bold py-0 px-1.5 bg-indigo-950 text-indigo-300 border-indigo-800/60"
          >
            {role} Portal
          </Badge>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          const isActive =
            pathname === link.href ||
            (link.href !== "/student" &&
              link.href !== "/counselor" &&
              link.href !== "/admin" &&
              pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-400"
                )}
              />
              <span className="truncate">{link.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Ethical Guardrail Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 leading-relaxed">
        <p className="font-semibold text-slate-400 mb-0.5">Ethical Notice</p>
        Assessment indicators are decision-support tools, not diagnostic evaluations.
      </div>
    </aside>
  )
}
