import { httpClient as api } from '@/infrastructure/http/client'
import type { MaterialGroup, CreateMaterialGroupPayload, UpdateMaterialGroupPayload } from '../types'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type { PageLike, PageParams } from '@/shared/types/pagination'

type MaterialGroupsParams = PageParams & { search?: string }

export const materialGroupsApi = {
  list: (params?: MaterialGroupsParams) =>
    api.get<PageLike<MaterialGroup>>('/material-groups', { params }).then((r) => unwrapPage(r.data)),
  get: (id: EntityId) => api.get<MaterialGroup>(`/material-groups/${id}`).then((r) => r.data),
  create: (data: CreateMaterialGroupPayload) => api.post<MaterialGroup>('/material-groups', data).then((r) => r.data),
  update: (id: EntityId, data: UpdateMaterialGroupPayload) => api.patch<MaterialGroup>(`/material-groups/${id}`, data).then((r) => r.data),
  delete: (id: EntityId) => api.delete(`/material-groups/${id}`),
}
