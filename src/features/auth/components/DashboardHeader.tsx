'use client'

import { useAuthStore } from '@/store/useAuthStore'

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name?.split(' ')[0] ?? 'Usuário'

  return (
    <div className="flex items-center gap-3">
      {/* Mobile/tablet: greeting */}
      <div className="flex flex-col lg:hidden">
        <span className="text-base font-semibold text-gray-900">
          Olá, {firstName}!
        </span>
        <span className="text-xs text-brand font-medium">Por onde quer começar?</span>
      </div>

      {/* Desktop: compact user chip (shown in top bar via layout) */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center">
          <span className="text-[11px] font-bold text-brand">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-gray-800">{firstName}</span>
          <span className="text-[10px] text-gray-400">{user?.email ?? ''}</span>
        </div>
      </div>
    </div>
  )
}
