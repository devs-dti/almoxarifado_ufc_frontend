import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../api'
import type {
  InventoryReportParams,
  LowStockReportParams,
  ExpiringReportParams,
  EntriesReportParams,
  TransfersReportParams,
} from '../types'

export function useInventoryReport(params: InventoryReportParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['reports', 'inventory', params],
    queryFn: () => reportsApi.inventory(params),
    enabled,
    staleTime: 30_000,
  })
}

export function useLowStockReport(params: LowStockReportParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['reports', 'low-stock', params],
    queryFn: () => reportsApi.lowStock(params),
    enabled,
    staleTime: 30_000,
  })
}

export function useExpiringReport(params: ExpiringReportParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['reports', 'expiring', params],
    queryFn: () => reportsApi.expiring(params),
    enabled,
    staleTime: 30_000,
  })
}

export function useEntriesSummary(params: EntriesReportParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['reports', 'entries', params],
    queryFn: () => reportsApi.entries(params),
    enabled,
    staleTime: 30_000,
  })
}

export function useTransfersSummary(params: TransfersReportParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['reports', 'transfers', params],
    queryFn: () => reportsApi.transfers(params),
    enabled,
    staleTime: 30_000,
  })
}
