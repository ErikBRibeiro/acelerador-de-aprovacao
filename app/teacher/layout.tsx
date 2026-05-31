import { Sidebar } from '@/components/Sidebar'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar
        profile="Teacher"
        name="Prof. Ana"
        items={[
          { href: '/teacher', label: 'Dashboard', icon: '📊' },
          { href: '/teacher/glossary', label: 'Glossary', icon: '📖' },
        ]}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
