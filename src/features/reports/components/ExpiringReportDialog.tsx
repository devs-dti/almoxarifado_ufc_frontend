'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Sheet, ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, Search } from 'lucide-react'
import { useExpiringReport } from '../hooks'
import { formatDate } from '@/shared/lib/format'
import { reportsApi } from '../api'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function ExpiringReportDialog({ open, onOpenChange }: Props) {
  const [page, setPage] = useState(0)
  const [materialName, setMaterialName] = useState('')
  const [maxExpirationDate, setMaxExpirationDate] = useState('')
  const pageSize = 10

  const { data, isLoading, isError } = useExpiringReport(
    {
      page,
      size: pageSize,
      materialName: materialName || undefined,
      maxExpirationDate: maxExpirationDate || undefined,
    },
    open
  )
  const items = data?.content || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pr-6 space-y-0 pb-2 border-b">
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <CalendarDays size={18} className="text-brand" />
              Controle de Vencimentos por Lote
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Monitoramento de lotes e datas de validade dos materiais
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 hover:border-red-200 hover:bg-red-50 text-gray-700"
              onClick={() =>
                reportsApi.exportExpiringPdf({
                  materialName: materialName || undefined,
                  maxExpirationDate: maxExpirationDate || undefined,
                })
              }
            >
              <FileText size={14} className="text-red-500" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 hover:border-green-200 hover:bg-green-50 text-gray-700"
              onClick={() =>
                reportsApi.exportExpiringExcel({
                  materialName: materialName || undefined,
                  maxExpirationDate: maxExpirationDate || undefined,
                })
              }
            >
              <Sheet size={14} className="text-green-600" /> Excel
            </Button>
          </div>
        </DialogHeader>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-1">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            <Input
              placeholder="Buscar por nome do material..."
              value={materialName}
              onChange={(e) => {
                setMaterialName(e.target.value)
                setPage(0)
              }}
              className="pl-8 h-8 text-xs rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0">Vencimento até:</span>
            <Input
              type="date"
              value={maxExpirationDate}
              onChange={(e) => {
                setMaxExpirationDate(e.target.value)
                setPage(0)
              }}
              className="h-8 text-xs rounded-xl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {isLoading && (
            <div className="flex flex-col gap-2 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 text-center text-sm text-destructive">
              Erro ao carregar os registros de vencimento.
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 size={40} className="text-emerald-500 mb-2" />
              <p className="text-sm font-medium text-gray-800">Tudo em dia!</p>
              <p className="text-xs text-gray-400">Nenhum lote com validade próxima encontrado para este filtro.</p>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div
                  key={`${item.lotCode || idx}-${item.materialName}`}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/80 transition-colors shadow-sm"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="text-xs font-semibold text-gray-900 truncate">
                      {item.materialName || 'Material sem nome'}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      {item.lotCode && (
                        <span>
                          Lote: <strong className="text-gray-700 font-mono">{item.lotCode}</strong>
                        </span>
                      )}
                      <span>
                        Unidade: <strong className="text-gray-700">{item.measurementUnit || 'UN'}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-xs font-bold text-gray-800">
                      {item.quantity ?? 0} {item.measurementUnit || 'un'}
                    </span>
                    {item.expirationDate && (
                      <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {formatDate(item.expirationDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com Paginação Server-Side */}
        <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
          <span>
            Total: <strong>{totalElements}</strong> lotes listados
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">
              Página {totalPages > 0 ? page + 1 : 0} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-lg"
              disabled={page === 0 || isLoading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-lg"
              disabled={page >= totalPages - 1 || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
