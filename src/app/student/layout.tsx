import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { prisma } from "@/lib/database/prisma"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch default student user for display
  const student = await prisma.student.findFirst({
    include: { user: true },
  })

  const notifications = await prisma.notification.findMany({
    where: { userId: student?.userId || "" },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="STUDENT" userName={student?.user.name || "Student"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={student?.user.name || "Student"}
          userEmail={student?.user.email || "student@example.com"}
          userRole="STUDENT"
          notifications={notifications}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
