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
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl w-full max-h-[90vh] flex flex-col p-6 sm:p-7 rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pr-6 space-y-0 pb-3 border-b">
          <div>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays size={22} className="text-brand" />
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
              className="h-9 text-xs gap-1.5 hover:border-red-200 hover:bg-red-50 text-gray-700 rounded-xl"
              onClick={() =>
                reportsApi.exportExpiringPdf({
                  materialName: materialName || undefined,
                  maxExpirationDate: maxExpirationDate || undefined,
                })
              }
            >
              <FileText size={15} className="text-red-500" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 hover:border-green-200 hover:bg-green-50 text-gray-700 rounded-xl"
              onClick={() =>
                reportsApi.exportExpiringExcel({
                  materialName: materialName || undefined,
                  maxExpirationDate: maxExpirationDate || undefined,
                })
              }
            >
              <Sheet size={15} className="text-green-600" /> Excel
            </Button>
          </div>
        </DialogHeader>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 py-3 border-b border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar por nome do material..."
              value={materialName}
              onChange={(e) => {
                setMaterialName(e.target.value)
                setPage(0)
              }}
              className="pl-9 h-10 text-sm rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium shrink-0">Vencimento até:</span>
            <Input
              type="date"
              min="2000-01-01"
              max="2099-12-31"
              value={maxExpirationDate}
              onChange={(e) => {
                setMaxExpirationDate(e.target.value)
                setPage(0)
              }}
              className="h-10 text-xs sm:text-sm rounded-xl w-40 sm:w-44"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {isLoading && (
            <div className="flex flex-col gap-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-8 text-center text-sm text-destructive font-medium">
              Erro ao carregar os registros de vencimento.
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
              <p className="text-base font-semibold text-gray-800">Tudo em dia!</p>
              <p className="text-xs text-gray-400 mt-1">Nenhum lote com validade próxima encontrado para este filtro.</p>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.lotCode || idx}-${item.materialName}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all shadow-xs gap-3"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-base font-bold text-gray-900 truncate">
                      {item.materialName || 'Material sem nome'}
                    </span>
                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                      {item.lotCode && (
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium">
                          Lote: <strong className="text-gray-900 font-mono">{item.lotCode}</strong>
                        </span>
                      )}
                      <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg font-medium">
                        Unidade: <strong className="text-slate-900">{item.measurementUnit || 'UN'}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl">
                      Qtd: {item.quantity ?? 0} {item.measurementUnit || 'un'}
                    </span>
                    {item.expirationDate && (
                      <span className="text-xs sm:text-sm font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
                        Vence: {formatDate(item.expirationDate)}
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
