import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type { PageLike, PageParams } from '@/shared/types/pagination'
import type { Transfer, CreateTransferPayload, ApproveTransferPayload } from '../types'

export const transfersApi = {
  list: (params?: PageParams & { status?: string }) =>
    api.get<PageLike<Transfer>>('/transfers', { params }).then((r) => unwrapPage(r.data)),

  get: (id: EntityId) =>
    api.get<Transfer>(`/transfers/${id}`).then((r) => r.data),

  create: (data: CreateTransferPayload) =>
    api.post<Transfer>('/transfers', data).then((r) => r.data),

  approve: (id: EntityId, data: ApproveTransferPayload) =>
    api.patch<Transfer>(`/transfers/${id}/approve`, data).then((r) => r.data),

  disapprove: (id: EntityId) =>
    api.patch<void>(`/transfers/${id}/disapprove`).then((r) => r.data),
}
