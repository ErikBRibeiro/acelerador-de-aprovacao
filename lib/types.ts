export type LinguisticType = 'cognate' | 'false-cognate' | 'equivalent'
export type TestFrequency = 'high' | 'medium' | 'low'

export interface ExampleSentence {
  en: string
  pt: string
}

export interface Word {
  id: string
  word: string
  translation: string
  definition: string
  exampleEN: string
  examplePT: string
  /** Primary category (used as the main display label). */
  category: string
  /** Optional full list of categories this word belongs to (for cross-category
   *  filtering). When absent, the word belongs only to `category`. */
  categories?: string[]
  subcategory: string
  imageUrl: string
  audioHumanUrl: string
  linguisticType: LinguisticType
  testFrequency: TestFrequency
  tags: string[]
  /** Additional example sentences shown in the expanded card. */
  extraExamples?: ExampleSentence[]
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
