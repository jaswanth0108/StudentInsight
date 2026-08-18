import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { prisma } from "@/lib/database/prisma"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await prisma.admin.findFirst({
    include: { user: true },
  })

  const notifications = await prisma.notification.findMany({
    where: { userId: admin?.userId || "" },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="ADMIN" userName={admin?.user.name || "Dean Eleanor Vance"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={admin?.user.name || "Dean Eleanor Vance"}
          userEmail={admin?.user.email || "admin@example.com"}
          userRole="ADMIN"
          notifications={notifications}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
