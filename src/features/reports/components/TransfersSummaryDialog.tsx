'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Sheet, ChevronLeft, ChevronRight, ArrowRightLeft, Package, Search } from 'lucide-react'
import { useTransfersSummary } from '../hooks'
import { formatDate } from '@/shared/lib/format'
import { reportsApi } from '../api'


type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function TransfersSummaryDialog({ open, onOpenChange }: Props) {
  const [page, setPage] = useState(0)
  const [materialName, setMaterialName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const filters = { materialName: materialName || undefined, startDate: startDate || undefined, endDate: endDate || undefined }
  const { data, isLoading, isError } = useTransfersSummary({ page, size: 10, ...filters }, open)
  const items = data?.content || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl lg:max-w-5xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-5 pb-5 pt-6 text-left sm:px-7 sm:pt-7">
          <div className="flex items-start gap-3 pr-6 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><ArrowRightLeft size={21} aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Relatório de movimentações</p>
              <DialogTitle className="text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">Histórico e Registro de Saídas / Transferências</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-5 text-slate-500">Consulte as movimentações de materiais transferidos.</DialogDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 sm:pl-[60px]">
            <span className="text-xs font-medium text-slate-500">{isLoading ? 'Carregando registros...' : isError ? 'Registros indisponíveis' : totalElements + (totalElements === 1 ? ' registro encontrado' : ' registros encontrados')}</span>
            <div className="flex items-center gap-2">
              <span className="mr-1 hidden text-xs text-slate-500 sm:inline">Exportar</span>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs text-slate-700 hover:border-red-200 hover:bg-red-50" onClick={() => reportsApi.exportTransfersPdf(filters)}><FileText size={15} className="text-red-500" aria-hidden="true" /> PDF</Button>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs text-slate-700 hover:border-green-200 hover:bg-green-50" onClick={() => reportsApi.exportTransfersExcel(filters)}><Sheet size={15} className="text-green-600" aria-hidden="true" /> Excel</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="col-span-2 lg:col-span-1"><label htmlFor="transfers-material" className="mb-1.5 block text-xs font-medium text-slate-600">Material</label><div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><Input id="transfers-material" placeholder="Buscar material..." value={materialName} onChange={(e) => { setMaterialName(e.target.value); setPage(0) }} className="h-10 rounded-xl pl-9 text-sm" /></div></div>
              <div className="min-w-0"><label htmlFor="transfers-start" className="mb-1.5 block text-xs font-medium text-slate-600">Data inicial</label><Input id="transfers-start" type="date" min="2000-01-01" max="2099-12-31" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(0) }} className="h-10 w-full min-w-0 rounded-xl text-sm" /></div>
              <div className="min-w-0"><label htmlFor="transfers-end" className="mb-1.5 block text-xs font-medium text-slate-600">Data final</label><Input id="transfers-end" type="date" min="2000-01-01" max="2099-12-31" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(0) }} className="h-10 w-full min-w-0 rounded-xl text-sm" /></div>
            </div>
          </div>

          <div className="bg-[#f8f8fb] px-5 py-5 sm:px-7">
            {isLoading && <div className="flex flex-col gap-3" aria-label="Carregando registros">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/60" />)}</div>}
            {isError && <div role="alert" className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm font-medium text-red-700">Erro ao carregar o registro de transferências.</div>}
            {!isLoading && !isError && items.length === 0 && <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center"><span className="mb-4 rounded-2xl bg-violet-50 p-4 text-violet-500"><ArrowRightLeft size={28} aria-hidden="true" /></span><p className="font-semibold text-slate-800">Nenhuma saída encontrada</p><p className="mt-1 text-sm text-slate-500">Não há registros para os filtros informados.</p></div>}
            {!isLoading && !isError && items.length > 0 && <div className="space-y-3">
              {items.map((item, idx) => <article key={(item.exitDate || 'transfer') + '-' + item.materialName + '-' + idx} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3"><span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 sm:flex"><Package size={19} aria-hidden="true" /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Material</p><h3 className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900 sm:text-base">{item.materialName || 'Material sem nome'}</h3></div></div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-amber-50 px-4 py-2.5 sm:min-w-32 sm:flex-col sm:items-start sm:gap-0.5"><span className="text-xs font-medium text-amber-700">Quantidade transferida</span><span className="text-lg font-bold leading-tight text-amber-700">-{item.quantity ?? 0}</span></div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 sm:ml-[52px] sm:grid-cols-3">
                  <div className="min-w-0"><dt className="text-xs text-slate-500">Unidade</dt><dd className="mt-1 break-words text-xs font-semibold text-slate-700">{item.measurementUnit || 'UN'}</dd></div>
                  {item.currentStock !== undefined && item.currentStock !== null && <div className="min-w-0"><dt className="text-xs text-slate-500">Saldo em estoque</dt><dd className="mt-1 text-xs font-semibold text-slate-700">{item.currentStock}</dd></div>}
                  <div className="min-w-0"><dt className="text-xs text-slate-500">Data de saída</dt><dd className="mt-1 text-xs font-semibold text-slate-700">{item.exitDate ? formatDate(item.exitDate) : 'Não informada'}</dd></div>
                </dl>
              </article>)}
            </div>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 text-xs text-slate-500 sm:px-7">
          <span>Total: <strong className="text-slate-700">{totalElements}</strong> registros de saída</span>
          <div className="flex items-center gap-2"><span className="mr-1">Página {totalPages > 0 ? page + 1 : 0} de {totalPages}</span>
            <Button variant="outline" size="icon" aria-label="Página anterior" className="h-9 w-9 rounded-xl" disabled={page === 0 || isLoading} onClick={() => setPage((p) => Math.max(0, p - 1))}><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="icon" aria-label="Próxima página" className="h-9 w-9 rounded-xl" disabled={page >= totalPages - 1 || isLoading} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
