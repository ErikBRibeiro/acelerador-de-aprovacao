'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { WordCard } from '@/components/WordCard'
import { useAppStore } from '@/lib/store'
import { seededStars } from '@/lib/seed'
import { matchesFacets } from '@/lib/words-utils'

export default function Glossary() {
  const [q, setQ] = useState('')
  const [cats, setCats] = useState<string[]>([])
  const [phenomena, setPhenomena] = useState<string[]>([])
  const [fixations, setFixations] = useState<string[]>([])
  const [agency, setAgency] = useState<string | null>(null)
  const [freq, setFreq] = useState('All')
  const progress = useAppStore((s) => s.progress)

  const filtered = WORDS.filter((w) => {
    const stars = progress[w.id]?.stars ?? seededStars(w.id)
    const text = [w.word, w.translation, ...w.tags].join(' ').toLowerCase()
    const qMatch = q === '' || text.includes(q.toLowerCase())
    return matchesFacets(w, stars, { cats, phenomena, fixations, agency, freq }) && qMatch
  })

  const sel = 'rounded-lg border border-gray-200 px-2 py-1 text-xs'
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold text-navy">Glossary</h1>
      <div className="mb-3">
        <SearchBar value={q} onChange={setQ} />
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterBar
          cats={cats}
          setCats={setCats}
          phenomena={phenomena}
          setPhenomena={setPhenomena}
          fixations={fixations}
          setFixations={setFixations}
          agency={agency}
          setAgency={setAgency}
          extraActive={q !== '' || freq !== 'All'}
          onClearExtra={() => {
            setQ('')
            setFreq('All')
          }}
        />
        <select className={sel} value={freq} onChange={(e) => setFreq(e.target.value)}>
          <option value="All">All frequencies</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
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
