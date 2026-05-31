import type { MockStudent } from '@/lib/types'
import { StarRating } from './StarRating'

export function StudentTable({ students }: { students: MockStudent[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-gray-100 px-4 py-2 text-[10px] font-bold text-gray-500">
        <div>STUDENT</div>
        <div>GLOSSARY</div>
        <div>AVG STARS</div>
        <div>LAST ACTIVE</div>
      </div>
      {students.map((s) => (
        <div
          key={s.id}
          className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center border-t border-gray-100 px-4 py-2 ${
            s.glossaryPercent < 40 ? 'bg-amber-50' : ''
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.avatarUrl} alt="" className="h-6 w-6 rounded-full" />
            {s.name}
          </div>
          <div
            className={`text-sm font-bold ${
              s.glossaryPercent < 40 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {s.glossaryPercent}%
          </div>
          <div>
            <StarRating value={Math.round(s.averageStars)} />
          </div>
          <div className="text-sm text-gray-400">
            {new Date(s.lastActivity).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
