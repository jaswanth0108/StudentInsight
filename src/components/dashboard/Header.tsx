"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, LogOut, Shield, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"

interface HeaderProps {
  userName?: string
  userEmail?: string
  userRole?: string
  notifications?: Array<{
    id: string
    title: string
    message: string
    link?: string | null
    isRead: boolean
  }>
}

export function Header({
  userName = "User",
  userEmail = "user@example.com",
  userRole = "STUDENT",
  notifications = [],
}: HeaderProps) {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleLogout = async () => {
    // Navigate to login / logout endpoint
    router.push("/login")
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Search / Context banner */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
          Institution: <strong className="text-slate-800 font-semibold">Nexus Institute (NITS)</strong>
        </span>
      </div>

      {/* Right actions: notifications + profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {unreadCount} new
                  </Badge>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications right now.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs hover:bg-indigo-50/50 transition-colors"
                    >
                      <p className="font-semibold text-slate-900 mb-0.5">{n.title}</p>
                      <p className="text-slate-600">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {getInitials(userName)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">{userName}</p>
              <p className="text-[10px] text-slate-500 mt-1 capitalize">{userRole.toLowerCase()}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
