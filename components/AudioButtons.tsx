'use client'
import { speak } from '@/lib/speech'

export function AudioButtons({
  word,
  sentence,
  humanUrl,
  showHuman = true,
  iconOnly = false,
}: {
  word: string
  sentence?: string
  humanUrl?: string
  /** Show the "Human" recording button (hidden in the collapsed word row). */
  showHuman?: boolean
  /** Icon-only (no text labels), keeping the colored box — for the word row. */
  iconOnly?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation()
          speak(word)
        }}
        aria-label="Neural Audio"
        title="Neural Audio"
        className="flex items-center gap-1 rounded-md bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-950"
      >
        <span aria-hidden className={iconOnly ? 'text-base leading-none' : undefined}>🔊</span>
        {!iconOnly && <span className="hidden md:inline">Neural Audio</span>}
      </button>
      {sentence && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            speak(sentence)
          }}
          aria-label="Sentence"
          title="Sentence"
          className="flex items-center gap-1 rounded-md border border-navy px-3 py-1.5 text-xs font-bold text-navy hover:bg-blue-50"
        >
          <span aria-hidden className={iconOnly ? 'text-base leading-none' : undefined}>📣</span>
          {!iconOnly && <span className="hidden md:inline">Sentence</span>}
        </button>
      )}
      {showHuman && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (humanUrl) new Audio(humanUrl).play()
          }}
          disabled={!humanUrl}
          aria-label="Human"
          title={humanUrl ? 'Play human recording' : 'Human audio coming soon'}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 enabled:hover:bg-gray-50 disabled:opacity-40"
        >
          <span aria-hidden>🎧</span>
          <span className="hidden md:inline">Human</span>
        </button>
      )}
    </div>
  )
}
