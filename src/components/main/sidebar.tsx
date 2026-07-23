'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart,
  Building2,
  Ruler,
  Truck,
  Users,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Principal',
    items: [
      { label: 'Materiais', href: '/dashboard/materiais', icon: Package },
      { label: 'Entradas', href: '/dashboard/entradas', icon: ArrowDownCircle },
      { label: 'Transferências', href: '/dashboard/transferencias', icon: ArrowUpCircle },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { label: 'Setores', href: '/dashboard/setores', icon: Building2 },
      { label: 'Unidades de Medida', href: '/dashboard/unidades-de-medida', icon: Ruler },
      { label: 'Fornecedores', href: '/dashboard/fornecedores', icon: Truck },
      { label: 'Usuários', href: '/dashboard/usuarios', icon: Users },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Relatórios', href: '/dashboard/relatorios', icon: FileBarChart },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
          <LayoutDashboard size={16} className="text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-gray-900">Almoxarifado</span>
          <span className="text-[10px] text-gray-400 font-medium">UFC</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
              {group.label}
            </span>
            {group.items.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 hover:translate-x-0.5'
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-gray-100 px-3 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-brand">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[12px] font-semibold text-gray-800 truncate">{user?.name ?? 'Usuário'}</span>
          <span className="text-[10px] text-gray-400 truncate">{user?.email ?? ''}</span>
        </div>
        <button
          onClick={() => logout()}
          className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
          aria-label="Sair"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
