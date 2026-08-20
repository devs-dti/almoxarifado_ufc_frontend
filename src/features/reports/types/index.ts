import type { PageParams } from '@/shared/types/pagination'

// 1. Relação Geral de Estoque
export type MaterialStockReportItem = {
  invoiceNumber?: string
  expirationDate?: string
  currentLotQuantity?: number
  materialName?: string
  lotCode?: string
  measurementUnitDescription?: string
}

export type InventoryReportParams = PageParams

// 2. Falta de Estoque / Baixo Estoque
export type OutOfStockReportItem = {
  materialName?: string
  measurementUnit?: string
  quantity?: number
}

export type LowStockReportParams = PageParams & {
  includeExpired?: boolean
}

// 3. Controle de Vencimento
export type ExpirationReportItem = {
  expirationDate?: string
  materialName?: string
  measurementUnit?: string
  quantity?: number
  lotCode?: string
}

export type ExpiringReportParams = PageParams & {
  maxExpirationDate?: string
  materialName?: string
}

// 4. Registro de Entradas
export type EntryReportItem = {
  entryDate?: string
  materialName?: string
  measurementUnit?: string
  quantity?: number
}

export type EntryType = 'SUPPLIER' | 'DONATION' | 'INVENTORY_ADJUSTMENT' | 'RETURN' | 'OTHERS'

export type EntriesReportParams = PageParams & {
  startDate?: string
  endDate?: string
  type?: EntryType
  materialName?: string
}

// 5. Registro de Saídas / Transferências
export type ExitReportItem = {
  exitDate?: string
  currentStock?: number
  materialName?: string
  measurementUnit?: string
  quantity?: number
}

export type TransfersReportParams = PageParams & {
  startDate?: string
  endDate?: string
  sectorId?: string
  materialName?: string
}
