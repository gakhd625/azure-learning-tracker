'use client'

import { useState, useEffect } from 'react'
import { createEmptyDayProgress, DayProgress, ProgressStore } from '@/lib/progress'

const defaultDayProgress = createEmptyDayProgress

export function useProgress() {
  const [progress, setProgress] = useState<ProgressStore>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch('/api/progress', { cache: 'no-store' })
        if (!response.ok) return

        const data = await response.json()
        setProgress((data.entries ?? {}) as ProgressStore)
      } catch {
        // Leave the tracker usable even if the API request fails.
      } finally {
        setLoaded(true)
      }
    }

    void loadProgress()
  }, [])

  const saveDay = async (day: number, nextDayProgress: DayProgress, nextStore: ProgressStore) => {
    setProgress(nextStore)

    try {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day, ...nextDayProgress }),
      })

      if (!response.ok) return

      const data = await response.json()
      if (data.entry) {
        setProgress(current => ({
          ...current,
          [day]: {
            ...(current[day] ?? nextDayProgress),
            createdAt: data.entry.created_at,
          },
        }))
      }
    } catch {
      // The local state is already updated, so the UI stays usable offline.
    }
  }

  const getDayProgress = (day: number): DayProgress =>
    progress[day] ?? defaultDayProgress()

  const updateDayProgress = (day: number, updates: Partial<DayProgress>) => {
    const current = getDayProgress(day)
    const next = { ...current, ...updates }
    void saveDay(day, next, { ...progress, [day]: next })
  }

  const toggleTask = (day: number, taskId: string, totalTasks: number) => {
    const current = getDayProgress(day)
    const tasks = { ...current.tasks, [taskId]: !current.tasks[taskId] }
    const completedCount = Object.values(tasks).filter(Boolean).length

    let status: DayProgress['status'] = 'not-started'
    if (completedCount > 0 && completedCount < totalTasks) status = 'in-progress'
    if (completedCount === totalTasks) status = 'done'

    void saveDay(day, { ...current, tasks, status }, { ...progress, [day]: { ...current, tasks, status } })
  }

  const completedDays = Object.values(progress).filter(p => p.status === 'done').length

  return { progress, loaded, getDayProgress, updateDayProgress, toggleTask, completedDays }
}
