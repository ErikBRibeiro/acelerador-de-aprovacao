'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { WordCard } from '@/components/WordCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { wordCategories } from '@/lib/words-utils'

export default function Study() {
  const [cats, setCats] = useState<string[]>([])
  const [q, setQ] = useState('')

  const toggle = (c: string) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const filtered = WORDS.filter((w) => {
    const wCats = wordCategories(w)
    // AND across selected categories: include a word only if it matches ALL selected filters
    const catMatch = cats.length === 0 || cats.every((c) => wCats.includes(c))
    const text = `${w.word} ${w.translation}`.toLowerCase()
    const qMatch = q === '' || text.includes(q.toLowerCase())
    return catMatch && qMatch
  })

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold text-navy">Study Words</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search words…"
        className="mb-4 w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <div className="mb-6">
        <CategoryFilter selected={cats} onToggle={toggle} onClear={() => setCats([])} />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((w) => (
          <WordCard key={w.id} word={w} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-gray-500">No words match.</p>}
      <p className="mt-4 text-sm text-gray-500">
        {filtered.length} of {WORDS.length} words
      </p>
    </div>
  )
}
