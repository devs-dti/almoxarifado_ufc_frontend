'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMeasurementUnitsList, useDeleteUnit } from '../hooks'
import { UnitFormDialog } from './UnitFormDialog'
import type { MeasurementUnit } from '../types'

export function UnitList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MeasurementUnit | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: units = [], isLoading, isError } = useMeasurementUnitsList()
  const deleteMutation = useDeleteUnit()

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Unidade removida.')
    } catch {
      toast.error('Erro ao remover unidade.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Unidades de Medida</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-3" size="sm">
          <Plus size={15} />
          Nova
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar unidades.</p>}

      {!isLoading && units.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhuma unidade cadastrada.</div>
      )}

      {!isLoading && units.map((unit) => (
        <div key={unit.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-[11px] rounded-full font-mono">{unit.abbreviation}</Badge>
            <span className="font-medium text-gray-900 text-sm">{unit.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {deletingId === unit.id ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Confirmar?</span>
                <button onClick={() => handleDelete(unit.id)} className="text-xs font-medium text-destructive px-2 py-1 rounded-lg hover:bg-red-50">Sim</button>
                <button onClick={() => setDeletingId(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100">Não</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setEditing(unit); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeletingId(unit.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors" aria-label="Remover">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <UnitFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
        editing={editing}
      />
    </div>
  )
}
