'use client'

import type { ProgressStore } from '@/lib/progress'

interface ProgressStatsProps {
  progress: ProgressStore
  total: number
}

export default function ProgressStats({ progress, total }: ProgressStatsProps) {
  const done = Object.values(progress).filter(p => p.status === 'done').length
  const inProgress = Object.values(progress).filter(p => p.status === 'in-progress').length
  const pct = Math.round((done / total) * 100)

  const streak = (() => {
    let s = 0
    for (let d = 1; d <= total; d++) {
      if (progress[d]?.status === 'done') s++
      else break
    }
    return s
  })()

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-2xl p-6 mb-8">
      {/* Top row: stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <Stat label="Completed" value={`${done}/21`} color="text-emerald-400" />
        <Stat label="In Progress" value={String(inProgress)} color="text-amber-400" />
        <Stat label="Remaining" value={String(total - done - inProgress)} color="text-slate-400" />
        <Stat label="Streak" value={`${streak} days`} color="text-azure-400" />
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-slate-400">Overall Progress</span>
          <span className="text-xs font-mono text-azure-400 font-medium">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-600 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-azure-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-600">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Done</span>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-mono font-medium ${color}`}>{value}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}
