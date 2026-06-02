'use client'
import { useEffect, useRef, useState } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
  single = false,
  allLabel = 'All',
}: {
  label: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  /** Single-select: picking an option closes the panel. */
  single?: boolean
  allLabel?: string
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

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold ${
      active
        ? 'bg-navy text-white border-navy'
        : 'bg-white text-gray-600 border-gray-200 hover:border-navy'
    }`

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 ${pill(count > 0)}`}
      >
        {label}
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
            <button type="button" onClick={onClear} className={pill(count === 0)}>
              {allLabel}
            </button>
            {options.map((o) => {
              const active = selected.includes(o.value)
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onToggle(o.value)
                    if (single) setOpen(false)
                  }}
                  aria-pressed={active}
                  className={pill(active)}
                >
                  {active ? '✓ ' : ''}
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
