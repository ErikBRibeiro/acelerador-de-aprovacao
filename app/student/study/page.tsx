'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { WordCard } from '@/components/WordCard'
import { CategoryFilter } from '@/components/CategoryFilter'

export default function Study() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const filtered = WORDS.filter(
    (w) =>
      (cat === 'All' || w.category === cat) &&
      (q === '' ||
        w.word.toLowerCase().includes(q.toLowerCase()) ||
        w.translation.toLowerCase().includes(q.toLowerCase())),
  )
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
        <CategoryFilter value={cat} onChange={setCat} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((w) => (
          <WordCard key={w.id} word={w} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-gray-500">No words match.</p>}
    </div>
  )
}
