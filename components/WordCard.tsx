'use client'
import { useState } from 'react'
import type { Word } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { StarRating } from './StarRating'
import { Badge } from './Badge'
import { AudioButtons } from './AudioButtons'

const freqTone = { high: 'navy', medium: 'amber', low: 'gray' } as const
const typeLabel = {
  cognate: 'cognate',
  'false-cognate': 'false cognate',
  equivalent: 'equivalent',
} as const

export function WordCard({ word }: { word: Word }) {
  const [expanded, setExpanded] = useState(false)
  const stars = useAppStore((s) => s.progress[word.id]?.stars ?? 0)
  const lastReviewed = useAppStore((s) => s.progress[word.id]?.lastReviewed)
  const setStars = useAppStore((s) => s.setStars)
  const danger = stars > 0 && stars <= 2
  return (
    <div
      className={`rounded-xl bg-white border-t-[3px] ${
        danger ? 'border-red-600' : 'border-navy'
      } ${expanded ? 'shadow-cardLg' : 'shadow-card'} transition-shadow`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((x) => !x)
          }
        }}
        className="w-full cursor-pointer text-left p-4"
      >
        <div className="text-[9px] font-bold tracking-wider text-gray-500 uppercase">
          {word.category}
        </div>
        <div className="text-lg font-extrabold text-navy">{word.word}</div>
        <div className="text-sm font-medium text-gray-700 mb-2">{word.translation}</div>
        <div className="flex items-center justify-between">
          <StarRating value={stars} />
          <Badge tone={freqTone[word.testFrequency]}>{word.testFrequency.toUpperCase()}</Badge>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-100">
          {word.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={word.imageUrl}
              alt={word.word}
              className="h-32 w-full object-cover"
            />
          )}
          <div className="p-4 border-b border-gray-100">
            <div className="text-[10px] font-semibold tracking-wide text-gray-500">DEFINITION</div>
            <p className="text-sm text-gray-700">{word.definition}</p>
          </div>
          <div className="p-4 border-b border-gray-100 bg-[#fafbff]">
            <div className="text-[10px] font-semibold tracking-wide text-gray-500">EXAMPLE</div>
            <p className="text-sm italic text-navy">&ldquo;{word.exampleEN}&rdquo;</p>
            <p className="text-xs text-gray-500">&ldquo;{word.examplePT}&rdquo;</p>
          </div>
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
            <Badge tone="green">{typeLabel[word.linguisticType]}</Badge>
            <Badge tone="gray">{word.subcategory}</Badge>
            {word.tags.map((t) => (
              <Badge key={t} tone="gray">
                #{t}
              </Badge>
            ))}
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <div className="text-[10px] font-semibold tracking-wide text-gray-500 mb-1">
                YOUR FIXATION
              </div>
              <StarRating value={stars} size="lg" onChange={(v) => setStars(word.id, v)} />
            </div>
            <AudioButtons word={word.word} sentence={word.exampleEN} humanUrl={word.audioHumanUrl} />
            <div className="text-[10px] text-gray-400">
              Last review:{' '}
              {lastReviewed ? new Date(lastReviewed).toLocaleDateString() : '—'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
