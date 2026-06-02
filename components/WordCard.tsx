'use client'
import { useState } from 'react'
import type { Word } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { wordCategories, wordExamples } from '@/lib/words-utils'
import { StarRating } from './StarRating'
import { Badge } from './Badge'
import { AudioButtons } from './AudioButtons'

const freqTone = { high: 'navy', medium: 'amber', low: 'gray' } as const
const typeLabel = {
  cognate: 'cognate',
  'false-cognate': 'false cognate',
  equivalent: 'equivalent',
} as const

/** Thin, barely-visible vertical rule separating the collapsed-row sections. */
function Divider({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`w-px self-stretch bg-gray-200 ${className}`} />
}

export function WordCard({ word }: { word: Word }) {
  const [expanded, setExpanded] = useState(false)
  const stars = useAppStore((s) => s.progress[word.id]?.stars ?? 0)
  const lastReviewed = useAppStore((s) => s.progress[word.id]?.lastReviewed)
  const setStars = useAppStore((s) => s.setStars)
  const danger = stars > 0 && stars <= 2
  const cats = wordCategories(word)
  const examples = wordExamples(word)

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white border-l-4 ${
        danger ? 'border-red-600' : 'border-navy'
      } ${expanded ? 'shadow-cardLg' : 'shadow-card'} transition-shadow`}
    >
      {/* Collapsed row — full width */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          // Only toggle from the row itself, not from inner controls (audio buttons).
          if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
            e.preventDefault()
            setExpanded((x) => !x)
          }
        }}
        className="flex cursor-pointer items-center gap-4 p-4"
      >
        {/* English word — centered on both axes, with its star rating floating
            at the upper-right so it doesn't shift the word off-center */}
        <div className="relative flex min-w-0 flex-1 items-center justify-center self-stretch">
          <p className="max-w-full truncate text-center text-lg font-extrabold text-navy">
            {word.word}
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <StarRating value={stars} />
          </div>
        </div>

        <Divider />

        {/* Translation — same size & color as the word, just not bold */}
        <div className="min-w-0 flex-1 truncate text-center text-lg text-navy">
          {word.translation}
        </div>

        <Divider className="hidden lg:block" />

        {/* Application + definition — black */}
        <div className="hidden min-w-0 flex-[1.6] text-center lg:block">
          <p className="truncate text-sm italic text-gray-900">
            &ldquo;{word.exampleEN}&rdquo;
          </p>
          <p className="truncate text-xs text-gray-900">{word.definition}</p>
        </div>

        <Divider className="hidden lg:block" />

        {/* Audio — same buttons as the open card, minus "Human" */}
        <div className="shrink-0">
          <AudioButtons word={word.word} sentence={word.exampleEN} showHuman={false} iconOnly />
        </div>

        {/* Categories */}
        <div className="hidden shrink-0 flex-wrap gap-1 lg:flex">
          {cats.map((c) => (
            <Badge key={c} tone="gray">
              {c}
            </Badge>
          ))}
        </div>

        {/* Frequency */}
        <div className="hidden shrink-0 sm:block">
          <Badge tone={freqTone[word.testFrequency]}>{word.testFrequency.toUpperCase()}</Badge>
        </div>

        {/* Chevron */}
        <span
          className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden
        >
          ▾
        </span>
      </div>

      {/* Expanded content — opens downward */}
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[220px_1fr]">
            {/* Image */}
            <div className="border-b border-gray-100 md:border-b-0 md:border-r">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={word.imageUrl}
                alt={word.word}
                className="h-44 w-full object-cover md:h-full"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="text-[10px] font-semibold tracking-wide text-gray-500">
                  DEFINITION
                </div>
                <p className="text-sm text-gray-700">{word.definition}</p>
                <p className="mt-1 text-sm italic text-gray-500">{word.definitionPT}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone="green">{typeLabel[word.linguisticType]}</Badge>
                  <Badge tone="amber">{word.agency}</Badge>
                  <Badge tone="gray">{word.subcategory}</Badge>
                  {word.tags.map((t) => (
                    <Badge key={t} tone="gray">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 bg-[#fafbff]">
                <div className="text-[10px] font-semibold tracking-wide text-gray-500">
                  EXAMPLES IN CONTEXT
                </div>
                <ul className="mt-1 space-y-2">
                  {examples.map((ex, i) => (
                    <li key={i}>
                      <p className="text-sm italic text-navy">&ldquo;{ex.en}&rdquo;</p>
                      <p className="text-xs text-gray-500">&ldquo;{ex.pt}&rdquo;</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div>
                  <div className="mb-1 text-[10px] font-semibold tracking-wide text-gray-500">
                    YOUR FIXATION
                  </div>
                  <StarRating value={stars} size="lg" onChange={(v) => setStars(word.id, v)} />
                </div>
                <AudioButtons
                  word={word.word}
                  sentence={word.exampleEN}
                  humanUrl={word.audioHumanUrl}
                />
                <div className="text-[10px] text-gray-400">
                  Last review:{' '}
                  {lastReviewed ? new Date(lastReviewed).toLocaleDateString() : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
