'use client'

import { useProgress } from '@/hooks/useProgress'
import { ROADMAP_DATA } from '@/data/roadmap'
import DayCard from '@/components/DayCard'
import ProgressStats from '@/components/ProgressStats'
import ActivityGrid from '@/components/ActivityGrid'
import { useMemo, useState } from 'react'

const TOTAL_DAYS = ROADMAP_DATA.length

const WEEKS = [
  { week: 1 as const, label: 'Week 1', subtitle: 'Azure Core + Networking + Storage', color: 'text-azure-400' },
  { week: 2 as const, label: 'Week 2', subtitle: 'Identity, Access & Security Hardening', color: 'text-violet-400' },
  { week: 3 as const, label: 'Week 3', subtitle: 'Zero Trust, NGFW & Security Integration', color: 'text-emerald-400' },
  { week: 4 as const, label: 'Week 4', subtitle: 'Monitoring, DevOps & Final Project', color: 'text-amber-400' },
]

export default function Home() {
  const { progress, loaded, getDayProgress } = useProgress()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'done'>('all')

  const filteredDays = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ROADMAP_DATA.filter(day => {
      const dayProgress = getDayProgress(day.day)
      const matchesQuery =
        !q ||
        day.title.toLowerCase().includes(q) ||
        day.category.toLowerCase().includes(q) ||
        day.tasks.some(task => task.text.toLowerCase().includes(q)) ||
        dayProgress.notes.toLowerCase().includes(q) ||
        dayProgress.learnedSummary.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || dayProgress.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter, progress]) // eslint-disable-line

  const doneCount = Object.values(progress).filter(p => p.status === 'done').length
  const inProgressCount = Object.values(progress).filter(p => p.status === 'in-progress').length
  const nextBestDay = ROADMAP_DATA.find(day => getDayProgress(day.day).status !== 'done')

  const weekSummaries = WEEKS.map(({ week, label }) => {
    const days = ROADMAP_DATA.filter(d => d.week === week)
    const done = days.filter(d => getDayProgress(d.day).status === 'done').length
    return { week, label, done, total: days.length }
  })

  const badges = [
    { id: 'starter', label: 'Starter', unlocked: doneCount >= 1 },
    { id: 'momentum', label: 'Momentum', unlocked: doneCount >= 5 },
    { id: 'week1', label: 'Week 1 Complete', unlocked: weekSummaries[0]?.done === weekSummaries[0]?.total },
    { id: 'halfway', label: 'Halfway Hero', unlocked: doneCount >= Math.ceil(TOTAL_DAYS / 2) },
    { id: 'finisher', label: 'Finisher', unlocked: doneCount === TOTAL_DAYS },
  ]

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

        <section className="bg-surface-800 border border-surface-600 rounded-2xl p-4 mb-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-mono text-slate-300">Focus Assistant</h2>
              <p className="text-xs text-slate-500 mt-1">
                {nextBestDay
                  ? `Next best day: Day ${String(nextBestDay.day).padStart(2, '0')} - ${nextBestDay.title}`
                  : 'All days complete. Great work.'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Status: {doneCount} done, {inProgressCount} in progress, {TOTAL_DAYS - doneCount - inProgressCount} not started
              </p>
            </div>
            {nextBestDay && (
              <a
                href={`/day/${nextBestDay.day}`}
                className="px-3 py-2 text-xs font-mono rounded-lg border border-azure-500/50 text-azure-300 hover:bg-azure-500/20 transition-colors"
              >
                Continue learning
              </a>
            )}
          </div>
        </section>

        <section className="bg-surface-800 border border-surface-600 rounded-2xl p-4 mb-8">
          <h2 className="text-sm font-mono text-slate-300 mb-3">Search and Filter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by day title, category, task, notes..."
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-azure-500 outline-none"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'all' | 'not-started' | 'in-progress' | 'done')}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-azure-500 outline-none"
            >
              <option value="all">All statuses</option>
              <option value="not-started">Not started</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-2">
            Showing {filteredDays.length} of {TOTAL_DAYS} days
          </p>
        </section>

        <section className="bg-surface-800 border border-surface-600 rounded-2xl p-4 mb-8">
          <h2 className="text-sm font-mono text-slate-300 mb-3">Milestones</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => (
              <span
                key={badge.id}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                  badge.unlocked
                    ? 'text-emerald-300 border-emerald-700 bg-emerald-950/40'
                    : 'text-slate-500 border-surface-600 bg-surface-700'
                }`}
              >
                {badge.unlocked ? '✓ ' : ''}{badge.label}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-surface-800 border border-surface-600 rounded-2xl p-4 mb-8">
          <h2 className="text-sm font-mono text-slate-300 mb-3">Weekly Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weekSummaries.map(summary => {
              const pct = Math.round((summary.done / summary.total) * 100)
              return (
                <div key={summary.week} className="rounded-lg border border-surface-600 bg-surface-700/50 p-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{summary.label}</span>
                    <span className="text-azure-300">{summary.done}/{summary.total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-600 mt-2 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-azure-500 to-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Week sections */}
        {WEEKS.map(({ week, label, subtitle, color }) => {
          const weekDays = filteredDays.filter(d => d.week === week)
          return (
            <section key={week} className="mb-10">
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className={`text-sm font-mono font-medium ${color} uppercase tracking-widest`}>{label}</h2>
                <span className="text-xs text-slate-500">{subtitle}</span>
              </div>
              {weekDays.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {weekDays.map(day => (
                    <DayCard
                      key={day.day}
                      day={day}
                      progress={getDayProgress(day.day)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-surface-700 bg-surface-800/40 px-3 py-2 text-xs font-mono text-slate-500">
                  No days match your current search/filter in {label}.
                </div>
              )}
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
