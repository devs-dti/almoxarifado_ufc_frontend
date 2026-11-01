import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PageParams } from '@/shared/types/pagination'
import type { EntityId } from '@/shared/types/id'
import { suppliersApi } from '../api'
import type { CreateSupplierPayload, UpdateSupplierPayload } from '../types'

export const suppliersKeys = {
  all: ['suppliers'] as const,
  list: () => ['suppliers', 'list'] as const,
}

export function useSuppliers() {
  return useQuery({ queryKey: suppliersKeys.list(), queryFn: () => suppliersApi.list() })
}

export function useSuppliersPage(params: PageParams & { search?: string }) {
  return useQuery({ queryKey: [...suppliersKeys.all, 'page', params], queryFn: () => suppliersApi.listPage(params) })
}

export function useCreateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSupplierPayload) => suppliersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: suppliersKeys.all }),
  })
}

export function useUpdateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: EntityId; data: UpdateSupplierPayload }) => suppliersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: suppliersKeys.all }),
  })
}

export function useDeleteSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: EntityId) => suppliersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: suppliersKeys.all }),
  })
}
