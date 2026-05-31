'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

/**
 * Seeds initial student performance (star ratings) on first load so the demo
 * never shows empty cards. Does nothing if the student already has progress.
 */
export function SeedProgress() {
  const seedIfEmpty = useAppStore((s) => s.seedIfEmpty)
  useEffect(() => {
    seedIfEmpty()
  }, [seedIfEmpty])
  return null
}
