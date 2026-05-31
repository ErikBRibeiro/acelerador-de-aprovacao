'use client'
import Link from 'next/link'
import { WORDS } from '@/data/words'
import { useAppStore } from '@/lib/store'
import { studentMetrics } from '@/lib/metrics'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/Badge'

export default function StudentDashboard() {
  const progress = useAppStore((s) => s.progress)
  const m = studentMetrics(WORDS, progress)
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Good to see you, Maria 👋</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="STUDIED" value={m.studied} sub={`of ${m.total} words`} tone="navy" />
        <StatCard label="GLOSSARY" value={`${m.percent}%`} sub="completed" tone="green" />
        <StatCard label="AVG STARS" value={m.avgStars.toFixed(1)} sub="retention" tone="amber" />
        <StatCard label="TO REVIEW" value={m.toReview.length} sub="low fixation" tone="red" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm font-bold text-gray-700">Next words to review</div>
          {m.toReview.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nothing flagged yet — start studying to build your list.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {m.toReview.slice(0, 8).map((w) => (
                <Badge key={w.id} tone="navy">
                  {w.word}
                </Badge>
              ))}
            </div>
          )}
          <Link
            href="/student/study"
            className="mt-4 inline-block rounded-md bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-950"
          >
            Go to study →
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm font-bold text-gray-700">High fixation</div>
          {m.highFixation.length === 0 ? (
            <p className="text-sm text-gray-500">
              No mastered words yet — rate words 4–5 stars as you learn them.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {m.highFixation.slice(0, 8).map((w) => (
                <Badge key={w.id} tone="green">
                  {w.word}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
