'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Check, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useFinishEntry, useCancelEntry, useRemoveEntryItem } from '../hooks'
import { AddItemDialog } from './AddItemDialog'
import { formatDate, formatCurrency } from '@/shared/lib/format'
import { ENTRY_STATUS } from '@/shared/lib/icon-system'
import type { Entry, EntryStatus } from '../types'

const TYPE_LABELS: Record<string, string> = {
  SUPPLIER: 'Fornecedor',
  DONATION: 'Doação',
  RETURN: 'Devolução',
}

type Props = { entry: Entry }

export function EntryAccordion({ entry }: Props) {
  const [open, setOpen] = useState(false)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const finish = useFinishEntry()
  const cancel = useCancelEntry()
  const removeItem = useRemoveEntryItem()

  const isPending = entry.status === 'PENDING'
  const total = entry.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const status = ENTRY_STATUS[entry.status as EntryStatus] ?? ENTRY_STATUS.PENDING
  const { Icon: StatusIcon } = status

  async function handleFinish() {
    try { await finish.mutateAsync(entry.id); toast.success('Entrada finalizada!') }
    catch { toast.error('Erro ao finalizar entrada.') }
  }

  async function handleCancel() {
    try { await cancel.mutateAsync(entry.id); toast.success('Entrada cancelada.') }
    catch { toast.error('Erro ao cancelar entrada.') }
  }

  async function handleRemoveItem(itemId: number) {
    try { await removeItem.mutateAsync({ entryId: entry.id, itemId }); toast.success('Item removido.') }
    catch { toast.error('Erro ao remover item.') }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left"
        >
          {/* Status icon replaces circular badge */}
          <div className={`w-9 h-9 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
            <StatusIcon size={17} className={status.iconColor} />
          </div>

          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">Entrada #{entry.id}</span>
              <span className={`text-[11px] font-medium ${status.iconColor}`}>{status.label}</span>
            </div>
            <span className="text-[11px] text-gray-400">
              {TYPE_LABELS[entry.type] ?? entry.type}
              {entry.supplierName && ` · ${entry.supplierName}`}
              {` · `}{formatDate(entry.createdAt)}
            </span>
            <span className="text-[11px] text-gray-500">
              {entry.items.length} {entry.items.length === 1 ? 'item' : 'itens'}
              {total > 0 && ` · ${formatCurrency(total)}`}
            </span>
          </div>

          <div className="shrink-0 ml-1 text-gray-400">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {open && (
          <div className="border-t border-gray-50 px-4 pb-4 pt-3 flex flex-col gap-3">
            {entry.items.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">Nenhum item adicionado.</p>
            ) : (
              /* Inner list — lighter visual weight than the block */
              <div className="divide-y divide-gray-50">
                {entry.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                    <div className="w-0.5 h-8 rounded-full bg-brand/25 shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="text-xs font-medium text-gray-700 truncate">{item.materialName}</span>
                      <span className="text-[10px] text-gray-400">
                        {item.quantity} un · {formatCurrency(item.unitPrice)} · {formatCurrency(item.quantity * item.unitPrice)}
                        {item.lotCode && ` · Lote ${item.lotCode}`}
                      </span>
                    </div>
                    {isPending && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeItem.isPending}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-destructive hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                        aria-label="Remover item"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isPending && (
              <div className="flex flex-col gap-2 pt-1">
                <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs w-full" onClick={() => setAddItemOpen(true)}>
                  <Plus size={13} />
                  Adicionar Item
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs text-destructive hover:text-destructive border-red-200 hover:bg-red-50" onClick={handleCancel} disabled={cancel.isPending}>
                    <X size={13} />
                    Cancelar
                  </Button>
                  <Button size="sm" className="gap-1.5 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700" onClick={handleFinish} disabled={finish.isPending || entry.items.length === 0}>
                    <Check size={13} />
                    Finalizar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddItemDialog entryId={entry.id} open={addItemOpen} onOpenChange={setAddItemOpen} />
    </>
  )
}
