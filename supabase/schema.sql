create table if not exists public.progress_entries (
    day integer primary key,
    status text not null default 'not-started',
    tasks jsonb not null default '{}'::jsonb,
    notes text not null default '',
    doc_link text not null default '',
    what_learned text not null default '',
    created_at timestamptz not null default now()
);

create extension if not exists pgcrypto;

create table if not exists public.quiz_items (
    id uuid primary key default gen_random_uuid(),
    day integer not null,
    week integer not null,
    source_title text not null default '',
    type text not null check (type in ('mcq', 'flashcard', 'scenario')),
    question text not null,
    choices jsonb not null default '[]'::jsonb,
    answer text not null,
    explanation text not null default '',
    tags jsonb not null default '[]'::jsonb,
    difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
    due_at timestamptz not null default now(),
    interval_days integer not null default 1,
    ease_factor numeric not null default 2.3,
    review_count integer not null default 0,
    correct_count integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists quiz_items_day_idx on public.quiz_items(day);
create index if not exists quiz_items_week_idx on public.quiz_items(week);
create index if not exists quiz_items_due_at_idx on public.quiz_items(due_at);

create table if not exists public.quiz_attempts (
    id uuid primary key default gen_random_uuid(),
    mode text not null check (mode in ('day', 'week', 'custom')),
    source_day integer null,
    source_week integer null,
    total_questions integer not null,
    correct_answers integer not null,
    score_pct integer not null,
    weak_tags jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);