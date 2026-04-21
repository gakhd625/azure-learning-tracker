'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ROADMAP_DATA } from '@/data/roadmap'
import type { QuizItem, ReviewRating } from '@/lib/quiz'
import { useSearchParams } from 'next/navigation'

interface ProgressEntry {
  notes: string
  learnedSummary: string
}

export default function StudyPage() {
  const searchParams = useSearchParams()
  const [day, setDay] = useState<number>(1)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [count, setCount] = useState(6)
  const [includeNotes, setIncludeNotes] = useState(true)
  const [items, setItems] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<Array<{ id: string; tags: string[]; isCorrect: boolean }>>([])
  const [finishedScore, setFinishedScore] = useState<number | null>(null)

  const current = items[cursor]
  const dayMeta = ROADMAP_DATA.find(d => d.day === day)
  const dayParam = searchParams.get('day')

  useEffect(() => {
    if (!dayParam) return
    const parsed = Number(dayParam)
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= ROADMAP_DATA.length) {
      setDay(parsed)
    }
  }, [dayParam])

  const correctCount = useMemo(() => results.filter(r => r.isCorrect).length, [results])

  const generate = async () => {
    setLoading(true)
    setError(null)
    setFinishedScore(null)
    setResults([])
    setCursor(0)
    setSelectedChoice(null)
    setRevealed(false)

    try {
      let notesPayload: ProgressEntry | null = null
      if (includeNotes) {
        const progressRes = await fetch('/api/progress', { cache: 'no-store' })
        if (progressRes.ok) {
          const progressData = await progressRes.json() as { entries?: Record<number, ProgressEntry> }
          notesPayload = progressData.entries?.[day] ?? null
        }
      }

      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day,
          count,
          difficulty,
          includeNotes,
          notes: notesPayload?.notes ?? '',
          learnedSummary: notesPayload?.learnedSummary ?? '',
        }),
      })
      const data = await response.json() as { items?: QuizItem[]; error?: string }
      if (!response.ok) throw new Error(data.error || 'Failed to generate quiz.')
      setItems(data.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.')
    } finally {
      setLoading(false)
    }
  }

  const rateCard = async (isCorrect: boolean, rating: ReviewRating) => {
    if (!current) return
    try {
      await fetch('/api/quiz/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: current.id,
          rating,
          wasCorrect: isCorrect,
        }),
      })
    } catch (err) {
      console.error('Review update failed', err)
    }
    const nextResults = [...results, { id: current.id, tags: current.tags ?? [], isCorrect }]
    setResults(nextResults)
    setSelectedChoice(null)
    setRevealed(false)

    if (cursor + 1 < items.length) {
      setCursor(cursor + 1)
      return
    }

    const score = Math.round((nextResults.filter(item => item.isCorrect).length / items.length) * 100)
    setFinishedScore(score)

    try {
      await fetch('/api/quiz/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'day',
          sourceDay: day,
          sourceWeek: dayMeta?.week ?? null,
          totalQuestions: items.length,
          correctAnswers: nextResults.filter(item => item.isCorrect).length,
          results: nextResults,
        }),
      })
    } catch (err) {
      console.error('Attempt save failed', err)
    }
  }

  return (
    <main className="min-h-screen bg-surface-900">
      <nav className="border-b border-surface-700 bg-surface-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-200 font-mono">← Back to tracker</Link>
          <span className="text-xs font-mono text-azure-300">AI Study Mode (Gemini)</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <section className="rounded-xl border border-surface-600 bg-surface-800/70 p-4">
          <h1 className="text-2xl font-bold text-white mb-2">Generate Quiz by Topic</h1>
          <p className="text-sm text-slate-400 mb-4">
            Questions are generated from roadmap topics/tasks and optionally your notes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={day}
              onChange={e => setDay(Number(e.target.value))}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-azure-500"
            >
              {ROADMAP_DATA.map(item => (
                <option key={item.day} value={item.day}>
                  Day {String(item.day).padStart(2, '0')} - {item.title}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-azure-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              type="number"
              min={3}
              max={20}
              value={count}
              onChange={e => setCount(Math.max(3, Math.min(20, Number(e.target.value) || 6)))}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-azure-500"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="w-full px-3 py-2 rounded-lg border border-azure-500/50 text-azure-300 bg-azure-500/10 hover:bg-azure-500/20 transition-colors disabled:opacity-60"
            >
              {loading ? 'Generating...' : 'Generate quiz'}
            </button>
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-slate-400">
            <input type="checkbox" checked={includeNotes} onChange={e => setIncludeNotes(e.target.checked)} />
            Blend in my notes if available
          </label>
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </section>

        {items.length > 0 && current && finishedScore === null && (
          <section className="rounded-xl border border-surface-600 bg-surface-800/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-slate-400">
                Question {cursor + 1}/{items.length} · Correct {correctCount}
              </p>
              <span className="text-[11px] font-mono text-slate-500">{current.type.toUpperCase()} · {current.difficulty}</span>
            </div>
            <h2 className="text-lg text-white font-semibold mb-3">{current.question}</h2>

            {current.type === 'mcq' ? (
              <div className="space-y-2">
                {current.choices.map(choice => (
                  <button
                    key={choice}
                    onClick={() => setSelectedChoice(choice)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      selectedChoice === choice
                        ? 'border-azure-500/60 bg-azure-500/10 text-slate-100'
                        : 'border-surface-600 bg-surface-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (!selectedChoice) return
                      const isCorrect = selectedChoice.trim().toLowerCase() === current.answer.trim().toLowerCase()
                      void rateCard(isCorrect, isCorrect ? 'easy' : 'again')
                    }}
                    disabled={!selectedChoice}
                    className="px-3 py-1.5 rounded-md border border-emerald-500/50 text-emerald-300 text-xs font-mono disabled:opacity-50"
                  >
                    Submit answer
                  </button>
                  <button
                    onClick={() => setRevealed(!revealed)}
                    className="px-3 py-1.5 rounded-md border border-surface-500 text-slate-300 text-xs font-mono"
                  >
                    {revealed ? 'Hide explanation' : 'Show explanation'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="px-3 py-1.5 rounded-md border border-surface-500 text-slate-300 text-xs font-mono"
                >
                  {revealed ? 'Hide answer' : 'Reveal answer'}
                </button>
                {revealed && (
                  <div className="rounded-lg border border-surface-600 bg-surface-700 p-3 space-y-2">
                    <p className="text-sm text-emerald-300"><span className="font-mono text-xs text-slate-400">Answer:</span> {current.answer}</p>
                    <p className="text-sm text-slate-300">{current.explanation}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button onClick={() => void rateCard(true, 'easy')} className="px-3 py-1.5 rounded-md border border-emerald-500/50 text-emerald-300 text-xs font-mono">I got it</button>
                      <button onClick={() => void rateCard(false, 'again')} className="px-3 py-1.5 rounded-md border border-rose-500/50 text-rose-300 text-xs font-mono">I missed it</button>
                      <button onClick={() => void rateCard(true, 'hard')} className="px-3 py-1.5 rounded-md border border-amber-500/50 text-amber-300 text-xs font-mono">Hard but correct</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {revealed && current.type === 'mcq' && (
              <div className="mt-3 rounded-lg border border-surface-600 bg-surface-700 p-3">
                <p className="text-xs font-mono text-slate-400">Correct answer</p>
                <p className="text-sm text-emerald-300">{current.answer}</p>
                <p className="text-sm text-slate-300 mt-1">{current.explanation}</p>
              </div>
            )}
          </section>
        )}

        {finishedScore !== null && (
          <section className="rounded-xl border border-surface-600 bg-surface-800/70 p-5">
            <h2 className="text-xl font-bold text-white">Session complete</h2>
            <p className="text-sm text-slate-300 mt-2">
              Score: <span className="text-azure-300 font-mono">{finishedScore}%</span> ({correctCount}/{items.length})
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Attempts are saved with weak tags so you can generate targeted follow-up quizzes later.
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={generate} className="px-3 py-2 rounded-md border border-azure-500/50 text-azure-300 text-xs font-mono">Regenerate</button>
              <Link href="/" className="px-3 py-2 rounded-md border border-surface-500 text-slate-300 text-xs font-mono">Back to dashboard</Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

