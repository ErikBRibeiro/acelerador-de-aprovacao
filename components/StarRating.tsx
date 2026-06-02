'use client'

export function StarRating({
  value,
  onChange,
  size = 'sm',
}: {
  value: number
  onChange?: (v: 1 | 2 | 3 | 4 | 5) => void
  size?: 'sm' | 'lg'
}) {
  const cls = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <div className={`text-blue-500 ${cls} select-none`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={(e) => {
            e.stopPropagation()
            onChange?.(n as 1 | 2 | 3 | 4 | 5)
          }}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${n} stars`}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
