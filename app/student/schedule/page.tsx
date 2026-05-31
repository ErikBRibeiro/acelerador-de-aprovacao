'use client'
import { SCHEDULE } from '@/data/schedule'
import { ScheduleDayCard } from '@/components/ScheduleDayCard'
import { useAppStore } from '@/lib/store'

export default function Schedule() {
  const doneMap = useAppStore((s) => s.scheduleDone)
  const completed = SCHEDULE.filter((d) => doneMap[d.day]).length
  const pct = Math.round((completed / SCHEDULE.length) * 100)
  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-navy">10-Day Study Plan</h1>
      <p className="mb-4 text-sm text-gray-600">
        {completed} of {SCHEDULE.length} days completed
      </p>
      <div className="mb-6 h-2 w-full max-w-md overflow-hidden rounded bg-gray-200">
        <div className="h-full rounded bg-navy transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE.map((d) => (
          <ScheduleDayCard key={d.day} day={d} />
        ))}
      </div>
    </div>
  )
}
