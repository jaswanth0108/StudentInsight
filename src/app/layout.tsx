import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "StudentInsight — Student Personality & Well-Being Assessment Platform",
  description:
    "An intelligent student assessment platform that transforms questionnaire responses into meaningful personality and well-being insights for counselors and educational institutions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full antialiased text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  )
}
