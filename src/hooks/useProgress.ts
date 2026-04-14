'use client'

import { useState, useEffect } from 'react'
import { createEmptyDayProgress, DayProgress, ProgressStore, rowToDayProgress } from '@/lib/progress'

const defaultDayProgress = createEmptyDayProgress

export function useProgress() {
  const [progress, setProgress] = useState<ProgressStore>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        console.log('[Hook] Loading progress from API...')
        const response = await fetch('/api/progress', { cache: 'no-store' })
        if (!response.ok) {
          console.error('[Hook] Load failed:', response.status)
          return
        }

        const data = await response.json()
        console.log('[Hook] Received from API:', data)
        const store = (data.entries ?? {}) as ProgressStore
        console.log('[Hook] Parsed store keys:', Object.keys(store))
        if (store[2]) {
          console.log('[Hook] Day 2 data:', store[2])
        }
        setProgress(store)
      } catch (error) {
        // Leave the tracker usable even if the API request fails.
        console.error('[Hook] Load exception:', error)
      } finally {
        setLoaded(true)
      }
    }

    void loadProgress()
  }, [])

  const saveDay = async (day: number, nextDayProgress: DayProgress, nextStore: ProgressStore) => {
    console.log('[Hook] Saving day', day, 'with:', nextDayProgress)
    setProgress(nextStore)

    try {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day, ...nextDayProgress }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Hook] Save failed:', response.status, errorText)
        return
      }

      const data = await response.json()
      console.log('[Hook] Save response:', data)
      if (data.entry) {
        // Convert the database row back to client field names
        const savedProgress = rowToDayProgress(data.entry)
        console.log('[Hook] Converted progress:', savedProgress)
        setProgress(current => ({
          ...current,
          [day]: savedProgress,
        }))
      }
    } catch (error) {
      // The local state is already updated, so the UI stays usable offline.
      console.error('[Hook] Save exception:', error)
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
