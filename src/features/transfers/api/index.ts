import { httpClient as api } from '@/infrastructure/http/client'
import type { Transfer, CreateTransferPayload, ApproveTransferPayload, UpdateTransferStatusPayload } from '../types'
import type { PaginatedResponse, PageParams } from '@/shared/types/pagination'

export const transfersApi = {
  list: (params?: PageParams & { status?: string }) =>
    api.get<PaginatedResponse<Transfer>>('/transfers', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Transfer>(`/transfers/${id}`).then((r) => r.data),

  create: (data: CreateTransferPayload) =>
    api.post<Transfer>('/transfers', data).then((r) => r.data),

  approve: (id: number, data: ApproveTransferPayload) =>
    api.patch<Transfer>(`/transfers/${id}/approve`, data).then((r) => r.data),

  updateStatus: (id: number, data: UpdateTransferStatusPayload) =>
    api.patch<Transfer>(`/transfers/${id}/status`, data).then((r) => r.data),
}
