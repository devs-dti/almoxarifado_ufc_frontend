'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ArrowDownCircle, ArrowUpCircle, FileBarChart } from 'lucide-react'

import type { Role } from '@/features/auth/types'
import { useAuthStore } from '@/store/useAuthStore'
import { hasAnyRole } from '@/shared/lib/rbac'

interface BottomNavItem {
  label: string
  href: string
  icon: typeof Package
  roles?: Role[]
}

const items: BottomNavItem[] = [
  { label: 'Materiais', href: '/dashboard/materiais', icon: Package },
  { label: 'Entradas', href: '/dashboard/entradas', icon: ArrowDownCircle, roles: ['ADMIN', 'MANAGER'] },
  { label: 'Saídas', href: '/dashboard/transferencias', icon: ArrowUpCircle },
  { label: 'Relatórios', href: '/dashboard/relatorios', icon: FileBarChart, roles: ['ADMIN', 'MANAGER'] },
]

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const role = user?.role

  const filteredItems = !role
    ? []
    : items.filter((item) => !item.roles || hasAnyRole(role, item.roles))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex md:hidden h-14">
      {filteredItems.map(({ label, href, icon: Icon }) => {
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
