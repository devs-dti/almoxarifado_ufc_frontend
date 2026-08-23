'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Sheet, ChevronLeft, ChevronRight, TriangleAlert, PackageCheck } from 'lucide-react'
import { useLowStockReport } from '../hooks'
import { reportsApi } from '../api'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function LowStockReportDialog({ open, onOpenChange }: Props) {
  const [page, setPage] = useState(0)
  const [includeExpired, setIncludeExpired] = useState(false)
  const pageSize = 10

  const { data, isLoading, isError } = useLowStockReport(
    { page, size: pageSize, includeExpired },
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
              <TriangleAlert size={22} className="text-amber-500" />
              Materiais com Estoque Zerado ou Baixo
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Relação de itens que necessitam de reposição imediata
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 hover:border-red-200 hover:bg-red-50 text-gray-700 rounded-xl"
              onClick={() => reportsApi.exportLowStockPdf({ includeExpired })}
            >
              <FileText size={15} className="text-red-500" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 hover:border-green-200 hover:bg-green-50 text-gray-700 rounded-xl"
              onClick={() => reportsApi.exportLowStockExcel({ includeExpired })}
            >
              <Sheet size={15} className="text-green-600" /> Excel
            </Button>
          </div>
        </DialogHeader>

        {/* Filtro simples */}
        <div className="flex items-center justify-between py-2 px-3 text-xs sm:text-sm text-gray-700 bg-gray-50/80 rounded-xl border border-gray-100">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeExpired}
              onChange={(e) => {
                setIncludeExpired(e.target.checked)
                setPage(0)
              }}
              className="rounded border-gray-300 text-brand focus:ring-brand h-4 w-4"
            />
            <span className="font-medium">Incluir lotes vencidos no cálculo</span>
          </label>
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
              Erro ao carregar a lista de estoque baixo.
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PackageCheck size={48} className="text-emerald-500 mb-3" />
              <p className="text-base font-semibold text-gray-800">Estoque Regularizado</p>
              <p className="text-xs text-gray-400 mt-1">Nenhum item com estoque crítico ou zerado no momento.</p>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.materialName}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-amber-200/60 bg-amber-50/30 hover:bg-amber-50/60 hover:shadow-md transition-all shadow-xs gap-3"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-base font-bold text-gray-900 truncate">
                      {item.materialName || 'Material sem nome'}
                    </span>
                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-600">
                      <span className="bg-amber-100/60 text-amber-900 px-2.5 py-1 rounded-lg font-medium">
                        Unidade de Medida: <strong className="text-amber-950">{item.measurementUnit || 'UN'}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-100">
                    <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-sm sm:text-base font-extrabold shadow-2xs">
                      <span>Saldo Atual: {item.quantity ?? 0}</span>
                      <span className="text-xs font-medium text-red-600">
                        {item.measurementUnit || 'un'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com Paginação Server-Side */}
        <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
          <span>
            Total: <strong>{totalElements}</strong> materiais críticos
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
