import type { EntityId } from '@/shared/types/id'

export type EntryStatus = 'PENDING' | 'FINISHED' | 'CANCELED'
export type EntryType = 'SUPPLIER' | 'DONATION' | 'RETURN'

export type EntryItem = {
  id: EntityId
  materialId: EntityId
  materialName: string
  quantity: number
  unitPrice: number
  lotId?: EntityId
  lotCode?: string
  expiresAt?: string | null
}

export type EntryInvoice = {
  number: string
  issueDate: string
  value: number
}

export type Entry = {
  id: EntityId
  status: EntryStatus
  type: EntryType
  supplierId?: EntityId
  supplierName?: string
  contractId?: EntityId
  responsible?: string
  invoice?: EntryInvoice | null
  items: EntryItem[]
  createdAt: string
  finishedAt?: string | null
}

export type CreateEntryPayload = {
  type: EntryType
  supplierId?: EntityId
  contractId?: EntityId
}

export type AddEntryItemPayload = {
  materialId: EntityId
  quantity: number
  unitPrice: number
  expiresAt?: string
}

export type AttachInvoicePayload = {
  number: string
  issueDate: string
  value: number
}
