import { httpClient } from '@/infrastructure/http/client'
import { buildFormData } from '@/shared/lib/form-data'
import { unwrapPage } from '@/shared/lib/pagination'
import type { PageLike, PageParams } from '@/shared/types/pagination'
import type { EntityId } from '@/shared/types/id'
import type {
  Material,
  MaterialDetails,
  MaterialGroup,
  MeasurementUnit,
  CreateMaterialPayload,
  UpdateMaterialPayload,
} from '../types'

type MaterialListParams = PageParams & {
  search?: string
  name?: string
  internalCode?: string
  measurementUnit?: string
  materialGroup?: string
  groupId?: EntityId
}

export const materialsApi = {
  list: (params?: MaterialListParams) =>
    httpClient
      .get<PageLike<Material>>('/materials', { params })
      .then((r) => unwrapPage(r.data)),

  get: (id: EntityId) =>
    httpClient.get<MaterialDetails>(`/materials/${id}`).then((r) => r.data),

  create: (data: CreateMaterialPayload) =>
    httpClient.post<Material>('/materials', buildFormData(data), {
      headers: { 'Content-Type': undefined }
    }).then((r) => r.data),

  update: (id: EntityId, data: UpdateMaterialPayload) =>
    httpClient.patch<Material>(`/materials/${id}`, buildFormData(data), {
      headers: { 'Content-Type': undefined }
    }).then((r) => r.data),

  delete: (id: EntityId) => httpClient.delete(`/materials/${id}`),

  groups: () =>
    httpClient.get<PageLike<MaterialGroup>>('/material-groups').then((r) => unwrapPage(r.data).content),

  units: () =>
    httpClient.get<PageLike<MeasurementUnit>>('/measurement-units').then((r) => unwrapPage(r.data).content),
}
