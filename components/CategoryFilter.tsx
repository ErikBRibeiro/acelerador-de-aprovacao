'use client'
import { CATEGORIES } from '@/data/categories'

export function CategoryFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const all = ['All', ...CATEGORIES]
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            value === c
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-gray-600 border-gray-200 hover:border-navy'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
