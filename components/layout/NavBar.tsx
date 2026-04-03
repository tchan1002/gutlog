'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  const links = [
    { href: '/log/food', label: 'Food', emoji: '🍽️' },
    { href: '/log/gut', label: 'Gut', emoji: '💩' },
    { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] transition-colors rounded-lg ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-2xl mb-1">{link.emoji}</span>
              <span className="text-xs">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
