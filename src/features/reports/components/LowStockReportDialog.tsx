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
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pr-6 space-y-0 pb-2 border-b">
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <TriangleAlert size={18} className="text-amber-500" />
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
              className="h-8 text-xs gap-1 hover:border-red-200 hover:bg-red-50 text-gray-700"
              onClick={() => reportsApi.exportLowStockPdf({ includeExpired })}
            >
              <FileText size={14} className="text-red-500" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 hover:border-green-200 hover:bg-green-50 text-gray-700"
              onClick={() => reportsApi.exportLowStockExcel({ includeExpired })}
            >
              <Sheet size={14} className="text-green-600" /> Excel
            </Button>
          </div>
        </DialogHeader>

        {/* Filtro simples */}
        <div className="flex items-center justify-between py-1 px-1 text-xs text-gray-600 bg-gray-50/60 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeExpired}
              onChange={(e) => {
                setIncludeExpired(e.target.checked)
                setPage(0)
              }}
              className="rounded border-gray-300 text-brand focus:ring-brand"
            />
            <span>Incluir lotes vencidos no cálculo</span>
          </label>
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
              Erro ao carregar a lista de estoque baixo.
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PackageCheck size={40} className="text-emerald-500 mb-2" />
              <p className="text-sm font-medium text-gray-800">Estoque Regularizado</p>
              <p className="text-xs text-gray-400">Nenhum item com estoque crítico ou zerado no momento.</p>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div
                  key={`${item.materialName}-${idx}`}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-amber-100 bg-amber-50/30 hover:bg-amber-50/60 transition-colors shadow-sm"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="text-xs font-semibold text-gray-900 truncate">
                      {item.materialName || 'Material sem nome'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Unidade de Medida: <strong className="text-gray-700">{item.measurementUnit || 'UN'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <span>{item.quantity ?? 0}</span>
                    <span className="text-[10px] font-normal text-red-600">
                      {item.measurementUnit || 'un'}
                    </span>
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
