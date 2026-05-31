'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StudentProgress } from '@/lib/types'

type Profile = 'student' | 'teacher' | null

interface AppState {
  profile: Profile
  progress: Record<string, StudentProgress>
  scheduleDone: Record<number, boolean>
  setProfile: (p: Profile) => void
  setStars: (wordId: string, stars: 1 | 2 | 3 | 4 | 5) => void
  toggleDay: (day: number) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      progress: {},
      scheduleDone: {},
      setProfile: (profile) => set({ profile }),
      setStars: (wordId, stars) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [wordId]: {
              wordId,
              stars,
              lastReviewed: new Date().toISOString(),
              reviewCount: (s.progress[wordId]?.reviewCount ?? 0) + 1,
            },
          },
        })),
      toggleDay: (day) =>
        set((s) => ({
          scheduleDone: { ...s.scheduleDone, [day]: !s.scheduleDone[day] },
        })),
      reset: () => set({ progress: {}, scheduleDone: {} }),
    }),
    { name: 'acelerador-state' },
  ),
)
