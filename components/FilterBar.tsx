'use client'
import type { Dispatch, SetStateAction } from 'react'
import { CATEGORIES } from '@/data/categories'
import { AGENCIES } from '@/data/agencies'
import { FilterDropdown, type FilterOption } from './FilterDropdown'

const PHENOMENA: FilterOption[] = [
  { value: 'cognate', label: 'cognato' },
  { value: 'false-cognate', label: 'falso cognato' },
  { value: 'equivalent', label: 'equivalente' },
]

const FIXATIONS: FilterOption[] = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: '★'.repeat(n),
}))

const toOptions = (values: readonly string[]): FilterOption[] =>
  values.map((v) => ({ value: v, label: v }))

const toggleIn =
  (set: Dispatch<SetStateAction<string[]>>) =>
  (value: string) =>
    set((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]))

export function FilterBar({
  cats,
  setCats,
  phenomena,
  setPhenomena,
  fixations,
  setFixations,
  agency,
  setAgency,
  extraActive = false,
  onClearExtra,
}: {
  cats: string[]
  setCats: Dispatch<SetStateAction<string[]>>
  phenomena: string[]
  setPhenomena: Dispatch<SetStateAction<string[]>>
  fixations: string[]
  setFixations: Dispatch<SetStateAction<string[]>>
  agency: string | null
  setAgency: Dispatch<SetStateAction<string | null>>
  /** Whether non-facet filters owned by the page (search, frequency) are active. */
  extraActive?: boolean
  /** Resets those page-owned filters, so "Limpar" returns the full default view. */
  onClearExtra?: () => void
}) {
  const anyActive =
    cats.length > 0 ||
    phenomena.length > 0 ||
    fixations.length > 0 ||
    agency !== null ||
    extraActive

  const clearAll = () => {
    setCats([])
    setPhenomena([])
    setFixations([])
    setAgency(null)
    onClearExtra?.()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterDropdown
        label="Tipo"
        options={toOptions(CATEGORIES)}
        selected={cats}
        onToggle={toggleIn(setCats)}
        onClear={() => setCats([])}
      />
      <FilterDropdown
        label="Fenômeno"
        options={PHENOMENA}
        selected={phenomena}
        onToggle={toggleIn(setPhenomena)}
        onClear={() => setPhenomena([])}
      />
      <FilterDropdown
        label="Fixação"
        options={FIXATIONS}
        selected={fixations}
        onToggle={toggleIn(setFixations)}
        onClear={() => setFixations([])}
      />
      <FilterDropdown
        label="Agências"
        options={toOptions(AGENCIES)}
        selected={agency ? [agency] : []}
        onToggle={(value) => setAgency((prev) => (prev === value ? null : value))}
        onClear={() => setAgency(null)}
        single
      />
      {anyActive && (
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full px-3 py-1 text-xs font-semibold text-gray-500 hover:text-red-600"
        >
          ✕ Limpar filtros
        </button>
      )}
    </div>
  )
}
