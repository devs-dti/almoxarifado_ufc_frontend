'use client'

import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, ArrowDownUp, ChevronDown, Search } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import { useTransfers } from '../hooks'
import { TransferAccordion } from './TransferAccordion'
import { CreateTransferDialog } from './CreateTransferDialog'


export function TransferList() {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState('createdAt,desc')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search.trim(), 300)
  const [createOpen, setCreateOpen] = useState(false)
  const role = useAuthStore((s) => s.user?.role)
  const canCreate = hasAnyRole(role, ['ADMIN', 'MANAGER', 'STAFF'])

  const { data, isLoading, isError } = useTransfers({
    page,
    size: pageSize,
    sort,
    search: debouncedSearch || undefined,
  })
  const transfers = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Transferências</h2>

        {canCreate && (
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5 rounded-xl px-4 bg-brand hover:bg-brand/90 shrink-0" size="sm">
            <Plus size={15} /> Nova Transferência
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100/70 text-violet-700"><ArrowDownUp size={16} aria-hidden="true" /></span>
          <div><p className="text-sm font-semibold text-slate-800">Todas as transferências</p>{data && !isError && <p className="text-xs text-slate-500">{data.totalElements} {data.totalElements === 1 ? 'registro' : 'registros'}</p>}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 transition-colors hover:border-violet-200 focus-within:ring-2 focus-within:ring-violet-200 sm:flex-none">
            <span aria-hidden="true" className="shrink-0">Ordenar por</span>
            <span aria-hidden="true" className="min-w-0 truncate text-sm font-medium text-slate-800">{({ 'createdAt,desc': 'Mais recentes', 'createdAt,asc': 'Mais antigas', 'status,asc': 'Status (A–Z)', 'status,desc': 'Status (Z–A)', 'exitType,asc': 'Tipo de saída' } as Record<string, string>)[sort]}</span>
            <select aria-label="Ordenar por" value={sort} onChange={(event) => { setSort(event.target.value); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
              <option value="createdAt,desc">Mais recentes</option>
              <option value="createdAt,asc">Mais antigas</option>
              <option value="status,asc">Status (A–Z)</option>
              <option value="status,desc">Status (Z–A)</option>
              <option value="exitType,asc">Tipo de saída</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" />
          </label>
          <label className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 transition-colors hover:border-violet-200 focus-within:ring-2 focus-within:ring-violet-200">
            <span aria-hidden="true" className="text-sm font-medium text-slate-800">{pageSize}</span>
            <span aria-hidden="true" className="whitespace-nowrap">por página</span>
            <select aria-label="Transferências por página" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
              <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className="relative w-full sm:max-w-md"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><Input aria-label="Buscar por setor ou solicitante" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} placeholder="Buscar por setor ou solicitante" className="h-10 rounded-xl bg-white pl-10 text-sm" /></div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-sm text-destructive py-8">
          Erro ao carregar transferências.
        </p>
      )}

      {!isLoading && !isError && transfers.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Nenhuma transferência encontrada.
        </div>
      )}

      {!isLoading && transfers.map((transfer) => (
        <TransferAccordion key={transfer.id} transfer={transfer} />
      ))}

      {!isLoading && !isError && data && data.totalElements > 0 && (
        <nav aria-label="Paginação de transferências" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-600">Mostrando {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.totalElements)} de {data.totalElements} {data.totalElements === 1 ? 'transferência' : 'transferências'}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={17} /></button>
            <span aria-live="polite" className="px-2 text-sm text-slate-600">Página {page + 1} de {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40" aria-label="Próxima página"><ChevronRight size={17} /></button>
          </div>
        </nav>
      )}

      {canCreate && <CreateTransferDialog open={createOpen} onOpenChange={setCreateOpen} />}
    </div>
  )
}

