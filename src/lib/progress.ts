export type DayStatus = 'not-started' | 'in-progress' | 'done'

export interface DayProgress {
  status: DayStatus
  tasks: Record<string, boolean>
  notes: string
  docLink: string
  learnedSummary: string
  createdAt?: string
}

export type ProgressStore = Record<number, DayProgress>

export interface ProgressEntryRow {
  day: number
  status: DayStatus
  tasks: Record<string, boolean>
  notes: string
  doc_link: string
  what_learned: string
  created_at: string
}

export const createEmptyDayProgress = (): DayProgress => ({
  status: 'not-started',
  tasks: {},
  notes: '',
  docLink: '',
  learnedSummary: '',
})

export const rowToDayProgress = (row: ProgressEntryRow): DayProgress => ({
  status: row.status,
  tasks: row.tasks ?? {},
  notes: row.notes ?? '',
  docLink: row.doc_link ?? '',
  learnedSummary: row.what_learned ?? '',
  createdAt: row.created_at,
})

export const rowsToProgressStore = (rows: ProgressEntryRow[]): ProgressStore => {
  return rows.reduce<ProgressStore>((store, row) => {
    store[row.day] = rowToDayProgress(row)
    return store
  }, {})
}

export const dayProgressToPayload = (day: number, progress: DayProgress) => ({
  day,
  status: progress.status,
  tasks: progress.tasks,
  notes: progress.notes,
  doc_link: progress.docLink,
  what_learned: progress.learnedSummary,
})