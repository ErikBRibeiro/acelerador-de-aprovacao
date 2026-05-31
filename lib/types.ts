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
