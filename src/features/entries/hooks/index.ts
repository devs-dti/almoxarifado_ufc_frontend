import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EntityId } from '@/shared/types/id'
import { entriesApi } from '../api'
import type { CreateEntryPayload, AddEntryItemPayload } from '../types'

export const entriesKeys = {
  all: ['entries'] as const,
  list: (params?: object) => ['entries', 'list', params] as const,
  detail: (id: EntityId) => ['entries', id] as const,
}

export function useEntries(params?: Parameters<typeof entriesApi.list>[0]) {
  return useQuery({
    queryKey: entriesKeys.list(params),
    queryFn: () => entriesApi.list(params),
  })
}

export function useEntry(id: EntityId, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: entriesKeys.detail(id),
    queryFn: () => entriesApi.get(id),
    enabled: (options?.enabled ?? true) && id.length > 0,
  })
}

export function useCreateEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEntryPayload) => entriesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: entriesKeys.all }),
  })
}


export function useAddEntryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: EntityId; data: AddEntryItemPayload }) =>
      entriesApi.addItem(entryId, data),
    onSuccess: (_, { entryId }) => {
      qc.invalidateQueries({ queryKey: entriesKeys.detail(entryId) })
      qc.invalidateQueries({ queryKey: entriesKeys.all })
    },
  })
}

export function useRemoveEntryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, itemId }: { entryId: EntityId; itemId: EntityId }) =>
      entriesApi.removeItem(entryId, itemId),
    onSuccess: (_, { entryId }) => {
      qc.invalidateQueries({ queryKey: entriesKeys.detail(entryId) })
      qc.invalidateQueries({ queryKey: entriesKeys.all })
    },
  })
}

export function useFinishEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: EntityId) => entriesApi.finish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: entriesKeys.all }),
  })
}

export function useCancelEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: EntityId) => entriesApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: entriesKeys.all }),
  })
}
