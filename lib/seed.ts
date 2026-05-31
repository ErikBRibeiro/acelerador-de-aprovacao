import { WORDS } from '@/data/words'
import type { StudentProgress } from '@/lib/types'

// Deterministic 1–5 stars per word id, so the demo looks the same on every load
// (no hydration mismatch) while still varying nicely across words.
export function seededStars(id: string): 1 | 2 | 3 | 4 | 5 {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return ((h % 5) + 1) as 1 | 2 | 3 | 4 | 5
}

// Initial student performance for the demo: every word gets a star rating and a
// recent "last reviewed" date, spread out over the past few weeks.
export function seedProgress(): Record<string, StudentProgress> {
  const now = Date.now()
  const out: Record<string, StudentProgress> = {}
  WORDS.forEach((w, i) => {
    out[w.id] = {
      wordId: w.id,
      stars: seededStars(w.id),
      lastReviewed: new Date(now - i * 36 * 60 * 60 * 1000).toISOString(),
      reviewCount: 1 + (i % 4),
    }
  })
  return out
}
