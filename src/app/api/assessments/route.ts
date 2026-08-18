import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"
import { AssessmentStatus } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        status: AssessmentStatus.PUBLISHED,
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: assessments })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, instructions, timeLimit, questions } = body

    const admin = await prisma.admin.findFirst()

    const assessment = await prisma.assessment.create({
      data: {
        title: title || "New Custom Assessment",
        description,
        instructions,
        timeLimit: timeLimit ? parseInt(timeLimit, 10) : null,
        status: AssessmentStatus.PUBLISHED,
        createdBy: admin?.userId || "admin-system",
        questions: {
          create: (questions || []).map((q: any, idx: number) => ({
            text: q.text,
            type: q.type,
            weight: q.weight || 1.0,
            isReversed: q.isReversed || false,
            order: idx,
            categoryId: q.categoryId || undefined,
            options: {
              create: (q.options || []).map((opt: any, oIdx: number) => ({
                text: opt.text,
                value: opt.value || 0,
                order: oIdx,
              })),
            },
          })),
        },
      },
      include: { questions: { include: { options: true } } },
    })

    return NextResponse.json({ success: true, data: assessment })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
