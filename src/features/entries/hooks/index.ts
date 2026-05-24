import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { entriesApi } from '../api'
import type { CreateEntryPayload, AddEntryItemPayload, AttachInvoicePayload } from '../types'

export const entriesKeys = {
  all: ['entries'] as const,
  list: (params?: object) => ['entries', 'list', params] as const,
  detail: (id: number) => ['entries', id] as const,
}

export function useEntries(params?: Parameters<typeof entriesApi.list>[0]) {
  return useQuery({
    queryKey: entriesKeys.list(params),
    queryFn: () => entriesApi.list(params),
  })
}

export function useEntry(id: number) {
  return useQuery({
    queryKey: entriesKeys.detail(id),
    queryFn: () => entriesApi.get(id),
    enabled: id > 0,
  })
}

export function useCreateEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEntryPayload) => entriesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: entriesKeys.all }),
  })
}

export function useAttachInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AttachInvoicePayload }) =>
      entriesApi.attachInvoice(id, data),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: entriesKeys.detail(id) }),
  })
}

export function useAddEntryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: AddEntryItemPayload }) =>
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
    mutationFn: ({ entryId, itemId }: { entryId: number; itemId: number }) =>
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
    mutationFn: (id: number) => entriesApi.finish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: entriesKeys.all }),
  })
}

export function useCancelEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => entriesApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: entriesKeys.all }),
  })
}
