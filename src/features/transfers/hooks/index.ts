import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EntityId } from '@/shared/types/id'
import { transfersApi } from '../api'
import type { CreateTransferPayload, ApproveTransferPayload } from '../types'

export const transfersKeys = {
  all: ['transfers'] as const,
  list: (params?: object) => ['transfers', 'list', params] as const,
  detail: (id: EntityId) => ['transfers', id] as const,
}

export function useTransfers(params?: Parameters<typeof transfersApi.list>[0]) {
  return useQuery({
    queryKey: transfersKeys.list(params),
    queryFn: () => transfersApi.list(params),
  })
}

export function useTransfer(id: EntityId, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: transfersKeys.detail(id),
    queryFn: () => transfersApi.get(id),
    enabled: (options?.enabled ?? true) && id.length > 0,
  })
}

export function useCreateTransfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransferPayload) => transfersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfersKeys.all }),
  })
}

export function useApproveTransfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: EntityId; data: ApproveTransferPayload }) =>
      transfersApi.approve(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfersKeys.all }),
  })
}

export function useDisapproveTransfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: EntityId) => transfersApi.disapprove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfersKeys.all }),
  })
}
