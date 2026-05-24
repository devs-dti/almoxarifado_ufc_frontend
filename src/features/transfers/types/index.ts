export type TransferStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PARTIALLY_APPROVED'
  | 'DENIED'
  | 'CANCELED'

export type TransferItem = {
  id: number
  materialId: number
  materialName: string
  requestedQuantity: number
  approvedQuantity?: number
}

export type Transfer = {
  id: number
  sectorId: number
  sectorName: string
  requestedBy: string
  status: TransferStatus
  items: TransferItem[]
  createdAt: string
  resolvedAt?: string | null
}

export type CreateTransferPayload = {
  sectorId: number
  items: { materialId: number; requestedQuantity: number }[]
}

export type ApproveTransferPayload = {
  items: { itemId: number; approvedQuantity: number }[]
}

export type UpdateTransferStatusPayload = {
  status: 'CANCELED' | 'DENIED'
  reason?: string
}
