'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSectors, useDeleteSector } from '../hooks'
import { SectorFormDialog } from './SectorFormDialog'
import { getSectorIcon } from '@/shared/lib/icon-system'
import type { Sector } from '../types'

export function SectorList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Sector | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: sectors = [], isLoading, isError } = useSectors()
  const deleteMutation = useDeleteSector()

  async function handleDelete() {
    if (!deletingId) return
    try { await deleteMutation.mutateAsync(deletingId); toast.success('Setor removido.') }
    catch { toast.error('Erro ao remover setor.') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Setores</h2>
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

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar setores.</p>}

      {!isLoading && sectors.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhum setor cadastrado.</div>
      )}

      {!isLoading && sectors.map((sector, i) => {
        const SectorIcon = getSectorIcon(sector.id)
        return (
          <div
            key={sector.id}
            className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <SectorIcon size={17} className="text-brand" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="font-semibold text-gray-900 text-sm">{sector.name}</span>
              {sector.code && <span className="text-[11px] text-gray-400 font-mono">{sector.code}</span>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => { setEditing(sector); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-violet-50 transition-colors cursor-pointer" aria-label="Editar">
                <Pencil size={15} />
              </button>
              <button onClick={() => setDeletingId(sector.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors cursor-pointer" aria-label="Remover">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )
      })}

      <SectorFormDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }} editing={editing} />

      <AlertDialog open={deletingId !== null} onOpenChange={(v) => { if (!v) setDeletingId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover setor</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita. O setor será removido permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
