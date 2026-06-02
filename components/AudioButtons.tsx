'use client'
import { speak } from '@/lib/speech'

export function AudioButtons({
  word,
  sentence,
  humanUrl,
  compact = false,
}: {
  word: string
  sentence?: string
  humanUrl?: string
  /** Icon-only variant (word + sentence) for the collapsed word row. */
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            speak(word)
          }}
          title="Ouvir palavra"
          aria-label="Ouvir palavra"
          className="rounded-md px-2 py-1 text-sm leading-none text-navy hover:bg-blue-50"
        >
          🔊
        </button>
        {sentence && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              speak(sentence)
            }}
            title="Ouvir frase de exemplo"
            aria-label="Ouvir frase de exemplo"
            className="rounded-md px-2 py-1 text-sm leading-none text-navy hover:bg-blue-50"
          >
            💬
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => speak(word)}
        className="flex items-center gap-1 rounded-md bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-950"
      >
        ▶ Neural Audio
      </button>
      {sentence && (
        <button
          onClick={() => speak(sentence)}
          className="rounded-md border border-navy px-3 py-1.5 text-xs font-bold text-navy hover:bg-blue-50"
        >
          ▶ Sentence
        </button>
      )}
      <button
        onClick={() => {
          if (humanUrl) new Audio(humanUrl).play()
        }}
        disabled={!humanUrl}
        title={humanUrl ? 'Play human recording' : 'Human audio coming soon'}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 enabled:hover:bg-gray-50 disabled:opacity-40"
      >
        🎧 Human
      </button>
    </div>
  )
}
