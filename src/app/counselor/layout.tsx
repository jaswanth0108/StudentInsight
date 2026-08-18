import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { prisma } from "@/lib/database/prisma"

export default async function CounselorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const counselor = await prisma.counselor.findFirst({
    include: { user: true },
  })

  const notifications = await prisma.notification.findMany({
    where: { userId: counselor?.userId || "" },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="COUNSELOR" userName={counselor?.user.name || "Dr. Marcus Holloway"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={counselor?.user.name || "Dr. Marcus Holloway"}
          userEmail={counselor?.user.email || "counselor@example.com"}
          userRole="COUNSELOR"
          notifications={notifications}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
