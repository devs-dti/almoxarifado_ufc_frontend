'use client'

import { useState } from 'react'
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Eye, ArrowDownUp, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMaterials } from '../hooks'
import { MaterialDetailsDialog } from './MaterialDetailsDialog'
import { MaterialFormDialog } from './MaterialFormDialog'
import { DeleteMaterialDialog } from './DeleteMaterialDialog'
import { MATERIALS_SKELETON_COUNT } from '../constants'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import type { Material } from '../types'

export function MaterialList() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [code, setCode] = useState('')
  const [group, setGroup] = useState('')
  const [unit, setUnit] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState('name,asc')
  const [debouncedSearch] = useDebounceValue(search.trim(), 300)
  const [debouncedCode] = useDebounceValue(code.trim(), 300)
  const [debouncedGroup] = useDebounceValue(group.trim(), 300)
  const [debouncedUnit] = useDebounceValue(unit.trim(), 300)
  const sortLabels: Record<string, string> = { 'name,asc': 'Nome (A–Z)', 'name,desc': 'Nome (Z–A)', 'internalCode,asc': 'Código (A–Z)', 'internalCode,desc': 'Código (Z–A)' }

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Material | null>(null)
  const [editing, setEditing] = useState<Material | null>(null)
  const [deleting, setDeleting] = useState<Material | null>(null)
  const role = useAuthStore((s) => s.user?.role)
  const canWrite = hasAnyRole(role, ['ADMIN', 'MANAGER'])
  const canDelete = hasAnyRole(role, ['ADMIN'])

  const { data: pageData, isLoading, isError } = useMaterials({
    page,
    size: pageSize,
    sort,
    search: debouncedSearch || undefined,
    internalCode: debouncedCode || undefined,
    materialGroup: debouncedGroup || undefined,
    measurementUnit: debouncedUnit || undefined,
  })

  const materials = pageData?.content ?? []
  const totalPages = pageData?.totalPages ?? 0

  function handleEdit(m: Material) {
    setEditing(m)
    setDialogOpen(true)
  }

  function handleNew() {
    setEditing(null)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Materiais</h2>

        {canWrite && <Button onClick={handleNew} className="gap-1.5 rounded-xl px-4 bg-brand hover:bg-brand/90 shrink-0" size="sm"><Plus size={15} /> Novo material</Button>}
      </div>

      <div className="space-y-4 border-b border-slate-200/80 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100/70 text-violet-700"><ArrowDownUp size={16} aria-hidden="true" /></span><div><p className="text-sm font-semibold text-slate-800">Todos os materiais</p>{pageData && !isError && <p className="text-xs text-slate-500">{pageData.totalElements} {pageData.totalElements === 1 ? 'registro' : 'registros'}</p>}</div></div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 transition-colors hover:border-violet-200 focus-within:ring-2 focus-within:ring-violet-200 sm:flex-none"><span aria-hidden="true">Ordenar por</span><span aria-hidden="true" className="text-sm font-medium text-slate-800">{sortLabels[sort]}</span><select aria-label="Ordenar materiais por" value={sort} onChange={(e) => { setSort(e.target.value); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value="name,asc">Nome (A–Z)</option><option value="name,desc">Nome (Z–A)</option><option value="internalCode,asc">Código (A–Z)</option><option value="internalCode,desc">Código (Z–A)</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" /></label>
            <label className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 hover:border-violet-200 focus-within:ring-2 focus-within:ring-violet-200"><span aria-hidden="true" className="text-sm font-medium text-slate-800">{pageSize}</span><span aria-hidden="true">por página</span><select aria-label="Materiais por página" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" /></label>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2"><p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><SlidersHorizontal size={16} className="text-violet-700" aria-hidden="true" /> Filtros</p>{(search || code || group || unit) && <button type="button" onClick={() => { setSearch(''); setCode(''); setGroup(''); setUnit(''); setPage(0) }} className="text-xs font-semibold text-violet-700 hover:underline">Limpar filtros</button>}</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-xs font-medium text-slate-600">Nome ou descrição<div className="relative"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} placeholder="Buscar material" className="h-10 rounded-xl bg-white pl-9 text-sm" /></div></label>
            <label className="space-y-1 text-xs font-medium text-slate-600">Código interno<Input value={code} onChange={(e) => { setCode(e.target.value); setPage(0) }} placeholder="Ex.: MAT-001" className="h-10 rounded-xl bg-white text-sm" /></label>
            <label className="space-y-1 text-xs font-medium text-slate-600">Grupo<Input value={group} onChange={(e) => { setGroup(e.target.value); setPage(0) }} placeholder="Nome do grupo" className="h-10 rounded-xl bg-white text-sm" /></label>
            <label className="space-y-1 text-xs font-medium text-slate-600">Unidade de medida<Input value={unit} onChange={(e) => { setUnit(e.target.value); setPage(0) }} placeholder="Nome da unidade" className="h-10 rounded-xl bg-white text-sm" /></label>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: MATERIALS_SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-sm text-destructive py-8">
          Erro ao carregar materiais.
        </p>
      )}

      {!isLoading && !isError && materials.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Nenhum material encontrado.
        </div>
      )}

      {!isLoading && materials.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-start justify-between shadow-sm"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                    <span className="text-xs font-bold uppercase">{m.name.substring(0, 2)}</span>
                  </div>
                )}
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm break-words">{m.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {m.internalCode}
                    {m.description && <span className="text-gray-300 mx-1">·</span>}
                    {m.description && <span className="text-gray-500 truncate max-w-[150px] inline-block align-bottom">{m.description}</span>}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-[10px] rounded-full">
                  {m.materialGroupName}
                </Badge>
                <span className="text-xs text-gray-500">
                  {m.measurementUnitName}
                  <span className="text-gray-300 mx-1">·</span>
                  mín {m.minQuantity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
                <button onClick={() => setSelected(m)} className="p-2 rounded-xl text-gray-500 hover:text-brand hover:bg-purple-50 transition-colors" aria-label={`Ver detalhes de ${m.name}`}><Eye size={17} /></button>
                {canWrite && (
                  <button
                    onClick={() => handleEdit(m)}
                    className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors"
                    aria-label="Editar material"
                  >
                    <Pencil size={15} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => setDeleting(m)}
                    className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors"
                    aria-label="Remover material"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
            </div>
          </div>
        ))
      }

      {!isLoading && !isError && pageData && pageData.totalElements > 0 && (
        <nav aria-label="Paginação de materiais" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-600">Mostrando {page * pageSize + 1}–{Math.min((page + 1) * pageSize, pageData.totalElements)} de {pageData.totalElements} {pageData.totalElements === 1 ? 'material' : 'materiais'}</p>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={17} /></button><span aria-live="polite" className="px-2 text-sm text-slate-600">Página {page + 1} de {totalPages}</span><button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40" aria-label="Próxima página"><ChevronRight size={17} /></button></div>
        </nav>
      )}

      <MaterialDetailsDialog material={selected} onClose={() => setSelected(null)} onEdit={canWrite ? (material) => { setSelected(null); handleEdit(material) } : undefined} />

      {canWrite && (
        <MaterialFormDialog
          open={dialogOpen}
          onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
          editing={editing}
        />
      )}

      {canDelete && (
        <DeleteMaterialDialog
          material={deleting}
          onOpenChange={(v) => { if (!v) setDeleting(null) }}
        />
      )}
    </div>
  )
}
