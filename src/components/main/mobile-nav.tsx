'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
  Menu,
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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  async function handleLogout() {
    setOpen(false)
    await logout()
    router.push('/login')
  }

  function handleNavClick() {
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu de navegação"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetHeader className="px-5 py-4 border-b border-gray-100">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-[13px] font-bold text-gray-900">Almoxarifado</span>
                <span className="text-[10px] text-gray-400 font-medium">UFC</span>
              </div>
            </SheetTitle>
          </SheetHeader>

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
                      onClick={handleNavClick}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
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

          <div className="border-t border-gray-100 px-3 py-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-brand">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12px] font-semibold text-gray-800 truncate">{user?.name ?? 'Usuário'}</span>
              <span className="text-[10px] text-gray-400 truncate">{user?.email ?? ''}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              aria-label="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
