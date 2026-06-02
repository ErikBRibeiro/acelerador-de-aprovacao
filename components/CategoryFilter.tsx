'use client'
import { useEffect, useRef, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = selected.length

  // Close when clicking outside the dropdown.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
          count > 0
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-gray-600 border-gray-200 hover:border-navy'
        }`}
      >
        Tipo
        {count > 0 && (
          <span className="rounded-full bg-white/25 px-1.5 text-[10px]">{count}</span>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path
            d="M2 4l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClear}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                count === 0
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
                  type="button"
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
        </div>
      )}
    </div>
  )
}
