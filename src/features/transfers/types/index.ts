import type { EntityId } from '@/shared/types/id'

export type TransferStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PARTIALLY_APPROVED'
  | 'DENIED'
  | 'CANCELED'

export type TransferItem = {
  id: EntityId
  materialId: EntityId
  materialName: string
  requestedQuantity: number
  approvedQuantity?: number
}

export type Transfer = {
  id: EntityId
  sectorId: EntityId
  sectorName: string
  requestedBy: string
  status: TransferStatus
  items: TransferItem[]
  createdAt: string
  resolvedAt?: string | null
}

export type CreateTransferPayload = {
  sectorId: EntityId
  items: { materialId: EntityId; requestedQuantity: number }[]
}

export type ApproveTransferPayload = {
  items: { transferItemId: EntityId; approvedQuantity: number }[]
}

export type DisapproveTransferPayload = {
  reason?: string
}
