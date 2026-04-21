# ☁️ Azure Learning Tracker

A clean, dark-mode dashboard for tracking a 21-day Azure cloud engineering learning journey. Built with Next.js + Tailwind CSS, deployable to Vercel in under 2 minutes.

**Live demo:** [your-app.vercel.app](https://your-app.vercel.app)

---

## Features

- 21-day structured roadmap (Azure fundamentals → identity → security → DevOps)
- Per-day task checklists with auto status updates
- "What I Learned", notes, and documentation link fields
- AI quiz generation by topic/tasks (Gemini)
- Flashcard + MCQ study mode with spaced review scheduling
- Progress stats dashboard (completed / in-progress / streak)
- GitHub-style activity grid
- Supabase-backed persistence
- Fully responsive dark UI
- Deployable to Vercel with one command

---

## Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v3 | Styling |
| Supabase | Persistence |
| Gemini API | Quiz generation |
| Vercel | Deployment |

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/azure-learning-tracker.git
cd azure-learning-tracker
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Environment variables

Set these in `.env.local`:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
# Optional:
GEMINI_MODEL=gemini-1.5-flash
```

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your app will be live in ~60 seconds.

### Option B — Vercel Dashboard (recommended for portfolio)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import your GitHub repo
4. Leave all settings as default → click **Deploy**
5. Done — you get a `.vercel.app` URL instantly

### Option C — One-click from GitHub Actions

Add `.github/workflows/deploy.yml` with Vercel's GitHub Action for automatic deploys on push.

---

## Project Structure

```
azure-tracker/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles + Tailwind
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage dashboard
│   │   └── day/
│   │       └── [day]/
│   │           └── page.tsx     # Day detail page
│   ├── components/
│   │   ├── DayCard.tsx          # Card for each day
│   │   ├── ProgressStats.tsx    # Stats bar + progress
│   │   └── ActivityGrid.tsx     # GitHub-style grid
│   ├── data/
│   │   └── roadmap.ts           # All 21 days of data
│   └── hooks/
│       └── useProgress.ts       # localStorage persistence hook
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── vercel.json
```

---

## Customization

### Change the roadmap content

Edit `src/data/roadmap.ts` — each day has:
- `title` — day title
- `category` — one of: `fundamentals | identity | security | monitoring | devops | project`
- `tasks` — array of task objects
- `isFinalProject` — boolean for Day 21 badge

### Add new categories

Update `CATEGORY_META` in `roadmap.ts` with label, color, and badge styles.

### Reset progress

Open browser DevTools → Application → Local Storage → delete `azure-tracker-progress`.

---

## Recruiter-Ready Improvements (Post-MVP)

> These additions will significantly boost the portfolio impression of this project.

### High impact (add these first)
- **Export to PDF/Markdown** — let recruiters download your learning log
- **GitHub OAuth + Supabase** — replace localStorage with a real DB + shareable profile URL
- **Public share link** — `/share/[username]` read-only view of your progress
- **Streak tracking** — "🔥 7-day streak" gamification for consistency
- **Dark/light mode toggle** — shows attention to detail

### Medium impact
- **Certification roadmap tab** — show AZ-500/AZ-104 exam progress separately
- **Lab timer** — Pomodoro-style timer per day session
- **Tags for commands/tools used** — e.g. tag "az cli", "bicep", "KQL" per day
- **Weekly review prompts** — end of each week, prompted to write a reflection

### Nice to have
- **Markdown support in notes** — render notes as formatted markdown
- **Resource bookmarks** — save links per day with title + description
- **Confetti animation** on Day 21 completion

---

## Learning Path Covered

| Week | Focus |
|------|-------|
| Week 1 | Azure Portal, VMs, Networking, Storage, RBAC basics, CLI + Bicep |
| Week 2 | Entra ID, MFA, Conditional Access, PIM, Managed Identity, Zero Trust |
| Week 3 | Azure Monitor, Defender for Cloud, Sentinel, Key Vault, Azure DevOps CI/CD |

**Target certifications after this roadmap:** AZ-500 (first) → AZ-104 (second)

---

## License

MIT — use freely for your own learning journey.
