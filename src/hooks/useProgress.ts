'use client'

import { useState, useEffect } from 'react'

export interface DayProgress {
  status: 'not-started' | 'in-progress' | 'done'
  tasks: Record<string, boolean>
  notes: string
  docLink: string
  learnedSummary: string
  completedAt?: string
}

export type ProgressStore = Record<number, DayProgress>

const STORAGE_KEY = 'azure-tracker-progress'

const defaultDayProgress = (): DayProgress => ({
  status: 'not-started',
  tasks: {},
  notes: '',
  docLink: '',
  learnedSummary: '',
})

export function useProgress() {
  const [progress, setProgress] = useState<ProgressStore>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setProgress(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  const save = (next: ProgressStore) => {
    setProgress(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  const getDayProgress = (day: number): DayProgress =>
    progress[day] ?? defaultDayProgress()

  const updateDayProgress = (day: number, updates: Partial<DayProgress>) => {
    const current = getDayProgress(day)
    const next = { ...current, ...updates }
    save({ ...progress, [day]: next })
  }

  const toggleTask = (day: number, taskId: string, totalTasks: number) => {
    const current = getDayProgress(day)
    const tasks = { ...current.tasks, [taskId]: !current.tasks[taskId] }
    const completedCount = Object.values(tasks).filter(Boolean).length

    let status: DayProgress['status'] = 'not-started'
    if (completedCount > 0 && completedCount < totalTasks) status = 'in-progress'
    if (completedCount === totalTasks) status = 'done'

    const completedAt = status === 'done' ? new Date().toISOString() : current.completedAt
    save({ ...progress, [day]: { ...current, tasks, status, completedAt } })
  }

  const completedDays = Object.values(progress).filter(p => p.status === 'done').length

  return { progress, loaded, getDayProgress, updateDayProgress, toggleTask, completedDays }
}
