'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { WordCard } from '@/components/WordCard'
import { wordCategories } from '@/lib/words-utils'

export default function Glossary() {
  const [q, setQ] = useState('')
  const [cats, setCats] = useState<string[]>([])
  const [freq, setFreq] = useState('All')
  const [type, setType] = useState('All')

  const toggle = (c: string) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const filtered = WORDS.filter((w) => {
    const wCats = wordCategories(w)
    // AND across selected categories: include a word only if it matches ALL selected filters
    const catMatch = cats.length === 0 || cats.every((c) => wCats.includes(c))
    const freqMatch = freq === 'All' || w.testFrequency === freq
    const typeMatch = type === 'All' || w.linguisticType === type
    const text = [w.word, w.translation, ...w.tags].join(' ').toLowerCase()
    const qMatch = q === '' || text.includes(q.toLowerCase())
    return catMatch && freqMatch && typeMatch && qMatch
  })

  const sel = 'rounded-lg border border-gray-200 px-2 py-1 text-xs'
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold text-navy">Glossary</h1>
      <div className="mb-3">
        <SearchBar value={q} onChange={setQ} />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select className={sel} value={freq} onChange={(e) => setFreq(e.target.value)}>
          <option value="All">All frequencies</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className={sel} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All types</option>
          <option value="cognate">Cognate</option>
          <option value="false-cognate">False cognate</option>
          <option value="equivalent">Equivalent</option>
        </select>
      </div>
      <div className="mb-6">
        <CategoryFilter selected={cats} onToggle={toggle} onClear={() => setCats([])} />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((w) => (
          <WordCard key={w.id} word={w} />
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        {filtered.length} of {WORDS.length} words
      </p>
    </div>
  )
}
