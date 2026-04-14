'use client'

import type { ProgressStore } from '@/lib/progress'

interface ActivityGridProps {
  progress: ProgressStore
  total: number
}

export default function ActivityGrid({ progress, total }: ActivityGridProps) {
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-2xl p-5 mb-8">
      <h2 className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-widest">Activity</h2>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: total }, (_, i) => {
          const day = i + 1
          const status = progress[day]?.status ?? 'not-started'
          return (
            <div
              key={day}
              title={`Day ${day}`}
              className={`
                w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono
                transition-all duration-200
                ${status === 'done'
                  ? 'bg-emerald-500/80 text-emerald-100 border border-emerald-400/50'
                  : status === 'in-progress'
                  ? 'bg-amber-500/40 text-amber-300 border border-amber-500/50 animate-pulse-slow'
                  : 'bg-surface-600 text-slate-600 border border-surface-500'
                }
              `}
            >
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] font-mono text-slate-500">
        <LegendItem color="bg-surface-600" label="Not started" />
        <LegendItem color="bg-amber-500/40" label="In progress" />
        <LegendItem color="bg-emerald-500/80" label="Done" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  )
}
