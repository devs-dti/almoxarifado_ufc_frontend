'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Sheet, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react'
import { useInventoryReport } from '../hooks'
import { formatDate } from '@/shared/lib/format'
import { reportsApi } from '../api'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function InventoryReportDialog({ open, onOpenChange }: Props) {
  const [page, setPage] = useState(0)
  const pageSize = 10

  const { data, isLoading, isError } = useInventoryReport({ page, size: pageSize }, open)
  const items = data?.content || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pr-6 space-y-0 pb-2 border-b">
          <div>
            <DialogTitle className="text-base font-bold text-gray-900">
              Relação Geral de Itens em Estoque
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Listagem de lotes, validades e saldo físico atual
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 hover:border-red-200 hover:bg-red-50 text-gray-700"
              onClick={() => reportsApi.exportInventoryPdf()}
            >
              <FileText size={14} className="text-red-500" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 hover:border-green-200 hover:bg-green-50 text-gray-700"
              onClick={() => reportsApi.exportInventoryExcel()}
            >
              <Sheet size={14} className="text-green-600" /> Excel
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          {isLoading && (
            <div className="flex flex-col gap-2 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 text-center text-sm text-destructive">
              Erro ao carregar os registros de estoque.
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PackageSearch size={40} className="text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-700">Nenhum registro encontrado</p>
              <p className="text-xs text-gray-400">Não há materiais com lotes cadastrados em estoque.</p>
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
                      {item.invoiceNumber && (
                        <span>
                          NF: <strong className="text-gray-700">{item.invoiceNumber}</strong>
                        </span>
                      )}
                      {item.expirationDate && (
                        <span>
                          Validade: <strong className="text-gray-700">{formatDate(item.expirationDate)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <span>{item.currentLotQuantity ?? 0}</span>
                    <span className="text-[10px] font-normal text-purple-600">
                      {item.measurementUnitDescription || 'un'}
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
            Total: <strong>{totalElements}</strong> registros
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
