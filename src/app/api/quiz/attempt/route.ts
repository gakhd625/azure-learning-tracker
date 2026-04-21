import { NextResponse } from 'next/server'
import { extractWeakTags } from '@/lib/quiz'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'

const TABLE_NAME = 'quiz_attempts'

interface AttemptItem {
  tags: string[]
  isCorrect: boolean
}

interface AttemptBody {
  mode: 'day' | 'week' | 'custom'
  sourceDay?: number | null
  sourceWeek?: number | null
  totalQuestions: number
  correctAnswers: number
  results: AttemptItem[]
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as AttemptBody
    const total = Number(body.totalQuestions)
    const correct = Number(body.correctAnswers)
    if (!Number.isFinite(total) || !Number.isFinite(correct) || total <= 0) {
      return NextResponse.json({ error: 'Invalid attempt payload.' }, { status: 400 })
    }

    const weakTags = extractWeakTags(body.results ?? [])
    const score = Math.round((correct / total) * 100)

    const payload = {
      mode: body.mode ?? 'custom',
      source_day: body.sourceDay ?? null,
      source_week: body.sourceWeek ?? null,
      total_questions: total,
      correct_answers: correct,
      score_pct: score,
      weak_tags: weakTags,
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase.from(TABLE_NAME).insert(payload).select('*').single()
    if (error) throw error

    return NextResponse.json({ attempt: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save quiz attempt.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

