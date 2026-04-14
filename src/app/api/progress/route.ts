import { NextResponse } from 'next/server'
import { dayProgressToPayload, rowsToProgressStore } from '@/lib/progress'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import { getBackupData, saveToBackupData } from '@/lib/localBackup'
import { ProgressEntryRow } from '@/lib/progress'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
const TABLE_NAME = 'progress_entries'

export async function GET() {
  try {
    try {
      const supabase = getSupabaseAdminClient()
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('day,status,tasks,notes,doc_link,what_learned,created_at')
        .order('day', { ascending: true })

      if (error) {
        throw error
      }

      console.log('[API GET] Retrieved rows from DB:', data?.length ?? 0, 'rows')
      if (data && data.length > 0) {
        console.log('[API GET] First row:', data[0])
      }
      const store = rowsToProgressStore(data ?? [])
      console.log('[API GET] Returning store:', Object.keys(store))
      return NextResponse.json({ entries: store })
    } catch (dbError) {
      console.warn('[API GET] Supabase unavailable, falling back to local JSON.', dbError)
      const backupRows = await getBackupData()
      const store = rowsToProgressStore(backupRows)
      return NextResponse.json({ entries: store })
    }


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
    
    const payloadWithTimestamps: ProgressEntryRow = {
      ...(payload as Omit<ProgressEntryRow, 'created_at'>),
      created_at: new Date().toISOString()
    }

    try {
      const supabase = getSupabaseAdminClient()
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(payload, { onConflict: 'day' })
        .select('day,status,tasks,notes,doc_link,what_learned,created_at')
        .single()

      if (error) {
        throw error
      }

      // Keep backup in sync
      const syncedData = await saveToBackupData(data as ProgressEntryRow)
      console.log('[API PUT] Saved and returned:', syncedData)
      return NextResponse.json({ entry: syncedData })
    } catch (dbError) {
      console.warn('[API PUT] Supabase unavailable, falling back to local JSON.', dbError)
      const fallbackData = await saveToBackupData(payloadWithTimestamps)
      return NextResponse.json({ entry: fallbackData })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save progress.'
    console.error('[API PUT] Exception:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}