import type { EntityId } from '@/shared/types/id'

export type TransferType =
  | 'SECTOR'
  | 'CLAIM'
  | 'DONATION'
  | 'EXPIRATION'
  | 'OTHERS'
  | 'INVENTORY_ADJUSTMENT'

export type TransferStatus = 'PENDING' | 'FINISHED' | 'CANCELED'

export type TransferItem = {
  id: EntityId
  name: string
  measurementUnit: string
  quantity: number
}

export type Transfer = {
  id: EntityId
  exitType: TransferType
  status: TransferStatus
  exitDate?: string | null
  requester?: string | null
  issuer?: string | null
  sector?: string | null
  createdAt: string
  items: TransferItem[]
}

export type CreateTransferPayload = {
  exitType: TransferType
  notes: string
  items: { materialId: EntityId; requestedQuantity: number }[]
}

export type ApproveTransferPayload = {
  items: { transferItemId: EntityId; approvedQuantity: number }[]
}

export type DisapproveTransferPayload = void // Backend expects no body for disapprove according to DTO list? Wait, I will just leave it empty.
