export type InventoryMaterial = {
  materialId: number
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
  materialId: number
  materialName: string
  code: string
  quantity: number
  minQuantity: number
}

export type ExpiringLot = {
  lotId: number
  lotCode: string
  materialId: number
  materialName: string
  quantity: number
  expiresAt: string
  daysUntilExpiry: number
}

export type EntriesSummary = {
  totalEntries: number
  totalValue: number
  bySupplier: { supplierId: number; supplierName: string; totalValue: number }[]
  byGroup: { groupId: number; groupName: string; totalValue: number }[]
}

export type TransfersSummary = {
  totalTransfers: number
  bySector: { sectorId: number; sectorName: string; itemsConsumed: number; totalCost: number }[]
}

export type ReportDateParams = {
  startDate: string
  endDate: string
}
