import { httpClient } from '@/infrastructure/http/client'
import type { PaginatedResponse, PageParams } from '@/shared/types/pagination'
import type {
  Material,
  MaterialGroup,
  MeasurementUnit,
  MaterialMovement,
  CreateMaterialPayload,
  UpdateMaterialPayload,
} from '../types'

type MaterialListParams = PageParams & { name?: string; groupId?: number }

export const materialsApi = {
  list: (params?: MaterialListParams) =>
    httpClient
      .get<PaginatedResponse<Material>>('/materials', { params })
      .then((r) => r.data),

  get: (id: number) =>
    httpClient.get<Material>(`/materials/${id}`).then((r) => r.data),

  create: (data: CreateMaterialPayload) =>
    httpClient.post<Material>('/materials', data).then((r) => r.data),

  update: (id: number, data: UpdateMaterialPayload) =>
    httpClient.patch<Material>(`/materials/${id}`, data).then((r) => r.data),

  delete: (id: number) => httpClient.delete(`/materials/${id}`),

  movements: (id: number) =>
    httpClient
      .get<MaterialMovement[]>(`/materials/${id}/movements`)
      .then((r) => r.data),

  groups: () =>
    httpClient.get<MaterialGroup[]>('/material-groups').then((r) => r.data),

  units: () =>
    httpClient.get<MeasurementUnit[]>('/measurement-units').then((r) => r.data),
}
