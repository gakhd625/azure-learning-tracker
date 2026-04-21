import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const TABLE_NAME = 'quiz_items'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const day = searchParams.get('day')
    const week = searchParams.get('week')
    const dueOnly = searchParams.get('dueOnly') === 'true'

    const supabase = getSupabaseAdminClient()
    let query = supabase.from(TABLE_NAME).select('*').order('due_at', { ascending: true }).limit(200)

    if (day) query = query.eq('day', Number(day))
    if (week) query = query.eq('week', Number(week))
    if (dueOnly) query = query.lte('due_at', new Date().toISOString())

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ items: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load quiz items.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

