import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type { UserListItem, CreateUserPayload, UpdateUserPayload } from '../types'
import type { PageLike, PageParams } from '@/shared/types/pagination'

export const usersApi = {
  list: (params?: PageParams) =>
    api.get<PageLike<UserListItem>>('/users', { params }).then((r) => unwrapPage(r.data)),
  create: (data: CreateUserPayload) =>
    api.post<UserListItem>('/users', data).then((r) => r.data),
  update: (id: EntityId, data: UpdateUserPayload) =>
    api.patch<UserListItem>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: EntityId) => api.delete(`/users/${id}`),
}
