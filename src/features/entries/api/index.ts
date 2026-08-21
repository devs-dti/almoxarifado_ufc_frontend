import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type {
  Entry,
  CreateEntryPayload,
  AddEntryItemPayload,
  UpdateEntryDetailsPayload,
} from '../types'
import type { PageLike, PageParams } from '@/shared/types/pagination'

export const entriesApi = {
  list: (params?: PageParams & { status?: string }) =>
    api.get<PageLike<Entry>>('/entries', { params }).then((r) => unwrapPage(r.data)),

  get: (id: EntityId) =>
    api.get<Entry>(`/entries/${id}`).then((r) => r.data),

  create: (data: CreateEntryPayload) =>
    api.post<Entry>('/entries', data).then((r) => r.data),

  updateDetails: (id: EntityId, data: UpdateEntryDetailsPayload) =>
    api.patch<Entry>(`/entries/${id}/details`, data).then((r) => r.data),

  addItem: (id: EntityId, data: AddEntryItemPayload) =>
    api.post<Entry['items'][number]>(`/entries/${id}/items`, data).then((r) => r.data),

  removeItem: (entryId: EntityId, itemId: EntityId) =>
    api.delete(`/entries/${entryId}/items/${itemId}`),

  finish: (id: EntityId) =>
    api.patch<Entry>(`/entries/${id}/finish`).then((r) => r.data),

  cancel: (id: EntityId) =>
    api.patch<Entry>(`/entries/${id}/cancel`).then((r) => r.data),
}
