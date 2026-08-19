'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useInventoryReport } from '../hooks'
import { formatCurrency } from '@/shared/lib/format'

const ABC_COLORS: Record<string, string> = {
  A: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  B: 'text-amber-600 bg-amber-50 border-amber-200',
  C: 'text-gray-500 bg-gray-50 border-gray-200',
}

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function InventoryReportDialog({ open, onOpenChange }: Props) {
  const { data, isLoading, isError } = useInventoryReport(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Relatório Geral de Materiais</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col gap-2 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && <p className="text-sm text-destructive py-4 text-center">Erro ao carregar relatório.</p>}

        {data && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2">
              <span className="text-xs text-gray-500">Valor total em estoque</span>
              <span className="text-sm font-semibold text-gray-800">{formatCurrency(data.totalValue)}</span>
            </div>

            <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
              {data.materials.map((m) => (
                <div key={m.materialId} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-medium text-gray-800 truncate">{m.materialName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{m.code}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs text-gray-500">{m.quantity} un</span>
                    <span className="text-xs font-medium text-gray-700">{formatCurrency(m.totalValue)}</span>
                    <span className={`text-[10px] font-bold border rounded-full px-1.5 py-0.5 ${ABC_COLORS[m.abcCurve]}`}>
                      {m.abcCurve}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
