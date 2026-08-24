import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import { downloadFile } from '@/shared/lib/download'
import type { PaginatedResponse, PageLike } from '@/shared/types/pagination'
import type {
  MaterialStockReportItem,
  OutOfStockReportItem,
  ExpirationReportItem,
  EntryReportItem,
  ExitReportItem,
  InventoryReportParams,
  LowStockReportParams,
  ExpiringReportParams,
  EntriesReportParams,
  TransfersReportParams,
} from '../types'

export const reportsApi = {
  // 1. Relação Geral de Estoque
  inventory: (params?: InventoryReportParams): Promise<PaginatedResponse<MaterialStockReportItem>> =>
    api.get<PageLike<MaterialStockReportItem>>('/reports/materials', { params }).then((r) => unwrapPage(r.data)),
  exportInventoryPdf: () => downloadFile('/reports/materials/export/pdf', 'Relacao_Estoque.pdf'),
  exportInventoryExcel: () => downloadFile('/reports/materials/export/excel', 'Relacao_Estoque.xlsx'),

  // 2. Falta de Estoque / Baixo Estoque
  lowStock: (params?: LowStockReportParams): Promise<PaginatedResponse<OutOfStockReportItem>> =>
    api.get<PageLike<OutOfStockReportItem>>('/reports/materials/low-stock', { params }).then((r) => unwrapPage(r.data)),
  exportLowStockPdf: (params?: Omit<LowStockReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/materials/low-stock/export/pdf', 'Estoque_Zerado_Baixo.pdf', params as Record<string, unknown>),
  exportLowStockExcel: (params?: Omit<LowStockReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/materials/low-stock/export/excel', 'Estoque_Zerado_Baixo.xlsx', params as Record<string, unknown>),

  // 3. Controle de Vencimentos
  expiring: (params?: ExpiringReportParams): Promise<PaginatedResponse<ExpirationReportItem>> =>
    api.get<PageLike<ExpirationReportItem>>('/reports/materials/expiring', { params }).then((r) => unwrapPage(r.data)),
  exportExpiringPdf: (params?: Omit<ExpiringReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/materials/expiring/export/pdf', 'Controle_Vencimentos.pdf', params as Record<string, unknown>),
  exportExpiringExcel: (params?: Omit<ExpiringReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/materials/expiring/export/excel', 'Controle_Vencimentos.xlsx', params as Record<string, unknown>),

  // 4. Registro de Entradas
  entries: (params?: EntriesReportParams): Promise<PaginatedResponse<EntryReportItem>> =>
    api.get<PageLike<EntryReportItem>>('/reports/entries/summary', { params }).then((r) => unwrapPage(r.data)),
  exportEntriesPdf: (params?: Omit<EntriesReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/entries/export/pdf', 'Registro_Entradas.pdf', params as Record<string, unknown>),
  exportEntriesExcel: (params?: Omit<EntriesReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/entries/export/excel', 'Registro_Entradas.xlsx', params as Record<string, unknown>),

  // 5. Registro de Saídas / Transferências
  transfers: (params?: TransfersReportParams): Promise<PaginatedResponse<ExitReportItem>> =>
    api.get<PageLike<ExitReportItem>>('/reports/transfer/summary', { params }).then((r) => unwrapPage(r.data)),
  exportTransfersPdf: (params?: Omit<TransfersReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/transfer/export/pdf', 'Registro_Transferencias.pdf', params as Record<string, unknown>),
  exportTransfersExcel: (params?: Omit<TransfersReportParams, 'page' | 'size' | 'sort'>) =>
    downloadFile('/reports/transfer/export/excel', 'Registro_Transferencias.xlsx', params as Record<string, unknown>),
}
