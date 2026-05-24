'use client'

import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntries } from '../hooks'
import { EntryAccordion } from './EntryAccordion'
import { CreateEntryDialog } from './CreateEntryDialog'

const PAGE_SIZE = 10

export function EntryList() {
  const [page, setPage] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading, isError } = useEntries({ page, size: PAGE_SIZE })
  const entries = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Entradas</h2>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5 rounded-xl px-3" size="sm">
          <Plus size={15} />
          Nova Entrada
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-sm text-destructive py-8">
          Erro ao carregar entradas.
        </p>
      )}

      {!isLoading && !isError && entries.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Nenhuma entrada encontrada.
        </div>
      )}

      {!isLoading && entries.map((entry) => (
        <EntryAccordion key={entry.id} entry={entry} />
      ))}

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
          <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
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

      <CreateEntryDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
