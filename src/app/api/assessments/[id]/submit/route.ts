import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"
import { calculateCategoryScores, getFinalScores, calculateOverallWellbeing, getStrengths, getAreasForSupport, requiresFollowUp } from "@/lib/scoring/engine"
import { getScoreLabel } from "@/lib/scoring/labels"
import { summarizeFreeTextResponses, detectDistressConcerns } from "@/lib/ai/gemini"
import { ResponseStatus, SupportLevel } from "@prisma/client"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params
    const body = await req.json()
    const { answers, consentGiven, studentId: customStudentId } = body

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: "Invalid answers format" },
        { status: 400 }
      )
    }

    // Default to student 1 (John Doe) for testing if not signed in
    let student = await prisma.student.findFirst({
      where: customStudentId ? { id: customStudentId } : {},
      include: { user: true },
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      )
    }

    // 1. Fetch Assessment & Questions with Options and Category
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          include: {
            options: true,
            category: true,
          },
        },
      },
    })

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: "Assessment not found" },
        { status: 404 }
      )
    }

    // 2. Prepare Scoring Inputs
    const scoringQuestions = assessment.questions.map((q) => ({
      id: q.id,
      weight: q.weight,
      isReversed: q.isReversed,
      categoryKey: q.category?.key || "generalWellbeing",
      options: q.options.map((o) => ({ id: o.id, value: o.value })),
      type: q.type,
    }))

    // 3. Calculate Deterministic Category Scores
    const categoryMap = calculateCategoryScores({
      answers,
      questions: scoringQuestions,
    })
    const finalScores = getFinalScores(categoryMap)
    const overallWellbeing = calculateOverallWellbeing(finalScores)
    const followUpInfo = requiresFollowUp(finalScores)
    const strengths = getStrengths(finalScores)
    const areasForSupport = getAreasForSupport(finalScores)

    // 4. Extract free-text answers and run AI analysis & distress detection
    const textAnswers = answers
      .filter((a) => a.textValue && a.textValue.trim().length > 0)
      .map((a) => a.textValue as string)

    let aiSummary = ""
    let flagDistress = false
    let distressReason = ""

    if (textAnswers.length > 0) {
      aiSummary = await summarizeFreeTextResponses(textAnswers)

      // Safety distress check
      for (const txt of textAnswers) {
        const check = await detectDistressConcerns(txt)
        if (check.flagged) {
          flagDistress = true
          distressReason = check.reason
          break
        }
      }
    }

    // 5. Create or Update AssessmentResponse Record
    const existingResponse = await prisma.assessmentResponse.findUnique({
      where: {
        assessmentId_studentId: {
          assessmentId,
          studentId: student.id,
        },
      },
    })

    let responseRecord
    if (existingResponse) {
      // Clear old answers and scores
      await prisma.responseAnswer.deleteMany({ where: { responseId: existingResponse.id } })
      await prisma.categoryScore.deleteMany({ where: { responseId: existingResponse.id } })

      responseRecord = await prisma.assessmentResponse.update({
        where: { id: existingResponse.id },
        data: {
          status: ResponseStatus.COMPLETED,
          completedAt: new Date(),
          consentGiven: consentGiven ?? true,
          consentAt: new Date(),
          aiSummary: aiSummary || undefined,
          requiresFlag: followUpInfo.required || flagDistress,
          flagReason: distressReason || followUpInfo.reason || undefined,
        },
      })
    } else {
      responseRecord = await prisma.assessmentResponse.create({
        data: {
          assessmentId,
          studentId: student.id,
          status: ResponseStatus.COMPLETED,
          startedAt: new Date(Date.now() - 10 * 60 * 1000),
          completedAt: new Date(),
          consentGiven: consentGiven ?? true,
          consentAt: new Date(),
          aiSummary: aiSummary || undefined,
          requiresFlag: followUpInfo.required || flagDistress,
          flagReason: distressReason || followUpInfo.reason || undefined,
        },
      })
    }

    // 6. Save Answers
    for (const ans of answers) {
      await prisma.responseAnswer.create({
        data: {
          responseId: responseRecord.id,
          questionId: ans.questionId,
          optionId: ans.optionId,
          numericValue: ans.numericValue,
          textValue: ans.textValue,
        },
      })
    }

    // 7. Save Category Scores
    for (const [key, score] of finalScores.entries()) {
      const label = getScoreLabel(key, score).label
      const raw = categoryMap.get(key)
      await prisma.categoryScore.create({
        data: {
          responseId: responseRecord.id,
          categoryKey: key,
          score,
          label,
          questionCount: raw?.questionCount || 1,
        },
      })
    }

    // 8. Update Student Profile & Support Level
    const profileUpdateData = {
      empathy: finalScores.get("empathy") ?? 50,
      humanity: finalScores.get("humanity") ?? 50,
      socialInteraction: finalScores.get("socialInteraction") ?? 50,
      introversion: finalScores.get("introversion") ?? 50,
      extroversion: finalScores.get("extroversion") ?? 50,
      communication: finalScores.get("communication") ?? 50,
      confidence: finalScores.get("confidence") ?? 50,
      stress: finalScores.get("stress") ?? 50,
      academicPressure: finalScores.get("academicPressure") ?? 50,
      emotionalWellbeing: finalScores.get("emotionalWellbeing") ?? 50,
      motivation: finalScores.get("motivation") ?? 50,
      discipline: finalScores.get("discipline") ?? 50,
      resilience: finalScores.get("resilience") ?? 50,
      adaptability: finalScores.get("adaptability") ?? 50,
      leadership: finalScores.get("leadership") ?? 50,
      cooperation: finalScores.get("cooperation") ?? 50,
      behavioralTendencies: finalScores.get("behavioralTendencies") ?? 50,
      socialSupport: finalScores.get("socialSupport") ?? 50,
      selfAwareness: finalScores.get("selfAwareness") ?? 50,
      generalWellbeing: overallWellbeing,
      aiSummary: aiSummary || undefined,
      requiresFollowUp: followUpInfo.required || flagDistress,
      flagReason: distressReason || followUpInfo.reason || undefined,
      lastAssessmentId: assessmentId,
    }

    await prisma.studentProfile.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        ...profileUpdateData,
      },
      update: profileUpdateData,
    })

    // Update Student support level
    let newSupportLevel: SupportLevel = SupportLevel.STABLE
    if (flagDistress || (finalScores.get("stress") ?? 0) > 75) {
      newSupportLevel = SupportLevel.FOLLOW_UP_RECOMMENDED
    } else if ((finalScores.get("stress") ?? 0) > 50) {
      newSupportLevel = SupportLevel.MODERATE_SUPPORT
    }

    await prisma.student.update({
      where: { id: student.id },
      data: { supportLevel: newSupportLevel },
    })

    // 9. Notify Counselor if follow-up is recommended
    if (student.counselorId && (followUpInfo.required || flagDistress)) {
      const counselor = await prisma.counselor.findUnique({
        where: { id: student.counselorId },
      })
      if (counselor) {
        await prisma.notification.create({
          data: {
            userId: counselor.userId,
            type: "FOLLOW_UP_RECOMMENDED",
            title: `Assessment Completed: ${student.user.name}`,
            message: `${student.user.name} completed an assessment with indicators suggesting counselor follow-up.`,
            link: `/counselor/students/${student.id}`,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      responseId: responseRecord.id,
      scores: Object.fromEntries(finalScores),
      overallWellbeing,
      strengths,
      areasForSupport,
      requiresFollowUp: followUpInfo.required || flagDistress,
    })
  } catch (error: any) {
    console.error("Error submitting assessment:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process assessment" },
      { status: 500 }
    )
  }
}
