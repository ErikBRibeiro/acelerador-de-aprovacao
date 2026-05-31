'use client'
export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search the glossary…"
      className="w-full max-w-md rounded-lg border border-gray-200 px-3 py-2 text-sm"
    />
  )
}
