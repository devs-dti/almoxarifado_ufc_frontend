import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type { PageLike, PageParams } from '@/shared/types/pagination'
import type { Sector, CreateSectorPayload, UpdateSectorPayload, MeasurementUnit, CreateMeasurementUnitPayload, UpdateMeasurementUnitPayload } from '../types'

export const sectorsApi = {
  listPage: (params?: PageParams & { search?: string }) =>
    api.get<PageLike<Sector>>('/sectors', { params }).then((r) => unwrapPage(r.data)),
  list: (params?: PageParams & { search?: string }) =>
    api.get<PageLike<Sector>>('/sectors', { params }).then((r) => unwrapPage(r.data).content),
  create: (data: CreateSectorPayload) => api.post<Sector>('/sectors', data).then((r) => r.data),
  update: (id: EntityId, data: UpdateSectorPayload) => api.patch<Sector>(`/sectors/${id}`, data).then((r) => r.data),
  delete: (id: EntityId) => api.delete(`/sectors/${id}`),
}

export const unitsApi = {
  list: (params?: PageParams & { search?: string }) =>
    api.get<PageLike<MeasurementUnit>>('/measurement-units', { params }).then((r) => unwrapPage(r.data).content),
  create: (data: CreateMeasurementUnitPayload) => api.post<MeasurementUnit>('/measurement-units', data).then((r) => r.data),
  update: (id: EntityId, data: UpdateMeasurementUnitPayload) => api.patch<MeasurementUnit>(`/measurement-units/${id}`, data).then((r) => r.data),
  delete: (id: EntityId) => api.delete(`/measurement-units/${id}`),
}
