'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { EntityId } from '@/shared/types/id'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import { useUsers, useDeleteUser } from '../hooks'
import { UserFormDialog } from './UserFormDialog'
import type { UserListItem } from '../types'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Gerente',
  STAFF: 'Colaborador',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'text-purple-600 bg-purple-50 border-purple-200',
  MANAGER: 'text-blue-600 bg-blue-50 border-blue-200',
  STAFF: 'text-gray-600 bg-gray-50 border-gray-200',
}

const PAGE_SIZE = 10

export function UserList() {
  const [page, setPage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<UserListItem | null>(null)
  const [deletingId, setDeletingId] = useState<EntityId | null>(null)
  const role = useAuthStore((s) => s.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN'])

  const { data, isLoading, isError } = useUsers({ page, size: PAGE_SIZE })
  const users = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const deleteMutation = useDeleteUser()

  async function handleDelete(id: EntityId) {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Usuário removido.')
    } catch {
      toast.error('Erro ao remover usuário.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Usuários</h2>
        {canManage && (
          <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-3" size="sm">
            <Plus size={15} />
            Novo
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar usuários.</p>}

      {!isLoading && users.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhum usuário encontrado.</div>
      )}

      {!isLoading && users.map((user: UserListItem) => (
        <div key={user.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                  <UserIcon size={16} />
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                  <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${ROLE_COLORS[user.role] ?? ''}`}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                  {user.enabled !== undefined && (
                    <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${user.enabled ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                      {user.enabled ? 'Ativo' : 'Inativo'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {user.email} {user.jobTitle ? `• ${user.jobTitle}` : ''}
                </span>
              </div>
            </div>
          </div>
          {canManage && (
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {deletingId === user.id ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Confirmar?</span>
                <button onClick={() => handleDelete(user.id)} className="text-xs font-medium text-destructive px-2 py-1 rounded-lg hover:bg-red-50">Sim</button>
                <button onClick={() => setDeletingId(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100">Não</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setEditing(user); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeletingId(user.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors" aria-label="Remover">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Anterior">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Próxima">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {canManage && (
        <UserFormDialog
          open={dialogOpen}
          onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
          editing={editing}
        />
      )}
    </div>
  )
}
