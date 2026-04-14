create table if not exists public.progress_entries (
    day integer primary key,
    status text not null default 'not-started',
    tasks jsonb not null default '{}'::jsonb,
    notes text not null default '',
    doc_link text not null default '',
    what_learned text not null default '',
    created_at timestamptz not null default now()
);