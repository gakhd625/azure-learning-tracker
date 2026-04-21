import { NextResponse } from 'next/server'
import { addDaysIso, nextSchedule, ReviewRating } from '@/lib/quiz'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'

const TABLE_NAME = 'quiz_items'

interface ReviewBody {
  id: string
  rating: ReviewRating
  wasCorrect: boolean
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ReviewBody
    if (!body.id || !body.rating) {
      return NextResponse.json({ error: 'id and rating are required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data: current, error: loadError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', body.id)
      .single()

    if (loadError) throw loadError

    const scheduled = nextSchedule(current.interval_days ?? 1, current.ease_factor ?? 2.3, body.rating)
    const reviewCount = (current.review_count ?? 0) + 1
    const correctCount = (current.correct_count ?? 0) + (body.wasCorrect ? 1 : 0)

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        interval_days: scheduled.interval_days,
        ease_factor: scheduled.ease_factor,
        due_at: addDaysIso(scheduled.interval_days),
        review_count: reviewCount,
        correct_count: correctCount,
      })
      .eq('id', body.id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to review quiz item.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

