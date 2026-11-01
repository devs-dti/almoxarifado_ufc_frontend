'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Sheet, ChevronLeft, ChevronRight, PackageSearch, Package } from 'lucide-react'
import { useInventoryReport } from '../hooks'
import { formatDate } from '@/shared/lib/format'
import { reportsApi } from '../api'

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function InventoryReportDialog({ open, onOpenChange }: Props) {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useInventoryReport({ page, size: 10 }, open)
  const items = data?.content || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl lg:max-w-5xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-5 pb-5 pt-6 text-left sm:px-7 sm:pt-7">
          <div className="flex items-start gap-3 pr-6 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><PackageSearch size={21} aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Relatório de estoque</p>
              <DialogTitle className="text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">Relação Geral de Itens em Estoque</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-5 text-slate-500">Consulte os lotes, as validades e os saldos dos materiais.</DialogDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 sm:pl-[60px]">
            <span className="text-xs font-medium text-slate-500">{isLoading ? 'Carregando registros...' : isError ? 'Registros indisponíveis' : `${totalElements} ${totalElements === 1 ? 'registro encontrado' : 'registros encontrados'}`}</span>
            <div className="flex items-center gap-2">
              <span className="mr-1 hidden text-xs text-slate-500 sm:inline">Exportar</span>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs text-slate-700 hover:border-red-200 hover:bg-red-50" onClick={() => reportsApi.exportInventoryPdf()}><FileText size={15} className="text-red-500" aria-hidden="true" /> PDF</Button>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs text-slate-700 hover:border-green-200 hover:bg-green-50" onClick={() => reportsApi.exportInventoryExcel()}><Sheet size={15} className="text-green-600" aria-hidden="true" /> Excel</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8f8fb] px-5 py-5 sm:px-7">
          {isLoading && <div className="flex flex-col gap-3" aria-label="Carregando registros">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/60" />)}</div>}
          {isError && <div role="alert" className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm font-medium text-red-700">Erro ao carregar os registros de estoque.</div>}
          {!isLoading && !isError && items.length === 0 && <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center"><span className="mb-4 rounded-2xl bg-violet-50 p-4 text-violet-500"><PackageSearch size={28} aria-hidden="true" /></span><p className="font-semibold text-slate-800">Nenhum registro encontrado</p><p className="mt-1 text-sm text-slate-500">Não há materiais com lotes cadastrados em estoque.</p></div>}
          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <article key={`${item.lotCode || 'lot'}-${item.materialName}-${idx}`} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 sm:flex"><Package size={19} aria-hidden="true" /></span>
                      <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Material</p><h3 className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900 sm:text-base">{item.materialName || 'Material sem nome'}</h3></div>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-violet-50 px-4 py-2.5 sm:min-w-28 sm:flex-col sm:items-start sm:gap-0.5">
                      <span className="text-xs font-medium text-violet-700">Saldo do lote</span><span className="text-lg font-bold leading-tight text-violet-700">{item.currentLotQuantity ?? 0}</span>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 sm:ml-[52px] sm:grid-cols-4">
                    <div className="min-w-0"><dt className="text-xs text-slate-500">Unidade</dt><dd className="mt-1 break-words text-xs font-semibold text-slate-700">{item.measurementUnitDescription || 'UN'}</dd></div>
                    <div className="min-w-0"><dt className="text-xs text-slate-500">Lote</dt><dd className="mt-1 break-all text-xs font-semibold text-slate-700">{item.lotCode || 'Não informado'}</dd></div>
                    <div className="min-w-0"><dt className="text-xs text-slate-500">Nota fiscal</dt><dd className="mt-1 break-words text-xs font-semibold text-slate-700">{item.invoiceNumber || 'Não informada'}</dd></div>
                    <div className="min-w-0"><dt className="text-xs text-slate-500">Validade</dt><dd className="mt-1 text-xs font-semibold text-slate-700">{item.expirationDate ? formatDate(item.expirationDate) : 'Não informada'}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 text-xs text-slate-500 sm:px-7">
          <span>Total: <strong className="text-slate-700">{totalElements}</strong> registros</span>
          <div className="flex items-center gap-2"><span className="mr-1">Página {totalPages > 0 ? page + 1 : 0} de {totalPages}</span>
            <Button variant="outline" size="icon" aria-label="Página anterior" className="h-9 w-9 rounded-xl" disabled={page === 0 || isLoading} onClick={() => setPage((p) => Math.max(0, p - 1))}><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="icon" aria-label="Próxima página" className="h-9 w-9 rounded-xl" disabled={page >= totalPages - 1 || isLoading} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
