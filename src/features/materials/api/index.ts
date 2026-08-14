import { httpClient } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { PageLike, PageParams } from '@/shared/types/pagination'
import type { EntityId } from '@/shared/types/id'
import type {
  Material,
  MaterialGroup,
  MeasurementUnit,
  CreateMaterialPayload,
  UpdateMaterialPayload,
} from '../types'

type MaterialListParams = PageParams & { name?: string; groupId?: EntityId }

export const materialsApi = {
  list: (params?: MaterialListParams) =>
    httpClient
      .get<PageLike<Material>>('/materials', { params })
      .then((r) => unwrapPage(r.data)),

  get: (id: EntityId) =>
    httpClient.get<Material>(`/materials/${id}`).then((r) => r.data),

  create: (data: CreateMaterialPayload) =>
    httpClient.post<Material>('/materials', data).then((r) => r.data),

  update: (id: EntityId, data: UpdateMaterialPayload) =>
    httpClient.patch<Material>(`/materials/${id}`, data).then((r) => r.data),

  delete: (id: EntityId) => httpClient.delete(`/materials/${id}`),

  groups: () =>
    httpClient.get<PageLike<MaterialGroup>>('/material-groups').then((r) => unwrapPage(r.data).content),

  units: () =>
    httpClient.get<PageLike<MeasurementUnit>>('/measurement-units').then((r) => unwrapPage(r.data).content),
}
