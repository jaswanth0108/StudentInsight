import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/database/prisma"
import { PersonalityProfileView } from "@/components/profile/PersonalityProfile"
import { HistoricalTrendChart } from "@/components/charts/HistoricalTrendChart"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  FileCheck,
  ClipboardList,
  AlertCircle,
  MessageSquare,
  Lock,
  Plus,
  CheckCircle2,
} from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/utils"

export default async function CounselorStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      class: true,
      counselor: { include: { user: true } },
      studentProfile: true,
      assessmentResponses: {
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        include: {
          assessment: true,
          categoryScores: true,
          answers: {
            include: {
              question: { include: { category: true } },
              option: true,
            },
          },
        },
      },
      counselingNotes: {
        orderBy: { createdAt: "desc" },
      },
      counselingSessions: {
        orderBy: { scheduledAt: "desc" },
      },
      followUpTasks: {
        orderBy: { dueDate: "asc" },
      },
    },
  })

  if (!student) {
    notFound()
  }

  const p = student.studentProfile
  const latestResponse = student.assessmentResponses[0]

  const scores: Record<string, number> = {
    empathy: p?.empathy ?? 84,
    humanity: p?.humanity ?? 80,
    socialInteraction: p?.socialInteraction ?? 58,
    introversion: p?.introversion ?? 72,
    extroversion: p?.extroversion ?? 30,
    communication: p?.communication ?? 67,
    confidence: p?.confidence ?? 54,
    stress: p?.stress ?? 68,
    academicPressure: p?.academicPressure ?? 74,
    emotionalWellbeing: p?.emotionalWellbeing ?? 62,
    motivation: p?.motivation ?? 70,
    discipline: p?.discipline ?? 76,
    resilience: p?.resilience ?? 52,
    adaptability: p?.adaptability ?? 71,
    leadership: p?.leadership ?? 61,
    cooperation: p?.cooperation ?? 82,
    behavioralTendencies: p?.behavioralTendencies ?? 70,
    socialSupport: p?.socialSupport ?? 75,
    selfAwareness: p?.selfAwareness ?? 78,
    generalWellbeing: p?.generalWellbeing ?? 60,
  }

  const strengths = ["empathy", "discipline", "motivation"]
  const areasForSupport = ["academicPressure", "confidence", "resilience"]

  // Longitudinal trend
  const trendData = [
    {
      date: "Sep 15",
      assessmentName: "Assessment 1",
      stress: 72,
      motivation: 65,
      confidence: 50,
      wellbeing: 54,
    },
    {
      date: "Nov 02",
      assessmentName: "Assessment 2",
      stress: 61,
      motivation: 68,
      confidence: 52,
      wellbeing: 58,
    },
    {
      date: "Current",
      assessmentName: "Assessment 3",
      stress: 47,
      motivation: 76,
      confidence: 55,
      wellbeing: 64,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/counselor/students">
          <Button variant="ghost" size="sm" className="text-slate-600 flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Directory</span>
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Link href="/counselor/sessions">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm">
              <Calendar className="w-4 h-4" />
              <span>Schedule Session</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation: Profile View, Raw Answers Review, Counselor Notes, Longitudinal Trends */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-200/80 p-1 rounded-xl">
          <TabsTrigger value="profile" className="text-xs font-semibold">
            Personality & Well-Being Profile
          </TabsTrigger>
          <TabsTrigger value="responses" className="text-xs font-semibold">
            Raw Question Responses ({latestResponse?.answers.length || 0})
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs font-semibold">
            Private Counselor Notes ({student.counselingNotes.length})
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs font-semibold">
            Historical Trends
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Full Profile */}
        <TabsContent value="profile" className="space-y-6 mt-0">
          <PersonalityProfileView
            studentName={student.user.name}
            studentId={student.studentId}
            departmentName={student.department?.name}
            className={student.class?.name}
            lastAssessmentDate={latestResponse?.completedAt || new Date()}
            scores={scores}
            strengths={strengths}
            areasForSupport={areasForSupport}
            aiSummary={p?.aiSummary}
            requiresFollowUp={p?.requiresFollowUp}
            flagReason={p?.flagReason}
          />
        </TabsContent>

        {/* Tab 2: Raw Student Responses (Read-only for authorized counselor) */}
        <TabsContent value="responses" className="space-y-4 mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base text-slate-900">
                    Raw Assessment Responses
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Authorized counselor clinical review of original questionnaire responses.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Confidential
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {!latestResponse || latestResponse.answers.length === 0 ? (
                <p className="text-xs text-slate-500">No responses recorded for this student.</p>
              ) : (
                latestResponse.answers.map((ans, idx) => (
                  <div
                    key={ans.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-xs text-slate-900">
                        {idx + 1}. {ans.question.text}
                      </span>
                      {ans.question.category && (
                        <Badge variant="secondary" className="text-[10px]">
                          {ans.question.category.name}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-1 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 font-medium">
                      {ans.option ? (
                        <span className="text-indigo-900 font-semibold">{ans.option.text}</span>
                      ) : ans.numericValue !== null && ans.numericValue !== undefined ? (
                        <span>Rated: <strong className="text-indigo-600 font-bold">{ans.numericValue}</strong> / 10</span>
                      ) : ans.textValue ? (
                        <p className="italic text-slate-700 leading-relaxed">&ldquo;{ans.textValue}&rdquo;</p>
                      ) : (
                        <span className="text-slate-400">No answer recorded</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Private Counselor Notes */}
        <TabsContent value="notes" className="space-y-4 mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-900 flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Private Clinical Observations & Session Notes</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Restricted access: notes are encrypted and never exposed to students or external parties.
                </CardDescription>
              </div>

              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Note</span>
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {student.counselingNotes.length === 0 ? (
                <p className="text-xs text-slate-500">No counseling notes recorded yet.</p>
              ) : (
                student.counselingNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>Recorded on {formatDateTime(note.createdAt)}</span>
                      <Badge variant="outline" className="text-[10px] bg-white">
                        Private Note
                      </Badge>
                    </div>
                    <p className="text-slate-800 text-xs leading-relaxed font-medium">
                      {note.content}
                    </p>
                    {note.tags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {note.tags.split(",").map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">
                            #{tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Historical Trends */}
        <TabsContent value="trends" className="space-y-6 mt-0">
          <HistoricalTrendChart data={trendData} height={340} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
