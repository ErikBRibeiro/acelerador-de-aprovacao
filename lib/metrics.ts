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
