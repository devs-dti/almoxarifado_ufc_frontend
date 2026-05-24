import { httpClient as api } from '@/infrastructure/http/client'
import type {
  Entry,
  CreateEntryPayload,
  AddEntryItemPayload,
  AttachInvoicePayload,
} from '../types'
import type { PaginatedResponse, PageParams } from '@/shared/types/pagination'

export const entriesApi = {
  list: (params?: PageParams & { status?: string }) =>
    api.get<PaginatedResponse<Entry>>('/entries', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Entry>(`/entries/${id}`).then((r) => r.data),

  create: (data: CreateEntryPayload) =>
    api.post<Entry>('/entries', data).then((r) => r.data),

  attachInvoice: (id: number, data: AttachInvoicePayload) =>
    api.patch<Entry>(`/entries/${id}/details`, data).then((r) => r.data),

  addItem: (id: number, data: AddEntryItemPayload) =>
    api.post<Entry['items'][number]>(`/entries/${id}/items`, data).then((r) => r.data),

  removeItem: (entryId: number, itemId: number) =>
    api.delete(`/entries/${entryId}/items/${itemId}`),

  finish: (id: number) =>
    api.patch<Entry>(`/entries/${id}/finish`).then((r) => r.data),

  cancel: (id: number) =>
    api.patch<Entry>(`/entries/${id}/cancel`).then((r) => r.data),
}
