export function StatCard({
  label,
  value,
  sub,
  tone = 'navy',
}: {
  label: string
  value: React.ReactNode
  sub?: string
  tone?: 'navy' | 'green' | 'amber' | 'red'
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
  return (
    <div className={`rounded-lg bg-white p-4 shadow-card border-t-2 ${top[tone]}`}>
      <div className="text-[10px] font-semibold tracking-wide text-gray-500">{label}</div>
      <div className={`text-2xl font-extrabold ${val[tone]}`}>{value}</div>
      {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
    </div>
  )
}
