'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ArrowDownCircle, ArrowUpCircle, FileBarChart, LayoutGrid } from 'lucide-react'

const items = [
  { label: 'Materiais', href: '/dashboard/materiais', icon: Package },
  { label: 'Entradas', href: '/dashboard/entradas', icon: ArrowDownCircle },
  { label: 'Saídas', href: '/dashboard/transferencias', icon: ArrowUpCircle },
  { label: 'Relatórios', href: '/dashboard/relatorios', icon: FileBarChart },
  { label: 'Mais', href: '/dashboard/setores', icon: LayoutGrid },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex md:hidden">
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-brand' : 'text-gray-400'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
