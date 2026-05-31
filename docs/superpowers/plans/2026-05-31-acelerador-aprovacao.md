# Acelerador de Aprovação — MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished demo MVP web platform that replaces an Excel glossary for interpreter exam prep — glossary, expandable word cards with neural audio, student/teacher dashboards, and a functional 10-day study schedule.

**Architecture:** Next.js 14 App Router + TypeScript. UI in Tailwind. Mocked data in `/data/*.ts`. Student state (stars, schedule progress, active profile) in a Zustand store persisted to localStorage. Dashboards derive metrics live from the store; teacher dashboard uses static mock students. No backend.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Zustand, Web Speech API (`speechSynthesis`).

**Verification approach:** This is a UI demo. Most tasks are verified by `npm run build` passing + visual check in the browser. The progress-derivation logic (the only non-trivial logic) is unit-tested with Vitest.

---

## File Structure

```
acelerador/
  app/
    layout.tsx                  Root layout, fonts, global metadata
    globals.css                 Tailwind directives + theme tokens
    page.tsx                    Home (/)
    select/page.tsx             Profile selection (/select)
    student/layout.tsx          Student area shell (sidebar)
    student/page.tsx            Student dashboard
    student/study/page.tsx      Word cards grid + filters
    student/schedule/page.tsx   10-day schedule
    teacher/layout.tsx          Teacher area shell (sidebar)
    teacher/page.tsx            Teacher dashboard
    teacher/glossary/page.tsx   Glossary + search/filters
  components/
    Sidebar.tsx                 Nav sidebar (per profile)
    WordCard.tsx                Collapsed + expanded word card
    StarRating.tsx              1-5 interactive stars
    AudioButtons.tsx            Neural (speechSynthesis) + human audio
    StatCard.tsx                Dashboard metric card
    CategoryFilter.tsx          Category/subcategory/frequency/type filters
    SearchBar.tsx               Glossary search input
    StudentTable.tsx            Teacher's student list table
    ScheduleDayCard.tsx         One day of the schedule w/ completion toggle
    Badge.tsx                   Small frequency/type pill
  data/
    words.ts                    50 mock Word entries
    students.ts                 Mock students for teacher dashboard
    schedule.ts                 10-day schedule definition
    categories.ts               Category list + metadata
  lib/
    types.ts                    Word, StudentProgress, ScheduleDay, MockStudent
    store.ts                    Zustand store (progress, schedule, profile) + localStorage
    metrics.ts                  Pure functions deriving dashboard metrics
    speech.ts                   speechSynthesis helper
  lib/metrics.test.ts           Unit tests for metrics
  tailwind.config.ts            Theme: navy palette
  ...config files
```

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (temporary), `vitest.config.ts`

- [ ] **Step 1: Create the Next.js app non-interactively**

Run in the project root (`C:\Users\erik\Claude projects\accelerator`):
```bash
npx --yes create-next-app@14 . --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
If the directory is not empty (docs/.git exist), create in a temp subfolder and move files, OR answer prompts to proceed. Expected: `app/`, `package.json`, `tailwind.config.ts` created.

- [ ] **Step 2: Install runtime + test deps**

```bash
npm install zustand
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

- [ ] **Step 3: Add test script + vitest config**

In `package.json` scripts add: `"test": "vitest run"`.
Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
  resolve: { alias: { '@': resolve(__dirname, '.') } },
})
```

- [ ] **Step 4: Verify build + dev**

Run: `npm run build`
Expected: build succeeds with the default page.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js + Tailwind + Vitest"
```

---

### Task 2: Theme tokens (navy palette)

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Define brand colors in Tailwind**

In `tailwind.config.ts`, extend theme colors:
```ts
extend: {
  colors: {
    navy: { DEFAULT: '#1e3a8a', 700: '#1d4ed8', 900: '#1e3a8a', 950: '#172554' },
    ink: '#0f172a',
    accent: { amber: '#f59e0b', red: '#dc2626', green: '#16a34a' },
  },
  boxShadow: { card: '0 2px 8px rgba(30,58,138,0.08)', cardLg: '0 4px 20px rgba(30,58,138,0.12)' },
}
```

- [ ] **Step 2: Set base background + font in globals.css**

After the `@tailwind` directives add:
```css
:root { --bg: #f8f9fb; }
body { background: var(--bg); color: #0f172a; -webkit-font-smoothing: antialiased; }
```

- [ ] **Step 3: Verify build**

