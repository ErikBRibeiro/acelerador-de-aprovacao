import type { Word, StudentProgress } from '@/lib/types'
import { wordCategories } from '@/lib/words-utils'

/** A category paired with how many of its words fall into a fixation bucket. */
export interface CategoryFixation {
  category: string
  count: number
}

export interface StudentMetrics {
  studied: number
  total: number
  percent: number
  avgStars: number
  toReview: Word[]
  highFixation: Word[]
  /** Categories ranked by how many of their words the student rates 4★+ (desc). */
  highFixationCategories: CategoryFixation[]
  /** Categories ranked by how many of their words the student rates ≤2★ (desc). */
  lowFixationCategories: CategoryFixation[]
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

  // Per-category counts of mastered (4★+) and struggling (≤2★) words. A word can
  // belong to several categories, so it counts toward each one it belongs to.
  const high = new Map<string, number>()
  const low = new Map<string, number>()
  for (const p of entries) {
    const w = byId.get(p.wordId)
    if (!w) continue
    const bucket = p.stars >= 4 ? high : p.stars <= 2 ? low : null
    if (!bucket) continue
    for (const c of wordCategories(w)) bucket.set(c, (bucket.get(c) ?? 0) + 1)
  }
  const rank = (m: Map<string, number>): CategoryFixation[] =>
    Array.from(m, ([category, count]) => ({ category, count }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count || String(a.category).localeCompare(String(b.category)))

  return {
    studied,
    total,
    percent,
    avgStars,
    toReview,
    highFixation,
    highFixationCategories: rank(high),
    lowFixationCategories: rank(low),
  }
}
