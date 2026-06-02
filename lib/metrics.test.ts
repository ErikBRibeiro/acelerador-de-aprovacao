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

describe('studentMetrics — category fixation', () => {
  const catWords = [
    { id: 'a', category: 'Banking' },
    { id: 'b', category: 'Banking' },
    { id: 'c', category: 'Medical', categories: ['Banking'] },
    { id: 'd', category: 'Medical' },
    { id: 'e', category: 'Basics' },
  ] as Word[]
  const prog: Record<string, StudentProgress> = {
    a: { wordId: 'a', stars: 5, lastReviewed: '', reviewCount: 1 },
    b: { wordId: 'b', stars: 4, lastReviewed: '', reviewCount: 1 },
    c: { wordId: 'c', stars: 2, lastReviewed: '', reviewCount: 1 },
    d: { wordId: 'd', stars: 1, lastReviewed: '', reviewCount: 1 },
    e: { wordId: 'e', stars: 3, lastReviewed: '', reviewCount: 1 },
  }

  it('ranks categories by # of 4★+ words (desc)', () => {
    const m = studentMetrics(catWords, prog)
    expect(m.highFixationCategories).toEqual([{ category: 'Banking', count: 2 }])
  })

  it('ranks categories by # of ≤2★ words, counting a word in each of its categories', () => {
    const m = studentMetrics(catWords, prog)
    // c (2★) is Medical+Banking, d (1★) is Medical → Medical:2, Banking:1
    expect(m.lowFixationCategories).toEqual([
      { category: 'Medical', count: 2 },
      { category: 'Banking', count: 1 },
    ])
  })

  it('omits categories with no words in the bucket and ignores 3★ (neutral)', () => {
    const m = studentMetrics(catWords, prog)
    const highCats = m.highFixationCategories.map((c) => c.category)
    const lowCats = m.lowFixationCategories.map((c) => c.category)
    expect(highCats).not.toContain('Medical')
    expect(highCats).not.toContain('Basics') // only 3★, neutral
    expect(lowCats).not.toContain('Basics')
  })
})
