'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import { useDisapproveTransfer } from '../hooks'
import { ApproveTransferDialog } from './ApproveTransferDialog'
import { formatDate } from '@/shared/lib/format'
import type { Transfer, TransferStatus } from '../types'

const STATUS_LABELS: Record<TransferStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  PARTIALLY_APPROVED: 'Parcial',
  DENIED: 'Negada',
  CANCELED: 'Cancelada',
}

const STATUS_COLORS: Record<TransferStatus, string> = {
  PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
  APPROVED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  PARTIALLY_APPROVED: 'text-blue-600 bg-blue-50 border-blue-200',
  DENIED: 'text-red-500 bg-red-50 border-red-200',
  CANCELED: 'text-gray-400 bg-gray-50 border-gray-200',
}

type Props = {
  transfer: Transfer
}

export function TransferAccordion({ transfer }: Props) {
  const [open, setOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const disapprove = useDisapproveTransfer()
  const role = useAuthStore((s) => s.user?.role)
  const canApprove = hasAnyRole(role, ['MANAGER'])
  const canDisapprove = hasAnyRole(role, ['ADMIN', 'MANAGER'])

  const isPending = transfer.status === 'PENDING'

  async function handleDeny() {
    try {
      await disapprove.mutateAsync({ id: transfer.id })
      toast.success('Transferência negada.')
    } catch {
      toast.error('Erro ao negar transferência.')
    }
  }

  async function handleCancel() {
    try {
      await disapprove.mutateAsync({ id: transfer.id })
      toast.success('Transferência cancelada.')
    } catch {
      toast.error('Erro ao cancelar transferência.')
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
                Transferência #{transfer.id}
              </span>
              <span
                className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${STATUS_COLORS[transfer.status]}`}
              >
                {STATUS_LABELS[transfer.status]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{transfer.sectorName}</span>
              <span className="text-gray-200">·</span>
              <span>{transfer.requestedBy}</span>
              <span className="text-gray-200">·</span>
              <span>{formatDate(transfer.createdAt)}</span>
            </div>
            <span className="text-xs text-gray-500">
              {transfer.items.length} {transfer.items.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <div className="shrink-0 ml-2 text-gray-400">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {open && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {transfer.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
                >
                  <span className="text-xs font-medium text-gray-800 truncate">
                    {item.materialName}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 shrink-0 ml-2">
                    <span>Solicitado: {item.requestedQuantity}</span>
                    {item.approvedQuantity !== undefined && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-emerald-600 font-medium">
                          Aprovado: {item.approvedQuantity}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isPending && (canDisapprove || canApprove) && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {canDisapprove && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 rounded-xl text-xs text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCancel}
                    disabled={disapprove.isPending}
                  >
                    <X size={12} />
                    Cancelar
                  </Button>
                )}
                {canDisapprove && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 rounded-xl text-xs"
                    onClick={handleDeny}
                    disabled={disapprove.isPending}
                  >
                    Negar
                  </Button>
                )}
                {canApprove && (
                  <Button
                    size="sm"
                    className="gap-1 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setApproveOpen(true)}
                  >
                    <Check size={12} />
                    Aprovar
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {canApprove && (
        <ApproveTransferDialog
          transfer={approveOpen ? transfer : null}
          onOpenChange={setApproveOpen}
        />
      )}
    </>
  )
}
