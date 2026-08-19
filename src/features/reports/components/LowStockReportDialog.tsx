'use client'

import { TriangleAlert } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLowStockReport } from '../hooks'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function LowStockReportDialog({ open, onOpenChange }: Props) {
  const { data, isLoading, isError } = useLowStockReport(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Materiais em Falta</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col gap-2 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && <p className="text-sm text-destructive py-4 text-center">Erro ao carregar relatório.</p>}

        {data && data.materials.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Nenhum material abaixo do estoque mínimo.</p>
        )}

        {data && data.materials.length > 0 && (
          <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
            {data.materials.map((m) => {
              const deficit = m.minQuantity - m.quantity
              return (
                <div key={m.materialId} className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <TriangleAlert size={13} className="text-amber-500 shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-medium text-gray-800 truncate">{m.materialName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{m.code}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <span className="text-xs text-amber-700 font-semibold">{m.quantity} / {m.minQuantity}</span>
                    <span className="text-[10px] text-red-500">−{deficit} em falta</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
