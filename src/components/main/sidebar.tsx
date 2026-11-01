'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { UfcLogo } from '@/shared/components/UfcLogo'
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
  FileSignature,
  ClipboardList,
  Layers,
  HelpCircle,
} from 'lucide-react'

import type { Role } from '@/features/auth/types'
import { hasAnyRole } from '@/shared/lib/rbac'

interface NavItem {
  label: string
  href: string
  icon: typeof Package
  roles?: Role[]
}

interface NavGroup {
  label: string
  items: NavItem[]
  roles?: Role[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Materiais', href: '/dashboard/materiais', icon: Package },
      { label: 'Entradas', href: '/dashboard/entradas', icon: ArrowDownCircle, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Transferências', href: '/dashboard/transferencias', icon: ArrowUpCircle },
    ],
  },
  {
    label: 'Cadastros',
    roles: ['ADMIN', 'MANAGER'],
    items: [
      { label: 'Setores', href: '/dashboard/setores', icon: Building2, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Grupos de Materiais', href: '/dashboard/grupos', icon: Layers, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Unidades de Medida', href: '/dashboard/unidades-de-medida', icon: Ruler, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Fornecedores', href: '/dashboard/fornecedores', icon: Truck, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Empresas', href: '/dashboard/companies', icon: Building2, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Usuários', href: '/dashboard/usuarios', icon: Users, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Relatórios', href: '/dashboard/relatorios', icon: FileBarChart, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Contratos', href: '/dashboard/contracts', icon: FileSignature, roles: ['ADMIN', 'MANAGER'] },
      { label: 'Auditoria de Materiais', href: '/dashboard/auditorias', icon: ClipboardList, roles: ['ADMIN', 'MANAGER'] },
      { label: 'FAQ', href: '/dashboard/faq', icon: HelpCircle },
    ],
  },
]

export function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const currentRole = user?.role

  // Guarda o último papel válido para evitar flash branco ou layout shift durante o logout/descarregamento
  const lastRoleRef = useRef<Role | undefined>(currentRole)
  if (currentRole) {
    lastRoleRef.current = currentRole
  }
  const role = currentRole || lastRoleRef.current

  const filteredGroups = !role
    ? []
    : navGroups
        .filter((group) => !group.roles || hasAnyRole(role, group.roles))
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.roles || hasAnyRole(role, item.roles)),
        }))
        .filter((group) => group.items.length > 0)

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-5 border-b border-gray-100 shrink-0">
        <UfcLogo className="h-12 shrink-0" />
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-bold text-gray-900">Sistema Soma</span>
          <span className="text-[10px] text-gray-400 font-medium truncate w-36">Almoxarifado UFC Sobral</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {filteredGroups.map((group) => (
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
                  onClick={onLinkClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
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
      <div className="border-t border-gray-100 px-3 py-3 flex items-center gap-2.5 shrink-0">
        <Link href="/dashboard/perfil" onClick={onLinkClick} className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
            <span className="text-[14px] font-bold text-brand">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1 ml-1">
            <span className="text-[14px] font-semibold text-gray-800 truncate">{user?.name ?? 'Usuário'}</span>
            <span className="text-[11px] text-gray-400 truncate">{user?.email ?? ''}</span>
          </div>
        </Link>
        <button
          onClick={() => {
            onLinkClick?.()
            logout()
          }}
          className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
          aria-label="Sair"
        >
          <LogOut size={14} />
        </button>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen bg-white border-r border-gray-100">
      <SidebarContent />
    </aside>
  )
}
