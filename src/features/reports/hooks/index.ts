import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../api'

export function useInventoryReport(enabled: boolean) {
  return useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: () => reportsApi.inventory(),
    enabled,
    staleTime: 60_000,
  })
}

export function useLowStockReport(enabled: boolean) {
  return useQuery({
    queryKey: ['reports', 'low-stock'],
    queryFn: () => reportsApi.lowStock(),
    enabled,
    staleTime: 60_000,
  })
}

export function useExpiringReport(days: number, enabled: boolean) {
  return useQuery({
    queryKey: ['reports', 'expiring', days],
    queryFn: () => reportsApi.expiring(days),
    enabled,
    staleTime: 60_000,
  })
}

export function useEntriesSummary(enabled: boolean) {
  return useQuery({
    queryKey: ['reports', 'entries-summary'],
    queryFn: () => reportsApi.entriesSummary(),
    enabled,
    staleTime: 60_000,
  })
}

export function useTransfersSummary(enabled: boolean) {
  return useQuery({
    queryKey: ['reports', 'transfers-summary'],
    queryFn: () => reportsApi.transfersSummary(),
    enabled,
    staleTime: 60_000,
  })
}
