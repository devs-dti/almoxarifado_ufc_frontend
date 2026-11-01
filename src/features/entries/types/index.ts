import type { EntityId } from '@/shared/types/id'

export type EntryStatus = 'PENDING' | 'FINISHED' | 'CANCELED'
export type EntryType = 'SUPPLIER' | 'DONATION' | 'INVENTORY_ADJUSTMENT' | 'RETURN' | 'OTHERS'
export type ExpirationType = 'DATED' | 'NON_EXPIRING' | 'INDEFINITE'

export type EntryItem = {
  id: EntityId
  materialName: string
  lotCode?: string
  quantity: number
  expirationType: ExpirationType
  expirationDate?: string | null
}

export type SupplierDetails = {
  supplierId: EntityId
  invoiceNumber: string
  invoiceIssueDate: string
  totalAmount: number
  biddingCode: string
  commitmentNote: string
}

export type SupplierDetailsResponse = SupplierDetails & { supplierName: string | null }

export type Entry = {
  id: EntityId
  arrivalAt: string
  entryType: EntryType
  status: EntryStatus
  responsible?: string
  notes?: string
  supplierDetails?: SupplierDetailsResponse | null
  items: EntryItem[]
}

export type CreateEntryPayload = {
  arrivalAt: string
  entryType: EntryType
  notes?: string
  supplierDetails?: SupplierDetails
  supplierDetailsConsistent?: boolean
}

export type AddEntryItemPayload = {
  materialId: EntityId
  quantity: number
  expirationType: ExpirationType
  validity?: string
  validityConsistentWithExpirationType?: boolean
}

export type UpdateEntryDetailsPayload = CreateEntryPayload
