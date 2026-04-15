'use client'

import { useProgress } from '@/hooks/useProgress'
import { ROADMAP_DATA } from '@/data/roadmap'
import DayCard from '@/components/DayCard'
import ProgressStats from '@/components/ProgressStats'
import ActivityGrid from '@/components/ActivityGrid'

const TOTAL_DAYS = ROADMAP_DATA.length

const WEEKS = [
  { week: 1 as const, label: 'Week 1', subtitle: 'Azure Core + Networking + Storage', color: 'text-azure-400' },
  { week: 2 as const, label: 'Week 2', subtitle: 'Identity, Access & Security Hardening', color: 'text-violet-400' },
  { week: 3 as const, label: 'Week 3', subtitle: 'Zero Trust, NGFW & Security Integration', color: 'text-emerald-400' },
  { week: 4 as const, label: 'Week 4', subtitle: 'Monitoring, DevOps & Final Project', color: 'text-amber-400' },
]

export default function Home() {
  const { progress, loaded, getDayProgress } = useProgress()

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-azure-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-surface-900">
      {/* Top nav */}
      <nav className="border-b border-surface-700 bg-surface-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-azure-500/20 border border-azure-500/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-azure-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
            </div>
            <span className="font-mono text-sm font-medium text-slate-200">azure-tracker</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:block">{TOTAL_DAYS}-day cloud engineering journey</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono text-azure-400 tracking-widest uppercase">Azure Cloud Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Learning <span className="text-gradient">Tracker</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            {TOTAL_DAYS}-day hands-on roadmap covering Azure fundamentals, Entra ID, security, monitoring, and DevOps.
          </p>
        </div>

        {/* Progress stats */}
        <ProgressStats progress={progress} total={TOTAL_DAYS} />

        {/* Activity grid */}
        <ActivityGrid progress={progress} total={TOTAL_DAYS} />

        {/* Week sections */}
        {WEEKS.map(({ week, label, subtitle, color }) => {
          const weekDays = ROADMAP_DATA.filter(d => d.week === week)
          return (
            <section key={week} className="mb-10">
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className={`text-sm font-mono font-medium ${color} uppercase tracking-widest`}>{label}</h2>
                <span className="text-xs text-slate-500">{subtitle}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {weekDays.map(day => (
                  <DayCard
                    key={day.day}
                    day={day}
                    progress={getDayProgress(day.day)}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {/* Footer */}
        <footer className="border-t border-surface-700 pt-6 mt-4 text-center">
          <p className="text-xs text-slate-600 font-mono">
            built with Next.js + Tailwind · progress stored in Supabase
          </p>
        </footer>
      </div>
    </main>
  )
}
