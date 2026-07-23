import { httpClient as api } from '@/infrastructure/http/client'
import type { PagedReport, StockItem, LowStockItem, ExpiringItem, EntryReportItem, ExitReportItem } from '../types'

export const reportsApi = {
  inventory: (page = 0) =>
    api.get<PagedReport<StockItem>>('/reports/materials', { params: { page, size: 50 } }).then((r) => r.data),

  lowStock: (page = 0) =>
    api.get<PagedReport<LowStockItem>>('/reports/materials/low-stock', { params: { page, size: 50 } }).then((r) => r.data),

  expiring: (days: number, page = 0) =>
    api.get<PagedReport<ExpiringItem>>('/reports/materials/expiring', { params: { days, page, size: 50 } }).then((r) => r.data),

  entriesSummary: (page = 0) =>
    api.get<PagedReport<EntryReportItem>>('/reports/entries/summary', { params: { page, size: 50 } }).then((r) => r.data),

  transfersSummary: (page = 0) =>
    api.get<PagedReport<ExitReportItem>>('/reports/transfer/summary', { params: { page, size: 50 } }).then((r) => r.data),
}
