import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
            category: true,
          },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!assessment) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: assessment })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
