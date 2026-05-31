import { STUDENTS } from '@/data/students'
import { WORDS } from '@/data/words'
import { StudentTable } from '@/components/StudentTable'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/Badge'

export default function TeacherDashboard() {
  const avg = Math.round(
    STUDENTS.reduce((s, x) => s + x.glossaryPercent, 0) / STUDENTS.length,
  )
  const avgStars = (
    STUDENTS.reduce((s, x) => s + x.averageStars, 0) / STUDENTS.length
  ).toFixed(1)

  // Simulated "hardest words" overview for the demo: lowest-frequency high-value words
  const hardest = WORDS.filter((w) => w.linguisticType === 'false-cognate').slice(0, 6)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Class Overview</h1>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="STUDENTS" value={STUDENTS.length} tone="navy" />
        <StatCard label="AVG GLOSSARY" value={`${avg}%`} tone="green" />
        <StatCard label="AVG STARS" value={avgStars} tone="amber" />
      </div>

      <StudentTable students={STUDENTS} />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-2 text-sm font-bold text-gray-700">
          Words with highest difficulty (false cognates)
        </div>
        <div className="flex flex-wrap gap-2">
          {hardest.map((w) => (
            <Badge key={w.id} tone="red">
              {w.word}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
