'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useExpiringReport } from '../hooks'
import { formatDate } from '@/shared/lib/format'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function ExpiringReportDialog({ open, onOpenChange }: Props) {
  const [days, setDays] = useState(30)
  const { data, isLoading, isError } = useExpiringReport(days, open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vencimento de Materiais</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 shrink-0">Vencendo em até</span>
          <Input
            type="number"
            min={1}
            max={365}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl w-20 text-center text-sm"
          />
          <span className="text-xs text-gray-500 shrink-0">dias</span>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && <p className="text-sm text-destructive py-4 text-center">Erro ao carregar relatório.</p>}

        {data && data.lots.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Nenhum lote vencendo neste período.</p>
        )}

        {data && data.lots.length > 0 && (
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {data.lots.map((lot) => (
              <div key={lot.lotId} className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium text-gray-800 truncate">{lot.materialName}</span>
                  <span className="text-[10px] text-gray-400">Lote {lot.lotCode} · {lot.quantity} un</span>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span className="text-xs font-medium text-red-500">{formatDate(lot.expiresAt)}</span>
                  <span className="text-[10px] text-gray-400">{lot.daysUntilExpiry}d restantes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
