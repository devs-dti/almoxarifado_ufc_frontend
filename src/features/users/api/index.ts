import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type { UserListItem, CreateUserPayload, UpdateUserPayload, UserDetail } from '../types'
import type { PageLike, PageParams } from '@/shared/types/pagination'

function buildFormData(data: Record<string, any>): FormData {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      fd.append(key, value instanceof File ? value : String(value))
    }
  })
  return fd
}

export const usersApi = {
  list: (params?: PageParams) =>
    api.get<PageLike<UserListItem>>('/users', { params }).then((r) => unwrapPage(r.data)),
  create: (data: CreateUserPayload) => {
    return api.post<UserListItem>('/users', buildFormData(data), {
      headers: { 'Content-Type': undefined }
    }).then((r) => r.data)
  },
  update: (id: EntityId, data: UpdateUserPayload) => {
    return api.patch<UserListItem>(`/users/${id}`, buildFormData(data), {
      headers: { 'Content-Type': undefined }
    }).then((r) => r.data)
  },
  getById: (id: EntityId) => 
    api.get<UserDetail>(`/users/${id}`).then((r) => r.data),
  delete: (id: EntityId) => api.delete(`/users/${id}`),
}
