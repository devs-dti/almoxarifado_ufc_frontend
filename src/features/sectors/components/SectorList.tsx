'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { EntityId } from '@/shared/types/id'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSectors, useDeleteSector } from '../hooks'
import { SectorFormDialog } from './SectorFormDialog'
import type { Sector } from '../types'

export function SectorList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Sector | null>(null)
  const [deletingId, setDeletingId] = useState<EntityId | null>(null)
  const role = useAuthStore((s) => s.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN', 'MANAGER'])

  const { data: sectors = [], isLoading, isError } = useSectors()
  const deleteMutation = useDeleteSector()

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteMutation.mutateAsync(deletingId)
      toast.success('Setor removido.')
    } catch {
      toast.error('Erro ao remover setor.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Setores</h2>
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

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar setores.</p>}

      {!isLoading && sectors.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhum setor cadastrado.</div>
      )}

      {!isLoading && sectors.map((sector) => (
        <div key={sector.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-semibold text-gray-900 text-sm">{sector.name}</span>
            {sector.code && <span className="text-xs text-gray-400">Código: {sector.code}</span>}
          </div>
          {canManage && (
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button onClick={() => { setEditing(sector); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors" aria-label="Editar">
                <Pencil size={15} />
              </button>
              <button onClick={() => setDeletingId(sector.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors" aria-label="Remover">
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      ))}

      {canManage && (
        <SectorFormDialog
          open={dialogOpen}
          onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
          editing={editing}
        />
      )}

      <AlertDialog open={canManage && deletingId !== null} onOpenChange={(v) => { if (!v) setDeletingId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover setor</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O setor será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
