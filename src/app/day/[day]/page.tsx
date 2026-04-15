'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROADMAP_DATA, CATEGORY_META } from '@/data/roadmap'
import { useProgress } from '@/hooks/useProgress'
import { useEffect, useState } from 'react'

export default function DayPage() {
  const params = useParams()
  const router = useRouter()
  const dayNum = Number(params.day)
  const dayData = ROADMAP_DATA.find(d => d.day === dayNum)
  const { getDayProgress, updateDayProgress, toggleTask, loaded } = useProgress()

  const [localNotes, setLocalNotes] = useState('')
  const [localLink, setLocalLink] = useState('')
  const [localLearned, setLocalLearned] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    if (!loaded || !dayData) return
    const p = getDayProgress(dayNum)
    setLocalNotes(p.notes)
    setLocalLink(p.docLink)
    setLocalLearned(p.learnedSummary)
  }, [loaded, dayNum]) // eslint-disable-line

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Day not found.</p>
          <Link href="/" className="text-azure-400 hover:text-azure-200 text-sm font-mono">← Back</Link>
        </div>
      </div>
    )
  }

  const meta = CATEGORY_META[dayData.category]
  const progress = getDayProgress(dayNum)
  const completedTasks = Object.values(progress.tasks).filter(Boolean).length
  const totalTasks = dayData.tasks.length
  const allDone = totalTasks > 0 && completedTasks === totalTasks

  const prevDay = dayNum > 1 ? dayNum - 1 : null
  const nextDay = dayNum < ROADMAP_DATA.length ? dayNum + 1 : null

  const handleSave = () => {
    updateDayProgress(dayNum, {
      notes: localNotes,
      docLink: localLink,
      learnedSummary: localLearned,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // after saving while in edit mode, switch back to preview if all done
    if (allDone) setIsPreview(true)
  }

  // When tasks flip to all-done, switch to preview automatically
  useEffect(() => {
    if (allDone) setIsPreview(true)
  }, [allDone])

  // Determine effective preview state: if not all done, always show edit
  const showPreview = allDone && isPreview

  const hasUnsaved =
    localNotes !== progress.notes ||
    localLink !== progress.docLink ||
    localLearned !== progress.learnedSummary

  return (
    <main className="min-h-screen bg-surface-900">
      {/* Nav */}
      <nav className="border-b border-surface-700 bg-surface-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-mono text-xs">azure-tracker</span>
          </Link>
          <div className="flex items-center gap-3">
            {prevDay && (
              <button
                onClick={() => router.push(`/day/${prevDay}`)}
                className="text-slate-500 hover:text-slate-200 transition-colors text-xs font-mono"
              >
                ← Day {prevDay}
              </button>
            )}
            {nextDay && (
              <button
                onClick={() => router.push(`/day/${nextDay}`)}
                className="text-slate-500 hover:text-slate-200 transition-colors text-xs font-mono"
              >
                Day {nextDay} →
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {dayData.isFinalProject && (
            <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-900 text-pink-300 border border-pink-700 mb-3">
              FINAL PROJECT
            </span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              Day {String(dayNum).padStart(2, '0')} · Week {dayData.week}
            </span>
            <span className={`text-xs font-mono ${meta.color}`}>· {meta.label}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{dayData.title}</h1>

          {/* Status bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-surface-600 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress.status === 'done' ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                style={{ width: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 shrink-0">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>

        {/* Tasks section */}
        <Section title="Tasks" icon="✓">
          <div className="space-y-2">
            {dayData.tasks.map((task) => {
              const checked = progress.tasks[task.id] ?? false
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(dayNum, task.id, totalTasks)}
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-lg border text-left
                    transition-all duration-150
                    ${checked
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                      : 'bg-surface-700 border-surface-600 text-slate-300 hover:border-slate-500 hover:bg-surface-600'
                    }
                  `}
                >
                  <span className={`
                    w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors
                    ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}
                  `}>
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm leading-relaxed ${checked ? 'line-through opacity-60' : ''}`}>
                    {task.text}
                  </span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* ─── Notes panel with Preview / Edit toggle ─── */}
        <div className="mb-6 rounded-xl border border-surface-600 bg-surface-800/50 overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700">
            <span className="text-sm font-mono font-medium text-slate-300">
              {showPreview ? '📄 Day Notes — Preview' : '✏️ Day Notes — Edit'}
            </span>

            {allDone ? (
              /* Toggle pill — only visible when all tasks done */
              <div className="flex items-center rounded-full border border-surface-600 bg-surface-900 p-0.5 gap-0.5">
                <button
                  onClick={() => setIsPreview(true)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                    showPreview
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-700/60'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z" />
                    <circle cx="12" cy="12" r="2.25" />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => setIsPreview(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                    !showPreview
                      ? 'bg-azure-500/20 text-azure-300 border border-azure-700/60'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.125 1.125-4.5L16.862 3.487z" />
                  </svg>
                  Edit
                </button>
              </div>
            ) : (
              /* Hint badge when tasks are still in progress */
              <span className="text-[10px] font-mono text-slate-600 border border-surface-600 rounded-full px-2 py-0.5">
                preview unlocks when all tasks done
              </span>
            )}
          </div>

          {/* Panel body */}
          <div className="px-4 py-5 space-y-5">
            {showPreview ? (
              /* ── PREVIEW MODE ── */
              <>
                <PreviewField label="💡 What I Learned">
                  <p className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed text-sm">
                    {progress.learnedSummary || <span className="text-slate-600 italic">No summary saved yet.</span>}
                  </p>
                </PreviewField>

                <PreviewField label="🔗 Documentation Link">
                  {progress.docLink ? (
                    <a
                      href={progress.docLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-azure-400 hover:text-azure-200 transition-colors break-all text-sm"
                    >
                      {progress.docLink}
                    </a>
                  ) : (
                    <span className="text-slate-600 italic text-sm">No link saved yet.</span>
                  )}
                </PreviewField>

                <PreviewField label="📝 Notes">
                  <p className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed text-sm font-mono">
                    {progress.notes || <span className="text-slate-600 italic font-sans">No notes saved yet.</span>}
                  </p>
                </PreviewField>
              </>
            ) : (
              /* ── EDIT MODE ── */
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">💡 What I Learned</label>
                  <textarea
                    value={localLearned}
                    onChange={e => setLocalLearned(e.target.value)}
                    placeholder="Summarize what you learned today. What clicked? What was confusing? What would you do differently?"
                    rows={4}
                    className="w-full bg-surface-700 border border-surface-600 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:border-azure-500 transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">🔗 Documentation Link</label>
                  <input
                    type="url"
                    value={localLink}
                    onChange={e => setLocalLink(e.target.value)}
                    placeholder="https://notion.so/... or https://github.com/... or your blog post URL"
                    className="w-full bg-surface-700 border border-surface-600 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-azure-500 transition-colors outline-none"
                  />
                  {localLink && (
                    <a
                      href={localLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs text-azure-400 hover:text-azure-200 transition-colors font-mono"
                    >
                      Open link
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">📝 Notes</label>
                  <textarea
                    value={localNotes}
                    onChange={e => setLocalNotes(e.target.value)}
                    placeholder="Any extra notes, commands you ran, issues you hit, resources you found useful..."
                    rows={5}
                    className="w-full bg-surface-700 border border-surface-600 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:border-azure-500 transition-colors outline-none font-mono"
                  />
                  {hasUnsaved && (
                    <p className="mt-2 text-[11px] font-mono text-amber-400">Unsaved changes</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Panel footer — save button (only in edit mode) */}
          {!showPreview && (
            <div className="flex items-center justify-end px-4 py-3 border-t border-surface-700 bg-surface-900/40">
              <button
                onClick={handleSave}
                className={`
                  px-5 py-2 text-sm font-mono rounded-lg border transition-all duration-200
                  ${saved
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-azure-500/20 border-azure-500/50 text-azure-300 hover:bg-azure-500/30'
                  }
                `}
              >
                {saved ? '✓ Saved' : 'Save notes'}
              </button>
            </div>
          )}
        </div>

        {/* Day navigation footer */}
        <div className="flex items-center justify-between mt-2 mb-10">
          <div className="flex gap-2">
            {prevDay && (
              <Link
                href={`/day/${prevDay}`}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 border border-surface-600 rounded-lg hover:border-slate-500 transition-colors"
              >
                ← Day {prevDay}
              </Link>
            )}
            {nextDay && (
              <Link
                href={`/day/${nextDay}`}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 border border-surface-600 rounded-lg hover:border-slate-500 transition-colors"
              >
                Day {nextDay} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="flex items-center gap-2 text-sm font-mono font-medium text-slate-300 mb-3">
        <span className="text-base">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function PreviewField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-mono text-slate-500 mb-2">{label}</p>
      <div className="rounded-lg border border-surface-600 bg-surface-700/40 px-4 py-3">
        {children}
      </div>
    </div>
  )
}
