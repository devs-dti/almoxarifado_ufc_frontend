import type { EntityId } from '@/shared/types/id'

export type InventoryMaterial = {
  materialId: EntityId
  materialName: string
  code: string
  quantity: number
  totalValue: number
  abcCurve: 'A' | 'B' | 'C'
}

export type InventoryReport = {
  materials: InventoryMaterial[]
  totalValue: number
  generatedAt: string
}

export type LowStockMaterial = {
  materialId: EntityId
  materialName: string
  code: string
  quantity: number
  minQuantity: number
}

export type ExpiringLot = {
  lotId: EntityId
  lotCode: string
  materialId: EntityId
  materialName: string
  quantity: number
  expiresAt: string
  daysUntilExpiry: number
}

export type EntriesSummary = {
  totalEntries: number
  totalValue: number
  bySupplier: { supplierId: EntityId; supplierName: string; totalValue: number }[]
  byGroup: { groupId: EntityId; groupName: string; totalValue: number }[]
}

export type TransfersSummary = {
  totalTransfers: number
  bySector: { sectorId: EntityId; sectorName: string; itemsConsumed: number; totalCost: number }[]
}

export type ReportDateParams = {
  startDate: string
  endDate: string
}
