'use client'
import { CATEGORIES } from '@/data/categories'

export function CategoryFilter({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[]
  onToggle: (c: string) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onClear}
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          selected.length === 0
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-gray-600 border-gray-200 hover:border-navy'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((c) => {
        const active = selected.includes(c)
        return (
          <button
            key={c}
            onClick={() => onToggle(c)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              active
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-600 border-gray-200 hover:border-navy'
            }`}
          >
            {active ? '✓ ' : ''}
            {c}
          </button>
        )
      })}
    </div>
  )
}
