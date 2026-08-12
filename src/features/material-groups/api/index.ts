import { httpClient as api } from '@/infrastructure/http/client'
import type { MaterialGroup, CreateMaterialGroupPayload, UpdateMaterialGroupPayload } from '../types'
import type { PaginatedResponse } from '@/shared/types/pagination'

export const materialGroupsApi = {
  list: (params?: { page?: number; size?: number; search?: string }) => 
    api.get<PaginatedResponse<MaterialGroup>>('/material-groups', { params }).then((r) => r.data),
  get: (id: string) => api.get<MaterialGroup>(`/material-groups/${id}`).then((r) => r.data),
  create: (data: CreateMaterialGroupPayload) => api.post<MaterialGroup>('/material-groups', data).then((r) => r.data),
  update: (id: string, data: UpdateMaterialGroupPayload) => api.patch<MaterialGroup>(`/material-groups/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/material-groups/${id}`),
}

