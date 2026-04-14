import { NextResponse } from 'next/server'
import { dayProgressToPayload, rowsToProgressStore } from '@/lib/progress'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const TABLE_NAME = 'progress_entries'

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('day,status,tasks,notes,doc_link,what_learned,created_at')
      .order('day', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ entries: rowsToProgressStore(data ?? []) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load progress.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const day = Number(body.day)

    if (!Number.isFinite(day)) {
      return NextResponse.json({ error: 'day is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const payload = dayProgressToPayload(day, body)

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(payload, { onConflict: 'day' })
      .select('day,status,tasks,notes,doc_link,what_learned,created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ entry: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save progress.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}