'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useUpdateTransferStatus } from '../hooks'
import { ApproveTransferDialog } from './ApproveTransferDialog'
import { formatDate } from '@/shared/lib/format'
import { TRANSFER_STATUS } from '@/shared/lib/icon-system'
import type { Transfer, TransferStatus } from '../types'

type Props = { transfer: Transfer }

export function TransferAccordion({ transfer }: Props) {
  const [open, setOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const updateStatus = useUpdateTransferStatus()

  const isPending = transfer.status === 'PENDING'
  const status = TRANSFER_STATUS[transfer.status as TransferStatus] ?? TRANSFER_STATUS.PENDING
  const { Icon: StatusIcon } = status

  async function handleDeny() {
    try { await updateStatus.mutateAsync({ id: transfer.id, data: { status: 'DENIED' } }); toast.success('Transferência negada.') }
    catch { toast.error('Erro ao negar transferência.') }
  }

  async function handleCancel() {
    try { await updateStatus.mutateAsync({ id: transfer.id, data: { status: 'CANCELED' } }); toast.success('Transferência cancelada.') }
    catch { toast.error('Erro ao cancelar transferência.') }
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
              <span className="font-semibold text-gray-900 text-sm">Transferência #{transfer.id}</span>
              <span className={`text-[11px] font-medium ${status.iconColor}`}>{status.label}</span>
            </div>
            <span className="text-[11px] text-gray-400">
              {transfer.sectorName} · {transfer.requestedBy} · {formatDate(transfer.createdAt)}
            </span>
            <span className="text-[11px] text-gray-500">
              {transfer.items.length} {transfer.items.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <div className="shrink-0 ml-1 text-gray-400">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {open && (
          <div className="border-t border-gray-50 px-4 pb-4 pt-3 flex flex-col gap-3">
            {/* Inner list — lighter than block */}
            <div className="divide-y divide-gray-50">
              {transfer.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <div className="w-0.5 h-8 rounded-full bg-brand/25 shrink-0" />
                  <span className="text-xs font-medium text-gray-700 truncate flex-1">{item.materialName}</span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 shrink-0">
                    <span>Solicitado: {item.requestedQuantity}</span>
                    {item.approvedQuantity !== undefined && (
                      <span className="text-brand font-medium">Aprovado: {item.approvedQuantity}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isPending && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Button size="sm" variant="outline" className="gap-1 rounded-xl text-xs text-destructive hover:text-destructive border-red-200 hover:bg-red-50" onClick={handleCancel} disabled={updateStatus.isPending}>
                  <X size={12} />
                  Cancelar
                </Button>
                <Button size="sm" variant="outline" className="gap-1 rounded-xl text-xs" onClick={handleDeny} disabled={updateStatus.isPending}>
                  Negar
                </Button>
                <Button size="sm" className="gap-1 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => setApproveOpen(true)}>
                  <Check size={12} />
                  Aprovar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ApproveTransferDialog transfer={approveOpen ? transfer : null} onOpenChange={setApproveOpen} />
    </>
  )
}
