'use client'

import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name?.split(' ')[0] ?? 'Usuário'

  return (
    <>
      {/* Mobile/tablet: greeting + avatar */}
      <div className="flex items-center justify-between flex-1 w-full pl-2 lg:hidden">
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="text-[15px] font-semibold text-gray-900">
            Olá, {firstName}!
          </span>
          <span className="text-[10px] text-brand font-medium">Por onde quer começar?</span>
        </div>
        <Link href="/dashboard/perfil" className="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity">
          <span className="text-[12px] font-bold text-brand">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        </Link>
      </div>

      {/* Desktop: compact user chip (shown in top bar via layout) */}
      <Link
        href="/dashboard/perfil"
        className="hidden lg:flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center">
          <span className="text-[11px] font-bold text-brand">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-gray-800">{firstName}</span>
          <span className="text-[10px] text-gray-400">{user?.email ?? ''}</span>
        </div>
      </Link>
    </>
  )
}
