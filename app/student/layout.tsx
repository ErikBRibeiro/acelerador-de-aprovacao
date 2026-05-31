import { Sidebar } from '@/components/Sidebar'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar
        profile="Student"
        name="Maria Silva"
        items={[
          { href: '/student', label: 'Dashboard', icon: '📊' },
          { href: '/student/study', label: 'Study', icon: '📚' },
          { href: '/student/schedule', label: 'Schedule', icon: '📅' },
        ]}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
