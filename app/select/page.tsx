'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

export default function Select() {
  const router = useRouter()
  const setProfile = useAppStore((s) => s.setProfile)
  const pick = (p: 'student' | 'teacher') => {
    setProfile(p)
    router.push(`/${p}`)
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="mb-2 text-3xl font-extrabold text-navy">Welcome</h1>
      <p className="mb-10 text-gray-600">Choose how you want to enter the platform.</p>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <button
          onClick={() => pick('student')}
          className="rounded-2xl bg-white p-10 text-center shadow-card border-t-4 border-navy hover:shadow-cardLg transition-shadow"
        >
          <div className="text-4xl">🎓</div>
          <div className="mt-4 text-xl font-extrabold text-navy">I&apos;m a Student</div>
          <div className="mt-1 text-sm text-gray-500">Study words, track your progress</div>
        </button>
        <button
          onClick={() => pick('teacher')}
          className="rounded-2xl bg-white p-10 text-center shadow-card border-t-4 border-red-600 hover:shadow-cardLg transition-shadow"
        >
          <div className="text-4xl">👩‍🏫</div>
          <div className="mt-4 text-xl font-extrabold text-navy">I&apos;m a Teacher</div>
          <div className="mt-1 text-sm text-gray-500">Monitor your students</div>
        </button>
      </div>
    </main>
  )
}
