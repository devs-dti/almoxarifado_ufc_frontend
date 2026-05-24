export type EntryStatus = 'PENDING' | 'FINISHED' | 'CANCELED'
export type EntryType = 'SUPPLIER' | 'DONATION' | 'RETURN'

export type EntryItem = {
  id: number
  materialId: number
  materialName: string
  quantity: number
  unitPrice: number
  lotId?: number
  lotCode?: string
  expiresAt?: string | null
}

export type EntryInvoice = {
  number: string
  issueDate: string
  value: number
}

export type Entry = {
  id: number
  status: EntryStatus
  type: EntryType
  supplierId?: number
  supplierName?: string
  contractId?: number
  responsible?: string
  invoice?: EntryInvoice | null
  items: EntryItem[]
  createdAt: string
  finishedAt?: string | null
}

export type CreateEntryPayload = {
  type: EntryType
  supplierId?: number
  contractId?: number
}

export type AddEntryItemPayload = {
  materialId: number
  quantity: number
  unitPrice: number
  expiresAt?: string
}

export type AttachInvoicePayload = {
  number: string
  issueDate: string
  value: number
}
