import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transfersApi } from '../api'
import type { CreateTransferPayload, ApproveTransferPayload, UpdateTransferStatusPayload } from '../types'

export const transfersKeys = {
  all: ['transfers'] as const,
  list: (params?: object) => ['transfers', 'list', params] as const,
  detail: (id: number) => ['transfers', id] as const,
}

export function useTransfers(params?: Parameters<typeof transfersApi.list>[0]) {
  return useQuery({
    queryKey: transfersKeys.list(params),
    queryFn: () => transfersApi.list(params),
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
    mutationFn: ({ id, data }: { id: number; data: ApproveTransferPayload }) =>
      transfersApi.approve(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfersKeys.all }),
  })
}

export function useUpdateTransferStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransferStatusPayload }) =>
      transfersApi.updateStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfersKeys.all }),
  })
}
