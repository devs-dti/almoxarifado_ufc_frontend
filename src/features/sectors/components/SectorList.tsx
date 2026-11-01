'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Building2, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { EntityId } from '@/shared/types/id'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSectorsPage, useDeleteSector } from '../hooks'
import { SectorFormDialog } from './SectorFormDialog'
import type { Sector } from '../types'

export function SectorList() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [term] = useDebounceValue(search.trim(), 300)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState('name,asc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Sector | null>(null)
  const [deletingId, setDeletingId] = useState<EntityId | null>(null)
  const role = useAuthStore((s) => s.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN', 'MANAGER'])
  const canDelete = hasAnyRole(role, ['ADMIN'])

  const { data, isLoading, isError, refetch } = useSectorsPage({ page, size: pageSize, sort, search: term || undefined })
  const sectors = data?.content ?? []
  const deleteMutation = useDeleteSector()

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteMutation.mutateAsync(deletingId)
      if (sectors.length === 1 && page > 0) setPage((current) => current - 1)
      toast.success('Setor removido.')
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-2xl font-bold tracking-tight text-slate-900">Setores</h2><p className="mt-1 text-sm text-slate-500">Gerencie os setores vinculados ao almoxarifado.</p></div>
        {canManage && <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-4" size="sm"><Plus size={15} /> Novo setor</Button>}
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100/70 text-violet-700"><Building2 size={16} aria-hidden="true" /></span><div><p className="text-sm font-semibold text-slate-800">Todos os setores</p>{data && !isError && <p className="text-xs text-slate-500">{data.totalElements} {data.totalElements === 1 ? 'registro' : 'registros'}</p>}</div></div>
        <div className="flex flex-wrap gap-2">
          <label className="relative flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 focus-within:ring-2 focus-within:ring-violet-200 sm:flex-none"><span aria-hidden="true">Ordenar por</span><span aria-hidden="true" className="text-sm font-medium text-slate-800">{sort === 'name,asc' ? 'Nome (A–Z)' : 'Nome (Z–A)'}</span><select aria-label="Ordenar setores por" value={sort} onChange={(e) => { setSort(e.target.value); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value="name,asc">Nome (A–Z)</option><option value="name,desc">Nome (Z–A)</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" /></label>
          <label className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 focus-within:ring-2 focus-within:ring-violet-200"><span aria-hidden="true" className="text-sm font-medium text-slate-800">{pageSize}</span><span aria-hidden="true">por página</span><select aria-label="Setores por página" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" /></label>
        </div>
      </div>
      <div className="relative w-full sm:max-w-md"><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input aria-label="Buscar setores por nome ou código" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} placeholder="Buscar por nome ou código" className="h-10 rounded-xl bg-white pl-10 text-sm" /></div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && <div role="alert" className="py-8 text-center text-sm text-destructive">Erro ao carregar setores. <button type="button" onClick={() => refetch()} className="font-semibold underline">Tentar novamente</button></div>}

      {!isLoading && !isError && sectors.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">{search ? 'Nenhum setor encontrado para esta busca.' : 'Nenhum setor cadastrado.'}</div>
      )}

      {!isLoading && sectors.map((sector) => (
        <div key={sector.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-violet-200 sm:gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700"><Building2 size={20} aria-hidden="true" /></span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="break-words font-semibold text-slate-900 text-sm">{sector.name}</span>
            {sector.code && <span className="text-xs text-slate-500">Código: {sector.code}</span>}
          </div>
          {canManage && (
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button onClick={() => { setEditing(sector); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors" aria-label={`Editar setor ${sector.name}`}>
                <Pencil size={15} />
              </button>
              {canDelete && <button onClick={() => setDeletingId(sector.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors" aria-label={`Remover setor ${sector.name}`}>
                <Trash2 size={15} />
              </button>}
            </div>
          )}
        </div>
      ))}

      {!isLoading && !isError && data && data.totalElements > 0 && <nav aria-label="Paginação de setores" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"><p className="text-sm text-slate-600">Mostrando {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.totalElements)} de {data.totalElements} {data.totalElements === 1 ? 'setor' : 'setores'}</p><div className="flex items-center gap-2"><button type="button" aria-label="Página anterior" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronLeft size={17} /></button><span aria-live="polite" className="px-2 text-sm text-slate-600">Página {page + 1} de {data.totalPages}</span><button type="button" aria-label="Próxima página" disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronRight size={17} /></button></div></nav>}

      {canManage && (
        <SectorFormDialog
          open={dialogOpen}
          onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
          editing={editing}
        />
      )}

      <AlertDialog open={canDelete && deletingId !== null} onOpenChange={(v) => { if (!v) setDeletingId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover setor</AlertDialogTitle>
            <AlertDialogDescription>
              O setor será removido da listagem. Confirme para continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
