import { describe, it, expect } from 'vitest'
import { matchesFacets, type FacetFilters } from '@/lib/words-utils'
import { WORDS } from '@/data/words'
import { AGENCIES } from '@/data/agencies'
import type { Word } from '@/lib/types'

const NONE: FacetFilters = { cats: [], phenomena: [], fixations: [], agency: null }

const mk = (over: Partial<Word>): Word => ({
  id: 'x',
  word: 'w',
  translation: 't',
  definition: '',
  definitionPT: '',
  exampleEN: '',
  examplePT: '',
  category: 'Basics',
  subcategory: '',
  imageUrl: '',
  audioHumanUrl: '',
  linguisticType: 'cognate',
  testFrequency: 'high',
  agency: 'TransPerfect',
  tags: [],
  ...over,
})

describe('matchesFacets', () => {
  it('matches every word when no facet is selected', () => {
    expect(matchesFacets(mk({}), 3, NONE)).toBe(true)
  })

  describe('categories (Tipo) use AND', () => {
    const both = mk({ category: 'Emergency & 911', categories: ['Medical & Clinics'] })
    const single = mk({ category: 'Emergency & 911' })

    it('requires the word to have ALL selected categories', () => {
      const f = { ...NONE, cats: ['Emergency & 911', 'Medical & Clinics'] }
      expect(matchesFacets(both, 3, f)).toBe(true)
      expect(matchesFacets(single, 3, f)).toBe(false)
    })

    it('matches with a single selected category', () => {
      const f = { ...NONE, cats: ['Emergency & 911'] }
      expect(matchesFacets(both, 3, f)).toBe(true)
      expect(matchesFacets(single, 3, f)).toBe(true)
    })
  })

  describe('phenomenon (Fenômeno) is membership / OR across selection', () => {
    const f = { ...NONE, phenomena: ['cognate', 'false-cognate'] }
    it('matches a word whose type is any of the selected', () => {
      expect(matchesFacets(mk({ linguisticType: 'cognate' }), 3, f)).toBe(true)
      expect(matchesFacets(mk({ linguisticType: 'false-cognate' }), 3, f)).toBe(true)
    })
    it('excludes a word whose type is not selected', () => {
      expect(matchesFacets(mk({ linguisticType: 'equivalent' }), 3, f)).toBe(false)
    })
  })

  describe('fixation (Fixação) matches by star count', () => {
    it('matches when the star count is among the selected', () => {
      const f = { ...NONE, fixations: ['3', '5'] }
      expect(matchesFacets(mk({}), 3, f)).toBe(true)
      expect(matchesFacets(mk({}), 5, f)).toBe(true)
      expect(matchesFacets(mk({}), 4, f)).toBe(false)
    })
  })

  describe('agency (Agências) is single-select equality', () => {
    const f = { ...NONE, agency: 'Pangeanic' }
    it('matches only the selected agency', () => {
      expect(matchesFacets(mk({ agency: 'Pangeanic' }), 3, f)).toBe(true)
      expect(matchesFacets(mk({ agency: 'TransPerfect' }), 3, f)).toBe(false)
    })
  })

  describe('frequency filter', () => {
    it('matches exact frequency, and "All" matches any', () => {
      expect(matchesFacets(mk({ testFrequency: 'high' }), 3, { ...NONE, freq: 'high' })).toBe(true)
      expect(matchesFacets(mk({ testFrequency: 'low' }), 3, { ...NONE, freq: 'high' })).toBe(false)
      expect(matchesFacets(mk({ testFrequency: 'low' }), 3, { ...NONE, freq: 'All' })).toBe(true)
    })
  })

  it('combines different facets with AND', () => {
    const f: FacetFilters = {
      cats: ['Basics'],
      phenomena: ['cognate'],
      fixations: ['5'],
      agency: 'TransPerfect',
    }
    const ok = mk({ category: 'Basics', linguisticType: 'cognate', agency: 'TransPerfect' })
    expect(matchesFacets(ok, 5, f)).toBe(true)
    expect(matchesFacets(ok, 4, f)).toBe(false) // wrong fixation
    expect(matchesFacets(mk({ ...ok, agency: 'Pangeanic' }), 5, f)).toBe(false) // wrong agency
  })
})

describe('WORDS dataset has agencies for testing', () => {
  it('assigns a known agency to every word', () => {
    expect(WORDS.every((w) => AGENCIES.includes(w.agency))).toBe(true)
  })

  it('spreads all four agencies across the dataset (round-robin)', () => {
    const counts = AGENCIES.map(
      (a) => WORDS.filter((w) => matchesFacets(w, 5, { ...NONE, agency: a })).length,
    )
    expect(counts.reduce((s, n) => s + n, 0)).toBe(WORDS.length)
    // every agency is represented, and counts are balanced (round-robin over 50)
    expect(Math.min(...counts)).toBeGreaterThan(0)
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1)
  })
})
