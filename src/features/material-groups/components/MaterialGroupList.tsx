'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMaterialGroups, useDeleteMaterialGroup } from '../hooks'
import { MaterialGroupFormDialog } from './MaterialGroupFormDialog'
import type { MaterialGroup } from '../types'

export function MaterialGroupList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const size = 10

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MaterialGroup | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading, isError } = useMaterialGroups({ page, size, search })
  const deleteMutation = useDeleteMaterialGroup()

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Grupo removido.')
    } catch {
      toast.error('Erro ao remover grupo.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-gray-700 w-full sm:w-auto">Grupos de Materiais</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Buscar grupo..." 
            className="rounded-xl h-9 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
          />
          <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-3 h-9 shrink-0" size="sm">
            <Plus size={15} />
            Novo
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar grupos.</p>}

      {!isLoading && data?.data?.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center justify-center gap-2">
          <Layers className="text-gray-300" size={32} />
          <span>Nenhum grupo encontrado.</span>
        </div>
      )}

      {!isLoading && data?.data?.map((group) => (
        <div key={group.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <Layers size={18} className="text-gray-400" />
            </div>
            <span className="font-semibold text-gray-900 text-sm truncate">{group.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {deletingId === group.id ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Confirmar?</span>
                <button onClick={() => handleDelete(group.id)} className="text-xs font-medium text-destructive px-2 py-1 rounded-lg hover:bg-red-50">Sim</button>
                <button onClick={() => setDeletingId(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100">Não</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setEditing(group); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeletingId(group.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors" aria-label="Remover">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <MaterialGroupFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
        groupToEdit={editing}
      />

      {/* Paginação */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Página {data.meta.page + 1} de {data.meta.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-8 text-xs px-3"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-8 text-xs px-3"
              disabled={page >= data.meta.totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
