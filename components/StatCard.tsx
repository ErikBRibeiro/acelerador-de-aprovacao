export function StatCard({
  label,
  value,
  sub,
  tone = 'navy',
  progress,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  tone?: 'navy' | 'green' | 'amber' | 'red'
  /** When set (0–100), renders a progress bar filled to this percentage. */
  progress?: number
}) {
  const top: Record<string, string> = {
    navy: 'border-t-navy',
    green: 'border-t-green-600',
    amber: 'border-t-amber-500',
    red: 'border-t-red-600',
  }
  const val: Record<string, string> = {
    navy: 'text-navy',
    green: 'text-green-600',
    amber: 'text-amber-500',
    red: 'text-red-600',
  }
  const bar: Record<string, string> = {
    navy: 'bg-navy',
    green: 'bg-green-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
  }
  const pct = typeof progress === 'number' ? Math.max(0, Math.min(100, progress)) : null
  return (
    <div className={`rounded-lg bg-white p-4 shadow-card border-t-2 ${top[tone]}`}>
      <div className="text-[10px] font-semibold tracking-wide text-gray-500">{label}</div>
      <div className={`text-2xl font-extrabold ${val[tone]}`}>{value}</div>
      {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
      {pct !== null && (
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={`h-full rounded-full ${bar[tone]}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}
