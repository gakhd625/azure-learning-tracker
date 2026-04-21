import type { GenerateQuizInput, GeneratedQuizItem } from '@/lib/quiz'

function buildPrompt(input: GenerateQuizInput) {
  const notesPart = input.includeNotes
    ? `User notes:\n${input.notes || '(none)'}\n\nUser learned summary:\n${input.learnedSummary || '(none)'}`
    : 'Ignore user notes and learned summary.'

  return `
You are an Azure cloud engineering quiz generator.
Generate ${input.count} quiz items for this learning day.

Day: ${input.day}
Week: ${input.week}
Title: ${input.title}
Category: ${input.category}
Difficulty target: ${input.difficulty}

Tasks:
${input.tasks.map((task, idx) => `${idx + 1}. ${task}`).join('\n')}

${notesPart}

Rules:
- 60% conceptual, 30% hands-on, 10% troubleshooting.
- Keep questions strictly aligned to the day topic and tasks.
- Return only valid JSON (no markdown, no code fences).
- Output shape:
{
  "items": [
    {
      "type": "mcq" | "flashcard" | "scenario",
      "question": "string",
      "choices": ["A","B","C","D"] (required only for mcq),
      "answer": "string",
      "explanation": "string",
      "tags": ["tag1","tag2"],
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}
- For MCQ, make exactly 4 choices and one correct answer matching choices text.
- Keep wording practical and concise.
`
}

function parseGeneratedJson(text: string): GeneratedQuizItem[] {
  const raw = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
  const parsed = JSON.parse(raw) as { items?: GeneratedQuizItem[] }
  if (!parsed.items || !Array.isArray(parsed.items)) {
    throw new Error('Gemini response missing items array.')
  }
  return parsed.items.filter(item => item.question && item.answer && item.explanation && item.type)
}

export async function generateQuizWithGemini(input: GenerateQuizInput): Promise<GeneratedQuizItem[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  const preferredModel = process.env.GEMINI_MODEL

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in environment. Set GEMINI_API_KEY in .env.local and restart dev server.')
  }

  const modelCandidates = [
    preferredModel,
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-flash-latest',
  ].filter((value): value is string => Boolean(value))
  const uniqueModelCandidates = Array.from(new Set(modelCandidates))

  let lastError = 'Unknown Gemini error.'
  for (const model of uniqueModelCandidates) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(input) }] }],
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            maxOutputTokens: 4096,
          },
        }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      lastError = `Model ${model}: ${response.status} ${errorText}`
      // model not found or not available to this key; try next candidate
      if (response.status === 404 || response.status === 400) {
        continue
      }
      throw new Error(`Gemini request failed. ${lastError}`)
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }

    const text = data.candidates?.[0]?.content?.parts?.map(part => part.text ?? '').join('\n') ?? ''
    if (!text) {
      lastError = `Model ${model}: empty content`
      continue
    }

    try {
      return parseGeneratedJson(text)
    } catch (error) {
      lastError = `Model ${model}: ${error instanceof Error ? error.message : 'invalid response format'}`
      continue
    }
  }

  throw new Error(`All Gemini model candidates failed. Last error: ${lastError}`)
}

