import { httpClient as api } from '@/infrastructure/http/client'
import type { InventoryReport, LowStockMaterial, ExpiringLot, EntriesSummary, TransfersSummary } from '../types'

export const reportsApi = {
  inventory: () =>
    api.get<InventoryReport>('/reports/materials').then((r) => r.data),

  lowStock: () =>
    api.get<{ materials: LowStockMaterial[] }>('/reports/materials/low-stock').then((r) => r.data),

  expiring: (days: number) =>
    api.get<{ lots: ExpiringLot[] }>('/reports/materials/expiring', { params: { days } }).then((r) => r.data),

  entriesSummary: () =>
    api.get<EntriesSummary>('/reports/entries/summary').then((r) => r.data),

  transfersSummary: () =>
    api.get<TransfersSummary>('/reports/transfer/summary').then((r) => r.data),
}
