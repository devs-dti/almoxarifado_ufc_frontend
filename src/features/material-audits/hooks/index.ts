import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { materialAuditsApi, type MaterialAuditListParams } from '../api'
import type { CreateMaterialAuditPayload, UpdateMaterialAuditItemsPayload, AddAuditorsPayload } from '../types'

export const materialAuditsKeys = {
  all: ['material-audits'] as const,
  list: (params?: MaterialAuditListParams) => ['material-audits', 'list', params] as const,
  detail: (id: string) => ['material-audits', 'detail', id] as const,
}

export function useMaterialAudits(params?: MaterialAuditListParams) {
  return useQuery({
    queryKey: materialAuditsKeys.list(params),
    queryFn: () => materialAuditsApi.list(params),
  })
}

export function useMaterialAudit(id: string) {
  return useQuery({
    queryKey: materialAuditsKeys.detail(id),
    queryFn: () => materialAuditsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateMaterialAudit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaterialAuditPayload) => materialAuditsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: materialAuditsKeys.all }),
  })
}

export function useUpdateMaterialAuditItems() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialAuditItemsPayload }) =>
      materialAuditsApi.updateItems(id, data),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: materialAuditsKeys.detail(id) }),
  })
}

export function useFinalizeMaterialAudit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => materialAuditsApi.finalize(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: materialAuditsKeys.all })
      qc.invalidateQueries({ queryKey: materialAuditsKeys.detail(id) })
    },
  })
}

export function useCancelMaterialAudit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => materialAuditsApi.cancel(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: materialAuditsKeys.all })
      qc.invalidateQueries({ queryKey: materialAuditsKeys.detail(id) })
    },
  })
}

export function useAddAuditors() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddAuditorsPayload }) =>
      materialAuditsApi.addAuditors(id, data),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: materialAuditsKeys.detail(id) }),
  })
}
