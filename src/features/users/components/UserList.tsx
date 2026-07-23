'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Shield, Briefcase, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useUsers, useDeleteUser } from '../hooks'
import { UserFormDialog } from './UserFormDialog'
import type { UserListItem } from '../types'
import type { LucideIcon } from 'lucide-react'

type RoleConfig = { Icon: LucideIcon; label: string; iconColor: string; bg: string }

const ROLE_CONFIG: Record<string, RoleConfig> = {
  ADMIN:   { Icon: Shield,    label: 'Admin',       iconColor: 'text-brand',       bg: 'bg-violet-50' },
  MANAGER: { Icon: Briefcase, label: 'Gerente',     iconColor: 'text-slate-500',   bg: 'bg-slate-100' },
  STAFF:   { Icon: User,      label: 'Colaborador', iconColor: 'text-slate-400',   bg: 'bg-slate-50'  },
}

const PAGE_SIZE = 10

export function UserList() {
  const [page, setPage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<UserListItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data, isLoading, isError } = useUsers({ page, size: PAGE_SIZE })
  const users = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const deleteMutation = useDeleteUser()

  async function handleDelete(id: number) {
    try { await deleteMutation.mutateAsync(id); toast.success('Usuário removido.') }
    catch { toast.error('Erro ao remover usuário.') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Usuários</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-3" size="sm">
          <Plus size={15} />
          Novo
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[68px] rounded-2xl animate-shimmer" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar usuários.</p>}

      {!isLoading && users.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhum usuário encontrado.</div>
      )}

      {!isLoading && users.map((user, i) => {
        const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.STAFF
        const { Icon: RoleIcon } = role
        return (
          <div
            key={user.id}
            className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`w-9 h-9 rounded-xl ${role.bg} flex items-center justify-center shrink-0`}>
              <RoleIcon size={17} className={role.iconColor} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm truncate">{user.name}</span>
                <span className={`text-[11px] font-medium ${role.iconColor}`}>{role.label}</span>
              </div>
              <span className="text-[11px] text-gray-400 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {deletingId === user.id ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Confirmar?</span>
                  <button onClick={() => handleDelete(user.id)} className="text-xs font-medium text-destructive px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer">Sim</button>
                  <button onClick={() => setDeletingId(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Não</button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setEditing(user); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-violet-50 transition-colors cursor-pointer" aria-label="Editar">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeletingId(user.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors cursor-pointer" aria-label="Remover">
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer" aria-label="Anterior">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer" aria-label="Próxima">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <UserFormDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }} editing={editing} />
    </div>
  )
}
