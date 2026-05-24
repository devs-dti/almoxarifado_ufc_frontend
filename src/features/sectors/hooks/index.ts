import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sectorsApi, unitsApi } from '../api'
import type { CreateSectorPayload, UpdateSectorPayload, CreateMeasurementUnitPayload, UpdateMeasurementUnitPayload } from '../types'

export const sectorsKeys = {
  all: ['sectors'] as const,
  list: () => ['sectors', 'list'] as const,
}

export const unitsKeys = {
  all: ['measurement-units'] as const,
  list: () => ['measurement-units', 'list'] as const,
}

export function useSectors() {
  return useQuery({ queryKey: sectorsKeys.list(), queryFn: sectorsApi.list })
}

export function useCreateSector() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSectorPayload) => sectorsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: sectorsKeys.all }),
  })
}

export function useUpdateSector() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSectorPayload }) => sectorsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: sectorsKeys.all }),
  })
}

export function useDeleteSector() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sectorsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: sectorsKeys.all }),
  })
}

export function useMeasurementUnitsList() {
  return useQuery({ queryKey: unitsKeys.list(), queryFn: unitsApi.list })
}

export function useCreateUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMeasurementUnitPayload) => unitsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  })
}

export function useUpdateUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMeasurementUnitPayload }) => unitsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  })
}

export function useDeleteUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => unitsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  })
}
