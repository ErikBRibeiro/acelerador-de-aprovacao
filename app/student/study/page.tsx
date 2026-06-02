'use client'
import { useState } from 'react'
import { WORDS } from '@/data/words'
import { WordCard } from '@/components/WordCard'
import { FilterBar } from '@/components/FilterBar'
import { useAppStore } from '@/lib/store'
import { seededStars } from '@/lib/seed'
import { matchesFacets } from '@/lib/words-utils'

export default function Study() {
  const [cats, setCats] = useState<string[]>([])
  const [phenomena, setPhenomena] = useState<string[]>([])
  const [fixations, setFixations] = useState<string[]>([])
  const [agency, setAgency] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const progress = useAppStore((s) => s.progress)

  const filtered = WORDS.filter((w) => {
    const stars = progress[w.id]?.stars ?? seededStars(w.id)
    const text = `${w.word} ${w.translation}`.toLowerCase()
    const qMatch = q === '' || text.includes(q.toLowerCase())
    return matchesFacets(w, stars, { cats, phenomena, fixations, agency }) && qMatch
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
        <FilterBar
          cats={cats}
          setCats={setCats}
          phenomena={phenomena}
          setPhenomena={setPhenomena}
          fixations={fixations}
          setFixations={setFixations}
          agency={agency}
          setAgency={setAgency}
          extraActive={q !== ''}
          onClearExtra={() => setQ('')}
        />
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
