'use client'

import Link from 'next/link'
import { CATEGORY_META, type DayData } from '@/data/roadmap'
import type { DayProgress } from '@/hooks/useProgress'

interface DayCardProps {
  day: DayData
  progress: DayProgress
}

const STATUS_STYLES = {
  'not-started': 'text-slate-500 bg-slate-800/50 border-slate-700',
  'in-progress': 'text-amber-400 bg-amber-950/50 border-amber-800',
  'done': 'text-emerald-400 bg-emerald-950/50 border-emerald-800',
}

const STATUS_LABEL = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'done': 'Done',
}

const STATUS_DOT = {
  'not-started': 'bg-slate-600',
  'in-progress': 'bg-amber-400 animate-pulse',
  'done': 'bg-emerald-400',
}

export default function DayCard({ day, progress }: DayCardProps) {
  const meta = CATEGORY_META[day.category]
  const completedTasks = Object.values(progress.tasks).filter(Boolean).length
  const totalTasks = day.tasks.length
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Link href={`/day/${day.day}`}>
      <div className={`
        relative group rounded-xl border bg-surface-800 p-4 cursor-pointer card-hover
        ${day.isFinalProject ? 'border-pink-700 bg-pink-950/20' : 'border-surface-600'}
      `}>
        {/* Final project badge */}
        {day.isFinalProject && (
          <div className="absolute -top-2.5 left-4">
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-pink-900 text-pink-300 border border-pink-700">
              FINAL PROJECT
            </span>
          </div>
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500">
              DAY {String(day.day).padStart(2, '0')}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          </div>
          {/* Status badge */}
          <span className={`
            flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border
            ${STATUS_STYLES[progress.status]}
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[progress.status]}`} />
            {STATUS_LABEL[progress.status]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-slate-200 leading-snug mb-3 group-hover:text-white transition-colors">
          {day.title}
        </h3>

        {/* Category tag */}
        <div className="mb-3">
          <span className={`text-[10px] font-mono ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">{completedTasks}/{totalTasks} tasks</span>
            <span className="text-[10px] text-slate-500 font-mono">{pct}%</span>
          </div>
          <div className="h-1 rounded-full bg-surface-600 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.status === 'done'
                  ? 'bg-emerald-500'
                  : progress.status === 'in-progress'
                  ? 'bg-amber-400'
                  : 'bg-surface-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Done checkmark overlay */}
        {progress.status === 'done' && (
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  )
}
