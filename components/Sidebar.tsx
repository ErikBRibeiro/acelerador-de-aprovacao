'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon: string
}

export function Sidebar({
  items,
  profile,
  name,
}: {
  items: NavItem[]
  profile: string
  name: string
}) {
  const path = usePathname()
  return (
    <aside className="w-56 shrink-0 bg-navy p-4 text-white min-h-screen">
      <Link href="/" className="block">
        <div className="font-extrabold">ELITE</div>
        <div className="mb-6 text-xs text-blue-200">Accelerator</div>
      </Link>
      <nav className="space-y-1">
        {items.map((it) => {
          const active = path === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                active ? 'bg-white/15 font-bold text-white' : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              {it.icon} {it.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 rounded-md bg-white/10 p-3">
        <div className="text-[9px] font-semibold uppercase text-blue-200">{profile}</div>
        <div className="text-sm font-bold">{name}</div>
      </div>
      <Link
        href="/select"
        className="mt-3 block rounded-md px-3 py-2 text-xs text-blue-200 hover:bg-white/10"
      >
        �っ Switch profile
      </Link>
    </aside>
  )
}
