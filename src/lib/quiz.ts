export type QuizItemType = 'mcq' | 'flashcard' | 'scenario'
export type ReviewRating = 'again' | 'hard' | 'easy'

export interface QuizItem {
  id: string
  day: number
  week: number
  source_title: string
  type: QuizItemType
  question: string
  choices: string[]
  answer: string
  explanation: string
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  due_at: string
  interval_days: number
  ease_factor: number
  review_count: number
  correct_count: number
  created_at: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  mode: 'day' | 'week' | 'custom'
  source_day: number | null
  source_week: number | null
  total_questions: number
  correct_answers: number
  score_pct: number
  weak_tags: string[]
  created_at: string
}

export interface GenerateQuizInput {
  day: number
  week: number
  title: string
  category: string
  tasks: string[]
  notes?: string
  learnedSummary?: string
  difficulty: 'easy' | 'medium' | 'hard'
  count: number
  includeNotes?: boolean
}

export interface GeneratedQuizItem {
  type: QuizItemType
  question: string
  choices?: string[]
  answer: string
  explanation: string
  tags: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
}

export function normalizeGeneratedItems(items: GeneratedQuizItem[], day: number, week: number, sourceTitle: string, difficulty: 'easy' | 'medium' | 'hard'): Omit<QuizItem, 'id' | 'created_at' | 'updated_at'>[] {
  const now = new Date().toISOString()
  return items.map((item) => ({
    day,
    week,
    source_title: sourceTitle,
    type: item.type,
    question: item.question.trim(),
    choices: Array.isArray(item.choices) ? item.choices.filter(Boolean) : [],
    answer: item.answer.trim(),
    explanation: item.explanation.trim(),
    tags: Array.isArray(item.tags) ? item.tags.filter(Boolean) : [],
    difficulty: item.difficulty ?? difficulty,
    due_at: now,
    interval_days: 1,
    ease_factor: 2.3,
    review_count: 0,
    correct_count: 0,
  }))
}

export function nextSchedule(currentInterval: number, currentEase: number, rating: ReviewRating) {
  if (rating === 'again') {
    return { interval_days: 1, ease_factor: Math.max(1.3, currentEase - 0.2) }
  }
  if (rating === 'hard') {
    return { interval_days: Math.max(2, Math.round(currentInterval * 1.4)), ease_factor: Math.max(1.3, currentEase - 0.05) }
  }
  return { interval_days: Math.max(3, Math.round(currentInterval * currentEase)), ease_factor: Math.min(3, currentEase + 0.1) }
}

export function addDaysIso(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function extractWeakTags(items: Array<{ tags: string[]; isCorrect: boolean }>): string[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    if (item.isCorrect) continue
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag)
}

