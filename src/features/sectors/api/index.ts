import { httpClient as api } from '@/infrastructure/http/client'
import type { Sector, CreateSectorPayload, UpdateSectorPayload, MeasurementUnit, CreateMeasurementUnitPayload, UpdateMeasurementUnitPayload } from '../types'

export const sectorsApi = {
  list: () => api.get<Sector[]>('/sectors').then((r) => r.data),
  create: (data: CreateSectorPayload) => api.post<Sector>('/sectors', data).then((r) => r.data),
  update: (id: number, data: UpdateSectorPayload) => api.patch<Sector>(`/sectors/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/sectors/${id}`),
}

export const unitsApi = {
  list: () => api.get<MeasurementUnit[]>('/measurement-units').then((r) => r.data),
  create: (data: CreateMeasurementUnitPayload) => api.post<MeasurementUnit>('/measurement-units', data).then((r) => r.data),
  update: (id: number, data: UpdateMeasurementUnitPayload) => api.patch<MeasurementUnit>(`/measurement-units/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/measurement-units/${id}`),
}
