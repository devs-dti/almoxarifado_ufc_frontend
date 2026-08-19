'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEntriesSummary } from '../hooks'
import { formatCurrency } from '@/shared/lib/format'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function EntriesSummaryDialog({ open, onOpenChange }: Props) {
  const { data, isLoading, isError } = useEntriesSummary(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Resumo de Entradas</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col gap-2 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && <p className="text-sm text-destructive py-4 text-center">Erro ao carregar relatório.</p>}

        {data && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400">Total de entradas</span>
                <span className="text-lg font-bold text-gray-800">{data.totalEntries}</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400">Valor total</span>
                <span className="text-sm font-bold text-gray-800">{formatCurrency(data.totalValue)}</span>
              </div>
            </div>

            {data.bySupplier.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500">Por fornecedor</span>
                {data.bySupplier.map((s) => (
                  <div key={s.supplierId} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-700">{s.supplierName}</span>
                    <span className="text-xs font-medium text-gray-800">{formatCurrency(s.totalValue)}</span>
                  </div>
                ))}
              </div>
            )}

            {data.byGroup.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500">Por grupo</span>
                {data.byGroup.map((g) => (
                  <div key={g.groupId} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-700">{g.groupName}</span>
                    <span className="text-xs font-medium text-gray-800">{formatCurrency(g.totalValue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
