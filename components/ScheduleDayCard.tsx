'use client'
import type { ScheduleDay } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { WORDS } from '@/data/words'

export function ScheduleDayCard({ day }: { day: ScheduleDay }) {
  const done = useAppStore((s) => s.scheduleDone[day.day] ?? false)
  const toggle = useAppStore((s) => s.toggleDay)
  const words = day.wordIds
    .map((id) => WORDS.find((w) => w.id === id)?.word)
    .filter((w): w is string => Boolean(w))
  return (
    <div
      className={`rounded-xl border-t-[3px] bg-white p-4 shadow-card ${
        done ? 'border-green-600 opacity-70' : 'border-navy'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
          Day {day.day}
        </div>
        <label className="flex cursor-pointer items-center gap-1 text-xs text-gray-600">
          <input type="checkbox" checked={done} onChange={() => toggle(day.day)} /> done
        </label>
      </div>
      <div className="mt-1 font-extrabold text-navy">{day.title}</div>
      <div className="mt-1 text-xs text-gray-500">{day.categories.join(' · ')}</div>
      <div className="mt-3 flex flex-wrap gap-1">
        {words.map((w) => (
          <span key={w} className="rounded bg-blue-50 px-2 py-0.5 text-[11px] text-navy">
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
