'use client'

import { useState } from 'react'
import { Search, Pencil, Trash2, TriangleAlert, Plus, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMaterials } from '../hooks'
import { MaterialFormDialog } from './MaterialFormDialog'
import { DeleteMaterialDialog } from './DeleteMaterialDialog'
import { MATERIALS_PAGE_SIZE, MATERIALS_SKELETON_COUNT } from '../constants'
import type { Material } from '../types'

export function MaterialList() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 300)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Material | null>(null)
  const [deleting, setDeleting] = useState<Material | null>(null)

  const { data, isLoading, isError } = useMaterials({
    page,
    size: MATERIALS_PAGE_SIZE,
    name: debouncedSearch || undefined,
  })

  const materials = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  function handleEdit(m: Material) { setEditing(m); setDialogOpen(true) }
  function handleNew() { setEditing(null); setDialogOpen(true) }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar material..."
            className="pl-8 rounded-xl text-sm"
          />
        </div>
        <Button onClick={handleNew} className="gap-1.5 rounded-xl px-3 shrink-0">
          <Plus size={15} />
          Novo
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: MATERIALS_SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-2xl animate-shimmer" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar materiais.</p>}

      {!isLoading && !isError && materials.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhum material encontrado.</div>
      )}

      {!isLoading && materials.map((m, i) => {
        const isLowStock = m.quantity <= m.minQuantity
        return (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Material icon block */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isLowStock ? 'bg-amber-50' : 'bg-violet-50'}`}>
              {isLowStock
                ? <TriangleAlert size={17} className="text-amber-500" />
                : <Package size={17} className="text-brand" />
              }
            </div>

            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="font-semibold text-gray-900 text-sm truncate">{m.name}</span>
              <span className="text-[11px] text-gray-400">{m.code} · {m.group.name}</span>
              <span className="text-[11px] text-gray-500">
                {m.quantity} {m.unit.abbreviation}
                {isLowStock
                  ? <span className="text-amber-500 font-medium"> · estoque baixo (mín {m.minQuantity})</span>
                  : <span className="text-gray-400"> · mín {m.minQuantity}</span>
                }
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleEdit(m)} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-violet-50 transition-colors cursor-pointer" aria-label="Editar material">
                <Pencil size={15} />
              </button>
              <button onClick={() => setDeleting(m)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors cursor-pointer" aria-label="Remover material">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )
      })}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer" aria-label="Página anterior">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer" aria-label="Próxima página">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <MaterialFormDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }} editing={editing} />
      <DeleteMaterialDialog material={deleting} onOpenChange={(v) => { if (!v) setDeleting(null) }} />
    </div>
  )
}
