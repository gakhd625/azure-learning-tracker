import { NextResponse } from 'next/server'
import { ROADMAP_DATA } from '@/data/roadmap'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import { generateQuizWithGemini } from '@/lib/gemini'
import { normalizeGeneratedItems } from '@/lib/quiz'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const TABLE_NAME = 'quiz_items'

interface GenerateBody {
  day: number
  count?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  includeNotes?: boolean
  notes?: string
  learnedSummary?: string
}

export async function POST(request: Request) {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7484/ingest/0eaf9a53-f76b-43c4-8892-127f9cb4a06d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76e82d'},body:JSON.stringify({sessionId:'76e82d',runId:'run3',hypothesisId:'H6',location:'src/app/api/quiz/generate/route.ts:24',message:'Quiz generate API entered',data:{nodeEnv:process.env.NODE_ENV,hasGeminiApiKey:Boolean(process.env.GEMINI_API_KEY),hasNextPublicGeminiApiKey:Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const body = await request.json() as GenerateBody
    const day = Number(body.day)
    if (!Number.isFinite(day)) {
      return NextResponse.json({ error: 'day is required' }, { status: 400 })
    }

    const dayData = ROADMAP_DATA.find(item => item.day === day)
    if (!dayData) {
      return NextResponse.json({ error: 'day not found' }, { status: 404 })
    }

    const count = Math.min(20, Math.max(3, Number(body.count ?? 6)))
    const difficulty = body.difficulty ?? 'medium'

    const generated = await generateQuizWithGemini({
      day,
      week: dayData.week,
      title: dayData.title,
      category: dayData.category,
      tasks: dayData.tasks.map(task => task.text),
      notes: body.notes,
      learnedSummary: body.learnedSummary,
      includeNotes: Boolean(body.includeNotes),
      count,
      difficulty,
    })

    const normalized = normalizeGeneratedItems(generated, day, dayData.week, dayData.title, difficulty)
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(normalized)
      .select('*')

    if (error) throw error

    return NextResponse.json({ items: data ?? [] })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7484/ingest/0eaf9a53-f76b-43c4-8892-127f9cb4a06d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76e82d'},body:JSON.stringify({sessionId:'76e82d',runId:'run3',hypothesisId:'H6',location:'src/app/api/quiz/generate/route.ts:67',message:'Quiz generate API catch branch',data:{error:error instanceof Error ? error.message : 'unknown'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const message = error instanceof Error ? error.message : 'Failed to generate quiz.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

