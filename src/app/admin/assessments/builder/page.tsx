"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BuilderQuestion {
  id: string
  text: string
  type: string
  categoryKey: string
  weight: number
  isReversed: boolean
  options: { text: string; value: number }[]
}

const CATEGORIES = [
  { key: "stress", name: "Stress Level" },
  { key: "academicPressure", name: "Academic Pressure" },
  { key: "emotionalWellbeing", name: "Emotional Well-Being" },
  { key: "empathy", name: "Empathy" },
  { key: "confidence", name: "Confidence" },
  { key: "motivation", name: "Motivation" },
  { key: "discipline", name: "Self-Discipline" },
  { key: "resilience", name: "Resilience" },
  { key: "adaptability", name: "Adaptability" },
  { key: "communication", name: "Communication" },
  { key: "leadership", name: "Leadership" },
  { key: "socialSupport", name: "Social Support" },
  { key: "generalWellbeing", name: "General Well-Being" },
]

export default function AssessmentBuilderPage() {
  const router = useRouter()
  const [title, setTitle] = useState("Midterm Well-Being & Stress Assessment")
  const [description, setDescription] = useState("Assessing study load and emotional coping habits for the semester.")
  const [timeLimit, setTimeLimit] = useState("20")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [questions, setQuestions] = useState<BuilderQuestion[]>([
    {
      id: "1",
      text: "I feel capable of managing unexpected difficulties during exam periods.",
      type: "LIKERT",
      categoryKey: "resilience",
      weight: 1.5,
      isReversed: false,
      options: [
        { text: "1 — Strongly Disagree", value: 0 },
        { text: "2 — Disagree", value: 25 },
        { text: "3 — Neutral", value: 50 },
        { text: "4 — Agree", value: 75 },
        { text: "5 — Strongly Agree", value: 100 },
      ],
    },
    {
      id: "2",
      text: "I frequently feel overwhelmed by multiple upcoming submission deadlines.",
      type: "LIKERT",
      categoryKey: "academicPressure",
      weight: 1.5,
      isReversed: false,
      options: [
        { text: "1 — Strongly Disagree", value: 0 },
        { text: "2 — Disagree", value: 25 },
        { text: "3 — Neutral", value: 50 },
        { text: "4 — Agree", value: 75 },
        { text: "5 — Strongly Agree", value: 100 },
      ],
    },
    {
      id: "3",
      text: "What has been the most demanding academic challenge for you this month?",
      type: "OPEN_ENDED",
      categoryKey: "stress",
      weight: 1.0,
      isReversed: false,
      options: [],
    },
  ])

  const addQuestion = () => {
    const newQ: BuilderQuestion = {
      id: String(Date.now()),
      text: "New Assessment Question",
      type: "LIKERT",
      categoryKey: "stress",
      weight: 1.0,
      isReversed: false,
      options: [
        { text: "1 — Strongly Disagree", value: 0 },
        { text: "2 — Disagree", value: 25 },
        { text: "3 — Neutral", value: 50 },
        { text: "4 — Agree", value: 75 },
        { text: "5 — Strongly Agree", value: 100 },
      ],
    }
    setQuestions([...questions, newQ])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<BuilderQuestion>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          timeLimit: parseInt(timeLimit, 10),
          questions,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => router.push("/admin/assessments"), 1200)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/admin/assessments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Visual Assessment Builder
            </h2>
            <p className="text-slate-600 text-xs">
              Configure questionnaires, scoring dimensions, weights, and reverse-scoring logic.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving Assessment..." : "Publish Assessment"}</span>
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Assessment published successfully! Redirecting...</span>
        </div>
      )}

      {/* Assessment Metadata */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-900">Assessment Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs">Assessment Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Time Limit (Minutes, optional)</Label>
              <Input value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="text-sm" type="number" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description & Purpose</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-xs" />
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">
            Questions ({questions.length})
          </h3>
          <Button
            onClick={addQuestion}
            variant="outline"
            size="sm"
            className="text-xs font-semibold flex items-center space-x-1 text-indigo-700 border-indigo-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </Button>
        </div>

        {questions.map((q, idx) => (
          <Card key={q.id} className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-semibold text-xs text-slate-700 uppercase">
                  {q.type} Question
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(q.id)}
                className="text-red-600 hover:bg-red-50 text-xs h-8"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Delete</span>
              </Button>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Question Prompt</Label>
                <Input
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  className="text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Question Type */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Question Type</Label>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(q.id, { type: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    <option value="LIKERT">Likert Scale (1–5)</option>
                    <option value="MCQ">Multiple Choice</option>
                    <option value="YES_NO">Yes / No</option>
                    <option value="RATING">Rating Scale (1–10)</option>
                    <option value="OPEN_ENDED">Open-Ended Free Text</option>
                  </select>
                </div>

                {/* Dimension Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Assessment Dimension</Label>
                  <select
                    value={q.categoryKey}
                    onChange={(e) => updateQuestion(q.id, { categoryKey: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Scoring Weight (e.g. 1.0, 1.5, 2.0)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={q.weight}
                    onChange={(e) => updateQuestion(q.id, { weight: parseFloat(e.target.value) || 1.0 })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Reverse Scoring Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-semibold text-xs text-slate-800">Reverse Scoring</p>
                  <p className="text-[11px] text-slate-500">Inverts the response value (100 - response) for positive resilience or reverse indicators.</p>
                </div>
                <Switch
                  checked={q.isReversed}
                  onCheckedChange={(checked) => updateQuestion(q.id, { isReversed: checked })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
