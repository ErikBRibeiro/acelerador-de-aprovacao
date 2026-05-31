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
  it('lists high-fixation words (>=4 stars)', () => {
    const m = studentMetrics(words, progress)
    expect(m.highFixation.map((w) => w.id)).toEqual(['a'])
  })
  it('handles empty progress', () => {
    const m = studentMetrics(words, {})
    expect(m.studied).toBe(0)
    expect(m.avgStars).toBe(0)
    expect(m.percent).toBe(0)
  })
})
