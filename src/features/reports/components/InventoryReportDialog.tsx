'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useInventoryReport } from '../hooks'
import { formatDate } from '@/shared/lib/format'

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
              <div key={i} className="h-10 rounded-xl animate-shimmer" />
            ))}
          </div>
        )}

        {isError && <p className="text-sm text-destructive py-4 text-center">Erro ao carregar relatório.</p>}

        {data && data.content.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Nenhum material em estoque.</p>
        )}

        {data && data.content.length > 0 && (
          <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
            {data.content.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium text-gray-800 truncate">{item.materialName}</span>
                  {item.lotCode && (
                    <span className="text-[10px] text-gray-400 font-mono">Lote {item.lotCode}</span>
                  )}
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2 gap-0.5">
                  <span className="text-xs font-semibold text-gray-700">
                    {item.currentLotQuantity} {item.measurementUnitDescription}
                  </span>
                  {item.expirationDate && (
                    <span className="text-[10px] text-gray-400">Val. {formatDate(item.expirationDate)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
