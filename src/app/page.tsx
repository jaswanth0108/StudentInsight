import React from "react"
import Link from "next/link"
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Lock,
  Compass,
  Activity,
  ChevronRight,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonalityRadarChart } from "@/components/charts/RadarChart"
import { StressGauge } from "@/components/charts/StressGauge"

export default function LandingPage() {
  const sampleRadar = [
    { name: "Empathy", score: 84 },
    { name: "Confidence", score: 55 },
    { name: "Motivation", score: 76 },
    { name: "Resilience", score: 52 },
    { name: "Adaptability", score: 70 },
    { name: "Communication", score: 64 },
    { name: "Leadership", score: 61 },
    { name: "Cooperation", score: 82 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              StudentInsight
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#preview" className="hover:text-indigo-600 transition-colors">
              Profile Preview
            </a>
            <a href="#benefits" className="hover:text-indigo-600 transition-colors">
              Stakeholders
            </a>
            <a href="#ethics" className="hover:text-indigo-600 transition-colors">
              Ethical Guardrails
            </a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium text-slate-700">
                Log In
              </Button>
            </Link>
            <Link href="/student">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm">
                Student Portal
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Next-Generation Student Well-Being Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Understand Students.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
            Support Them Better.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          An intelligent assessment platform that transforms structured student questionnaires into meaningful personality and well-being indicators for counselors and educational institutions.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/student/assessments/1">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base px-8 h-12 shadow-lg shadow-indigo-200">
              <span>Take Assessment</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/counselor">
            <Button size="lg" variant="outline" className="font-semibold text-base px-6 h-12 border-slate-300 hover:bg-slate-100">
              Counselor Workspace
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="subtle" className="font-semibold text-base px-6 h-12 bg-slate-100 text-slate-800 hover:bg-slate-200">
              Admin Analytics
            </Button>
          </Link>
        </div>

        {/* Demo Credentials Quick-Card */}
        <div className="mt-8 max-w-xl mx-auto p-3 bg-indigo-50/70 border border-indigo-200/70 rounded-xl text-xs text-indigo-900 flex flex-wrap justify-center gap-3">
          <span className="font-bold">Demo Logins:</span>
          <span>Admin: <code>admin@example.com</code></span>
          <span>•</span>
          <span>Counselor: <code>counselor@example.com</code></span>
          <span>•</span>
          <span>Student: <code>student1@example.com</code></span>
          <span>(Password: <code>Password@123</code>)</span>
        </div>
      </section>

      {/* Profile & Well-Being Live Preview Section */}
      <section id="preview" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-2">
              Sample Profile Output
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Holistic Personality & Well-Being Profiles
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Transforming self-reported responses into explainable, multi-dimensional indicators across 20 categories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Radar Chart */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Multi-Dimension Personality Spider Chart</span>
              </h3>
              <PersonalityRadarChart data={sampleRadar} height={320} />
            </div>

            {/* Right: Stress Gauge & Behavioral Narrative */}
            <div className="lg:col-span-6 space-y-4">
              <StressGauge score={68} title="Academic Stress Indicator" size="md" />

              <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Sample Behavioral Summary</span>
                  </div>
                </CardHeader>
                <CardContent className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  &ldquo;The assessment indicates a student who demonstrates high empathy, strong cooperation, and positive motivation. Responses indicate elevated academic pressure and study pacing concerns. Counselor follow-up may be useful to explore workload balancing.&rdquo;
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-2 border-indigo-200 text-indigo-700">
            System Architecture
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            How The Assessment Pipeline Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Student Questionnaire",
              desc: "Students answer structured Likert scales, MCQs, ratings, and open-ended reflections with autosave.",
            },
            {
              step: "02",
              title: "Deterministic Scoring",
              desc: "The engine normalizes weights and reverse-scores to calculate accurate 0–100 indicators without arbitrary guessing.",
            },
            {
              step: "03",
              title: "Profile & Risk Flagging",
              desc: "Identifies personal strengths, areas for support, and triggers counselor follow-up if distress is indicated.",
            },
            {
              step: "04",
              title: "Counselor Review & Care",
              desc: "Human counselors examine raw responses, schedule confidential sessions, and track longitudinal progress.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative hover:shadow-md transition-all"
            >
              <span className="text-3xl font-black text-indigo-600/30 block mb-2">
                {item.step}
              </span>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ethical Guardrails Section */}
      <section id="ethics" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-950 border border-indigo-800 rounded-full text-indigo-300 text-xs font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ethical Standards & Non-Clinical Boundaries</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Responsible, Transparent & Confidential AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700">
              <h4 className="font-bold text-base text-indigo-300 mb-2">
                No Medical Diagnoses
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Results are described as assessment-based indicators. The system never claims to diagnose clinical mental health disorders or predict behavior.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700">
              <h4 className="font-bold text-base text-teal-300 mb-2">
                Human Counselor in the Loop
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                AI and algorithmic scores assist authorized human counselors. No disciplinary or academic eligibility decisions are ever automated.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700">
              <h4 className="font-bold text-base text-emerald-300 mb-2">
                Strict Role-Based Privacy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Student data is private. Students cannot see peer information. Private counseling observations are strictly partitioned from general data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {[
            {
              q: "Are the assessment results medical diagnoses?",
              a: "No. The system strictly presents results as assessment-based indicators derived from questionnaire responses to assist educational counselors in providing early support.",
            },
            {
              q: "Can other students see my personality profile or answers?",
              a: "Never. The platform enforces strict role-based access control. Only the individual student, their assigned counselor, and authorized institution administrators have access.",
            },
            {
              q: "How does the platform handle distress indications?",
              a: "Responses containing language that may suggest severe distress trigger an ethical attention flag recommending human counselor review. No autonomous emergency decisions are made.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs"
            >
              <h4 className="font-semibold text-sm text-slate-900 mb-1">
                {item.q}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">StudentInsight Platform</span>
            <span>• Educational Decision Support System</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-indigo-600">About</Link>
            <Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-indigo-600">Terms of Service</Link>
            <Link href="/contact" className="hover:text-indigo-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
