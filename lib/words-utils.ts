import type { Word } from '@/lib/types'

/** All categories a word belongs to (primary + any extras), de-duplicated. */
export function wordCategories(w: Word): string[] {
  const all = [w.category, ...(w.categories ?? [])]
  return Array.from(new Set(all))
}

/** All example sentences for a word: the primary one plus any extras. */
export function wordExamples(w: Word): { en: string; pt: string }[] {
  return [{ en: w.exampleEN, pt: w.examplePT }, ...(w.extraExamples ?? [])]
}

export interface FacetFilters {
  /** Selected categories. A word can belong to several, so ALL must match (AND). */
  cats: string[]
  /** Selected linguistic phenomena ('cognate' | 'false-cognate' | 'equivalent'). */
  phenomena: string[]
  /** Selected fixation levels, as star counts in string form ('1'..'5'). */
  fixations: string[]
  /** Selected agency, or null for any (single-select). */
  agency: string | null
  /** Test frequency: 'All' (or undefined) for any, otherwise an exact value. */
  freq?: string
}

/**
 * Whether a word passes the faceted filters. Categories use AND (a word may have
 * several); the single-valued attributes (phenomenon, fixation, agency, freq)
 * match when the word's value is among the selected set. Different facets are
 * combined with AND.
 */
export function matchesFacets(w: Word, stars: number, f: FacetFilters): boolean {
  const wCats = wordCategories(w)
  const catMatch = f.cats.length === 0 || f.cats.every((c) => wCats.includes(c))
  const phenMatch = f.phenomena.length === 0 || f.phenomena.includes(w.linguisticType)
  const fixMatch = f.fixations.length === 0 || f.fixations.includes(String(stars))
  const agencyMatch = !f.agency || w.agency === f.agency
  const freqMatch = !f.freq || f.freq === 'All' || w.testFrequency === f.freq
  return catMatch && phenMatch && fixMatch && agencyMatch && freqMatch
}
