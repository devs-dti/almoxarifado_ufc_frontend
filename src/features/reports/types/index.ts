export type PagedReport<T> = {
  content: T[]
  totalElements: number
  totalPages: number
}

export type StockItem = {
  materialName: string
  measurementUnitDescription: string
  lotCode?: string
  expirationDate?: string
  currentLotQuantity: number
  invoiceNumber?: string
}

export type LowStockItem = {
  materialName: string
  measurementUnit: string
  quantity: number
}

export type ExpiringItem = {
  materialName: string
  measurementUnit: string
  lotCode: string
  expirationDate: string
  quantity: number
}

export type EntryReportItem = {
  materialName: string
  measurementUnit: string
  quantity: number
  entryDate: string
}

export type ExitReportItem = {
  materialName: string
  measurementUnit: string
  quantity: number
  exitDate: string
  currentStock: number
}

export type ReportDateParams = {
  startDate: string
  endDate: string
}