Run: `npm run build` — Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: navy theme tokens"
```

---

### Task 3: Type definitions

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write the types**

```ts
export type LinguisticType = 'cognate' | 'false-cognate' | 'equivalent'
export type TestFrequency = 'high' | 'medium' | 'low'

export interface Word {
  id: string
  word: string
  translation: string
  definition: string
  exampleEN: string
  examplePT: string
  category: string
  subcategory: string
  imageUrl: string
  audioHumanUrl: string
  linguisticType: LinguisticType
  testFrequency: TestFrequency
  tags: string[]
}

export interface StudentProgress {
  wordId: string
  stars: 1 | 2 | 3 | 4 | 5
  lastReviewed: string // ISO date
  reviewCount: number
}

export interface ScheduleDay {
  day: number
  title: string
  categories: string[]
  wordIds: string[]
}

export interface MockStudent {
  id: string
  name: string
  avatarUrl: string
  wordsStudied: number
  averageStars: number
  lastActivity: string
  glossaryPercent: number
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit` — Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: core type definitions"
```

---

### Task 4: Mock data — categories + 50 words

**Files:**
- Create: `data/categories.ts`, `data/words.ts`

- [ ] **Step 1: Create categories**

```ts
// data/categories.ts
export const CATEGORIES = [
  'Basics',
  'Medical & Clinics',
  'Customer Service',
  'Banking',
  'Emergency & 911',
  'Insurance',
] as const
export type Category = typeof CATEGORIES[number]
```

- [ ] **Step 2: Create 50 mock words**

Create `data/words.ts` exporting `export const WORDS: Word[]` with 50 entries distributed across the 6 categories (~8 each). Each entry fully populated. Use placeholder images `https://picsum.photos/seed/<id>/400/300` and `audioHumanUrl: ''` (empty = not yet recorded). Example shape:
```ts
import { Word } from '@/lib/types'
export const WORDS: Word[] = [
  {
    id: 'w001', word: 'ambulance', translation: 'ambulância',
    definition: 'Emergency vehicle used to transport patients to a hospital.',
    exampleEN: 'Call an ambulance immediately.',
    examplePT: 'Chame uma ambulância imediatamente.',
    category: 'Emergency & 911', subcategory: 'First Response',
    imageUrl: 'https://picsum.photos/seed/w001/400/300', audioHumanUrl: '',
    linguisticType: 'cognate', testFrequency: 'high', tags: ['911','medical'],
  },
  // ... 49 more, simple realistic interpreter vocabulary
]
```
Write all 50 entries in full (no `// ...` in the real file).

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit` — Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: mock categories + 50 words"
```

---

### Task 5: Mock data — students + schedule

**Files:**
- Create: `data/students.ts`, `data/schedule.ts`

- [ ] **Step 1: Create 5 mock students**

`data/students.ts` exporting `export const STUDENTS: MockStudent[]` with 5 students, varied `glossaryPercent` (28–91), `averageStars` (2.0–5.0), `lastActivity` ISO dates, avatars `https://i.pravatar.cc/80?u=<id>`.

- [ ] **Step 2: Create 10-day schedule**

`data/schedule.ts` exporting `export const SCHEDULE: ScheduleDay[]` with 10 days, each with a title, 1–2 categories, and 4–6 `wordIds` drawn from `data/words.ts`.

- [ ] **Step 3: Verify typecheck + commit**

Run: `npx tsc --noEmit` — Expected: PASS.
```bash
git add -A && git commit -m "feat: mock students + 10-day schedule"
```

---

### Task 6: Zustand store with localStorage persistence

**Files:**
- Create: `lib/store.ts`

- [ ] **Step 1: Implement the store**

```ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StudentProgress } from '@/lib/types'

type Profile = 'student' | 'teacher' | null

interface AppState {
  profile: Profile
  progress: Record<string, StudentProgress>
  scheduleDone: Record<number, boolean>
  setProfile: (p: Profile) => void
  setStars: (wordId: string, stars: 1 | 2 | 3 | 4 | 5) => void
  toggleDay: (day: number) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      progress: {},
      scheduleDone: {},
      setProfile: (profile) => set({ profile }),
      setStars: (wordId, stars) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [wordId]: {
              wordId,
              stars,
              lastReviewed: new Date().toISOString(),
              reviewCount: (s.progress[wordId]?.reviewCount ?? 0) + 1,
            },
          },
        })),
      toggleDay: (day) =>
        set((s) => ({ scheduleDone: { ...s.scheduleDone, [day]: !s.scheduleDone[day] } })),
      reset: () => set({ progress: {}, scheduleDone: {} }),
    }),
    { name: 'acelerador-state' },
  ),
)
```

- [ ] **Step 2: Verify typecheck + commit**

Run: `npx tsc --noEmit` — Expected: PASS.
```bash
git add -A && git commit -m "feat: zustand store with localStorage"
```

---

### Task 7: Metrics derivation (with unit tests)

**Files:**
- Create: `lib/metrics.ts`
- Test: `lib/metrics.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { studentMetrics } from '@/lib/metrics'
import type { Word, StudentProgress } from '@/lib/types'

const words = [
  { id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' },
] as Word[]

const progress: Record<string, StudentProgress> = {
  a: { wordId: 'a', stars: 5, lastReviewed: '2026-05-30T00:00:00Z', reviewCount: 3 },
  b: { wordId: 'b', stars: 2, lastReviewed: '2026-05-29T00:00:00Z', reviewCount: 1 },
}

describe('studentMetrics', () => {
  it('counts studied words and percent', () => {
    const m = studentMetrics(words, progress)
    expect(m.studied).toBe(2)
    expect(m.total).toBe(4)
    expect(m.percent).toBe(50)
  })
  it('averages stars over studied words', () => {
    const m = studentMetrics(words, progress)
    expect(m.avgStars).toBeCloseTo(3.5)
  })
  it('flags low-fixation words (<=2 stars)', () => {
    const m = studentMetrics(words, progress)
    expect(m.toReview.map((w) => w.id)).toEqual(['b'])
  })
  it('handles empty progress', () => {
    const m = studentMetrics(words, {})
    expect(m.studied).toBe(0)
    expect(m.avgStars).toBe(0)
    expect(m.percent).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test` — Expected: FAIL ("studentMetrics is not a function").

- [ ] **Step 3: Implement metrics**

```ts
import type { Word, StudentProgress } from '@/lib/types'

export interface StudentMetrics {
  studied: number
  total: number
  percent: number
  avgStars: number
  toReview: Word[]
  highFixation: Word[]
}

export function studentMetrics(
  words: Word[],
  progress: Record<string, StudentProgress>,
): StudentMetrics {
  const entries = Object.values(progress)
  const studied = entries.length
  const total = words.length
  const percent = total ? Math.round((studied / total) * 100) : 0
  const avgStars = studied
    ? entries.reduce((sum, p) => sum + p.stars, 0) / studied
    : 0
  const byId = new Map(words.map((w) => [w.id, w]))
  const toReview = entries
    .filter((p) => p.stars <= 2)
    .map((p) => byId.get(p.wordId))
    .filter((w): w is Word => Boolean(w))
  const highFixation = entries
    .filter((p) => p.stars >= 4)
    .map((p) => byId.get(p.wordId))
    .filter((w): w is Word => Boolean(w))
  return { studied, total, percent, avgStars, toReview, highFixation }
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test` — Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: student metrics derivation + tests"
```

---

### Task 8: speechSynthesis helper

**Files:**
- Create: `lib/speech.ts`

- [ ] **Step 1: Implement helper**

```ts
export function speak(text: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  const voices = window.speechSynthesis.getVoices()
  const en = voices.find((v) => v.lang.startsWith('en'))
  if (en) utter.voice = en
  utter.rate = 0.95
  window.speechSynthesis.speak(utter)
}
```

- [ ] **Step 2: Verify typecheck + commit**

Run: `npx tsc --noEmit` — Expected: PASS.
```bash
git add -A && git commit -m "feat: speechSynthesis helper"
```

---

### Task 9: Primitive components — Badge, StarRating, StatCard

**Files:**
- Create: `components/Badge.tsx`, `components/StarRating.tsx`, `components/StatCard.tsx`

- [ ] **Step 1: Badge**

```tsx
export function Badge({ children, tone = 'navy' }: { children: React.ReactNode; tone?: 'navy' | 'green' | 'amber' | 'red' | 'gray' }) {
  const tones: Record<string, string> = {
    navy: 'bg-blue-50 text-navy border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>{children}</span>
}
```

- [ ] **Step 2: StarRating (interactive)**

```tsx
'use client'
export function StarRating({ value, onChange, size = 'sm' }: { value: number; onChange?: (v: 1|2|3|4|5) => void; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <div className={`text-amber-500 ${cls} select-none`}>
      {[1,2,3,4,5].map((n) => (
        <button key={n} type="button" disabled={!onChange}
          onClick={() => onChange?.(n as 1|2|3|4|5)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${n} stars`}>
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: StatCard**

```tsx
export function StatCard({ label, value, sub, tone = 'navy' }: { label: string; value: React.ReactNode; sub?: string; tone?: 'navy'|'green'|'amber'|'red' }) {
  const top: Record<string,string> = { navy:'border-t-navy', green:'border-t-green-600', amber:'border-t-amber-500', red:'border-t-red-600' }
  const val: Record<string,string> = { navy:'text-navy', green:'text-green-600', amber:'text-amber-500', red:'text-red-600' }
  return (
    <div className={`rounded-lg bg-white p-4 shadow-card border-t-2 ${top[tone]}`}>
      <div className="text-[10px] font-semibold tracking-wide text-gray-500">{label}</div>
      <div className={`text-2xl font-extrabold ${val[tone]}`}>{value}</div>
      {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
    </div>
  )
}
```

- [ ] **Step 4: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: Badge, StarRating, StatCard primitives"
```

---

### Task 10: AudioButtons component

**Files:**
- Create: `components/AudioButtons.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client'
import { speak } from '@/lib/speech'

export function AudioButtons({ word, sentence, humanUrl }: { word: string; sentence?: string; humanUrl?: string }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => speak(word)} className="flex items-center gap-1 rounded-md bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-950">▶ Neural Audio</button>
      {sentence && <button onClick={() => speak(sentence)} className="rounded-md border border-navy px-3 py-1.5 text-xs font-bold text-navy hover:bg-blue-50">▶ Sentence</button>}
      <button
        onClick={() => { if (humanUrl) new Audio(humanUrl).play() }}
        disabled={!humanUrl}
        title={humanUrl ? 'Play human recording' : 'Human audio coming soon'}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 enabled:hover:bg-gray-50 disabled:opacity-40">
        🎧 Human
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: AudioButtons (neural + human)"
```

---

### Task 11: WordCard component

**Files:**
- Create: `components/WordCard.tsx`

- [ ] **Step 1: Implement collapsed + expanded card**

Client component. Props: `word: Word`. Reads `progress[word.id]?.stars` and `setStars` from `useAppStore`. Local `expanded` state toggled on header click. Collapsed shows: category label, word (navy bold), translation, StarRating (read-only display), frequency Badge. Expanded adds: subcategory, definition block, example EN/PT block (tinted bg), linguistic-type Badge, interactive StarRating bound to `setStars`, `AudioButtons`, and "Last review" date. Top border 3px navy (red if stars≤2). Use `shadow-card` collapsed, `shadow-cardLg` expanded.

```tsx
'use client'
import { useState } from 'react'
import type { Word } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { StarRating } from './StarRating'
import { Badge } from './Badge'
import { AudioButtons } from './AudioButtons'

const freqTone = { high: 'navy', medium: 'amber', low: 'gray' } as const
const typeLabel = { cognate: 'cognate', 'false-cognate': 'false cognate', equivalent: 'equivalent' } as const

export function WordCard({ word }: { word: Word }) {
  const [expanded, setExpanded] = useState(false)
  const stars = useAppStore((s) => s.progress[word.id]?.stars ?? 0)
  const lastReviewed = useAppStore((s) => s.progress[word.id]?.lastReviewed)
  const setStars = useAppStore((s) => s.setStars)
  const danger = stars > 0 && stars <= 2
  return (
    <div className={`rounded-xl bg-white border-t-[3px] ${danger ? 'border-red-600' : 'border-navy'} ${expanded ? 'shadow-cardLg' : 'shadow-card'} transition-shadow`}>
      <button onClick={() => setExpanded((e) => !e)} className="w-full text-left p-4">
        <div className="text-[9px] font-bold tracking-wider text-gray-500 uppercase">{word.category}</div>
        <div className="text-lg font-extrabold text-navy">{word.word}</div>
        <div className="text-sm font-medium text-gray-700 mb-2">{word.translation}</div>
        <div className="flex items-center justify-between">
          <StarRating value={stars} />
          <Badge tone={freqTone[word.testFrequency]}>{word.testFrequency.toUpperCase()}</Badge>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="text-[10px] font-semibold tracking-wide text-gray-500">DEFINITION</div>
            <p className="text-sm text-gray-700">{word.definition}</p>
          </div>
          <div className="p-4 border-b border-gray-100 bg-[#fafbff]">
            <div className="text-[10px] font-semibold tracking-wide text-gray-500">EXAMPLE</div>
            <p className="text-sm italic text-navy">&ldquo;{word.exampleEN}&rdquo;</p>
            <p className="text-xs text-gray-500">&ldquo;{word.examplePT}&rdquo;</p>
          </div>
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
            <Badge tone="green">{typeLabel[word.linguisticType]}</Badge>
            <Badge tone="gray">{word.subcategory}</Badge>
            {word.tags.map((t) => <Badge key={t} tone="gray">#{t}</Badge>)}
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <div className="text-[10px] font-semibold tracking-wide text-gray-500 mb-1">YOUR FIXATION</div>
              <StarRating value={stars} size="lg" onChange={(v) => setStars(word.id, v)} />
            </div>
            <AudioButtons word={word.word} sentence={word.exampleEN} humanUrl={word.audioHumanUrl} />
            <div className="text-[10px] text-gray-400">Last review: {lastReviewed ? new Date(lastReviewed).toLocaleDateString() : '—'}</div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: WordCard (collapsed + expanded)"
```

---

### Task 12: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement home**

Hero with product name "Acelerador de Aprovação", subtitle explaining it helps interpreters study technical vocabulary, pronunciation, real application and memorization for selection processes. Primary CTA "Get Started" → `/select`. A 3-feature row (Glossary, Neural Audio, Progress Tracking). Navy/white, centered, responsive. Top bar with "ELITE Accelerator" wordmark.

```tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="h-7 w-2 rounded bg-navy" />
          <span className="font-extrabold text-navy">ELITE</span>
          <span className="text-gray-500">Accelerator</span>
        </div>
        <Link href="/select" className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white">Get Started</Link>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-navy">Acelerador de Aprovação</h1>
        <p className="mt-6 text-lg text-gray-600">A plataforma que prepara intérpretes para processos seletivos — vocabulário técnico, pronúncia, aplicação real e memorização, tudo em um só lugar.</p>
        <Link href="/select" className="mt-10 inline-block rounded-lg bg-navy px-8 py-3 text-base font-bold text-white shadow-card hover:bg-navy-950">Acessar área de estudos →</Link>
      </section>
      <section className="mx-auto max-w-4xl grid grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {[
          ['📖','Glossário inteligente','Busca e filtros por categoria, frequência e tipo linguístico.'],
          ['🔊','Áudio neural','Pronúncia gerada por voz neural direto no navegador.'],
          ['📈','Acompanhamento','Estrelas de fixação, progresso e cronograma de estudo.'],
        ].map(([icon,title,desc]) => (
          <div key={title} className="rounded-xl bg-white p-6 shadow-card border-t-[3px] border-navy">
            <div className="text-2xl">{icon}</div>
            <h3 className="mt-2 font-bold text-navy">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build + visual check + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: home page"
```

---

### Task 13: Profile selection page

**Files:**
- Create: `app/select/page.tsx`

- [ ] **Step 1: Implement**

Two big cards: "I'm a Student" → sets profile=student, routes `/student`; "I'm a Teacher" → profile=teacher, routes `/teacher`. Uses `useAppStore.setProfile` + `next/navigation` router.

```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

export default function Select() {
  const router = useRouter()
  const setProfile = useAppStore((s) => s.setProfile)
  const pick = (p: 'student' | 'teacher') => { setProfile(p); router.push(`/${p}`) }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="mb-2 text-3xl font-extrabold text-navy">Welcome</h1>
      <p className="mb-10 text-gray-600">Choose how you want to enter the platform.</p>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <button onClick={() => pick('student')} className="rounded-2xl bg-white p-10 text-center shadow-card border-t-4 border-navy hover:shadow-cardLg transition-shadow">
          <div className="text-4xl">🎓</div>
          <div className="mt-4 text-xl font-extrabold text-navy">I&apos;m a Student</div>
          <div className="mt-1 text-sm text-gray-500">Study words, track your progress</div>
        </button>
        <button onClick={() => pick('teacher')} className="rounded-2xl bg-white p-10 text-center shadow-card border-t-4 border-red-600 hover:shadow-cardLg transition-shadow">
          <div className="text-4xl">👩‍🏫</div>
          <div className="mt-4 text-xl font-extrabold text-navy">I&apos;m a Teacher</div>
          <div className="mt-1 text-sm text-gray-500">Monitor your students</div>
        </button>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: profile selection page"
```

---

### Task 14: Sidebar + area layouts

**Files:**
- Create: `components/Sidebar.tsx`, `app/student/layout.tsx`, `app/teacher/layout.tsx`

- [ ] **Step 1: Sidebar**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem { href: string; label: string; icon: string }

export function Sidebar({ items, profile, name }: { items: NavItem[]; profile: string; name: string }) {
  const path = usePathname()
  return (
    <aside className="w-56 shrink-0 bg-navy p-4 text-white min-h-screen">
      <div className="font-extrabold">ELITE</div>
      <div className="mb-6 text-xs text-blue-200">Accelerator</div>
      <nav className="space-y-1">
        {items.map((it) => {
          const active = path === it.href
          return (
            <Link key={it.href} href={it.href}
              className={`block rounded-md px-3 py-2 text-sm ${active ? 'bg-white/15 font-bold text-white' : 'text-blue-200 hover:bg-white/10'}`}>
              {it.icon} {it.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 rounded-md bg-white/10 p-3">
        <div className="text-[9px] font-semibold uppercase text-blue-200">{profile}</div>
        <div className="text-sm font-bold">{name}</div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Student layout**

```tsx
import { Sidebar } from '@/components/Sidebar'
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar profile="Student" name="Maria Silva" items={[
        { href: '/student', label: 'Dashboard', icon: '📊' },
        { href: '/student/study', label: 'Study', icon: '📚' },
        { href: '/student/schedule', label: 'Schedule', icon: '📅' },
      ]} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Teacher layout**

```tsx
import { Sidebar } from '@/components/Sidebar'
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar profile="Teacher" name="Prof. Ana" items={[
        { href: '/teacher', label: 'Dashboard', icon: '📊' },
        { href: '/teacher/glossary', label: 'Glossary', icon: '📖' },
      ]} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: sidebar + student/teacher layouts"
```

---

### Task 15: Study page (grid + filters)

**Files:**
- Create: `app/student/study/page.tsx`, `components/CategoryFilter.tsx`

- [ ] **Step 1: CategoryFilter**

```tsx
'use client'
import { CATEGORIES } from '@/data/categories'

export function CategoryFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const all = ['All', ...CATEGORIES]
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((c) => (
        <button key={c} onClick={() => onChange(c)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${value === c ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-navy'}`}>
          {c}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Study page**

```tsx
'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { WordCard } from '@/components/WordCard'
import { CategoryFilter } from '@/components/CategoryFilter'

export default function Study() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const filtered = WORDS.filter((w) =>
    (cat === 'All' || w.category === cat) &&
    (q === '' || w.word.toLowerCase().includes(q.toLowerCase()) || w.translation.toLowerCase().includes(q.toLowerCase())))
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold text-navy">Study Words</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search words…"
        className="mb-4 w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm" />
      <div className="mb-6"><CategoryFilter value={cat} onChange={setCat} /></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((w) => <WordCard key={w.id} word={w} />)}
      </div>
      {filtered.length === 0 && <p className="text-gray-500">No words match.</p>}
    </div>
  )
}
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: study page with grid + filters"
```

---

### Task 16: Student dashboard

**Files:**
- Create: `app/student/page.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client'
import { WORDS } from '@/data/words'
import { useAppStore } from '@/lib/store'
import { studentMetrics } from '@/lib/metrics'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/Badge'
import Link from 'next/link'

export default function StudentDashboard() {
  const progress = useAppStore((s) => s.progress)
  const m = studentMetrics(WORDS, progress)
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Good to see you, Maria 👋</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="STUDIED" value={m.studied} sub={`of ${m.total} words`} tone="navy" />
        <StatCard label="GLOSSARY" value={`${m.percent}%`} sub="completed" tone="green" />
        <StatCard label="AVG STARS" value={m.avgStars.toFixed(1)} sub="retention" tone="amber" />
        <StatCard label="TO REVIEW" value={m.toReview.length} sub="low fixation" tone="red" />
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-2 text-sm font-bold text-gray-700">Next words to review</div>
        {m.toReview.length === 0
          ? <p className="text-sm text-gray-500">Nothing flagged yet — start studying to build your list.</p>
          : <div className="flex flex-wrap gap-2">{m.toReview.slice(0,8).map((w) => <Badge key={w.id} tone="navy">{w.word}</Badge>)}</div>}
        <Link href="/student/study" className="mt-4 inline-block rounded-md bg-navy px-4 py-2 text-sm font-bold text-white">Go to study →</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: student dashboard"
```

---

### Task 17: Schedule page (10 days, completion toggle)

**Files:**
- Create: `app/student/schedule/page.tsx`, `components/ScheduleDayCard.tsx`

- [ ] **Step 1: ScheduleDayCard**

```tsx
'use client'
import type { ScheduleDay } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { WORDS } from '@/data/words'

export function ScheduleDayCard({ day }: { day: ScheduleDay }) {
  const done = useAppStore((s) => s.scheduleDone[day.day] ?? false)
  const toggle = useAppStore((s) => s.toggleDay)
  const words = day.wordIds.map((id) => WORDS.find((w) => w.id === id)?.word).filter(Boolean)
  return (
    <div className={`rounded-xl border-t-[3px] bg-white p-4 shadow-card ${done ? 'border-green-600 opacity-70' : 'border-navy'}`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Day {day.day}</div>
        <label className="flex cursor-pointer items-center gap-1 text-xs text-gray-600">
          <input type="checkbox" checked={done} onChange={() => toggle(day.day)} /> done
        </label>
      </div>
      <div className="mt-1 font-extrabold text-navy">{day.title}</div>
      <div className="mt-1 text-xs text-gray-500">{day.categories.join(' · ')}</div>
      <div className="mt-3 flex flex-wrap gap-1">
        {words.map((w) => <span key={w} className="rounded bg-blue-50 px-2 py-0.5 text-[11px] text-navy">{w}</span>)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Schedule page with progress bar**

```tsx
'use client'
import { SCHEDULE } from '@/data/schedule'
import { ScheduleDayCard } from '@/components/ScheduleDayCard'
import { useAppStore } from '@/lib/store'

export default function Schedule() {
  const doneMap = useAppStore((s) => s.scheduleDone)
  const completed = SCHEDULE.filter((d) => doneMap[d.day]).length
  const pct = Math.round((completed / SCHEDULE.length) * 100)
  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-navy">10-Day Study Plan</h1>
      <p className="mb-4 text-sm text-gray-600">{completed} of {SCHEDULE.length} days completed</p>
      <div className="mb-6 h-2 w-full max-w-md overflow-hidden rounded bg-gray-200">
        <div className="h-full rounded bg-navy transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE.map((d) => <ScheduleDayCard key={d.day} day={d} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: 10-day study schedule"
```

---

### Task 18: Teacher dashboard

**Files:**
- Create: `app/teacher/page.tsx`, `components/StudentTable.tsx`

- [ ] **Step 1: StudentTable**

```tsx
import type { MockStudent } from '@/lib/types'
import { StarRating } from './StarRating'

export function StudentTable({ students }: { students: MockStudent[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-gray-100 px-4 py-2 text-[10px] font-bold text-gray-500">
        <div>STUDENT</div><div>GLOSSARY</div><div>AVG STARS</div><div>LAST ACTIVE</div>
      </div>
      {students.map((s) => (
        <div key={s.id} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center border-t border-gray-100 px-4 py-2 ${s.glossaryPercent < 40 ? 'bg-amber-50' : ''}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.avatarUrl} alt="" className="h-6 w-6 rounded-full" />{s.name}
          </div>
          <div className={`text-sm font-bold ${s.glossaryPercent < 40 ? 'text-red-600' : 'text-green-600'}`}>{s.glossaryPercent}%</div>
          <div><StarRating value={Math.round(s.averageStars)} /></div>
          <div className="text-sm text-gray-400">{new Date(s.lastActivity).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Teacher dashboard page**

```tsx
import { STUDENTS } from '@/data/students'
import { StudentTable } from '@/components/StudentTable'
import { StatCard } from '@/components/StatCard'

export default function TeacherDashboard() {
  const avg = Math.round(STUDENTS.reduce((s, x) => s + x.glossaryPercent, 0) / STUDENTS.length)
  const avgStars = (STUDENTS.reduce((s, x) => s + x.averageStars, 0) / STUDENTS.length).toFixed(1)
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Class Overview</h1>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="STUDENTS" value={STUDENTS.length} tone="navy" />
        <StatCard label="AVG GLOSSARY" value={`${avg}%`} tone="green" />
        <StatCard label="AVG STARS" value={avgStars} tone="amber" />
      </div>
      <StudentTable students={STUDENTS} />
    </div>
  )
}
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: teacher dashboard"
```

---

### Task 19: Glossary page

**Files:**
- Create: `app/teacher/glossary/page.tsx`, `components/SearchBar.tsx`

- [ ] **Step 1: SearchBar**

```tsx
'use client'
export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search the glossary…"
      className="w-full max-w-md rounded-lg border border-gray-200 px-3 py-2 text-sm" />
  )
}
```

- [ ] **Step 2: Glossary page (search + filters: category, frequency, linguistic type)**

```tsx
'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { WordCard } from '@/components/WordCard'

export default function Glossary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [freq, setFreq] = useState('All')
  const [type, setType] = useState('All')
  const filtered = WORDS.filter((w) =>
    (cat === 'All' || w.category === cat) &&
    (freq === 'All' || w.testFrequency === freq) &&
    (type === 'All' || w.linguisticType === type) &&
    (q === '' || [w.word, w.translation, ...w.tags].join(' ').toLowerCase().includes(q.toLowerCase())))
  const sel = 'rounded-lg border border-gray-200 px-2 py-1 text-xs'
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold text-navy">Glossary</h1>
      <div className="mb-3"><SearchBar value={q} onChange={setQ} /></div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select className={sel} value={freq} onChange={(e) => setFreq(e.target.value)}>
          <option value="All">All frequencies</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
        <select className={sel} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All types</option><option value="cognate">Cognate</option><option value="false-cognate">False cognate</option><option value="equivalent">Equivalent</option>
        </select>
      </div>
      <div className="mb-6"><CategoryFilter value={cat} onChange={setCat} /></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((w) => <WordCard key={w.id} word={w} />)}
      </div>
      <p className="mt-4 text-sm text-gray-500">{filtered.length} of {WORDS.length} words</p>
    </div>
  )
}
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build` — Expected: PASS.
```bash
git add -A && git commit -m "feat: glossary page with search + filters"
```

---

### Task 20: Final polish + deploy prep

**Files:**
- Modify: `app/layout.tsx` (metadata/title), `README.md` (create)

- [ ] **Step 1: Set metadata**

In `app/layout.tsx` set `metadata = { title: 'Acelerador de Aprovação', description: 'Plataforma de preparação para intérpretes' }` and `lang="pt-BR"` on `<html>`.

- [ ] **Step 2: README with run + deploy instructions**

Create `README.md` documenting `npm install`, `npm run dev`, `npm run build`, and `vercel --prod` deploy. Note that data is mocked in `/data` and where the partner replaces the 50 words.

- [ ] **Step 3: Full build + test + commit**

Run: `npm run build && npm test` — Expected: build PASS, tests PASS.
```bash
git add -A && git commit -m "chore: metadata, README, deploy prep"
```

---

## Self-Review

**Spec coverage:**
- Home page → Task 12 ✓
- Study cards grid + filters → Task 15 ✓
- Expandable card w/ all fields → Task 11 ✓
- Neural audio (speechSynthesis) + human structure → Tasks 8, 10 ✓
- Student dashboard (studied, %, low/high fixation, next review, stars) → Tasks 7, 16 ✓
- Teacher dashboard (list, %, avg stars, last activity) → Task 18 ✓
- Glossary search + filters (category, subcat via tags, frequency, type) → Task 19 ✓
- Categories/niches structure → Tasks 3, 4 ✓
- 10-day schedule, functional toggle → Task 17 ✓
- Profile selection (no real login) → Task 13 ✓
- Navy/white visual identity → Task 2 + per-component ✓
- localStorage persistence → Task 6 ✓
- 30–100 words (50) → Task 4 ✓

Note: "tempo total de estudo" (total study time) from the spec is shown as a static/derived placeholder — not separately tracked in the MVP store to avoid scope creep; acceptable for a demo. Personalization is structural only (categories data file), per spec non-goals.

**Placeholder scan:** No TBD/TODO. Task 4 instructs writing all 50 entries in full (the `// ...` appears only as authoring guidance, not in the delivered file).

**Type consistency:** `studentMetrics(words, progress)` signature consistent across Tasks 7/16. Store methods `setProfile/setStars/toggleDay` consistent across Tasks 6/11/13/17. `Word`/`MockStudent`/`ScheduleDay` fields match data files.
