'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Check, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { EntityId } from '@/shared/types/id'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import { useFinishEntry, useCancelEntry, useRemoveEntryItem } from '../hooks'
import { AddItemDialog } from './AddItemDialog'
import { formatDate } from '@/shared/lib/format'
import type { Entry, EntryStatus } from '../types'

const STATUS_LABELS: Record<EntryStatus, string> = {
  PENDING: 'Pendente',
  FINISHED: 'Finalizada',
  CANCELED: 'Cancelada',
}

const STATUS_COLORS: Record<EntryStatus, string> = {
  PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
  FINISHED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  CANCELED: 'text-red-500 bg-red-50 border-red-200',
}

const TYPE_LABELS: Record<string, string> = {
  SUPPLIER: 'Fornecedor',
  DONATION: 'Doação',
  INVENTORY_ADJUSTMENT: 'Ajuste de Estoque',
  RETURN: 'Devolução',
  OTHERS: 'Outros',
}

const EXPIRATION_LABELS: Record<string, string> = {
  DATED: 'Vence em',
  NON_EXPIRING: 'Sem Validade',
  INDEFINITE: 'Indeterminado',
}

type Props = {
  entry: Entry
}

export function EntryAccordion({ entry }: Props) {
  const [open, setOpen] = useState(false)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const finish = useFinishEntry()
  const cancel = useCancelEntry()
  const removeItem = useRemoveEntryItem()
  const role = useAuthStore((s) => s.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN', 'MANAGER', 'STAFF'])

  const isPending = entry.status === 'PENDING'

  async function handleFinish() {
    try {
      await finish.mutateAsync(entry.id)
      toast.success('Entrada finalizada!')
    } catch {
      toast.error('Erro ao finalizar entrada.')
    }
  }

  async function handleCancel() {
    try {
      await cancel.mutateAsync(entry.id)
      toast.success('Entrada cancelada.')
    } catch {
      toast.error('Erro ao cancelar entrada.')
    }
  }

  async function handleRemoveItem(itemId: EntityId) {
    try {
      await removeItem.mutateAsync({ entryId: entry.id, itemId })
      toast.success('Item removido.')
    } catch {
      toast.error('Erro ao remover item.')
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">
                Entrada #{entry.id}
              </span>
              <span
                className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${STATUS_COLORS[entry.status]}`}
              >
                {STATUS_LABELS[entry.status]}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-gray-500">
              <span>{TYPE_LABELS[entry.entryType] ?? entry.entryType}</span>
              {entry.responsible && (
                <>
                  <span className="text-gray-200">·</span>
                  <span>Resp: {entry.responsible}</span>
                </>
              )}
              <span className="text-gray-200">·</span>
              <span>Chegada: {formatDate(entry.arrivalAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{entry.items.length} {entry.items.length === 1 ? 'item' : 'itens'}</span>
            </div>
          </div>
          <div className="shrink-0 ml-2 text-gray-400">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {open && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-3">
            {entry.notes && (
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                Observações: {entry.notes}
              </p>
            )}

            {entry.items.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">Nenhum item adicionado.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {entry.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-medium text-gray-800 truncate">
                        {item.materialName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {item.quantity} un
                        <span className="text-gray-300 mx-1">·</span>
                        {EXPIRATION_LABELS[item.expirationType]} {item.expirationDate ? formatDate(item.expirationDate) : ''}
                      </span>
                      {item.lotCode && (
                        <span className="text-[10px] text-gray-400">Lote: {item.lotCode}</span>
                      )}
                    </div>
                    {isPending && canManage && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeItem.isPending}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-destructive hover:bg-red-50 transition-colors shrink-0 ml-2"
                        aria-label="Remover item"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isPending && canManage && (
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-xl text-xs w-full"
                  onClick={() => setAddItemOpen(true)}
                >
                  <Plus size={13} />
                  Adicionar Item
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-xl text-xs text-destructive hover:text-destructive border-red-200 hover:bg-red-50"
                    onClick={handleCancel}
                    disabled={cancel.isPending}
                  >
                    <X size={13} />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleFinish}
                    disabled={finish.isPending || entry.items.length === 0}
                  >
                    <Check size={13} />
                    Finalizar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {canManage && (
        <AddItemDialog
          entryId={entry.id}
          open={addItemOpen}
          onOpenChange={setAddItemOpen}
        />
      )}
    </>
  )
}
