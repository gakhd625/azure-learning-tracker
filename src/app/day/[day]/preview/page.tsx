'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ROADMAP_DATA, CATEGORY_META } from '@/data/roadmap'
import { useProgress } from '@/hooks/useProgress'

export default function DayPreviewPage() {
  const params = useParams()
  const dayNum = Number(params.day)
  const dayData = ROADMAP_DATA.find(d => d.day === dayNum)
  const { getDayProgress, loaded } = useProgress()

  if (!dayData) {
    return (
      <main className="min-h-screen bg-surface-900 px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-400 mb-4">Day not found.</p>
          <Link href="/" className="text-azure-400 hover:text-azure-200 text-sm font-mono">
            Back to tracker
          </Link>
        </div>
      </main>
    )
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-azure-500 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const meta = CATEGORY_META[dayData.category]
  const progress = getDayProgress(dayNum)

  return (
    <main className="min-h-screen bg-surface-900">
      <nav className="sticky top-0 z-10 border-b border-surface-700 bg-surface-900/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 shrink-0">
              Day {String(dayNum).padStart(2, '0')}
            </span>
            <span className={`text-xs font-mono ${meta.color} truncate`}>
              {meta.label}
            </span>
          </div>
          <Link
            href={`/day/${dayNum}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-600 bg-surface-700 text-xs font-mono text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Editor
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8 pb-5 border-b border-surface-700">
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">Saved Documentation Preview</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{dayData.title}</h1>
          <p className="text-sm text-slate-400">
            Long-form view for reviewing your saved learning notes and references.
          </p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">What I Learned</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4">
              <p className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed">
                {progress.learnedSummary || 'No summary saved yet.'}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Documentation Link</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4">
              {progress.docLink ? (
                <a
                  href={progress.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-azure-400 hover:text-azure-200 transition-colors break-all"
                >
                  {progress.docLink}
                </a>
              ) : (
                <p className="text-slate-400">No documentation link saved yet.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Notes</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4">
              <p className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed font-mono">
                {progress.notes || 'No notes saved yet.'}
              </p>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}
