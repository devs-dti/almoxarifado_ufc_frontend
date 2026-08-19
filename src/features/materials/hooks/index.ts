import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EntityId } from '@/shared/types/id'
import { materialsApi } from '../api'
import type { CreateMaterialPayload, UpdateMaterialPayload } from '../types'

export const materialsKeys = {
  all: ['materials'] as const,
  list: (params?: object) => ['materials', 'list', params] as const,
  detail: (id: EntityId) => ['materials', id] as const,
  groups: () => ['material-groups'] as const,
  units: () => ['measurement-units'] as const,
}

export function useMaterials(params?: Parameters<typeof materialsApi.list>[0]) {
  return useQuery({
    queryKey: materialsKeys.list(params),
    queryFn: () => materialsApi.list(params),
  })
}


export function useMeasurementUnits() {
  return useQuery({
    queryKey: materialsKeys.units(),
    queryFn: materialsApi.units,
    staleTime: Infinity,
  })
}

export function useCreateMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaterialPayload) => materialsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: materialsKeys.all }),
  })
}

export function useUpdateMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: EntityId; data: UpdateMaterialPayload }) =>
      materialsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: materialsKeys.all }),
  })
}

export function useDeleteMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: EntityId) => materialsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: materialsKeys.all }),
  })
}
