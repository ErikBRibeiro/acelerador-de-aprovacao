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
        <StatCard label="GLOSSARY" value={`${m.percent}%`} sub="completed" tone="green" progress={m.percent} />
        <StatCard label="AVG STARS" value={m.avgStars.toFixed(1)} sub="retention" tone="amber" />
        <StatCard label="TO REVIEW" value={m.toReview.length} sub="low fixation" tone="red" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-bold text-red-600">Low fixation</div>
          <div className="mb-3 text-xs text-gray-400">
            Categories with the most words you rated ≤2★
          </div>
          {m.lowFixationCategories.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nothing flagged yet — start studying to build your list.
            </p>
          ) : (
            <ul className="space-y-2">
              {m.lowFixationCategories.slice(0, 3).map((c) => (
                <li key={c.category} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-gray-700">{c.category}</span>
                  <Badge tone="red">
                    {c.count} {c.count === 1 ? 'word' : 'words'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/student/study"
            className="mt-4 inline-block rounded-md bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-950"
          >
            Go to study →
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-bold text-gray-700">High fixation</div>
          <div className="mb-3 text-xs text-gray-400">
            Categories with the most words you rated 4★+
          </div>
          {m.highFixationCategories.length === 0 ? (
            <p className="text-sm text-gray-500">
              No mastered words yet — rate words 4–5 stars as you learn them.
            </p>
          ) : (
            <ul className="space-y-2">
              {m.highFixationCategories.slice(0, 3).map((c) => (
                <li key={c.category} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-gray-700">{c.category}</span>
                  <Badge tone="green">
                    {c.count} {c.count === 1 ? 'word' : 'words'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
