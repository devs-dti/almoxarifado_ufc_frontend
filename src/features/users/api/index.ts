import { httpClient as api } from '@/infrastructure/http/client'
import type { UserListItem, CreateUserPayload, UpdateUserPayload } from '../types'
import type { PaginatedResponse, PageParams } from '@/shared/types/pagination'

export const usersApi = {
  list: (params?: PageParams) =>
    api.get<PaginatedResponse<UserListItem>>('/users', { params }).then((r) => r.data),
  create: (data: CreateUserPayload) =>
    api.post<UserListItem>('/users', data).then((r) => r.data),
  update: (id: number, data: UpdateUserPayload) =>
    api.patch<UserListItem>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/users/${id}`),
}
