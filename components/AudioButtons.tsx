'use client'
import { speak } from '@/lib/speech'

export function AudioButtons({
  word,
  sentence,
  humanUrl,
}: {
  word: string
  sentence?: string
  humanUrl?: string
}) {
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
