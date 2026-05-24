'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTransfersSummary } from '../hooks'
import { formatCurrency } from '@/shared/lib/format'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function TransfersSummaryDialog({ open, onOpenChange }: Props) {
  const { data, isLoading, isError } = useTransfersSummary(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Resumo de Transferências</DialogTitle>
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
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Total de transferências</span>
              <span className="text-lg font-bold text-gray-800">{data.totalTransfers}</span>
            </div>

            {data.bySector.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500">Por setor</span>
                {data.bySector.map((s) => (
                  <div key={s.sectorId} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-gray-700">{s.sectorName}</span>
                      <span className="text-[10px] text-gray-400">{s.itemsConsumed} itens consumidos</span>
                    </div>
                    <span className="text-xs font-medium text-gray-800">{formatCurrency(s.totalCost)}</span>
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
