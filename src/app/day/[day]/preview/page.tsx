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
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">Saved Notes Preview</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{dayData.title}</h1>
          <p className="text-sm text-slate-400">
            Review your saved learning notes in a clean, read-only format.
          </p>
          {progress.createdAt && (
            <p className="mt-3 text-xs font-mono text-slate-500">
              Saved on {new Date(progress.createdAt).toLocaleString()}
            </p>
          )}
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">What I Learned</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              {progress.learnedSummary ? (
                <MarkdownPreview content={progress.learnedSummary} />
              ) : (
                <p className="text-slate-300">No learning summary yet.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Documentation Link</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              {progress.docLink ? (
                <div className="flex items-start justify-between gap-3">
                  <a
                    href={progress.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-azure-400 hover:text-azure-200 transition-colors break-all"
                  >
                    {progress.docLink}
                  </a>
                  <a
                    href={progress.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 shrink-0 rounded-md border border-surface-500 px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-slate-100 hover:border-slate-400 transition-colors"
                  >
                    Open
                  </a>
                </div>
              ) : (
                <p className="text-slate-400">No documentation link yet.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Notes</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              {progress.notes ? (
                <MarkdownPreview content={progress.notes} monospace />
              ) : (
                <p className="text-slate-300">No notes yet.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Quick Actions</h2>
            <div className="rounded-xl border border-surface-600 bg-surface-700/60 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => void copyDaySummary(dayData.title, dayNum, progress.learnedSummary, progress.docLink, progress.notes)}
                  className="px-3 py-1.5 text-xs font-mono rounded-md border border-surface-500 text-slate-300 hover:text-slate-100 hover:border-slate-400 transition-colors"
                >
                  Copy notes
                </button>
                <button
                  onClick={() => exportDayMarkdown(dayData.title, dayNum, progress.learnedSummary, progress.docLink, progress.notes)}
                  className="px-3 py-1.5 text-xs font-mono rounded-md border border-surface-500 text-slate-300 hover:text-slate-100 hover:border-slate-400 transition-colors"
                >
                  Export .md
                </button>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}

function MarkdownPreview({ content, monospace = false }: { content: string; monospace?: boolean }) {
  const lines = content.split('\n')
  return (
    <div className={`space-y-2 text-sm text-slate-300 leading-relaxed ${monospace ? 'font-mono' : ''}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-2" />
        if (trimmed.startsWith('# ')) return <h4 key={idx} className="text-base font-semibold text-slate-100">{trimmed.slice(2)}</h4>
        if (trimmed.startsWith('## ')) return <h5 key={idx} className="text-sm font-semibold text-slate-100">{trimmed.slice(3)}</h5>
        if (trimmed.startsWith('- ')) return <p key={idx}>• {trimmed.slice(2)}</p>
        if (trimmed.startsWith('`') && trimmed.endsWith('`') && trimmed.length > 2) {
          return <code key={idx} className="inline-block rounded bg-surface-800 px-2 py-1 text-xs text-amber-300">{trimmed.slice(1, -1)}</code>
        }
        return <p key={idx}>{line}</p>
      })}
    </div>
  )
}

async function copyDaySummary(title: string, dayNum: number, learnedSummary: string, docLink: string, notes: string) {
  const text = buildMarkdownSummary(title, dayNum, learnedSummary, docLink, notes)
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy notes', error)
  }
}

function exportDayMarkdown(title: string, dayNum: number, learnedSummary: string, docLink: string, notes: string) {
  const content = buildMarkdownSummary(title, dayNum, learnedSummary, docLink, notes)
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `day-${String(dayNum).padStart(2, '0')}-notes.md`
  anchor.click()
  URL.revokeObjectURL(url)
}

function buildMarkdownSummary(title: string, dayNum: number, learnedSummary: string, docLink: string, notes: string) {
  return [
    `# Day ${String(dayNum).padStart(2, '0')} - ${title}`,
    '',
    '## What I Learned',
    learnedSummary || '_No summary yet._',
    '',
    '## Documentation Link',
    docLink || '_No link yet._',
    '',
    '## Notes',
    notes || '_No notes yet._',
    '',
  ].join('\n')
}
