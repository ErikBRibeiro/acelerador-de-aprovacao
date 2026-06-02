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
