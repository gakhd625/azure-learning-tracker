import { NextResponse } from 'next/server'
import { dayProgressToPayload, rowsToProgressStore } from '@/lib/progress'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const TABLE_NAME = 'progress_entries'

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('day,status,tasks,notes,doc_link,what_learned,created_at')
      .order('day', { ascending: true })

    if (error) throw error

    console.log('[API GET] Retrieved rows from DB:', data?.length ?? 0, 'rows')
    const store = rowsToProgressStore(data ?? [])
    return NextResponse.json({ entries: store })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load progress.'
    console.error('[API GET] Exception:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const day = Number(body.day)

    if (!Number.isFinite(day)) {
      console.error('[API] Invalid day:', body.day)
      return NextResponse.json({ error: 'day is required' }, { status: 400 })
    }

    const payload = dayProgressToPayload(day, body)

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(payload, { onConflict: 'day' })
      .select('day,status,tasks,notes,doc_link,what_learned,created_at')
      .single()

    if (error) throw error

    console.log('[API PUT] Saved and returned:', data)
    return NextResponse.json({ entry: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save progress.'
    console.error('[API PUT] Exception:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}