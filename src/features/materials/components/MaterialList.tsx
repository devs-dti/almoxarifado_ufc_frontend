'use client'

import { useState } from 'react'
import { Search, Pencil, Trash2, TriangleAlert, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  const { data: pageData, isLoading, isError } = useMaterials({
    page,
    size: MATERIALS_PAGE_SIZE,
    name: debouncedSearch || undefined,
  })

  const materials = pageData?.data || []
  const totalPages = pageData?.meta.totalPages || 0

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Materiais</h2>
          <div className="md:hidden">
            <Button onClick={handleNew} className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90 shrink-0" size="sm">
              <Plus size={15} />
              Novo
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              placeholder="Buscar material..."
              className="pl-8 h-8 rounded-lg text-xs w-full"
            />
          </div>
          <div className="hidden md:block">
            <Button onClick={handleNew} className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90 shrink-0" size="sm">
              <Plus size={15} />
              Novo
            </Button>
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

      {!isLoading && materials.map((m) => {
        const isLowStock = m.quantity <= m.minQuantity
        return (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-start justify-between shadow-sm"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm truncate">{m.name}</span>
                {isLowStock && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    <TriangleAlert size={10} />
                    Estoque baixo
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{m.code}</span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-[10px] rounded-full">
                  {m.group.name}
                </Badge>
                <span className="text-xs text-gray-500">
                  {m.quantity} {m.unit.abbreviation}
                  <span className="text-gray-300 mx-1">·</span>
                  mín {m.minQuantity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={() => handleEdit(m)}
                className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors"
                aria-label="Editar material"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleting(m)}
                className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors"
                aria-label="Remover material"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )
      })}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"
            aria-label="Próxima página"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <MaterialFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
        editing={editing}
      />

      <DeleteMaterialDialog
        material={deleting}
        onOpenChange={(v) => { if (!v) setDeleting(null) }}
      />
    </div>
  )
}
