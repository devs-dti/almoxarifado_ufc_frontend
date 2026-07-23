'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Ruler } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMeasurementUnitsList, useDeleteUnit } from '../hooks'
import { UnitFormDialog } from './UnitFormDialog'
import type { MeasurementUnit } from '../types'

export function UnitList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MeasurementUnit | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: units = [], isLoading, isError } = useMeasurementUnitsList()
  const deleteMutation = useDeleteUnit()

  async function handleDelete(id: string) {
    try { await deleteMutation.mutateAsync(id); toast.success('Unidade removida.') }
    catch { toast.error('Erro ao remover unidade.') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Unidades de Medida</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-3" size="sm">
          <Plus size={15} />
          Nova
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[68px] rounded-2xl animate-shimmer" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar unidades.</p>}

      {!isLoading && units.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhuma unidade cadastrada.</div>
      )}

      {!isLoading && units.map((unit, i) => (
        <div
          key={unit.id}
          className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 animate-fade-in-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
            <Ruler size={17} className="text-brand" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="font-semibold text-gray-900 text-sm">{unit.name}</span>
            <span className="text-[11px] text-brand font-mono font-medium">{unit.abbreviation}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {deletingId === unit.id ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Confirmar?</span>
                <button onClick={() => handleDelete(unit.id)} className="text-xs font-medium text-destructive px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer">Sim</button>
                <button onClick={() => setDeletingId(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Não</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setEditing(unit); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-violet-50 transition-colors cursor-pointer" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeletingId(unit.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors cursor-pointer" aria-label="Remover">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <UnitFormDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }} editing={editing} />
    </div>
  )
}
