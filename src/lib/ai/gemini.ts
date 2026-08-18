// src/lib/ai/gemini.ts
// Google Gemini API wrapper for AI analysis features

const AI_MODE = process.env.AI_MODE ?? 'mock'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? ''

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[]
}

async function callGemini(prompt: string): Promise<string> {
  if (AI_MODE === 'mock' || !GEMINI_API_KEY) {
    return '' // caller handles fallback
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    )

    if (!res.ok) return ''
    const json: GeminiResponse = await res.json()
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  } catch {
    return ''
  }
}

/**
 * Summarize open-ended free text responses for counselor review
 * Returns: brief neutral summary of themes
 */
export async function summarizeFreeTextResponses(responses: string[]): Promise<string> {
  if (responses.length === 0) return ''

  const combinedText = responses.map((r, i) => `Response ${i + 1}: "${r}"`).join('\n')

  const prompt = `You are assisting a school counselor by summarizing student open-ended assessment responses.

IMPORTANT RULES:
- Do NOT diagnose any mental health conditions
- Do NOT make definitive psychological claims
- Use neutral, professional language
- Present observations as "the student mentions..." or "themes include..."
- Focus on academic, social, and emotional themes only
- Keep the summary to 3-4 sentences

Student responses:
${combinedText}

Provide a brief, neutral counselor-support summary:`

  const result = await callGemini(prompt)
  if (!result) {
    // Rule-based fallback
    return `The student provided ${responses.length} open-ended response(s). A counselor review of the original responses is recommended to gain full context of the student's perspective.`
  }
  return result
}

/**
 * Extract recurring themes from open-ended responses
 */
export async function extractThemes(text: string): Promise<string[]> {
  if (!text.trim()) return []

  const prompt = `Analyze this student assessment response and identify up to 5 key themes from this list only:
academic workload, family expectations, peer relationships, social anxiety, motivation, time management, future uncertainty, self-confidence, sleep concerns, loneliness, financial concerns, career pressure.

Response: "${text}"

Return ONLY a comma-separated list of relevant themes, nothing else:`

  const result = await callGemini(prompt)
  if (!result) return []

  return result.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5)
}

/**
 * Generate a counselor-support summary from scores + open-ended summary
 */
export async function generateCounselorSummary(
  profileData: {
    studentName: string
    scores: Record<string, number>
    strengths: string[]
    areasForSupport: string[]
    freeTextSummary?: string
  }
): Promise<string> {
  const { studentName, scores, strengths, areasForSupport, freeTextSummary } = profileData

  const scoreList = Object.entries(scores)
    .map(([k, v]) => `${k}: ${Math.round(v)}%`)
    .join(', ')

  const prompt = `You are a counselor assistant generating a brief, professional summary to help a human counselor prepare for a session.

IMPORTANT RULES:
- Use language like "assessment responses indicate..." not "this student has..."
- Do NOT diagnose any condition
- Do NOT make definitive psychological claims  
- Mention potential areas to explore, not conclusions
- Keep to 4-5 sentences
- End with a suggestion for the counselor

Student: ${studentName}
Assessment scores: ${scoreList}
Identified strengths: ${strengths.join(', ')}
Areas to explore: ${areasForSupport.join(', ')}
${freeTextSummary ? `Open-ended response summary: ${freeTextSummary}` : ''}

Generate a professional counselor-support summary:`

  const result = await callGemini(prompt)
  return result || `Assessment responses for ${studentName} have been processed. The scoring indicates potential areas to explore including ${areasForSupport.join(', ')}. Identified strengths include ${strengths.join(', ')}. A counselor review of the full responses is recommended before the session.`
}

/**
 * Detect if open-ended response text may require immediate attention
 * Returns flag and reason — human counselor must review before any action
 */
export async function detectDistressConcerns(text: string): Promise<{
  flagged: boolean
  reason: string
}> {
  if (!text.trim() || text.length < 20) return { flagged: false, reason: '' }

  // Rule-based keywords first (always applied, regardless of AI)
  const HIGH_CONCERN_PATTERNS = [
    /\b(hurt myself|harm myself|end my life|don't want to live|want to die|suicidal|no reason to live)\b/i,
    /\b(self.harm|cutting|hurting myself)\b/i,
  ]

  for (const pattern of HIGH_CONCERN_PATTERNS) {
    if (pattern.test(text)) {
      return {
        flagged: true,
        reason: 'Student response contains language that may indicate significant distress. Immediate counselor review recommended.',
      }
    }
  }

  // Moderate concern keywords
  const MODERATE_PATTERNS = [
    /\b(overwhelmed|hopeless|helpless|worthless|can't cope|falling apart|breaking down)\b/i,
    /\b(nobody cares|all alone|no one understands|give up)\b/i,
  ]

  let moderateFlag = false
  for (const pattern of MODERATE_PATTERNS) {
    if (pattern.test(text)) {
      moderateFlag = true
      break
    }
  }

  if (moderateFlag) {
    return {
      flagged: true,
      reason: 'Student response contains language suggesting potential emotional distress. Counselor review recommended.',
    }
  }

  return { flagged: false, reason: '' }
}
