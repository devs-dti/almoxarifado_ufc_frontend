'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, User as UserIcon, Mail, Building2, Fingerprint } from 'lucide-react'
import type { EntityId } from '@/shared/types/id'
import { useUser } from '../hooks'
import { formatCPF } from '@/shared/lib/format'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  STAFF: 'Colaborador',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'text-purple-600 bg-purple-50 border-purple-200',
  MANAGER: 'text-blue-600 bg-blue-50 border-blue-200',
  STAFF: 'text-gray-600 bg-gray-50 border-gray-200',
}

type Props = {
  userId: EntityId | null
  onClose: () => void
}

export function UserDetailsDialog({ userId, onClose }: Props) {
  const { data: user, isLoading } = useUser(userId ?? '', { enabled: !!userId })

  return (
    <Dialog open={!!userId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40">
        <DialogHeader className="sr-only">
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        {isLoading || !user ? (
          <div className="flex flex-col items-center justify-center p-12 h-64">
            <Loader2 className="animate-spin text-brand" size={32} />
            <span className="text-sm text-gray-500 mt-4">Carregando perfil...</span>
          </div>
        ) : (
          <div className="flex flex-col relative">
            <div className="h-32 bg-gradient-to-br from-brand/80 to-purple-600 w-full rounded-t-lg" />
            
            <div className="px-6 pb-8">
              <div className="relative -mt-16 mb-4 flex items-end justify-between">
                <div className="rounded-full p-1 bg-white inline-block shadow-md">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt={user.name} className="w-28 h-28 rounded-full object-cover border border-gray-100" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${ROLE_COLORS[user.role] ?? ''}`}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  {user.name}
                  <span className={`w-2.5 h-2.5 rounded-full ${user.enabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} title={user.enabled ? 'Ativo' : 'Inativo'} />
                </h2>
                <p className="text-gray-500 text-sm">{user.jobTitle || 'Nenhum cargo definido'}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">E-mail</span>
                    <span className="text-sm font-medium text-gray-700 truncate">{user.email}</span>
                  </div>
                </div>

                {user.cpf && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Fingerprint size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">CPF</span>
                      <span className="text-sm font-medium text-gray-700">{formatCPF(user.cpf)}</span>
                    </div>
                  </div>
                )}

                {user.sector && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Setor</span>
                      <span className="text-sm font-medium text-gray-700">{user.sector.name}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
