'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSuppliers, useDeleteSupplier } from '../hooks'
import { SupplierFormDialog } from './SupplierFormDialog'
import type { Supplier } from '../types'

export function SupplierList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: suppliers = [], isLoading, isError } = useSuppliers()
  const deleteMutation = useDeleteSupplier()

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Fornecedor removido.')
    } catch {
      toast.error('Erro ao remover fornecedor.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Fornecedores</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-1.5 rounded-xl px-3" size="sm">
          <Plus size={15} />
          Novo
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-sm text-destructive py-8">Erro ao carregar fornecedores.</p>}

      {!isLoading && suppliers.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nenhum fornecedor cadastrado.</div>
      )}

      {!isLoading && suppliers.map((supplier) => (
        <div key={supplier.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-start justify-between shadow-sm">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-gray-900 text-sm">{supplier.name}</span>
            {supplier.cnpj && <span className="text-xs text-gray-400 font-mono">{supplier.cnpj}</span>}
            <div className="flex items-center gap-3 flex-wrap">
              {supplier.email && (
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Mail size={10} />{supplier.email}
                </span>
              )}
              {supplier.phone && (
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Phone size={10} />{supplier.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {deletingId === supplier.id ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Confirmar?</span>
                <button onClick={() => handleDelete(supplier.id)} className="text-xs font-medium text-destructive px-2 py-1 rounded-lg hover:bg-red-50">Sim</button>
                <button onClick={() => setDeletingId(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100">Não</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setEditing(supplier); setDialogOpen(true) }} className="p-2 rounded-xl text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeletingId(supplier.id)} className="p-2 rounded-xl text-gray-400 hover:text-destructive hover:bg-red-50 transition-colors" aria-label="Remover">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <SupplierFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null) }}
        editing={editing}
      />
    </div>
  )
}
