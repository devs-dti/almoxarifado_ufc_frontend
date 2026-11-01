'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
      <DialogContent className="flex max-h-[90dvh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl lg:max-w-5xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-5 pb-5 pt-6 text-left sm:px-7 sm:pt-7">
          <div className="flex items-start gap-3 pr-6 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><TriangleAlert size={21} aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Relatório de estoque</p>
              <DialogTitle className="text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">Materiais com Estoque Zerado ou Baixo</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-5 text-slate-500">Acompanhe os materiais com saldo baixo ou zerado.</DialogDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 sm:pl-[60px]">
            <span className="text-xs font-medium text-slate-500">{isLoading ? 'Carregando materiais...' : isError ? 'Materiais indisponíveis' : totalElements + (totalElements === 1 ? ' material encontrado' : ' materiais encontrados')}</span>
            <div className="flex items-center gap-2">
              <span className="mr-1 hidden text-xs text-slate-500 sm:inline">Exportar</span>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs text-slate-700 hover:border-red-200 hover:bg-red-50" onClick={() => reportsApi.exportLowStockPdf({ includeExpired })}><FileText size={15} className="text-red-500" aria-hidden="true" /> PDF</Button>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs text-slate-700 hover:border-green-200 hover:bg-green-50" onClick={() => reportsApi.exportLowStockExcel({ includeExpired })}><Sheet size={15} className="text-green-600" aria-hidden="true" /> Excel</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <input type="checkbox" checked={includeExpired} onChange={(e) => { setIncludeExpired(e.target.checked); setPage(0) }} className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600" />
              <span><span className="block text-sm font-medium text-slate-700">Incluir lotes vencidos no cálculo</span><span className="mt-1 block text-xs leading-5 text-slate-500">Considere também os lotes vencidos ao consultar o saldo dos materiais.</span></span>
            </label>
          </div>
          <div className="bg-[#f8f8fb] px-5 py-5 sm:px-7">
            {isLoading && <div className="flex flex-col gap-3" aria-label="Carregando materiais">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/60" />)}</div>}
            {isError && <div role="alert" className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm font-medium text-red-700">Erro ao carregar a lista de estoque baixo.</div>}
            {!isLoading && !isError && items.length === 0 && <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center"><span className="mb-4 rounded-2xl bg-emerald-50 p-4 text-emerald-600"><PackageCheck size={28} aria-hidden="true" /></span><p className="font-semibold text-slate-800">Nenhum material encontrado</p><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Não há materiais com estoque baixo ou zerado para a opção selecionada.</p></div>}
            {!isLoading && !isError && items.length > 0 && <div className="space-y-3">
              {items.map((item, idx) => <article key={(item.materialName || 'material') + '-' + idx} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Material</p><h3 className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900 sm:text-base">{item.materialName || 'Material sem nome'}</h3></div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-amber-50 px-4 py-2.5 sm:min-w-32 sm:flex-col sm:items-start sm:gap-0.5"><span className="text-xs font-medium text-amber-800">Saldo atual</span><span className="text-lg font-bold leading-tight text-amber-800">{item.quantity ?? 0}</span></div>
                </div>
                <dl className="mt-4 border-t border-slate-100 pt-4"><div><dt className="text-xs text-slate-500">Unidade</dt><dd className="mt-1 break-words text-xs font-semibold text-slate-700">{item.measurementUnit || 'UN'}</dd></div></dl>
              </article>)}
            </div>}
          </div>
        </div>
        {/* Footer com Paginação Server-Side */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 text-xs text-slate-500 sm:px-7">
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
              className="h-9 w-9 rounded-xl"
              aria-label="Página anterior" disabled={page === 0 || isLoading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              aria-label="Próxima página" disabled={page >= totalPages - 1 || isLoading}
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
